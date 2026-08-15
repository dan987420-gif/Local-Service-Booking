-- ====================================================================
-- Database Creation Script for Local Service Booking (ServiceConnect)
-- Target DBMS: Microsoft SQL Server / Azure SQL
-- ====================================================================

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'LocalServiceBooking')
BEGIN
    CREATE DATABASE LocalServiceBooking;
END
GO

USE LocalServiceBooking;
GO

-- 1. Users Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        UserId INT IDENTITY(1,1) PRIMARY KEY,
        FullName NVARCHAR(100) NOT NULL,
        Email NVARCHAR(150) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(256) NOT NULL,
        Phone NVARCHAR(20) NULL,
        Address NVARCHAR(255) NULL,
        Role NVARCHAR(20) NOT NULL CHECK (Role IN ('Customer', 'Provider', 'Admin')),
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME2 NULL
    );

    CREATE INDEX IX_Users_Email ON Users(Email);
    CREATE INDEX IX_Users_Role ON Users(Role);
END
GO

-- 2. ProviderProfiles Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ProviderProfiles')
BEGIN
    CREATE TABLE ProviderProfiles (
        ProviderId INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL UNIQUE,
        BusinessName NVARCHAR(150) NOT NULL,
        Category NVARCHAR(50) NOT NULL,
        Bio NVARCHAR(MAX) NULL,
        ExperienceYears INT NOT NULL DEFAULT 0,
        HourlyRate DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        Address NVARCHAR(255) NULL,
        City NVARCHAR(100) NULL,
        State NVARCHAR(100) NULL,
        ZipCode NVARCHAR(20) NULL,
        IsKycVerified NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (IsKycVerified IN ('Pending', 'Verified', 'Rejected')),
        IdentityDocUrl NVARCHAR(500) NULL,
        CertificateUrl NVARCHAR(500) NULL,
        Rating DECIMAL(3,2) NOT NULL DEFAULT 5.00,
        TotalReviews INT NOT NULL DEFAULT 0,
        WalletBalance DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        IsAvailable BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME2 NULL,
        CONSTRAINT FK_ProviderProfiles_Users FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
    );

    CREATE INDEX IX_ProviderProfiles_Category ON ProviderProfiles(Category);
    CREATE INDEX IX_ProviderProfiles_Kyc ON ProviderProfiles(IsKycVerified);
END
GO

-- 3. Services Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Services')
BEGIN
    CREATE TABLE Services (
        ServiceId INT IDENTITY(1,1) PRIMARY KEY,
        ProviderId INT NOT NULL,
        Title NVARCHAR(150) NOT NULL,
        Description NVARCHAR(MAX) NULL,
        Category NVARCHAR(50) NOT NULL,
        Price DECIMAL(18,2) NOT NULL,
        DurationMinutes INT NOT NULL DEFAULT 60,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME2 NULL,
        CONSTRAINT FK_Services_ProviderProfiles FOREIGN KEY (ProviderId) REFERENCES ProviderProfiles(ProviderId) ON DELETE CASCADE
    );

    CREATE INDEX IX_Services_Category ON Services(Category);
    CREATE INDEX IX_Services_ProviderId ON Services(ProviderId);
END
GO

-- 4. Bookings Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Bookings')
BEGIN
    CREATE TABLE Bookings (
        BookingId INT IDENTITY(1,1) PRIMARY KEY,
        CustomerId INT NOT NULL,
        ProviderId INT NOT NULL,
        ServiceId INT NOT NULL,
        BookingDate DATETIME2 NOT NULL,
        ScheduledTime NVARCHAR(50) NOT NULL,
        Address NVARCHAR(255) NOT NULL,
        City NVARCHAR(100) NOT NULL,
        Status NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (Status IN ('Pending', 'Accepted', 'Rejected', 'InProgress', 'Completed', 'Cancelled')),
        TotalPrice DECIMAL(18,2) NOT NULL,
        Notes NVARCHAR(MAX) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME2 NULL,
        CONSTRAINT FK_Bookings_Customer FOREIGN KEY (CustomerId) REFERENCES Users(UserId),
        CONSTRAINT FK_Bookings_Provider FOREIGN KEY (ProviderId) REFERENCES ProviderProfiles(ProviderId),
        CONSTRAINT FK_Bookings_Service FOREIGN KEY (ServiceId) REFERENCES Services(ServiceId)
    );

    CREATE INDEX IX_Bookings_Customer ON Bookings(CustomerId);
    CREATE INDEX IX_Bookings_Provider ON Bookings(ProviderId);
    CREATE INDEX IX_Bookings_Status ON Bookings(Status);
