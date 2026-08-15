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
    public class ServicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly RecommendationService _recommendationService;
        private readonly TrustScoreService _trustScoreService;

        public ServicesController(ApplicationDbContext context, RecommendationService recommendationService, TrustScoreService trustScoreService)
        {
            _context = context;
            _recommendationService = recommendationService;
            _trustScoreService = trustScoreService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllServices([FromQuery] string? category, [FromQuery] string? search, [FromQuery] decimal? maxPrice)
        {
            var query = _context.Services
                .Include(s => s.Provider)
                .ThenInclude(p => p!.User)
                .Where(s => s.IsActive && s.Provider != null && s.Provider.User!.IsActive);

            if (!string.IsNullOrWhiteSpace(category))
            {
                query = query.Where(s => s.Category.ToLower() == category.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(s => s.Title.Contains(search) ||
                                         s.Description!.Contains(search) ||
                                         s.Category.Contains(search) ||
                                         s.Provider!.BusinessName.Contains(search));
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(s => s.Price <= maxPrice.Value);
            }

            var services = await query.Select(s => new ServiceResponseDto
            {
                ServiceId = s.ServiceId,
                ProviderId = s.ProviderId,
                ProviderName = s.Provider!.User!.FullName,
                BusinessName = s.Provider.BusinessName,
                ProviderRating = s.Provider.Rating,
                Title = s.Title,
                Description = s.Description,
                Category = s.Category,
                Price = s.Price,
                DurationMinutes = s.DurationMinutes,
                IsActive = s.IsActive,
                CreatedAt = s.CreatedAt
            }).ToListAsync();

            foreach (var s in services)
            {
                var scoreResult = await _trustScoreService.CalculateTrustScoreAsync(s.ProviderId);
                s.TrustScore = scoreResult.TrustScore;
                s.TrustBadge = scoreResult.TrustBadge;
            }

            return Ok(services);
        }

        [HttpGet("recommended")]
        public async Task<IActionResult> GetRecommendedServices([FromQuery] int limit = 6)
        {
            int? customerId = null;
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out int uid))
            {
                customerId = uid;
            }

            var recommended = await _recommendationService.GetRecommendedServicesAsync(customerId, limit);
            foreach (var s in recommended)
            {
                var scoreResult = await _trustScoreService.CalculateTrustScoreAsync(s.ProviderId);
                s.TrustScore = scoreResult.TrustScore;
                s.TrustBadge = scoreResult.TrustBadge;
            }
            return Ok(recommended);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetServiceById(int id)
        {
            var service = await _context.Services
                .Include(s => s.Provider)
                .ThenInclude(p => p!.User)
                .FirstOrDefaultAsync(s => s.ServiceId == id);

            if (service == null) return NotFound(new { message = "Service not found." });

            var scoreResult = await _trustScoreService.CalculateTrustScoreAsync(service.ProviderId);

            return Ok(new ServiceResponseDto
            {
                ServiceId = service.ServiceId,
                ProviderId = service.ProviderId,
                ProviderName = service.Provider?.User?.FullName ?? string.Empty,
                BusinessName = service.Provider?.BusinessName ?? string.Empty,
                ProviderRating = service.Provider?.Rating ?? 5.0m,
                Title = service.Title,
                Description = service.Description,
                Category = service.Category,
                Price = service.Price,
                DurationMinutes = service.DurationMinutes,
                IsActive = service.IsActive,
                TrustScore = scoreResult.TrustScore,
                TrustBadge = scoreResult.TrustBadge,
                CreatedAt = service.CreatedAt
            });
        }

        [HttpPost]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> CreateService([FromBody] ServiceCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var provider = await _context.ProviderProfiles.FirstOrDefaultAsync(p => p.UserId == userId);

            if (provider == null)
            {
                return BadRequest(new { message = "Provider profile not found for current user." });
            }

            var service = new ServiceItem
            {
                ProviderId = provider.ProviderId,
                Title = dto.Title,
                Description = dto.Description,
                Category = dto.Category,
                Price = dto.Price,
                DurationMinutes = dto.DurationMinutes,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            var scoreResult = await _trustScoreService.CalculateTrustScoreAsync(provider.ProviderId);

            return CreatedAtAction(nameof(GetServiceById), new { id = service.ServiceId }, new ServiceResponseDto
            {
                ServiceId = service.ServiceId,
                ProviderId = service.ProviderId,
                ProviderName = User.FindFirst(ClaimTypes.Name)?.Value ?? "",
                BusinessName = provider.BusinessName,
                ProviderRating = provider.Rating,
                Title = service.Title,
                Description = service.Description,
                Category = service.Category,
                Price = service.Price,
                DurationMinutes = service.DurationMinutes,
                IsActive = service.IsActive,
                TrustScore = scoreResult.TrustScore,
                TrustBadge = scoreResult.TrustBadge,
                CreatedAt = service.CreatedAt
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> UpdateService(int id, [FromBody] ServiceUpdateDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var provider = await _context.ProviderProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (provider == null) return Unauthorized();

            var service = await _context.Services.FirstOrDefaultAsync(s => s.ServiceId == id && s.ProviderId == provider.ProviderId);
            if (service == null) return NotFound(new { message = "Service not found or unauthorized." });

            if (!string.IsNullOrEmpty(dto.Title)) service.Title = dto.Title;
            if (dto.Description != null) service.Description = dto.Description;
            if (!string.IsNullOrEmpty(dto.Category)) service.Category = dto.Category;
            if (dto.Price.HasValue) service.Price = dto.Price.Value;
            if (dto.DurationMinutes.HasValue) service.DurationMinutes = dto.DurationMinutes.Value;
            if (dto.IsActive.HasValue) service.IsActive = dto.IsActive.Value;
            service.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Service updated successfully." });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Provider,Admin")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var role = User.FindFirst(ClaimTypes.Role)!.Value;

            var service = await _context.Services.FindAsync(id);
            if (service == null) return NotFound();

            if (role == "Provider")
            {
                var provider = await _context.ProviderProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
                if (provider == null || service.ProviderId != provider.ProviderId)
                    return Forbidden();
            }

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Service deleted successfully." });
        }

        private IActionResult Forbidden() => StatusCode(StatusCodes.Status403Forbidden, new { message = "Forbidden" });
    }
}
