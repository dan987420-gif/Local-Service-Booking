import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DashboardCard } from '../components/DashboardCard';
import { BookingCard } from '../components/BookingCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Calendar, Clock, CheckCircle2, AlertCircle, Plus, Search, Sparkles } from 'lucide-react';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getCustomerBookings()
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalBookings = bookings.length;
  const activeBookings = bookings.filter((b) => ['Accepted', 'InProgress'].includes(b.status)).length;
  const completedServices = bookings.filter((b) => b.status === 'Completed').length;
  const pendingBookings = bookings.filter((b) => b.status === 'Pending').length;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Customer Portal</span>
          <h1 className="text-2xl font-bold mt-1">Hello, {user?.fullName || 'Customer'} 👋</h1>
          <p className="text-xs text-indigo-200 mt-1">Manage your active bookings, request new services, and view service status.</p>
        </div>
        <Link to="/services" className="btn-secondary text-xs shadow-sm py-2.5 px-4 shrink-0">
          <Plus className="w-4 h-4" />
          Book New Service
        </Link>
      </div>

      {/* 4 Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Bookings"
          value={totalBookings}
          subtitle="All time requests"
          icon={Calendar}
          color="indigo"
        />
        <DashboardCard
          title="Active Bookings"
          value={activeBookings}
          subtitle="Accepted or In Progress"
          icon={Clock}
          color="teal"
        />
        <DashboardCard
          title="Completed Services"
          value={completedServices}
          subtitle="Successfully finished"
          icon={CheckCircle2}
          color="emerald"
        />
        <DashboardCard
          title="Pending Bookings"
          value={pendingBookings}
          subtitle="Awaiting provider accept"
          icon={AlertCircle}
          color="amber"
        />
      </div>

      {/* Recent Bookings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Bookings</h2>
          <Link to="/my-bookings" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
            View All Bookings
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No Bookings Yet"
            description="You haven't requested any local services yet."
            actionLabel="Browse Available Services"
            onAction={() => window.location.href = '/services'}
          />
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking) => (
              <BookingCard key={booking.bookingId} booking={booking} role="Customer" />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
