namespace LocalServiceBooking.API.DTOs
{
    public class UserResponseDto
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public ProviderProfileResponseDto? ProviderProfile { get; set; }
    }

    public class ProviderProfileResponseDto
    {
        public int ProviderId { get; set; }
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public int ExperienceYears { get; set; }
        public decimal HourlyRate { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? ZipCode { get; set; }
        public string IsKycVerified { get; set; } = string.Empty;
        public string? IdentityDocUrl { get; set; }
        public string? CertificateUrl { get; set; }
        public decimal Rating { get; set; }
        public int TotalReviews { get; set; }
        public decimal WalletBalance { get; set; }
        public bool IsAvailable { get; set; }
        public int TrustScore { get; set; }
        public string TrustBadge { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class KycVerificationDto
    {
        public string Status { get; set; } = "Verified"; // Verified or Rejected
    }

    public class UserStatusUpdateDto
    {
        public bool IsActive { get; set; }
    }

    public class KycDocUploadDto
    {
        public string? DocUrl { get; set; }
    }

    public class CertificateUploadDto
    {
        public string? CertUrl { get; set; }
    }
}