END
GO

-- 5. Reviews Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Reviews')
BEGIN
    CREATE TABLE Reviews (
        ReviewId INT IDENTITY(1,1) PRIMARY KEY,
        BookingId INT NOT NULL UNIQUE,
        CustomerId INT NOT NULL,
        ProviderId INT NOT NULL,
        Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
        Comment NVARCHAR(MAX) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Reviews_Booking FOREIGN KEY (BookingId) REFERENCES Bookings(BookingId),
        CONSTRAINT FK_Reviews_Customer FOREIGN KEY (CustomerId) REFERENCES Users(UserId),
        CONSTRAINT FK_Reviews_Provider FOREIGN KEY (ProviderId) REFERENCES ProviderProfiles(ProviderId)
    );

    CREATE INDEX IX_Reviews_Provider ON Reviews(ProviderId);
END
GO

-- 6. Complaints Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Complaints')
BEGIN
    CREATE TABLE Complaints (
        ComplaintId INT IDENTITY(1,1) PRIMARY KEY,
        BookingId INT NOT NULL,
        CustomerId INT NOT NULL,
        ProviderId INT NOT NULL,
        Subject NVARCHAR(200) NOT NULL,
        Description NVARCHAR(MAX) NOT NULL,
        Status NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (Status IN ('Pending', 'InProgress', 'Resolved', 'Rejected')),
        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME2 NULL,
        CONSTRAINT FK_Complaints_Booking FOREIGN KEY (BookingId) REFERENCES Bookings(BookingId),
        CONSTRAINT FK_Complaints_Customer FOREIGN KEY (CustomerId) REFERENCES Users(UserId),
        CONSTRAINT FK_Complaints_Provider FOREIGN KEY (ProviderId) REFERENCES ProviderProfiles(ProviderId)
    );

    CREATE INDEX IX_Complaints_Status ON Complaints(Status);
END
GO

-- 7. Notifications Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Notifications')
BEGIN
    CREATE TABLE Notifications (
        NotificationId INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        Title NVARCHAR(150) NOT NULL,
        Message NVARCHAR(MAX) NOT NULL,
        Type NVARCHAR(50) NOT NULL DEFAULT 'General',
        IsRead BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Notifications_Users FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
    );

    CREATE INDEX IX_Notifications_UserId ON Notifications(UserId);
    CREATE INDEX IX_Notifications_IsRead ON Notifications(IsRead);
END
GO

-- 8. ChatMessages Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ChatMessages')
BEGIN
    CREATE TABLE ChatMessages (
        ChatMessageId INT IDENTITY(1,1) PRIMARY KEY,
        BookingId INT NOT NULL,
        SenderId INT NOT NULL,
        ReceiverId INT NOT NULL,
        MessageText NVARCHAR(MAX) NOT NULL,
        SentAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Chat_Booking FOREIGN KEY (BookingId) REFERENCES Bookings(BookingId),
        CONSTRAINT FK_Chat_Sender FOREIGN KEY (SenderId) REFERENCES Users(UserId),
        CONSTRAINT FK_Chat_Receiver FOREIGN KEY (ReceiverId) REFERENCES Users(UserId)
    );

    CREATE INDEX IX_Chat_Booking ON ChatMessages(BookingId);
END
GO

