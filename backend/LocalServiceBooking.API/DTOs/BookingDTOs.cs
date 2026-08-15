using System.ComponentModel.DataAnnotations;

namespace LocalServiceBooking.API.DTOs
{
    public class BookingCreateDto
    {
        [Required]
        public int ServiceId { get; set; }

        [Required]
        public DateTime BookingDate { get; set; }

        [Required]
        public string ScheduledTime { get; set; } = string.Empty;

        [Required]
        public string Address { get; set; } = string.Empty;

        [Required]
        public string City { get; set; } = string.Empty;

        public string? Notes { get; set; }
    }

    public class BookingStatusUpdateDto
    {
        [Required]
        public string Status { get; set; } = string.Empty; // Accepted, Rejected, InProgress, Completed, Cancelled
        public string? Remarks { get; set; }
    }

    public class BookingResponseDto
    {
        public int BookingId { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string? CustomerPhone { get; set; }

        public int ProviderId { get; set; }
        public int ProviderUserId { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public string ProviderName { get; set; } = string.Empty;
        public string? ProviderPhone { get; set; }

        public int ServiceId { get; set; }
        public string ServiceTitle { get; set; } = string.Empty;
        public string ServiceCategory { get; set; } = string.Empty;

        public DateTime BookingDate { get; set; }
        public string ScheduledTime { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal TotalPrice { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool HasReview { get; set; }
    }

    public class BookingStatusHistoryResponseDto
    {
        public int HistoryId { get; set; }
        public int BookingId { get; set; }
        public string? OldStatus { get; set; }
        public string NewStatus { get; set; } = string.Empty;
        public int ChangedByUserId { get; set; }
        public string ChangedByName { get; set; } = string.Empty;
        public string ChangedByRole { get; set; } = string.Empty;
        public DateTime ChangedAt { get; set; }
        public string? Remarks { get; set; }
    }
}
