import React, { useEffect, useState } from 'react';
import { providerService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { DollarSign, ArrowUpRight, TrendingUp, ShieldAlert, CreditCard } from 'lucide-react';

export const ProviderEarnings = () => {
  const [walletStats, setWalletStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    providerService.getWallet()
      .then((res) => {
        setWalletStats(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const walletBalance = walletStats?.walletBalance ?? 0;
  const totalEarned = walletStats?.totalEarned ?? 0;
  const pendingEarnings = walletStats?.pendingEarnings ?? 0;
  const transactions = walletStats?.recentTransactions ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Wallet & Earnings</h1>
        <p className="text-xs text-slate-500 mt-1">Track your income, verify processed credits, and view payment logs.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Wallet Balance */}
        <div className="sc-card p-6 bg-gradient-to-br from-teal-500 to-teal-600 text-white border-none shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-teal-100 font-semibold uppercase tracking-wider">Wallet Balance</p>
              <h2 className="text-3xl font-extrabold mt-1">${walletBalance}</h2>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[10px] text-teal-50 mt-4">Available for immediate payout verification.</p>
        </div>

        {/* Total Earned */}
        <div className="sc-card p-6 border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Earned</p>
              <h2 className="text-3xl font-extrabold mt-1 text-slate-900">${totalEarned}</h2>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-4">Aggregated completed booking receipts.</p>
        </div>

        {/* Pending Payouts */}
        <div className="sc-card p-6 border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Pending Earnings</p>
              <h2 className="text-3xl font-extrabold mt-1 text-slate-900">${pendingEarnings}</h2>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-4">Earnings currently locked in active jobs.</p>
        </div>
      </div>

      {/* College Project Disclaimer */}
      <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl flex gap-3 text-xs text-slate-700">
        <ShieldAlert className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-indigo-800">College Demonstration Notice:</span>
          <p className="mt-0.5">Real-world payment gateway integrations (e.g. Stripe, PayPal, Razorpay) are labeled for future enhancement. Payouts and wallet increments are simulated automatically in the database upon completion of customer bookings.</p>
        </div>
      </div>

      {/* Recent Payout/Earnings Log */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-950">Recent Income Credits</h2>
        {transactions.length === 0 ? (
          <div className="sc-card p-6 text-center text-slate-500 text-xs">
            No income credits listed yet. Completed bookings will trigger credits.
          </div>
        ) : (
          <div className="sc-card divide-y divide-slate-100 overflow-hidden">
            {transactions.map((t) => (
              <div key={t.bookingId} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Job Completion Credit</p>
                    <p className="text-[10px] text-slate-500">Booking Reference #{t.bookingId}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-emerald-600">+${t.totalPrice}</p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(t.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
