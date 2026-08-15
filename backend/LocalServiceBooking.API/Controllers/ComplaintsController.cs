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
    public class ComplaintsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ComplaintsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CreateComplaint([FromBody] ComplaintCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var customerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.BookingId == dto.BookingId && b.CustomerId == customerId);

            if (booking == null) return NotFound(new { message = "Booking not found." });

            var complaint = new Complaint
            {
                BookingId = dto.BookingId,
                CustomerId = customerId,
                ProviderId = booking.ProviderId,
                Subject = dto.Subject,
                Description = dto.Description,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.Complaints.Add(complaint);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Complaint registered successfully. Admin will review soon.", complaintId = complaint.ComplaintId });
        }

        [HttpGet("my-complaints")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetCustomerComplaints()
        {
            var customerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var complaints = await _context.Complaints
                .Include(c => c.Provider)
                .Where(c => c.CustomerId == customerId)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new ComplaintResponseDto
                {
                    ComplaintId = c.ComplaintId,
                    BookingId = c.BookingId,
                    CustomerId = c.CustomerId,
                    CustomerName = User.FindFirst(ClaimTypes.Name)!.Value,
                    ProviderId = c.ProviderId,
                    BusinessName = c.Provider!.BusinessName,
                    Subject = c.Subject,
                    Description = c.Description,
                    Status = c.Status,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                }).ToListAsync();

            return Ok(complaints);
        }

        [HttpGet("provider-complaints")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> GetProviderComplaints()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var provider = await _context.ProviderProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (provider == null) return NotFound();

            var complaints = await _context.Complaints
                .Include(c => c.Customer)
                .Where(c => c.ProviderId == provider.ProviderId)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new ComplaintResponseDto
                {
                    ComplaintId = c.ComplaintId,
                    BookingId = c.BookingId,
                    CustomerId = c.CustomerId,
                    CustomerName = c.Customer!.FullName,
                    ProviderId = c.ProviderId,
                    BusinessName = provider.BusinessName,
                    Subject = c.Subject,
                    Description = c.Description,
                    Status = c.Status,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                }).ToListAsync();

            return Ok(complaints);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllComplaints()
        {
            var complaints = await _context.Complaints
                .Include(c => c.Customer)
                .Include(c => c.Provider)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new ComplaintResponseDto
                {
                    ComplaintId = c.ComplaintId,
                    BookingId = c.BookingId,
                    CustomerId = c.CustomerId,
                    CustomerName = c.Customer!.FullName,
                    ProviderId = c.ProviderId,
                    BusinessName = c.Provider!.BusinessName,
                    Subject = c.Subject,
                    Description = c.Description,
                    Status = c.Status,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                }).ToListAsync();

            return Ok(complaints);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin,Provider")]
        public async Task<IActionResult> UpdateComplaintStatus(int id, [FromBody] ComplaintStatusUpdateDto dto)
        {
            var complaint = await _context.Complaints.FindAsync(id);
            if (complaint == null) return NotFound();

            if (User.IsInRole("Provider"))
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var provider = await _context.ProviderProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
                if (provider == null || complaint.ProviderId != provider.ProviderId)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "Forbidden. Complaint does not belong to provider." });
                }
            }

            complaint.Status = dto.Status;
            complaint.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // Notify Customer
            _context.Notifications.Add(new Notification
            {
                UserId = complaint.CustomerId,
                Title = $"Complaint Update: {dto.Status}",
                Message = $"Your complaint regarding booking #{complaint.BookingId} status is now '{dto.Status}'.",
                Type = "Complaint",
                CreatedAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Complaint status updated to {dto.Status}." });
        }
    }
}
