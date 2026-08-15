import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { DashboardCard } from '../components/DashboardCard';
import { Users, ShieldCheck, Wrench, Calendar, CheckCircle2, AlertCircle, ShieldAlert, DollarSign, Star } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const totalUsers = stats?.totalUsers ?? 0;
  const totalProviders = stats?.totalProviders ?? 0;
  const totalServices = stats?.totalServices ?? 0;
  const totalBookings = stats?.totalBookings ?? 0;
  const completedBookings = stats?.completedBookings ?? 0;
  const pendingComplaints = stats?.pendingComplaints ?? 0;
  const pendingKycCount = stats?.pendingKycCount ?? 0;
  const revenue = stats?.revenue ?? 0;
  const avgRating = stats?.averageRating ?? 5.0;

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Admin Control Center</h1>
        <p className="text-xs text-slate-500 mt-1">Monitor users, track database statistics, verify providers, and manage disputes.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Users"
          value={totalUsers}
          subtitle="Customers & Providers"
          icon={Users}
          color="indigo"
        />
        <DashboardCard
          title="Registered Providers"
          value={totalProviders}
          subtitle={`${pendingKycCount} verification pending`}
          icon={ShieldCheck}
          color="teal"
        />
        <DashboardCard
          title="Revenue Generated"
          value={`$${revenue}`}
          subtitle="Completed bookings total"
          icon={DollarSign}
          color="emerald"
        />
        <DashboardCard
          title="Total Bookings"
          value={totalBookings}
          subtitle={`${completedBookings} jobs completed`}
          icon={Calendar}
          color="indigo"
        />
      </div>

      {/* Admin Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Verification & Disputes Shortcuts Card */}
        <div className="sc-card p-5 space-y-4 border border-slate-200 shadow-sm">
          <h2 className="text-sm font-bold text-slate-950">Action Desk Shortcuts</h2>
          <div className="grid grid-cols-2 gap-4">
            
            {/* KYC Pending */}
            <Link
              to="/kyc-management"
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/10 transition-all text-center space-y-2 group"
            >
              <ShieldAlert className="w-6 h-6 text-indigo-600 mx-auto" />
              <div>
                <span className="text-xl font-black text-slate-900 block">{pendingKycCount}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">KYC Pending</span>
              </div>
            </Link>

            {/* Complaints Desk */}
            <Link
              to="/complaint-management"
              className="p-4 rounded-xl border border-slate-200 hover:border-red-400 bg-slate-50/50 hover:bg-red-50/10 transition-all text-center space-y-2 group"
            >
              <AlertCircle className="w-6 h-6 text-red-600 mx-auto animate-pulse" />
              <div>
                <span className="text-xl font-black text-slate-900 block">{pendingComplaints}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Unresolved</span>
              </div>
            </Link>

          </div>
        </div>

        {/* Database Quick Health Card */}
        <div className="sc-card p-5 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-950">Database Schema Health</h2>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Active Service Offerings</span>
              <span className="font-bold text-slate-800">{totalServices} catalog items</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Average Platform Rating</span>
              <span className="font-bold text-slate-800">{avgRating} ★</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500">Active Workspace</span>
              <span className="font-semibold text-teal-600">SQL Server (LocalServiceBooking)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
