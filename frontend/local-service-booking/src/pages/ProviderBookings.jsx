import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { Calendar, User, Phone, MapPin, DollarSign, Clock, Check, X, Play, Award, Eye } from 'lucide-react';

export const ProviderBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    setLoading(true);
    bookingService.getProviderBookings()
      .then((res) => {
        setBookings(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = (id, status) => {
    if (window.confirm(`Are you sure you want to change this booking status to "${status}"?`)) {
      setLoading(true);
      bookingService.updateBookingStatus(id, status)
        .then(() => {
          fetchBookings();
        })
        .catch((err) => {
          console.error(err);
          alert('Failed to update booking status.');
          setLoading(false);
        });
    }
  };

  const filteredBookings = filterStatus === 'All'
    ? bookings
    : bookings.filter((b) => b.status === filterStatus);

  const statuses = ['All', 'Pending', 'Accepted', 'InProgress', 'Completed', 'Rejected', 'Cancelled'];

  if (loading && bookings.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Booking Requests</h1>
        <p className="text-xs text-slate-500 mt-1">Manage and track jobs scheduled by your customers.</p>
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
          description="Booking requests from customers will appear here."
        />
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.bookingId} className="sc-card p-5 border border-slate-200 shadow-sm space-y-4">
              
              {/* Header: Service Title and Status */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wide mr-2">
                    {booking.serviceCategory}
                  </span>
                  <span className="text-sm font-bold text-slate-900">{booking.serviceTitle}</span>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              {/* Booking Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 text-xs text-slate-600 border-y border-slate-100 py-3.5">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900">{booking.customerName}</p>
                    <p className="text-[10px] text-slate-500">Customer</p>
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
                  <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 truncate max-w-[150px]">{booking.address}</p>
                    <p className="text-[10px] text-slate-500">{booking.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900">${booking.totalPrice}</p>
                    <p className="text-[10px] text-slate-500">Earnings</p>
                  </div>
                </div>
              </div>

              {/* Customer Notes */}
              {booking.notes && (
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-xs text-slate-600">
                  <span className="font-bold text-slate-800 block mb-0.5">Notes:</span>
                  {booking.notes}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  {booking.customerPhone && (
                    <a
                      href={`tel:${booking.customerPhone}`}
                      className="btn-outline py-1.5 px-3 flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      Call Customer
                    </a>
                  )}
                  <Link to={`/bookings/${booking.bookingId}`} className="btn-outline py-1.5 px-3 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    Details
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  {booking.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(booking.bookingId, 'Accepted')}
                        className="btn-secondary py-1.5 px-3 flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(booking.bookingId, 'Rejected')}
                        className="btn-danger py-1.5 px-3 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}

                  {booking.status === 'Accepted' && (
                    <button
                      onClick={() => handleUpdateStatus(booking.bookingId, 'InProgress')}
                      className="btn-primary py-1.5 px-3 flex items-center gap-1"
                    >
                      <Play className="w-4 h-4" />
                      Start Job
                    </button>
                  )}

                  {booking.status === 'InProgress' && (
                    <button
                      onClick={() => handleUpdateStatus(booking.bookingId, 'Completed')}
                      className="btn-secondary py-1.5 px-3 flex items-center gap-1"
                    >
                      <Award className="w-4 h-4" />
                      Complete Job
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
