import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Calendar, Wrench, Star, AlertCircle, Bell, User, Settings,
  DollarSign, Clock, ShieldCheck, Award, MessageSquare, Navigation, AlertTriangle,
  Users, CheckSquare, BarChart3, FileText, CheckCircle2
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || 'Customer';

  const customerNav = [
    { label: 'Dashboard', path: '/customer-dashboard', icon: LayoutDashboard },
    { label: 'My Bookings', path: '/my-bookings', icon: Calendar },
    { label: 'Service Reviews', path: '/reviews', icon: Star },
    { label: 'My Complaints', path: '/complaints', icon: AlertCircle },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Profile', path: '/customer-profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const providerNav = [
    { label: 'Dashboard', path: '/provider-dashboard', icon: LayoutDashboard },
    { label: 'Manage Services', path: '/provider-services', icon: Wrench },
    { label: 'Booking Requests', path: '/provider-bookings', icon: Calendar },
    { label: 'Availability', path: '/availability', icon: Clock },
    { label: 'Live Tracking', path: '/live-tracking', icon: Navigation },
    { label: 'Customer Chat', path: '/customer-chat', icon: MessageSquare },
    { label: 'Wallet & Earnings', path: '/provider-earnings', icon: DollarSign },
    { label: 'KYC Verification', path: '/kyc-verification', icon: ShieldCheck },
    { label: 'Certificates', path: '/certificate-upload', icon: Award },
    { label: 'Customer Reviews', path: '/provider-reviews', icon: Star },
    { label: 'Complaints', path: '/provider-complaints', icon: AlertCircle },
    { label: 'Analytics', path: '/provider-analytics', icon: BarChart3 },
    { label: 'Tax & Reports', path: '/provider-reports', icon: FileText },
    { label: 'Emergency SOS', path: '/emergency-sos', icon: AlertTriangle },
    { label: 'Notifications', path: '/provider-notifications', icon: Bell },
    { label: 'Settings', path: '/provider-settings', icon: Settings },
  ];

  const adminNav = [
    { label: 'Overview Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
    { label: 'User Management', path: '/user-management', icon: Users },
    { label: 'Provider Verification', path: '/kyc-management', icon: ShieldCheck },
    { label: 'Services Catalogue', path: '/service-management', icon: Wrench },
    { label: 'Bookings Control', path: '/booking-management', icon: Calendar },
    { label: 'Review Moderation', path: '/review-management', icon: Star },
    { label: 'Complaints Desk', path: '/complaint-management', icon: AlertCircle },
    { label: 'System Notifications', path: '/notification-management', icon: Bell },
    { label: 'Analytics & Reports', path: '/reports', icon: BarChart3 },
  ];

  const navItems = role === 'Admin' ? adminNav : role === 'Provider' ? providerNav : customerNav;

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex shrink-0 transition-colors duration-200">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {role} Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 font-semibold border-r-4 border-indigo-600'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 mt-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">System Connected</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">REST API Backend v1.0 Operational</p>
      </div>
    </aside>
  );
};
