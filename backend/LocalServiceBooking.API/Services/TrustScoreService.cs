using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LocalServiceBooking.API.Data;

namespace LocalServiceBooking.API.Services
{
    public class ProviderTrustScoreDto
    {
        public int ProviderId { get; set; }
        public int TrustScore { get; set; }
        public string TrustBadge { get; set; } = string.Empty; // Excellent, Trusted, Good, New / Developing
        public decimal AverageRating { get; set; }
        public int TotalBookings { get; set; }
        public int CompletedBookings { get; set; }
        public int CancelledBookings { get; set; }
        public double CompletionRate { get; set; }
        public double CancellationRate { get; set; }
        public int ExperienceYears { get; set; }

        // Breakdown percentages
        public double RatingContribution { get; set; }
        public double CompletionContribution { get; set; }
        public double CancellationContribution { get; set; }
        public double ExperienceContribution { get; set; }
    }

    public class TrustScoreService
    {
        private readonly ApplicationDbContext _context;

        public TrustScoreService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ProviderTrustScoreDto> CalculateTrustScoreAsync(int providerId)
        {
            var provider = await _context.ProviderProfiles
                .FirstOrDefaultAsync(p => p.ProviderId == providerId);

            if (provider == null)
            {
                throw new ArgumentException("Provider not found", nameof(providerId));
            }

            var bookings = await _context.Bookings
                .Where(b => b.ProviderId == providerId)
                .ToListAsync();

            int totalBookings = bookings.Count;
            int completedBookings = bookings.Count(b => b.Status == "Completed");
            int cancelledBookings = bookings.Count(b => b.Status == "Cancelled");

            // 1. Rating (40% weight)
            // Range: 0.0 - 5.0
            decimal rating = provider.Rating;
            double ratingScore = (double)rating / 5.0 * 100.0;
            double ratingContribution = ratingScore * 0.40;

            // 2. Completion Rate (30% weight)
            // Completion rate = Completed / (Completed + Cancelled)
            int finishedBookings = completedBookings + cancelledBookings;
            double completionRate = finishedBookings > 0 ? (double)completedBookings / finishedBookings : 1.0;
            double completionScore = completionRate * 100.0;
            double completionContribution = completionScore * 0.30;

            // 3. Cancellation Rate (15% weight)
            // Cancellation score = (1 - CancellationRate) * 100
            double cancellationRate = finishedBookings > 0 ? (double)cancelledBookings / finishedBookings : 0.0;
            double cancellationScore = (1.0 - cancellationRate) * 100.0;
            double cancellationContribution = cancellationScore * 0.15;

            // 4. Experience & Volume (15% weight)
            // Min(100, ExperienceYears * 10 + CompletedBookings * 5)
            double experienceScore = Math.Min(100.0, (provider.ExperienceYears * 10.0) + (completedBookings * 5.0));
            double experienceContribution = experienceScore * 0.15;

            // Overall score
            double rawScore = ratingContribution + completionContribution + cancellationContribution + experienceContribution;
            int trustScore = (int)Math.Round(rawScore);
            trustScore = Math.Clamp(trustScore, 0, 100);

            // Badge classification:
            // 90–100   → Excellent
            // 75–89    → Trusted
            // 60–74    → Good
            // Below 60 → New / Developing
            string badge = "New / Developing";
            if (trustScore >= 90) badge = "Excellent";
            else if (trustScore >= 75) badge = "Trusted";
            else if (trustScore >= 60) badge = "Good";

            return new ProviderTrustScoreDto
            {
                ProviderId = providerId,
                TrustScore = trustScore,
                TrustBadge = badge,
                AverageRating = rating,
                TotalBookings = totalBookings,
                CompletedBookings = completedBookings,
                CancelledBookings = cancelledBookings,
                CompletionRate = Math.Round(completionRate * 100, 1),
                CancellationRate = Math.Round(cancellationRate * 100, 1),
                ExperienceYears = provider.ExperienceYears,
                RatingContribution = Math.Round(ratingContribution, 2),
                CompletionContribution = Math.Round(completionContribution, 2),
                CancellationContribution = Math.Round(cancellationContribution, 2),
                ExperienceContribution = Math.Round(experienceContribution, 2)
            };
        }
    }
}
