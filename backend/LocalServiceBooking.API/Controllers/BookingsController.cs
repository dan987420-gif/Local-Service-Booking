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
    [Authorize]
    public class BookingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CreateBooking([FromBody] BookingCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var customerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var service = await _context.Services.Include(s => s.Provider).FirstOrDefaultAsync(s => s.ServiceId == dto.ServiceId);

            if (service == null || !service.IsActive)
            {
                return BadRequest(new { message = "Selected service is unavailable." });
            }

            var booking = new Booking
            {
                CustomerId = customerId,
                ProviderId = service.ProviderId,
                ServiceId = service.ServiceId,
                BookingDate = dto.BookingDate,
                ScheduledTime = dto.ScheduledTime,
                Address = dto.Address,
                City = dto.City,
                Status = "Pending",
                TotalPrice = service.Price,
                Notes = dto.Notes,
                CreatedAt = DateTime.UtcNow
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            // Log history
            _context.BookingStatusHistories.Add(new BookingStatusHistory
            {
                BookingId = booking.BookingId,
                OldStatus = null,
                NewStatus = "Pending",
                ChangedByUserId = customerId,
                ChangedByRole = "Customer",
                ChangedAt = DateTime.UtcNow,
                Remarks = "Booking created."
            });
            await _context.SaveChangesAsync();

            // Send notification to provider
            var providerUser = await _context.ProviderProfiles.Where(p => p.ProviderId == service.ProviderId).Select(p => p.UserId).FirstOrDefaultAsync();
            if (providerUser > 0)
            {
                _context.Notifications.Add(new Notification
                {
                    UserId = providerUser,
                    Title = "New Booking Request",
                    Message = $"You have a new booking request for service: '{service.Title}'.",
                    Type = "Booking",
                    CreatedAt = DateTime.UtcNow
                });
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Booking submitted successfully.", bookingId = booking.BookingId });
        }

        [HttpGet("my-bookings")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetCustomerBookings()
        {
            var customerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var bookings = await _context.Bookings
                .Include(b => b.Provider).ThenInclude(p => p!.User)
                .Include(b => b.Service)
                .Include(b => b.Review)
                .Where(b => b.CustomerId == customerId)
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new BookingResponseDto
                {
                    BookingId = b.BookingId,
                    CustomerId = b.CustomerId,
                    CustomerName = User.FindFirst(ClaimTypes.Name)!.Value,
                    CustomerEmail = User.FindFirst(ClaimTypes.Email)!.Value,
                    ProviderId = b.ProviderId,
                    ProviderUserId = b.Provider!.UserId,
                    BusinessName = b.Provider!.BusinessName,
                    ProviderName = b.Provider.User!.FullName,
                    ProviderPhone = b.Provider.User.Phone,
                    ServiceId = b.ServiceId,
                    ServiceTitle = b.Service!.Title,
                    ServiceCategory = b.Service.Category,
                    BookingDate = b.BookingDate,
                    ScheduledTime = b.ScheduledTime,
                    Address = b.Address,
                    City = b.City,
                    Status = b.Status,
                    TotalPrice = b.TotalPrice,
                    Notes = b.Notes,
                    CreatedAt = b.CreatedAt,
                    HasReview = b.Review != null
                }).ToListAsync();

            return Ok(bookings);
        }

        [HttpGet("provider-bookings")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> GetProviderBookings()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var provider = await _context.ProviderProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (provider == null) return NotFound(new { message = "Provider profile not found." });

            var bookings = await _context.Bookings
                .Include(b => b.Customer)
                .Include(b => b.Service)
                .Where(b => b.ProviderId == provider.ProviderId)
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new BookingResponseDto
                {
                    BookingId = b.BookingId,
                    CustomerId = b.CustomerId,
                    CustomerName = b.Customer!.FullName,
                    CustomerEmail = b.Customer.Email,
                    CustomerPhone = b.Customer.Phone,
                    ProviderId = b.ProviderId,
                    ProviderUserId = provider.UserId,
                    BusinessName = provider.BusinessName,
                    ProviderName = User.FindFirst(ClaimTypes.Name)!.Value,
                    ServiceId = b.ServiceId,
                    ServiceTitle = b.Service!.Title,
                    ServiceCategory = b.Service.Category,
                    BookingDate = b.BookingDate,
                    ScheduledTime = b.ScheduledTime,
                    Address = b.Address,
                    City = b.City,
                    Status = b.Status,
                    TotalPrice = b.TotalPrice,
                    Notes = b.Notes,
                    CreatedAt = b.CreatedAt
                }).ToListAsync();

            return Ok(bookings);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.Customer)
                .Include(b => b.Provider).ThenInclude(p => p!.User)
                .Include(b => b.Service)
                .Include(b => b.Review)
                .FirstOrDefaultAsync(b => b.BookingId == id);

            if (booking == null) return NotFound();

            return Ok(new BookingResponseDto
            {
                BookingId = booking.BookingId,
                CustomerId = booking.CustomerId,
                CustomerName = booking.Customer?.FullName ?? "",
                CustomerEmail = booking.Customer?.Email ?? "",
                CustomerPhone = booking.Customer?.Phone,
                ProviderId = booking.ProviderId,
                ProviderUserId = booking.Provider != null ? booking.Provider.UserId : 0,
                BusinessName = booking.Provider?.BusinessName ?? "",
                ProviderName = booking.Provider?.User?.FullName ?? "",
                ProviderPhone = booking.Provider?.User?.Phone,
                ServiceId = booking.ServiceId,
                ServiceTitle = booking.Service?.Title ?? "",
                ServiceCategory = booking.Service?.Category ?? "",
                BookingDate = booking.BookingDate,
                ScheduledTime = booking.ScheduledTime,
                Address = booking.Address,
                City = booking.City,
                Status = booking.Status,
                TotalPrice = booking.TotalPrice,
                Notes = booking.Notes,
                CreatedAt = booking.CreatedAt,
                HasReview = booking.Review != null
            });
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Provider,Admin")]
        public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] BookingStatusUpdateDto dto)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound();

            if (User.IsInRole("Provider"))
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var provider = await _context.ProviderProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
                if (provider == null || booking.ProviderId != provider.ProviderId)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "Forbidden. Booking does not belong to provider." });
                }
            }

            var validStatuses = new[] { "Accepted", "Rejected", "InProgress", "Completed", "Cancelled" };
            if (!validStatuses.Contains(dto.Status))
            {
                return BadRequest(new { message = "Invalid status update." });
            }

            var oldStatus = booking.Status;
            booking.Status = dto.Status;
            booking.UpdatedAt = DateTime.UtcNow;

            if (dto.Status == "Completed")
            {
                var provider = await _context.ProviderProfiles.FindAsync(booking.ProviderId);
                if (provider != null)
                {
                    provider.WalletBalance += booking.TotalPrice;
                }
            }

            await _context.SaveChangesAsync();

            var changedByUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var changedByRole = User.FindFirst(ClaimTypes.Role)!.Value;

            // Log history
            _context.BookingStatusHistories.Add(new BookingStatusHistory
            {
                BookingId = booking.BookingId,
                OldStatus = oldStatus,
                NewStatus = dto.Status,
                ChangedByUserId = changedByUserId,
                ChangedByRole = changedByRole,
                ChangedAt = DateTime.UtcNow,
                Remarks = dto.Remarks ?? $"Status updated to {dto.Status}."
            });
            await _context.SaveChangesAsync();

            // Notify Customer
            _context.Notifications.Add(new Notification
            {
                UserId = booking.CustomerId,
                Title = $"Booking Update: {dto.Status}",
                Message = $"Your booking status has been updated to '{dto.Status}'.",
                Type = "Booking",
                CreatedAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Booking status updated to {dto.Status}." });
        }

        [HttpPost("{id}/cancel")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            var customerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.BookingId == id && b.CustomerId == customerId);

            if (booking == null) return NotFound();
            if (booking.Status == "Completed" || booking.Status == "Cancelled")
            {
                return BadRequest(new { message = "Cannot cancel completed or already cancelled booking." });
            }

            var oldStatus = booking.Status;
            booking.Status = "Cancelled";
            booking.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // Log history
            _context.BookingStatusHistories.Add(new BookingStatusHistory
            {
                BookingId = booking.BookingId,
                OldStatus = oldStatus,
                NewStatus = "Cancelled",
                ChangedByUserId = customerId,
                ChangedByRole = "Customer",
                ChangedAt = DateTime.UtcNow,
                Remarks = "Booking cancelled by customer."
            });
            await _context.SaveChangesAsync();

            return Ok(new { message = "Booking cancelled successfully." });
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllBookings()
        {
            var bookings = await _context.Bookings
                .Include(b => b.Customer)
                .Include(b => b.Provider).ThenInclude(p => p!.User)
                .Include(b => b.Service)
                .Include(b => b.Review)
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new BookingResponseDto
                {
                    BookingId = b.BookingId,
                    CustomerId = b.CustomerId,
                    CustomerName = b.Customer!.FullName,
                    CustomerEmail = b.Customer.Email,
                    CustomerPhone = b.Customer.Phone,
                    ProviderId = b.ProviderId,
                    ProviderUserId = b.Provider!.UserId,
                    BusinessName = b.Provider!.BusinessName,
                    ProviderName = b.Provider.User!.FullName,
                    ProviderPhone = b.Provider.User.Phone,
                    ServiceId = b.ServiceId,
                    ServiceTitle = b.Service!.Title,
                    ServiceCategory = b.Service.Category,
                    BookingDate = b.BookingDate,
                    ScheduledTime = b.ScheduledTime,
                    Address = b.Address,
                    City = b.City,
                    Status = b.Status,
                    TotalPrice = b.TotalPrice,
                    Notes = b.Notes,
                    CreatedAt = b.CreatedAt,
                    HasReview = b.Review != null
                }).ToListAsync();

            return Ok(bookings);
        }

        [HttpGet("{id}/status-history")]
        public async Task<IActionResult> GetBookingStatusHistory(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound(new { message = "Booking not found." });

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var role = User.FindFirst(ClaimTypes.Role)!.Value;

            // Check authorization:
            // Customers: only own bookings
            // Providers: only own bookings
            // Admin: any
            if (role == "Customer" && booking.CustomerId != userId)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Forbidden. You cannot view this booking's history." });
            }
            else if (role == "Provider")
            {
                var provider = await _context.ProviderProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
                if (provider == null || booking.ProviderId != provider.ProviderId)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "Forbidden. You cannot view this booking's history." });
                }
            }

            var history = await _context.BookingStatusHistories
                .Include(h => h.ChangedByUser)
                .Where(h => h.BookingId == id)
                .OrderBy(h => h.ChangedAt)
                .Select(h => new BookingStatusHistoryResponseDto
                {
                    HistoryId = h.HistoryId,
                    BookingId = h.BookingId,
                    OldStatus = h.OldStatus,
                    NewStatus = h.NewStatus,
                    ChangedByUserId = h.ChangedByUserId,
                    ChangedByName = h.ChangedByUser != null ? h.ChangedByUser.FullName : "System",
                    ChangedByRole = h.ChangedByRole,
                    ChangedAt = h.ChangedAt,
                    Remarks = h.Remarks
                }).ToListAsync();

            return Ok(history);
        }
    }
}
