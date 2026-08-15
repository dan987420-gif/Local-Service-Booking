USE LocalServiceBooking;
GO

-- Clear existing status histories to prevent duplicates
DELETE FROM BookingStatusHistories;

-- Booking 1
INSERT INTO BookingStatusHistories (BookingId, OldStatus, NewStatus, ChangedByUserId, ChangedByRole, ChangedAt, Remarks) VALUES
(1, NULL, 'Pending', 2, 'Customer', '2026-08-13 10:00:00', 'Booking created.'),
(1, 'Pending', 'Accepted', 3, 'Provider', '2026-08-13 10:15:00', 'Pro Electric accepted the job.'),
(1, 'Accepted', 'InProgress', 3, 'Provider', '2026-08-13 10:45:00', 'Work in progress. Electrical check started.');

-- Booking 2
INSERT INTO BookingStatusHistories (BookingId, OldStatus, NewStatus, ChangedByUserId, ChangedByRole, ChangedAt, Remarks) VALUES
(2, NULL, 'Pending', 2, 'Customer', '2026-08-12 14:00:00', 'Booking created.'),
(2, 'Pending', 'Accepted', 5, 'Provider', '2026-08-12 14:20:00', 'Elena Home Cleaning accepted the request.'),
(2, 'Accepted', 'InProgress', 5, 'Provider', '2026-08-12 14:50:00', 'Cleaning provider has arrived.'),
(2, 'InProgress', 'Completed', 5, 'Provider', '2026-08-12 15:40:00', 'Cleaning completed. House is spotless.');

PRINT 'BookingStatusHistories seeded successfully.';
GO
