using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LocalServiceBooking.API.Data;
using LocalServiceBooking.API.DTOs;
using LocalServiceBooking.API.Models;

namespace LocalServiceBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalProviders = await _context.ProviderProfiles.CountAsync();
            var totalServices = await _context.Services.CountAsync();
            var totalBookings = await _context.Bookings.CountAsync();
            var completedBookings = await _context.Bookings.CountAsync(b => b.Status == "Completed");
            var pendingComplaints = await _context.Complaints.CountAsync(c => c.Status == "Pending");
            var pendingKycCount = await _context.ProviderProfiles.CountAsync(p => p.IsKycVerified == "Pending");

            var totalRevenue = await _context.Bookings
                .Where(b => b.Status == "Completed")
                .SumAsync(b => b.TotalPrice);

            var avgRating = await _context.Reviews.AnyAsync()
                ? (decimal)await _context.Reviews.AverageAsync(r => (double)r.Rating)
                : 5.0m;

            return Ok(new
            {
                TotalUsers = totalUsers,
                TotalProviders = totalProviders,
                TotalServices = totalServices,
                TotalBookings = totalBookings,
                CompletedBookings = completedBookings,
                PendingComplaints = pendingComplaints,
                PendingKycCount = pendingKycCount,
                Revenue = totalRevenue,
                AverageRating = Math.Round(avgRating, 2)
            });
        }

        [HttpGet("kyc-pending")]
        public async Task<IActionResult> GetPendingKycProviders()
        {
            var providers = await _context.ProviderProfiles
                .Include(p => p.User)
                .Where(p => p.IsKycVerified == "Pending")
                .Select(p => new ProviderProfileResponseDto
                {
                    ProviderId = p.ProviderId,
                    UserId = p.UserId,
                    FullName = p.User!.FullName,
                    Email = p.User.Email,
                    Phone = p.User.Phone,
                    BusinessName = p.BusinessName,
                    Category = p.Category,
                    Bio = p.Bio,
                    ExperienceYears = p.ExperienceYears,
                    HourlyRate = p.HourlyRate,
                    Address = p.Address,
                    City = p.City,
                    State = p.State,
                    ZipCode = p.ZipCode,
                    IsKycVerified = p.IsKycVerified,
                    IdentityDocUrl = p.IdentityDocUrl,
                    CertificateUrl = p.CertificateUrl,
                    Rating = p.Rating,
                    TotalReviews = p.TotalReviews,
                    WalletBalance = p.WalletBalance,
                    IsAvailable = p.IsAvailable,
                    CreatedAt = p.CreatedAt
                }).ToListAsync();

            return Ok(providers);
        }

        [HttpPut("kyc/{providerId}/verify")]
        public async Task<IActionResult> VerifyProviderKyc(int providerId, [FromBody] KycVerificationDto dto)
        {
            var provider = await _context.ProviderProfiles.FindAsync(providerId);
            if (provider == null) return NotFound(new { message = "Provider profile not found." });

            var validStatuses = new[] { "Verified", "Rejected" };
            if (!validStatuses.Contains(dto.Status))
            {
                return BadRequest(new { message = "Invalid KYC status." });
            }

            provider.IsKycVerified = dto.Status;
            provider.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // Notify Provider
            _context.Notifications.Add(new Notification
            {
                UserId = provider.UserId,
                Title = $"KYC Status Updated: {dto.Status}",
                Message = dto.Status == "Verified"
                    ? "Congratulations! Your provider account KYC has been verified."
                    : "Your provider KYC verification request was rejected. Please re-upload valid identity documents.",
                Type = "KYC",
                CreatedAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Provider KYC status updated to '{dto.Status}'." });
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Include(u => u.ProviderProfile)
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new UserResponseDto
                {
                    UserId = u.UserId,
                    FullName = u.FullName,
                    Email = u.Email,
                    Phone = u.Phone,
                    Address = u.Address,
                    Role = u.Role,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    ProviderProfile = u.ProviderProfile != null ? new ProviderProfileResponseDto
                    {
                        ProviderId = u.ProviderProfile.ProviderId,
                        BusinessName = u.ProviderProfile.BusinessName,
                        Category = u.ProviderProfile.Category,
                        IsKycVerified = u.ProviderProfile.IsKycVerified
                    } : null
                }).ToListAsync();

            return Ok(users);
        }

        [HttpPut("users/{userId}/status")]
        public async Task<IActionResult> ToggleUserStatus(int userId, [FromBody] UserStatusUpdateDto dto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            user.IsActive = dto.IsActive;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = $"User status updated to {(dto.IsActive ? "Active" : "Inactive")}." });
        }

        [HttpPost("notifications/send")]
        public async Task<IActionResult> SendNotification([FromBody] AdminNotificationDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (dto.UserId.HasValue)
            {
                var notification = new Notification
                {
                    UserId = dto.UserId.Value,
                    Title = dto.Title,
                    Message = dto.Message,
                    Type = "System",
                    CreatedAt = DateTime.UtcNow
                };
                _context.Notifications.Add(notification);
            }
            else
            {
                var users = await _context.Users.Select(u => u.UserId).ToListAsync();
                foreach (var uId in users)
                {
                    _context.Notifications.Add(new Notification
                    {
                        UserId = uId,
                        Title = dto.Title,
                        Message = dto.Message,
                        Type = "System",
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Notification sent successfully." });
        }
    }

    public class AdminNotificationDto
    {
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public int? UserId { get; set; }
    }
}
