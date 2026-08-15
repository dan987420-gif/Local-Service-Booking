import React, { useEffect, useState } from 'react';
import { bookingService, userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ToggleLeft, ToggleRight, Calendar as CalendarIcon, Clock, MapPin, User, CheckCircle2, AlertCircle } from 'lucide-react';

export const Availability = () => {
  const { user, updateUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable ?? true);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Refresh user profile to ensure availability is accurate
    userService.getProfile()
      .then((res) => {
        const prov = res.data.providerProfile;
        if (prov) {
          setIsAvailable(prov.isAvailable);
          updateUser({ isAvailable: prov.isAvailable });
        }
      })
      .catch((err) => console.error(err));

    fetchSchedule();
  }, []);

  const fetchSchedule = () => {
    setLoading(true);
    bookingService.getProviderBookings()
      .then((res) => {
        // Only show upcoming active bookings
        const active = res.data.filter(
          (b) => b.status === 'Accepted' || b.status === 'InProgress'
        );
        setBookings(active);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const handleToggleAvailability = () => {
    const nextVal = !isAvailable;
    setIsAvailable(nextVal);
    setLoading(true);
    userService.updateProfile({ isAvailable: nextVal })
      .then(() => {
        updateUser({ isAvailable: nextVal });
        setMessage(`Status updated to ${nextVal ? 'Available' : 'Unavailable'}.`);
        setTimeout(() => setMessage(''), 3000);
      })
      .catch((err) => {
        console.error(err);
        setIsAvailable(!nextVal); // revert
        alert('Failed to update availability status.');
      })
      .finally(() => setLoading(false));
  };

  if (loading && bookings.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Calendar & Availability</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your active working hours and check upcoming client appointments.</p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200">
          {message}
        </div>
      )}

      {/* General Availability Toggle Card */}
      <div className="sc-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-slate-950">General Listing Availability</h2>
          <p className="text-xs text-slate-500">
            {isAvailable
              ? 'Your profile is currently Active. Customers can see and book your services.'
              : 'Your profile is currently Hidden. Customers cannot book you until you turn it back on.'}
          </p>
        </div>

        <button
          onClick={handleToggleAvailability}
          className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 transition-colors self-start sm:self-center"
        >
          <span className="text-xs font-bold uppercase tracking-wider">
            {isAvailable ? 'Active' : 'Offline'}
          </span>
          {isAvailable ? (
            <ToggleRight className="w-10 h-10 text-indigo-600" />
          ) : (
            <ToggleLeft className="w-10 h-10 text-slate-300" />
          )}
        </button>
      </div>

      {/* Upcoming Timeline Schedule */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-indigo-600" />
          Upcoming Job Schedule
        </h2>

        {bookings.length === 0 ? (
          <div className="sc-card p-8 text-center text-slate-500 text-xs">
            No active jobs scheduled for the near future.
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div key={booking.bookingId} className="sc-card p-4 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-wide">
                      {booking.scheduledTime}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{booking.serviceTitle}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {booking.customerName}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {booking.address}, {booking.city}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      {new Date(booking.bookingDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </p>
                    <span className="text-[10px] text-slate-400">Scheduled Date</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
