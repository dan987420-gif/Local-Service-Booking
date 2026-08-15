import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { Calendar, Clock, MapPin, DollarSign, User, ArrowRight } from 'lucide-react';

export const BookingCard = ({ booking, role = 'Customer' }) => {
  const dateFormatted = new Date(booking.bookingDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="sc-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400">#BK-{booking.bookingId}</span>
          <StatusBadge status={booking.status} />
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {booking.serviceCategory}
          </span>
        </div>

        <h4 className="text-base font-bold text-slate-900">{booking.serviceTitle}</h4>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            {role === 'Provider' ? `Customer: ${booking.customerName}` : `Provider: ${booking.businessName || booking.providerName}`}
          </span>

          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {dateFormatted}
          </span>

          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {booking.scheduledTime}
          </span>

          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {booking.city}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
        <div>
          <span className="text-[10px] text-slate-400 font-medium block md:text-right">Total Amount</span>
          <span className="text-lg font-extrabold text-slate-900">${booking.totalPrice}</span>
        </div>

        <Link
          to={`/bookings/${booking.bookingId}`}
          className="btn-outline text-xs py-1.5 px-3 rounded-lg flex items-center gap-1"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
