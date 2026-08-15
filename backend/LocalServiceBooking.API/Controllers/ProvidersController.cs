using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LocalServiceBooking.API.Data;
using LocalServiceBooking.API.DTOs;
using LocalServiceBooking.API.Services;

namespace LocalServiceBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProvidersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly TrustScoreService _trustScoreService;

        public ProvidersController(ApplicationDbContext context, TrustScoreService trustScoreService)
        {
            _context = context;
            _trustScoreService = trustScoreService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProviders([FromQuery] string? category, [FromQuery] string? search)
        {
            var query = _context.ProviderProfiles
                .Include(p => p.User)
                .Where(p => p.User!.IsActive);

            if (!string.IsNullOrWhiteSpace(category))
            {
                query = query.Where(p => p.Category.ToLower() == category.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p => p.BusinessName.Contains(search) ||
                                         p.User!.FullName.Contains(search) ||
                                         p.Category.Contains(search) ||
                                         p.City!.Contains(search));
            }

            var providers = await query.Select(p => new ProviderProfileResponseDto
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

            foreach (var p in providers)
            {
                var scoreResult = await _trustScoreService.CalculateTrustScoreAsync(p.ProviderId);
                p.TrustScore = scoreResult.TrustScore;
                p.TrustBadge = scoreResult.TrustBadge;
            }

            return Ok(providers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProviderById(int id)
        {
            var provider = await _context.ProviderProfiles
                .Include(p => p.User)
                .Include(p => p.Services)
                .Include(p => p.ProviderReviews)
                .ThenInclude(r => r.Customer)
                .FirstOrDefaultAsync(p => p.ProviderId == id);

            if (provider == null) return NotFound(new { message = "Provider not found." });

            var scoreResult = await _trustScoreService.CalculateTrustScoreAsync(provider.ProviderId);

            return Ok(new
            {
                provider.ProviderId,
                provider.UserId,
                FullName = provider.User?.FullName,
                Email = provider.User?.Email,
                Phone = provider.User?.Phone,
                provider.BusinessName,
                provider.Category,
                provider.Bio,
                provider.ExperienceYears,
                provider.HourlyRate,
                provider.Address,
                provider.City,
                provider.State,
                provider.ZipCode,
                provider.IsKycVerified,
                provider.IdentityDocUrl,
                provider.CertificateUrl,
                provider.Rating,
                provider.TotalReviews,
                provider.WalletBalance,
                provider.IsAvailable,
                TrustScore = scoreResult.TrustScore,
                TrustBadge = scoreResult.TrustBadge,
                Services = provider.Services.Where(s => s.IsActive).Select(s => new
                {
                    s.ServiceId,
                    s.Title,
                    s.Description,
                    s.Category,
                    s.Price,
                    s.DurationMinutes
                }),
                Reviews = provider.ProviderReviews.OrderByDescending(r => r.CreatedAt).Select(r => new
                {
                    r.ReviewId,
                    r.Rating,
                    r.Comment,
                    CustomerName = r.Customer?.FullName,
                    r.CreatedAt
                })
            });
        }

        [HttpPost("kyc")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> UploadKycDoc([FromBody] KycDocUploadDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var provider = await _context.ProviderProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (provider == null) return NotFound();

            string docUrl = dto.DocUrl ?? "https://serviceconnect.com/docs/identity_verified.pdf";
            provider.IdentityDocUrl = docUrl;
            provider.IsKycVerified = "Pending";
            provider.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "KYC documents submitted successfully. Verification pending admin review." });
        }

        [HttpPost("certificate")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> UploadCertificate([FromBody] CertificateUploadDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var provider = await _context.ProviderProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (provider == null) return NotFound();

            string certUrl = dto.CertUrl ?? "https://serviceconnect.com/docs/license_certificate.pdf";
            provider.CertificateUrl = certUrl;
            provider.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Trade certificate uploaded successfully." });
        }

        [HttpGet("wallet")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> GetWalletStats()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var provider = await _context.ProviderProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (provider == null) return NotFound();

            var totalEarned = await _context.Bookings
                .Where(b => b.ProviderId == provider.ProviderId && b.Status == "Completed")
                .SumAsync(b => b.TotalPrice);

            var pendingEarnings = await _context.Bookings
                .Where(b => b.ProviderId == provider.ProviderId && (b.Status == "Accepted" || b.Status == "InProgress"))
                .SumAsync(b => b.TotalPrice);

            var recentTransactions = await _context.Bookings
                .Where(b => b.ProviderId == provider.ProviderId && b.Status == "Completed")
                .OrderByDescending(b => b.UpdatedAt ?? b.CreatedAt)
                .Take(5)
                .Select(b => new
                {
                    b.BookingId,
                    b.TotalPrice,
                    Date = b.UpdatedAt ?? b.CreatedAt,
                    Status = "Credited"
                }).ToListAsync();

            return Ok(new
            {
                provider.WalletBalance,
                TotalEarned = totalEarned,
                PendingEarnings = pendingEarnings,
                RecentTransactions = recentTransactions
            });
        }
        [HttpGet("{id}/trust-score")]
        public async Task<IActionResult> GetProviderTrustScore(int id)
        {
            var provider = await _context.ProviderProfiles.FindAsync(id);
            if (provider == null) return NotFound(new { message = "Provider not found." });

            var scoreResult = await _trustScoreService.CalculateTrustScoreAsync(id);
            return Ok(scoreResult);
        }
    }
}
