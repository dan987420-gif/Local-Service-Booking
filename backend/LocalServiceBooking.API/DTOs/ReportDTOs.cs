namespace LocalServiceBooking.API.DTOs
{
    public class AdminReportDto
    {
        public int TotalUsers { get; set; }
        public int TotalCustomers { get; set; }
        public int TotalProviders { get; set; }
        public int TotalServices { get; set; }
        public int TotalBookings { get; set; }
        public int ActiveBookings { get; set; }
        public int CompletedBookings { get; set; }
        public int CancelledBookings { get; set; }
        public decimal TotalRevenue { get; set; }
        public int PendingComplaints { get; set; }
        public int ResolvedComplaints { get; set; }
        public decimal AverageRating { get; set; }
        public List<MonthlyStatDto> MonthlyRevenue { get; set; } = new List<MonthlyStatDto>();
        public List<CategoryStatDto> CategoryBreakdown { get; set; } = new List<CategoryStatDto>();
    }

    public class ProviderReportDto
    {
        public int ProviderId { get; set; }
        public decimal TotalEarnings { get; set; }
        public decimal PendingEarnings { get; set; }
        public int CompletedBookings { get; set; }
        public int CancelledBookings { get; set; }
        public int ActiveServices { get; set; }
        public decimal AverageRating { get; set; }
        public List<MonthlyStatDto> MonthlyEarnings { get; set; } = new List<MonthlyStatDto>();
    }

    public class MonthlyStatDto
    {
        public string Month { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public int Count { get; set; }
    }

    public class CategoryStatDto
    {
        public string Category { get; set; } = string.Empty;
        public int ServiceCount { get; set; }
        public int BookingCount { get; set; }
    }
}
