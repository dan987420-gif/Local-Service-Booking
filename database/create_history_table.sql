USE LocalServiceBooking;
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BookingStatusHistories')
BEGIN
    CREATE TABLE BookingStatusHistories (
        HistoryId INT IDENTITY(1,1) PRIMARY KEY,
        BookingId INT NOT NULL,
        OldStatus NVARCHAR(20) NULL,
        NewStatus NVARCHAR(20) NOT NULL,
        ChangedByUserId INT NOT NULL,
        ChangedByRole NVARCHAR(20) NOT NULL,
        ChangedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        Remarks NVARCHAR(500) NULL,
        CONSTRAINT FK_BookingStatusHistories_Bookings_BookingId FOREIGN KEY (BookingId) REFERENCES Bookings (BookingId) ON DELETE CASCADE,
        CONSTRAINT FK_BookingStatusHistories_Users_ChangedByUserId FOREIGN KEY (ChangedByUserId) REFERENCES Users (UserId) ON DELETE NO ACTION
    );
    PRINT 'BookingStatusHistories table created successfully.';
END
ELSE
BEGIN
    PRINT 'BookingStatusHistories table already exists.';
END
GO
