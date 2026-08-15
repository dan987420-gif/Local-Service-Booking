using System.Security.Claims;
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
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReviewsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CreateReview([FromBody] ReviewCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var customerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.BookingId == dto.BookingId && b.CustomerId == customerId);

            if (booking == null) return NotFound(new { message = "Booking not found." });
            if (booking.Status != "Completed")
            {
                return BadRequest(new { message = "Reviews can only be submitted for completed bookings." });
            }

            var existingReview = await _context.Reviews.AnyAsync(r => r.BookingId == dto.BookingId);
            if (existingReview)
            {
                return BadRequest(new { message = "A review has already been submitted for this booking." });
            }

            var review = new Review
            {
                BookingId = dto.BookingId,
                CustomerId = customerId,
                ProviderId = booking.ProviderId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            // Recalculate Provider Rating & Total Reviews
            var provider = await _context.ProviderProfiles.Include(p => p.ProviderReviews).FirstOrDefaultAsync(p => p.ProviderId == booking.ProviderId);
            if (provider != null)
            {
                var totalRev = await _context.Reviews.CountAsync(r => r.ProviderId == provider.ProviderId);
                var avgRating = await _context.Reviews.Where(r => r.ProviderId == provider.ProviderId).AverageAsync(r => (double)r.Rating);
                provider.TotalReviews = totalRev;
                provider.Rating = (decimal)Math.Round(avgRating, 2);
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Review submitted successfully." });
        }

        [HttpGet("provider/{providerId}")]
        public async Task<IActionResult> GetProviderReviews(int providerId)
        {
            var reviews = await _context.Reviews
                .Include(r => r.Customer)
                .Include(r => r.Provider)
                .Where(r => r.ProviderId == providerId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewResponseDto
                {
                    ReviewId = r.ReviewId,
                    BookingId = r.BookingId,
                    CustomerId = r.CustomerId,
                    CustomerName = r.Customer!.FullName,
                    ProviderId = r.ProviderId,
                    BusinessName = r.Provider!.BusinessName,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                }).ToListAsync();

            return Ok(reviews);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllReviews()
        {
            var reviews = await _context.Reviews
                .Include(r => r.Customer)
                .Include(r => r.Provider)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewResponseDto
                {
                    ReviewId = r.ReviewId,
                    BookingId = r.BookingId,
                    CustomerId = r.CustomerId,
                    CustomerName = r.Customer!.FullName,
                    ProviderId = r.ProviderId,
                    BusinessName = r.Provider!.BusinessName,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                }).ToListAsync();

            return Ok(reviews);
        }
    }
}
