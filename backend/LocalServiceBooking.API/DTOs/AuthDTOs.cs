using System.ComponentModel.DataAnnotations;

namespace LocalServiceBooking.API.DTOs
{
    public class RegisterDto
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        public string? Phone { get; set; }
        public string? Address { get; set; }
    }

    public class ProviderRegisterDto : RegisterDto
    {
        [Required]
        public string BusinessName { get; set; } = string.Empty;

        [Required]
        public string Category { get; set; } = string.Empty;

        public string? Bio { get; set; }
        public int ExperienceYears { get; set; } = 0;
        public decimal HourlyRate { get; set; } = 0;
        public string? City { get; set; }
        public string? State { get; set; }
        public string? ZipCode { get; set; }
    }

    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public int? ProviderId { get; set; }
        public string? IsKycVerified { get; set; }
    }

    public class PasswordChangeDto
    {
        [Required]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; } = string.Empty;
    }

    public class ProfileUpdateDto
    {
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }

        // Provider specific
        public string? BusinessName { get; set; }
        public string? Bio { get; set; }
        public decimal? HourlyRate { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? ZipCode { get; set; }
        public bool? IsAvailable { get; set; }
    }
}
