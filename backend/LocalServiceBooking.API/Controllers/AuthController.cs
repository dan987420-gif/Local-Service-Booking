using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LocalServiceBooking.API.Data;
using LocalServiceBooking.API.DTOs;
using LocalServiceBooking.API.Models;
using LocalServiceBooking.API.Services;

namespace LocalServiceBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(ApplicationDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existingUser = await _context.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower());
            if (existingUser) return BadRequest(new { message = "Email is already registered." });

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = PasswordHasher.HashPassword(dto.Password),
                Phone = dto.Phone,
                Address = dto.Address,
                Role = "Customer",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _jwtService.GenerateToken(user);
            return Ok(new AuthResponseDto
            {
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                Token = token
            });
        }

        [HttpPost("register-provider")]
        public async Task<IActionResult> RegisterProvider([FromBody] ProviderRegisterDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existingUser = await _context.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower());
            if (existingUser) return BadRequest(new { message = "Email is already registered." });

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = PasswordHasher.HashPassword(dto.Password),
                Phone = dto.Phone,
                Address = dto.Address,
                Role = "Provider",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var providerProfile = new ProviderProfile
            {
                UserId = user.UserId,
                BusinessName = dto.BusinessName,
                Category = dto.Category,
                Bio = dto.Bio,
                ExperienceYears = dto.ExperienceYears,
                HourlyRate = dto.HourlyRate,
                Address = dto.Address,
                City = dto.City,
                State = dto.State,
                ZipCode = dto.ZipCode,
                IsKycVerified = "Pending",
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.ProviderProfiles.Add(providerProfile);
            await _context.SaveChangesAsync();

            var token = _jwtService.GenerateToken(user, providerProfile.ProviderId);

            return Ok(new AuthResponseDto
            {
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                Token = token,
                ProviderId = providerProfile.ProviderId,
                IsKycVerified = providerProfile.IsKycVerified
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await _context.Users
                .Include(u => u.ProviderProfile)
                .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());

            if (user == null || !PasswordHasher.VerifyPassword(dto.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            if (!user.IsActive)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Account has been deactivated. Please contact admin." });
            }

            int? providerId = user.ProviderProfile?.ProviderId;
            var token = _jwtService.GenerateToken(user, providerId);

            return Ok(new AuthResponseDto
            {
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                Token = token,
                ProviderId = providerId,
                IsKycVerified = user.ProviderProfile?.IsKycVerified
            });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized();

            var user = await _context.Users
                .Include(u => u.ProviderProfile)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null) return NotFound();

            return Ok(new
            {
                user.UserId,
                user.FullName,
                user.Email,
                user.Phone,
                user.Address,
                user.Role,
                user.IsActive,
                Provider = user.ProviderProfile != null ? new
                {
                    user.ProviderProfile.ProviderId,
                    user.ProviderProfile.BusinessName,
                    user.ProviderProfile.Category,
                    user.ProviderProfile.IsKycVerified,
                    user.ProviderProfile.Rating,
                    user.ProviderProfile.TotalReviews,
                    user.ProviderProfile.WalletBalance,
                    user.ProviderProfile.IsAvailable
                } : null
            });
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] PasswordChangeDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out int userId)) return Unauthorized();

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            if (!PasswordHasher.VerifyPassword(dto.CurrentPassword, user.PasswordHash))
            {
                return BadRequest(new { message = "Incorrect current password." });
            }

            user.PasswordHash = PasswordHasher.HashPassword(dto.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password updated successfully." });
        }
    }
}