-- Seed Initial Demo Data (Password for all seeded accounts is: Password123!)
-- PBKDF2 hash of "Password123!" for demo environment seeding
INSERT INTO Users (FullName, Email, PasswordHash, Phone, Address, Role, IsActive, CreatedAt)
VALUES 
('System Admin', 'admin@serviceconnect.com', 'AQAAAAEAACcQAAAAEH8Z9v+Kx5m9K2g3P1Q=', '+1 555-0100', '100 Tech Blvd, Suite 400', 'Admin', 1, GETDATE()),
('Sarah Customer', 'customer@serviceconnect.com', 'AQAAAAEAACcQAAAAEH8Z9v+Kx5m9K2g3P1Q=', '+1 555-0101', '742 Evergreen Terrace, Springfield', 'Customer', 1, GETDATE()),
('Alex Miller (Pro Electric)', 'electrician@serviceconnect.com', 'AQAAAAEAACcQAAAAEH8Z9v+Kx5m9K2g3P1Q=', '+1 555-0102', '12 Spark Lane, Metro City', 'Provider', 1, GETDATE()),
('David Plumbing Co', 'plumber@serviceconnect.com', 'AQAAAAEAACcQAAAAEH8Z9v+Kx5m9K2g3P1Q=', '+1 555-0103', '45 Water Street, Metro City', 'Provider', 1, GETDATE()),
('Elena Home Cleaning', 'cleaner@serviceconnect.com', 'AQAAAAEAACcQAAAAEH8Z9v+Kx5m9K2g3P1Q=', '+1 555-0104', '89 Clean Avenue, Metro City', 'Provider', 1, GETDATE());

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Bio, ExperienceYears, HourlyRate, Address, City, State, ZipCode, IsKycVerified, Rating, TotalReviews, WalletBalance, IsAvailable, CreatedAt)
VALUES 
(3, 'Apex Electrical Solutions', 'Electrician', 'Licensed master electrician with 8+ years experience in residential and commercial wiring, panel upgrades, and smart home setup.', 8, 75.00, '12 Spark Lane', 'Metro City', 'NY', '10001', 'Verified', 4.90, 24, 1850.00, 1, GETDATE()),
(4, 'David Master Plumbing', 'Plumber', '24/7 Emergency plumbing, pipe repair, leak detection, and water heater installation experts.', 10, 85.00, '45 Water Street', 'Metro City', 'NY', '10002', 'Verified', 4.80, 19, 2100.00, 1, GETDATE()),
(5, 'SparkleClean Home Services', 'Cleaning', 'Deep cleaning, eco-friendly products, move-in/move-out cleaning for residential homes and apartments.', 5, 50.00, '89 Clean Avenue', 'Metro City', 'NY', '10003', 'Verified', 4.95, 38, 1420.00, 1, GETDATE());

INSERT INTO Services (ProviderId, Title, Description, Category, Price, DurationMinutes, IsActive, CreatedAt)
VALUES 
(1, 'Full Home Electrical Inspection', 'Comprehensive check of circuit breakers, outlets, wiring safety, and surge protection.', 'Electrician', 120.00, 90, 1, GETDATE()),
(1, 'EV Charger Installation', 'Professional installation of Level 2 home electric vehicle charging stations.', 'Electrician', 350.00, 180, 1, GETDATE()),
(2, 'Emergency Leak & Pipe Repair', 'Rapid response repair for leaking pipes, clogged drains, and valve replacements.', 'Plumber', 150.00, 60, 1, GETDATE()),
(2, 'Water Heater Maintenance & Flush', 'Complete tank flushing, anode rod inspection, and temperature calibration.', 'Plumber', 180.00, 90, 1, GETDATE()),
(3, 'Standard Deep House Cleaning', 'Detailed dusting, vacuuming, mopping, kitchen sanitation, and bathroom deep scrubbing.', 'Cleaning', 140.00, 120, 1, GETDATE()),
(3, 'Move-In / Move-Out Deep Clean', 'Full thorough cleaning of cabinets, appliances, windows, baseboards, and floors.', 'Cleaning', 220.00, 240, 1, GETDATE());

INSERT INTO Bookings (CustomerId, ProviderId, ServiceId, BookingDate, ScheduledTime, Address, City, Status, TotalPrice, Notes, CreatedAt)
VALUES 
(2, 1, 1, DATEADD(day, 2, GETDATE()), '10:00 AM - 11:30 AM', '742 Evergreen Terrace', 'Springfield', 'Accepted', 120.00, 'Main breaker keeps tripping during high usage.', GETDATE()),
(2, 3, 5, DATEADD(day, -5, GETDATE()), '02:00 PM - 04:00 PM', '742 Evergreen Terrace', 'Springfield', 'Completed', 140.00, 'Please pay special attention to the kitchen area.', DATEADD(day, -6, GETDATE()));

INSERT INTO Reviews (BookingId, CustomerId, ProviderId, Rating, Comment, CreatedAt)
VALUES 
(2, 2, 3, 5, 'Elena did an incredible job! The house looks brand new and smelled fresh. Will definitely book again.', DATEADD(day, -4, GETDATE()));

INSERT INTO Notifications (UserId, Title, Message, Type, IsRead, CreatedAt)
VALUES 
(2, 'Booking Confirmed!', 'Your booking for Full Home Electrical Inspection has been accepted by Apex Electrical Solutions.', 'Booking', 0, GETDATE()),
(3, 'New Booking Request', 'You have a new pending booking request for Full Home Electrical Inspection from Sarah Customer.', 'Booking', 1, GETDATE());
