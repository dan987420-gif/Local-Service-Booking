using System.ComponentModel.DataAnnotations;

namespace LocalServiceBooking.API.DTOs
{
    public class ServiceCreateDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }

        [Required]
        public string Category { get; set; } = string.Empty;

        [Required]
        [Range(0.01, 100000.00)]
        public decimal Price { get; set; }

        public int DurationMinutes { get; set; } = 60;
    }

    public class ServiceUpdateDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Category { get; set; }
        public decimal? Price { get; set; }
        public int? DurationMinutes { get; set; }
        public bool? IsActive { get; set; }
    }

    public class ServiceResponseDto
    {
        public int ServiceId { get; set; }
        public int ProviderId { get; set; }
        public string ProviderName { get; set; } = string.Empty;
        public string BusinessName { get; set; } = string.Empty;
        public decimal ProviderRating { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Category { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DurationMinutes { get; set; }
        public bool IsActive { get; set; }
        public int TrustScore { get; set; }
        public string TrustBadge { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
