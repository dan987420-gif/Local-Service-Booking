using System.ComponentModel.DataAnnotations;

namespace LocalServiceBooking.API.DTOs
{
    public class ComplaintCreateDto
    {
        [Required]
        public int BookingId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Subject { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;
    }

    public class ComplaintStatusUpdateDto
    {
        [Required]
        public string Status { get; set; } = string.Empty; // Pending, InProgress, Resolved, Rejected
    }

    public class ComplaintResponseDto
    {
        public int ComplaintId { get; set; }
        public int BookingId { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public int ProviderId { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
