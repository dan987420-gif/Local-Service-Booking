using System.ComponentModel.DataAnnotations;

namespace LocalServiceBooking.API.DTOs
{
    public class SendMessageDto
    {
        [Required]
        public int BookingId { get; set; }

        [Required]
        public int ReceiverId { get; set; }

        [Required]
        public string MessageText { get; set; } = string.Empty;
    }

    public class ChatMessageResponseDto
    {
        public int ChatMessageId { get; set; }
        public int BookingId { get; set; }
        public int SenderId { get; set; }
        public string SenderName { get; set; } = string.Empty;
        public int ReceiverId { get; set; }
        public string ReceiverName { get; set; } = string.Empty;
        public string MessageText { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
    }
}
