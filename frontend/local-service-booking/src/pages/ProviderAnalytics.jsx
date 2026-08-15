import React, { useEffect, useState } from 'react';
import { reportService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { BarChart3, TrendingUp, DollarSign, Calendar, Star, Percent } from 'lucide-react';

export const ProviderAnalytics = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService.getProviderReport()
      .then((res) => {
        setReport(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const totalEarnings = report?.totalEarnings ?? 0;
  const pendingEarnings = report?.pendingEarnings ?? 0;
  const completedBookings = report?.completedBookings ?? 0;
  const cancelledBookings = report?.cancelledBookings ?? 0;
  const activeServices = report?.activeServices ?? 0;
  const averageRating = report?.averageRating ?? 5.0;
  const monthlyEarnings = report?.monthlyEarnings ?? [];

  // Compute completion rate
  const totalBookings = completedBookings + cancelledBookings;
  const completionRate = totalBookings > 0
    ? Math.round((completedBookings / totalBookings) * 100)
    : 100;

  // Find max monthly amount for scaling the SVG chart
  const maxAmount = monthlyEarnings.length > 0
    ? Math.max(...monthlyEarnings.map((m) => parseFloat(m.amount)))
    : 1000;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Analytics Dashboard</h1>
        <p className="text-xs text-slate-500 mt-1">Analyze your platform performance, completion stats, and monthly trends.</p>
      </div>

      {/* Grid of Key Performance Indicators (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total revenue */}
        <div className="sc-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wide">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">${totalEarnings}</h3>
            <p className="text-[10px] text-slate-400 mt-1">+$ {pendingEarnings} pending in progress</p>
          </div>
        </div>

        {/* Completed Jobs */}
        <div className="sc-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wide">Completed Jobs</span>
            <Calendar className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">{completedBookings}</h3>
            <p className="text-[10px] text-slate-400 mt-1">{cancelledBookings} cancelled requests</p>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="sc-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wide">Completion Rate</span>
            <Percent className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">{completionRate}%</h3>
            <p className="text-[10px] text-slate-400 mt-1">Target benchmark: &gt;90%</p>
          </div>
        </div>

        {/* Rating */}
        <div className="sc-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wide">Rating average</span>
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">{averageRating} ★</h3>
            <p className="text-[10px] text-slate-400 mt-1">Based on client review cards</p>
          </div>
        </div>
      </div>

      {/* SVG Bar Chart section */}
      <div className="sc-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            Monthly Earnings Trend
          </h2>
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
            Rolling Year Stats
          </span>
        </div>

        {/* Custom SVG Bar Chart */}
        <div className="space-y-4">
          <div className="h-64 flex items-end justify-between gap-2.5 pt-6 px-4 border-b border-l border-slate-200">
            {monthlyEarnings.map((item) => {
              const heightPercent = maxAmount > 0
                ? Math.min((parseFloat(item.amount) / maxAmount) * 100, 100)
                : 10;
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  {/* Tooltip on Hover */}
                  <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] font-semibold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-md">
                    ${parseFloat(item.amount).toFixed(2)} ({item.count} jobs)
                  </div>
                  
                  {/* Visual Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 rounded-t transition-all duration-300 min-h-[4px]"
                  ></div>
                  
                  {/* Month Label below */}
                  <span className="text-[10px] text-slate-400 font-medium mt-2">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};
