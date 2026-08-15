using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LocalServiceBooking.API.Models
{
    public class BookingStatusHistory
    {
        [Key]
        public int HistoryId { get; set; }

        [Required]
        public int BookingId { get; set; }

        [ForeignKey("BookingId")]
        public virtual Booking? Booking { get; set; }

        public string? OldStatus { get; set; }

        [Required]
        [MaxLength(20)]
        public string NewStatus { get; set; } = string.Empty;

        [Required]
        public int ChangedByUserId { get; set; }

        [ForeignKey("ChangedByUserId")]
        public virtual User? ChangedByUser { get; set; }

        [Required]
        [MaxLength(20)]
        public string ChangedByRole { get; set; } = string.Empty; // Customer, Provider, Admin

        [Required]
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(500)]
        public string? Remarks { get; set; }
    }
}
