using LocalServiceBooking.API.Models;
using LocalServiceBooking.API.Services;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;

namespace LocalServiceBooking.API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            try
            {
                context.Database.EnsureCreated();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Database schema check: {ex.Message}");
            }

            if (context.Users.Any())
            {
                return; // DB has been seeded
            }

            var defaultPasswordHash = PasswordHasher.HashPassword("Password123!");

            var users = new[]
            {
                new User
                {
                    FullName = "System Admin",
                    Email = "admin@serviceconnect.com",
                    PasswordHash = defaultPasswordHash,
                    Phone = "+1 555-0100",
                    Address = "100 Tech Blvd, Suite 400",
                    Role = "Admin",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    FullName = "Sarah Customer",
                    Email = "customer@serviceconnect.com",
                    PasswordHash = defaultPasswordHash,
                    Phone = "+1 555-0101",
                    Address = "742 Evergreen Terrace, Springfield",
                    Role = "Customer",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    FullName = "Alex Miller (Pro Electric)",
                    Email = "electrician@serviceconnect.com",
                    PasswordHash = defaultPasswordHash,
                    Phone = "+1 555-0102",
                    Address = "12 Spark Lane, Metro City",
                    Role = "Provider",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    FullName = "David Plumbing Co",
                    Email = "plumber@serviceconnect.com",
                    PasswordHash = defaultPasswordHash,
                    Phone = "+1 555-0103",
                    Address = "45 Water Street, Metro City",
                    Role = "Provider",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    FullName = "Elena Home Cleaning",
                    Email = "cleaner@serviceconnect.com",
                    PasswordHash = defaultPasswordHash,
                    Phone = "+1 555-0104",
                    Address = "89 Clean Avenue, Metro City",
                    Role = "Provider",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            context.Users.AddRange(users);
            context.SaveChanges();

            var providers = new[]
            {
                new ProviderProfile
                {
                    UserId = users[2].UserId,
                    BusinessName = "Apex Electrical Solutions",
                    Category = "Electrician",
                    Bio = "Licensed master electrician with 8+ years experience in residential and commercial wiring, panel upgrades, and smart home setup.",
                    ExperienceYears = 8,
                    HourlyRate = 75.00m,
                    Address = "12 Spark Lane",
                    City = "Metro City",
                    State = "NY",
                    ZipCode = "10001",
                    IsKycVerified = "Verified",
                    Rating = 4.90m,
                    TotalReviews = 24,
                    WalletBalance = 1850.00m,
                    IsAvailable = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ProviderProfile
                {
                    UserId = users[3].UserId,
                    BusinessName = "David Master Plumbing",
                    Category = "Plumber",
                    Bio = "24/7 Emergency plumbing, pipe repair, leak detection, and water heater installation experts.",
                    ExperienceYears = 10,
                    HourlyRate = 85.00m,
                    Address = "45 Water Street",
                    City = "Metro City",
                    State = "NY",
                    ZipCode = "10002",
                    IsKycVerified = "Verified",
                    Rating = 4.80m,
                    TotalReviews = 19,
                    WalletBalance = 2100.00m,
                    IsAvailable = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ProviderProfile
                {
                    UserId = users[4].UserId,
                    BusinessName = "SparkleClean Home Services",
                    Category = "Cleaning",
                    Bio = "Deep cleaning, eco-friendly products, move-in/move-out cleaning for residential homes and apartments.",
                    ExperienceYears = 5,
                    HourlyRate = 50.00m,
                    Address = "89 Clean Avenue",
                    City = "Metro City",
                    State = "NY",
                    ZipCode = "10003",
                    IsKycVerified = "Verified",
                    Rating = 4.95m,
                    TotalReviews = 38,
                    WalletBalance = 1420.00m,
                    IsAvailable = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            context.ProviderProfiles.AddRange(providers);
            context.SaveChanges();

            var services = new[]
            {
                new ServiceItem
                {
                    ProviderId = providers[0].ProviderId,
                    Title = "Full Home Electrical Inspection",
                    Description = "Comprehensive check of circuit breakers, outlets, wiring safety, and surge protection.",
                    Category = "Electrician",
                    Price = 120.00m,
                    DurationMinutes = 90,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ServiceItem
                {
                    ProviderId = providers[0].ProviderId,
                    Title = "EV Charger Installation",
                    Description = "Professional installation of Level 2 home electric vehicle charging stations.",
                    Category = "Electrician",
                    Price = 350.00m,
                    DurationMinutes = 180,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ServiceItem
                {
                    ProviderId = providers[1].ProviderId,
                    Title = "Emergency Leak & Pipe Repair",
                    Description = "Rapid response repair for leaking pipes, clogged drains, and valve replacements.",
                    Category = "Plumber",
                    Price = 150.00m,
                    DurationMinutes = 60,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ServiceItem
                {
                    ProviderId = providers[1].ProviderId,
                    Title = "Water Heater Maintenance & Flush",
                    Description = "Complete tank flushing, anode rod inspection, and temperature calibration.",
                    Category = "Plumber",
                    Price = 180.00m,
                    DurationMinutes = 90,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ServiceItem
                {
                    ProviderId = providers[2].ProviderId,
                    Title = "Standard Deep House Cleaning",
                    Description = "Detailed dusting, vacuuming, mopping, kitchen sanitation, and bathroom deep scrubbing.",
                    Category = "Cleaning",
                    Price = 140.00m,
                    DurationMinutes = 120,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ServiceItem
                {
                    ProviderId = providers[2].ProviderId,
                    Title = "Move-In / Move-Out Deep Clean",
                    Description = "Full thorough cleaning of cabinets, appliances, windows, baseboards, and floors.",
                    Category = "Cleaning",
                    Price = 220.00m,
                    DurationMinutes = 240,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            context.Services.AddRange(services);
            context.SaveChanges();

            var bookings = new[]
            {
                new Booking
                {
                    CustomerId = users[1].UserId,
                    ProviderId = providers[0].ProviderId,
                    ServiceId = services[0].ServiceId,
                    BookingDate = DateTime.UtcNow.AddDays(2),
                    ScheduledTime = "10:00 AM - 11:30 AM",
                    Address = "742 Evergreen Terrace",
                    City = "Springfield",
                    Status = "Accepted",
                    TotalPrice = 120.00m,
                    Notes = "Main breaker keeps tripping during high usage.",
                    CreatedAt = DateTime.UtcNow
                },
                new Booking
                {
                    CustomerId = users[1].UserId,
                    ProviderId = providers[2].ProviderId,
                    ServiceId = services[4].ServiceId,
                    BookingDate = DateTime.UtcNow.AddDays(-5),
                    ScheduledTime = "02:00 PM - 04:00 PM",
                    Address = "742 Evergreen Terrace",
                    City = "Springfield",
                    Status = "Completed",
                    TotalPrice = 140.00m,
                    Notes = "Please pay special attention to the kitchen area.",
                    CreatedAt = DateTime.UtcNow.AddDays(-6)
                }
            };

            context.Bookings.AddRange(bookings);
            context.SaveChanges();

            // Seed status history for seeded bookings
            var histories = new[]
            {
                // Booking 1 (Status: Accepted)
                new BookingStatusHistory
                {
                    BookingId = bookings[0].BookingId,
                    OldStatus = null,
                    NewStatus = "Pending",
                    ChangedByUserId = users[1].UserId,
                    ChangedByRole = "Customer",
                    ChangedAt = bookings[0].CreatedAt,
                    Remarks = "Booking created."
                },
                new BookingStatusHistory
                {
                    BookingId = bookings[0].BookingId,
                    OldStatus = "Pending",
                    NewStatus = "Accepted",
                    ChangedByUserId = users[2].UserId, // Alex Miller
                    ChangedByRole = "Provider",
                    ChangedAt = bookings[0].CreatedAt.AddMinutes(15),
                    Remarks = "Electrician accepted the job."
                },

                // Booking 2 (Status: Completed)
                new BookingStatusHistory
                {
                    BookingId = bookings[1].BookingId,
                    OldStatus = null,
                    NewStatus = "Pending",
                    ChangedByUserId = users[1].UserId,
                    ChangedByRole = "Customer",
                    ChangedAt = bookings[1].CreatedAt,
                    Remarks = "Booking created."
                },
                new BookingStatusHistory
                {
                    BookingId = bookings[1].BookingId,
                    OldStatus = "Pending",
                    NewStatus = "Accepted",
                    ChangedByUserId = users[4].UserId, // Elena Cleaner
                    ChangedByRole = "Provider",
                    ChangedAt = bookings[1].CreatedAt.AddMinutes(20),
                    Remarks = "Cleaning service accepted the request."
                },
                new BookingStatusHistory
                {
                    BookingId = bookings[1].BookingId,
                    OldStatus = "Accepted",
                    NewStatus = "InProgress",
                    ChangedByUserId = users[4].UserId,
                    ChangedByRole = "Provider",
                    ChangedAt = bookings[1].BookingDate.AddMinutes(-30),
                    Remarks = "Provider has arrived and started the clean-up."
                },
                new BookingStatusHistory
                {
                    BookingId = bookings[1].BookingId,
                    OldStatus = "InProgress",
                    NewStatus = "Completed",
                    ChangedByUserId = users[4].UserId,
                    ChangedByRole = "Provider",
                    ChangedAt = bookings[1].BookingDate.AddHours(2),
                    Remarks = "Cleaning completed. Payment received."
                }
            };

            context.BookingStatusHistories.AddRange(histories);
            context.SaveChanges();

            var reviews = new[]
            {
                new Review
                {
                    BookingId = bookings[1].BookingId,
                    CustomerId = users[1].UserId,
                    ProviderId = providers[2].ProviderId,
                    Rating = 5,
                    Comment = "Elena did an incredible job! The house looks brand new and smelled fresh. Will definitely book again.",
                    CreatedAt = DateTime.UtcNow.AddDays(-4)
                }
            };

            context.Reviews.AddRange(reviews);
            context.SaveChanges();

            var notifications = new[]
            {
                new Notification
                {
                    UserId = users[1].UserId,
                    Title = "Booking Confirmed!",
                    Message = "Your booking for Full Home Electrical Inspection has been accepted by Apex Electrical Solutions.",
                    Type = "Booking",
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                },
                new Notification
                {
                    UserId = users[2].UserId,
                    Title = "New Booking Request",
                    Message = "You have a new pending booking request for Full Home Electrical Inspection from Sarah Customer.",
                    Type = "Booking",
                    IsRead = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            context.Notifications.AddRange(notifications);
            context.SaveChanges();
        }
    }
}
