using Microsoft.EntityFrameworkCore;
using LocalServiceBooking.API.Data;
using LocalServiceBooking.API.DTOs;

namespace LocalServiceBooking.API.Services
{
    public class RecommendationService
    {
        private readonly ApplicationDbContext _context;

        public RecommendationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ServiceResponseDto>> GetRecommendedServicesAsync(int? customerId = null, int limit = 6)
        {
            // Rule 1: Highly rated & active providers
            var query = _context.Services
                .Include(s => s.Provider)
                .ThenInclude(p => p!.User)
                .Where(s => s.IsActive && s.Provider != null && s.Provider.IsAvailable && s.Provider.IsKycVerified == "Verified");

            // Rule 2: If customer has past bookings, prefer top categories they booked
            if (customerId.HasValue)
            {
                var favoriteCategories = await _context.Bookings
                    .Where(b => b.CustomerId == customerId.Value)
                    .Select(b => b.Service!.Category)
                    .Distinct()
                    .ToListAsync();

                if (favoriteCategories.Any())
                {
                    query = query.OrderByDescending(s => favoriteCategories.Contains(s.Category))
                                 .ThenByDescending(s => s.Provider!.Rating)
                                 .ThenByDescending(s => s.Bookings.Count);
                }
                else
                {
                    query = query.OrderByDescending(s => s.Provider!.Rating)
                                 .ThenByDescending(s => s.Bookings.Count);
                }
            }
            else
            {
                // Default: Order by provider rating and popularity
                query = query.OrderByDescending(s => s.Provider!.Rating)
                             .ThenByDescending(s => s.Bookings.Count);
            }

            var recommendedList = await query.Take(limit).Select(s => new ServiceResponseDto
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

            return recommendedList;
        }
    }
}
