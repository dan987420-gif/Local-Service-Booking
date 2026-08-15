import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService, serviceService, reportService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DashboardCard } from '../components/DashboardCard';
import { BookingCard } from '../components/BookingCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { DollarSign, Clock, CheckCircle2, Star, Wrench, ShieldCheck, Sparkles, AlertTriangle, Plus, Navigation } from 'lucide-react';

export const ProviderDashboard = () => {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      reportService.getProviderReport(),
      bookingService.getProviderBookings(),
    ])
      .then(([repRes, bookRes]) => {
        setReport(repRes.data);
        setBookings(bookRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalEarnings = report?.totalEarnings || 0;
  const pendingBookings = bookings.filter((b) => b.status === 'Pending').length;
  const completedBookings = report?.completedBookings || 0;
  const avgRating = report?.averageRating || 5.0;
  const activeServices = report?.activeServices || 0;

  return (
    <div className="space-y-8 fade-in">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-teal-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(20,184,166,0.1),transparent_60%)]"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider bg-teal-500/20 border border-teal-400/20 px-2 py-0.5 rounded-full">Provider Workspace</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-400/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verified Account
            </span>
          </div>
          <h1 className="text-2xl font-bold mt-2">{user?.fullName}</h1>
          <p className="text-xs text-teal-200 mt-1">Manage service offerings, respond to booking requests, track earnings, and complete KYC.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <Link to="/provider-services" className="btn-primary text-xs py-2 px-3 btn-glow">
            <Plus className="w-4 h-4" />
            Add Service
          </Link>
          <Link to="/emergency-sos" className="btn-danger text-xs py-2 px-3">
            <AlertTriangle className="w-4 h-4" />
            Emergency SOS
          </Link>
        </div>
      </div>

      {/* 5 Provider Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard
          title="Total Earnings"
          value={`$${totalEarnings}`}
          subtitle="Completed jobs"
          icon={DollarSign}
          color="emerald"
        />
        <DashboardCard
          title="Pending Requests"
          value={pendingBookings}
          subtitle="Requires response"
          icon={Clock}
          color="amber"
        />
        <DashboardCard
          title="Completed Jobs"
          value={completedBookings}
          subtitle="Finished bookings"
          icon={CheckCircle2}
          color="teal"
        />
        <DashboardCard
          title="Average Rating"
          value={`${avgRating} ★`}
          subtitle="From customer reviews"
          icon={Star}
          color="indigo"
        />
        <DashboardCard
          title="Active Services"
          value={activeServices}
          subtitle="Live on platform"
          icon={Wrench}
          color="indigo"
        />
      </div>

      {/* AI Smart Features Section */}
      <div className="sc-card-3d p-6 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-indigo-950/10 dark:to-purple-950/10 border-indigo-100 dark:border-indigo-900/40 space-y-4 transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Smart Demand Insights</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Rule-based recommendations based on booking traffic & customer searches</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-indigo-100 dark:border-indigo-900/40 shadow-xs space-y-1 transition-colors">
            <span className="font-bold text-indigo-750 dark:text-indigo-400 block">Peak Booking Slot</span>
            <p className="text-slate-650 dark:text-slate-300">Customers in Metro City book most services between <strong>10:00 AM - 02:00 PM</strong>.</p>
          </div>

          <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-indigo-100 dark:border-indigo-900/40 shadow-xs space-y-1 transition-colors">
            <span className="font-bold text-teal-750 dark:text-teal-400 block">High Demand Category</span>
            <p className="text-slate-650 dark:text-slate-300">Emergency leak repairs and electrical panel upgrades are trending <strong>+35% this week</strong>.</p>
          </div>

          <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-indigo-100 dark:border-indigo-900/40 shadow-xs space-y-1 transition-colors">
            <span className="font-bold text-emerald-750 dark:text-emerald-450 block">Pricing Recommendation</span>
            <p className="text-slate-650 dark:text-slate-300">Your average rate of <strong>${user?.provider?.hourlyRate || 75}/hr</strong> aligns perfectly with top 10% rated providers.</p>
          </div>
        </div>
      </div>

      {/* Recent Booking Requests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Booking Requests</h2>
          <Link to="/provider-bookings" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
            View All Requests
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : bookings.length === 0 ? (
          <div className="sc-card-3d p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            No booking requests received yet. Make sure your services are active!
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking) => (
              <BookingCard key={booking.bookingId} booking={booking} role="Provider" />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
