using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LocalServiceBooking.API.Data;
using LocalServiceBooking.API.DTOs;

namespace LocalServiceBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var user = await _context.Users
                .Include(u => u.ProviderProfile)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null) return NotFound();

            return Ok(new UserResponseDto
            {
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                Role = user.Role,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                ProviderProfile = user.ProviderProfile != null ? new ProviderProfileResponseDto
                {
                    ProviderId = user.ProviderProfile.ProviderId,
                    UserId = user.ProviderProfile.UserId,
                    FullName = user.FullName,
                    Email = user.Email,
                    Phone = user.Phone,
                    BusinessName = user.ProviderProfile.BusinessName,
                    Category = user.ProviderProfile.Category,
                    Bio = user.ProviderProfile.Bio,
                    ExperienceYears = user.ProviderProfile.ExperienceYears,
                    HourlyRate = user.ProviderProfile.HourlyRate,
                    Address = user.ProviderProfile.Address,
                    City = user.ProviderProfile.City,
                    State = user.ProviderProfile.State,
                    ZipCode = user.ProviderProfile.ZipCode,
                    IsKycVerified = user.ProviderProfile.IsKycVerified,
                    IdentityDocUrl = user.ProviderProfile.IdentityDocUrl,
                    CertificateUrl = user.ProviderProfile.CertificateUrl,
                    Rating = user.ProviderProfile.Rating,
                    TotalReviews = user.ProviderProfile.TotalReviews,
                    WalletBalance = user.ProviderProfile.WalletBalance,
                    IsAvailable = user.ProviderProfile.IsAvailable,
                    CreatedAt = user.ProviderProfile.CreatedAt
                } : null
            });
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileUpdateDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var user = await _context.Users
                .Include(u => u.ProviderProfile)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null) return NotFound();

            if (!string.IsNullOrEmpty(dto.FullName)) user.FullName = dto.FullName;
            if (dto.Phone != null) user.Phone = dto.Phone;
            if (dto.Address != null) user.Address = dto.Address;
            user.UpdatedAt = DateTime.UtcNow;

            if (user.Role == "Provider" && user.ProviderProfile != null)
            {
                if (!string.IsNullOrEmpty(dto.BusinessName)) user.ProviderProfile.BusinessName = dto.BusinessName;
                if (dto.Bio != null) user.ProviderProfile.Bio = dto.Bio;
                if (dto.HourlyRate.HasValue) user.ProviderProfile.HourlyRate = dto.HourlyRate.Value;
                if (dto.City != null) user.ProviderProfile.City = dto.City;
                if (dto.State != null) user.ProviderProfile.State = dto.State;
                if (dto.ZipCode != null) user.ProviderProfile.ZipCode = dto.ZipCode;
                if (dto.IsAvailable.HasValue) user.ProviderProfile.IsAvailable = dto.IsAvailable.Value;
                user.ProviderProfile.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Profile updated successfully." });
        }
    }
}
