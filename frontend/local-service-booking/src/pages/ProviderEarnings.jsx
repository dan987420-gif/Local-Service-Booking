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
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Wallet & Earnings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Track your income, verify processed credits, and view payment logs.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Wallet Balance */}
        <div className="sc-card-3d p-6 bg-gradient-to-br from-teal-600 to-emerald-700 text-white border-none shadow-md shadow-teal-500/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-teal-100 font-semibold uppercase tracking-wider">Wallet Balance</p>
              <h2 className="text-3xl font-extrabold mt-1">${walletBalance}</h2>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-[10px] text-teal-50 mt-4">Available for immediate payout verification.</p>
        </div>

        {/* Total Earned */}
        <div className="sc-card-3d p-6 border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Total Earned</p>
              <h2 className="text-3xl font-extrabold mt-1 text-slate-900 dark:text-white">${totalEarned}</h2>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-4">Aggregated completed booking receipts.</p>
        </div>

        {/* Pending Payouts */}
        <div className="sc-card-3d p-6 border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Pending Earnings</p>
              <h2 className="text-3xl font-extrabold mt-1 text-slate-900 dark:text-white">${pendingEarnings}</h2>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-4">Earnings currently locked in active jobs.</p>
        </div>
      </div>

      {/* College Project Disclaimer */}
      <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/30 rounded-xl flex gap-3 text-xs text-slate-700 dark:text-slate-300 transition-colors">
        <ShieldAlert className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-indigo-800 dark:text-indigo-400">College Demonstration Notice:</span>
          <p className="mt-0.5">Real-world payment gateway integrations (e.g. Stripe, PayPal, Razorpay) are labeled for future enhancement. Payouts and wallet increments are simulated automatically in the database upon completion of customer bookings.</p>
        </div>
      </div>

      {/* Recent Payout/Earnings Log */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-950 dark:text-white">Recent Income Credits</h2>
        {transactions.length === 0 ? (
          <div className="sc-card-3d p-6 text-center text-slate-500 dark:text-slate-400 text-xs transition-colors">
            No income credits listed yet. Completed bookings will trigger credits.
          </div>
        ) : (
          <div className="sc-card-3d divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
            {transactions.map((t) => (
              <div key={t.bookingId} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Job Completion Credit</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Booking Reference #{t.bookingId}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-emerald-600 dark:text-emerald-450">+${t.totalPrice}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
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
