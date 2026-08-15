import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { Calendar, User, ShieldAlert, MapPin, DollarSign, Clock, Eye, Trash2 } from 'lucide-react';

export const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    setLoading(true);
    // Fetch all bookings globally (Admin authorized)
    bookingService.getAllBookings()
      .then((res) => {
        setBookings(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const handleCancelBooking = (id) => {
    if (window.confirm('Are you sure you want to administratively CANCEL this booking?')) {
      setLoading(true);
      bookingService.updateBookingStatus(id, 'Cancelled')
        .then(() => {
          fetchBookings();
        })
        .catch((err) => {
          console.error(err);
          alert('Failed to cancel booking.');
          setLoading(false);
        });
    }
  };

  const filteredBookings = filterStatus === 'All'
    ? bookings
    : bookings.filter((b) => b.status === filterStatus);

  const statuses = ['All', 'Pending', 'Accepted', 'InProgress', 'Completed', 'Cancelled', 'Rejected'];

  if (loading && bookings.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Bookings Control</h1>
        <p className="text-xs text-slate-500 mt-1">Audit, monitor, and cancel booking slots across all platform users.</p>
      </div>

      {/* Tabs Filter */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterStatus === status
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <EmptyState
          title={`No ${filterStatus === 'All' ? '' : filterStatus.toLowerCase()} bookings found`}
          description="Bookings created by customers will appear here."
        />
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.bookingId} className="sc-card p-5 border border-slate-200 shadow-sm space-y-4">
              
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wide mr-2">
                    {booking.serviceCategory}
                  </span>
                  <span className="text-sm font-bold text-slate-900">{booking.serviceTitle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-semibold">Booking ID: #{booking.bookingId}</span>
                  <StatusBadge status={booking.status} />
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600 border-y border-slate-100 py-3.5">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900">{booking.customerName}</p>
                    <p className="text-[10px] text-slate-400">Client</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-teal-600 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900">{booking.businessName}</p>
                    <p className="text-[10px] text-slate-400">Provider</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">
                      {new Date(booking.bookingDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-[10px] text-slate-500">{booking.scheduledTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900">${booking.totalPrice}</p>
                    <p className="text-[10px] text-slate-400">Total Price</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between text-xs pt-1">
                <Link to={`/bookings/${booking.bookingId}`} className="btn-outline py-1.5 px-3 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  Details Panel
                </Link>

                {booking.status !== 'Completed' && booking.status !== 'Cancelled' && booking.status !== 'Rejected' && (
                  <button
                    onClick={() => handleCancelBooking(booking.bookingId)}
                    className="btn-danger py-1.5 px-3 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Cancel Booking
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
