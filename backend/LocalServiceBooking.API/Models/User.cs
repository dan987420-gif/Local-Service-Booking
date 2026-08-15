using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LocalServiceBooking.API.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Phone { get; set; }

        [MaxLength(255)]
        public string? Address { get; set; }

        [Required]
        [MaxLength(20)]
        public string Role { get; set; } = "Customer"; // Customer, Provider, Admin

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties
        public virtual ProviderProfile? ProviderProfile { get; set; }
        public virtual ICollection<Booking> CustomerBookings { get; set; } = new List<Booking>();
        public virtual ICollection<Review> CustomerReviews { get; set; } = new List<Review>();
        public virtual ICollection<Complaint> CustomerComplaints { get; set; } = new List<Complaint>();
        public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    }
}
