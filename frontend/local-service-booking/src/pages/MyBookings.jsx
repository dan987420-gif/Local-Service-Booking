import React, { useEffect, useState } from 'react';
import { bookingService } from '../services/api';
import { BookingCard } from '../components/BookingCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Calendar } from 'lucide-react';

export const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  const statuses = ['All', 'Pending', 'Accepted', 'InProgress', 'Completed', 'Cancelled'];

  useEffect(() => {
    bookingService.getCustomerBookings()
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === 'All') return true;
    return b.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Service Bookings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Track and manage all your requested service bookings</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              filterStatus === st
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Bookings Found"
          description={`No ${filterStatus !== 'All' ? filterStatus.toLowerCase() : ''} bookings available.`}
        />
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.bookingId} booking={booking} role="Customer" />
          ))}
        </div>
      )}
    </div>
  );
};
