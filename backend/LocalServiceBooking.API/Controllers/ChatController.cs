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
    public class ChatController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ChatController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("booking/{bookingId}")]
        public async Task<IActionResult> GetChatMessages(int bookingId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var booking = await _context.Bookings
                .Include(b => b.Provider)
                .FirstOrDefaultAsync(b => b.BookingId == bookingId);

            if (booking == null) return NotFound(new { message = "Booking not found." });

            // Ensure caller is either the Customer or the Provider
            if (booking.CustomerId != userId && booking.Provider!.UserId != userId)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Forbidden" });
            }

            var messages = await _context.ChatMessages
                .Include(c => c.Sender)
                .Include(c => c.Receiver)
                .Where(c => c.BookingId == bookingId)
                .OrderBy(c => c.SentAt)
                .Select(c => new ChatMessageResponseDto
                {
                    ChatMessageId = c.ChatMessageId,
                    BookingId = c.BookingId,
                    SenderId = c.SenderId,
                    SenderName = c.Sender!.FullName,
                    ReceiverId = c.ReceiverId,
                    ReceiverName = c.Receiver!.FullName,
                    MessageText = c.MessageText,
                    SentAt = c.SentAt
                }).ToListAsync();

            return Ok(messages);
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var senderId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var message = new ChatMessage
            {
                BookingId = dto.BookingId,
                SenderId = senderId,
                ReceiverId = dto.ReceiverId,
                MessageText = dto.MessageText,
                SentAt = DateTime.UtcNow
            };

            _context.ChatMessages.Add(message);
            await _context.SaveChangesAsync();

            var senderName = await _context.Users.Where(u => u.UserId == senderId).Select(u => u.FullName).FirstOrDefaultAsync();

            return Ok(new ChatMessageResponseDto
            {
                ChatMessageId = message.ChatMessageId,
                BookingId = message.BookingId,
                SenderId = message.SenderId,
                SenderName = senderName ?? "",
                ReceiverId = message.ReceiverId,
                MessageText = message.MessageText,
                SentAt = message.SentAt
            });
        }
    }
}
