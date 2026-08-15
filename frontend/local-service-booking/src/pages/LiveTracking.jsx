import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { Navigation, Clock, MapPin, CheckCircle, ShieldAlert } from 'lucide-react';

export const LiveTracking = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings =
      user?.role === 'Provider'
        ? bookingService.getProviderBookings()
        : bookingService.getCustomerBookings();

    fetchBookings
      .then((res) => {
        // Show bookings that are accepted or inprogress
        const trackingList = res.data.filter(
          (b) => b.status === 'Accepted' || b.status === 'InProgress'
        );
        setBookings(trackingList);

        // Auto select by query parameter bookingId if present
        const queryParams = new URLSearchParams(window.location.search);
        const urlBookingId = parseInt(queryParams.get('bookingId'));
        if (urlBookingId) {
          const selected = res.data.find(b => b.bookingId === urlBookingId);
          if (selected) {
            setSelectedBooking(selected);
            return;
          }
        }

        if (trackingList.length > 0) {
          setSelectedBooking(trackingList[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading && bookings.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Live Service Tracking</h1>
        <p className="text-xs text-slate-500 mt-1">Track transit statuses and service progress for current jobs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Active Jobs sidebar */}
        <div className="sc-card md:col-span-1 overflow-y-auto divide-y divide-slate-100 flex flex-col h-[400px]">
          <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500">
            Active Jobs ({bookings.length})
          </div>
          {bookings.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No active jobs in transit or progress.
            </div>
          ) : (
            bookings.map((b) => (
              <button
                key={b.bookingId}
                onClick={() => setSelectedBooking(b)}
                className={`p-3.5 w-full text-left text-xs transition-colors flex flex-col gap-1.5 ${
                  selectedBooking?.bookingId === b.bookingId
                    ? 'bg-indigo-50/50 border-r-4 border-indigo-600'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-bold text-slate-800">
                    {user?.role === 'Provider' ? b.customerName : (b.businessName || b.providerName)}
                  </span>
                  <StatusBadge status={b.status} />
                </div>
                <p className="text-slate-500 truncate w-full">{b.serviceTitle}</p>
                <span className="text-[10px] text-slate-400">Scheduled: {b.scheduledTime}</span>
              </button>
            ))
          )}
        </div>

        {/* Tracking Console */}
        <div className="sc-card md:col-span-2 p-6 flex flex-col border border-slate-200 shadow-sm justify-between gap-6 min-h-[400px]">
          {selectedBooking ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              
              {/* Top Meta info */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-950">Job Transit Panel</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Booking Reference #{selectedBooking.bookingId}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 block">
                    {user?.role === 'Provider' ? selectedBooking.customerName : (selectedBooking.businessName || selectedBooking.providerName)}
                  </span>
                  <span className="text-[10px] text-slate-400">{selectedBooking.scheduledTime}</span>
                </div>
              </div>

              {/* GPS Simulator Disclaimer Map Box */}
              <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 min-h-[160px] text-center space-y-3">
                <Navigation className="w-10 h-10 text-indigo-600 animate-pulse" />
                <div className="space-y-1">
                  <span className="text-xs font-bold text-indigo-700 block">Live GPS Integration – Future Enhancement</span>
                  <p className="text-[11px] text-slate-500 max-w-sm">
                    In a production release, this panel integrates Google Maps API to track the provider's smartphone device coordinates in real-time.
                  </p>
                </div>
              </div>

              {/* Job Stage Timeline */}
              <div className="grid grid-cols-3 gap-2 text-xs border-t border-slate-100 pt-4">
                <div className="space-y-1.5 text-center">
                  <div className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center font-bold text-white ${
                    selectedBooking.status === 'Accepted' || selectedBooking.status === 'InProgress' ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}>
                    1
                  </div>
                  <span className="font-bold text-slate-800 block text-[10px] uppercase">Job Confirmed</span>
                </div>

                <div className="space-y-1.5 text-center">
                  <div className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center font-bold text-white ${
                    selectedBooking.status === 'InProgress' ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}>
                    2
                  </div>
                  <span className="font-bold text-slate-800 block text-[10px] uppercase">Service Started</span>
                </div>

                <div className="space-y-1.5 text-center">
                  <div className="w-7 h-7 mx-auto rounded-full bg-slate-200 flex items-center justify-center font-bold text-white">
                    3
                  </div>
                  <span className="font-bold text-slate-400 block text-[10px] uppercase">Finished</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs text-center space-y-2">
              <Navigation className="w-10 h-10 text-slate-300" />
              <p>Select an active job on the left to view transit tracking.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
