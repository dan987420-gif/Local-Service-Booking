using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LocalServiceBooking.API.Models
{
    public class ProviderProfile
    {
        [Key]
        public int ProviderId { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        [Required]
        [MaxLength(150)]
        public string BusinessName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Category { get; set; } = string.Empty; // Electrician, Plumber, Cleaning, Appliance Repair, Carpentry, Painting

        public string? Bio { get; set; }

        public int ExperienceYears { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal HourlyRate { get; set; } = 0.00m;

        [MaxLength(255)]
        public string? Address { get; set; }

        [MaxLength(100)]
        public string? City { get; set; }

        [MaxLength(100)]
        public string? State { get; set; }

        [MaxLength(20)]
        public string? ZipCode { get; set; }

        [Required]
        [MaxLength(20)]
        public string IsKycVerified { get; set; } = "Pending"; // Pending, Verified, Rejected

        public string? IdentityDocUrl { get; set; }

        public string? CertificateUrl { get; set; }

        [Column(TypeName = "decimal(3,2)")]
        public decimal Rating { get; set; } = 5.00m;

        public int TotalReviews { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal WalletBalance { get; set; } = 0.00m;

        public bool IsAvailable { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties
        public virtual ICollection<ServiceItem> Services { get; set; } = new List<ServiceItem>();
        public virtual ICollection<Booking> ProviderBookings { get; set; } = new List<Booking>();
        public virtual ICollection<Review> ProviderReviews { get; set; } = new List<Review>();
        public virtual ICollection<Complaint> ProviderComplaints { get; set; } = new List<Complaint>();
    }
}
