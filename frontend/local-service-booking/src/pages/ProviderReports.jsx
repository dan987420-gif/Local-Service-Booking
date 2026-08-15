import React, { useEffect, useState } from 'react';
import { reportService, bookingService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { FileText, Printer, Download, Sparkles, Receipt, DollarSign, Calendar } from 'lucide-react';

export const ProviderReports = () => {
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
        // Only take completed jobs for tax/earnings report
        const completed = bookRes.data.filter((b) => b.status === 'Completed');
        setBookings(completed);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    if (bookings.length === 0) return;
    
    // Prepare CSV data
    const headers = ['BookingId', 'CustomerName', 'Service', 'Date', 'Amount'];
    const rows = bookings.map((b) => [
      b.bookingId,
      b.customerName,
      b.serviceTitle,
      new Date(b.bookingDate).toLocaleDateString(),
      b.totalPrice
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ServiceConnect_Earnings_Report_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const totalEarnings = report?.totalEarnings ?? 0;
  const completedJobs = report?.completedBookings ?? 0;
  const avgRating = report?.averageRating ?? 5.0;

  // Simple demo tax calculations (10% platform commission, 5% estimated tax)
  const platformFee = totalEarnings * 0.10;
  const estimatedTax = (totalEarnings - platformFee) * 0.05;
  const netEarnings = totalEarnings - platformFee - estimatedTax;

  return (
    <div className="space-y-6 print:p-0 print:bg-white print:border-none print:shadow-none">
      
      {/* Header section (hidden on print) */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Tax & Earnings Reports</h1>
          <p className="text-xs text-slate-500 mt-1">Review financial summaries, calculate estimated tax, and download records.</p>
        </div>

        <div className="flex gap-2">
          <button onClick={handlePrint} className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5">
            <Printer className="w-4 h-4" />
            Print statement
          </button>
          <button onClick={handleDownloadCsv} className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Printable Statement Layout */}
      <div className="sc-card p-6 border border-slate-200 shadow-sm space-y-6 print:border-none print:shadow-none">
        
        {/* Printable Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">ServiceConnect Statement</h2>
            <p className="text-[10px] text-slate-400">Statement Generated: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <h3 className="text-sm font-bold text-indigo-600">Apex Electrical Solutions</h3>
            <p className="text-[10px] text-slate-500">Provider Account Statement</p>
          </div>
        </div>

        {/* Aggregated Financial Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Gross Income</span>
            <span className="text-base font-extrabold text-slate-950">${totalEarnings.toFixed(2)}</span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Platform Fee (10%)</span>
            <span className="text-base font-extrabold text-red-600">-${platformFee.toFixed(2)}</span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Est. Tax (5%)</span>
            <span className="text-base font-extrabold text-red-600">-${estimatedTax.toFixed(2)}</span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Net Payout (Est)</span>
            <span className="text-base font-extrabold text-emerald-600">${netEarnings.toFixed(2)}</span>
          </div>
        </div>

        {/* Informational Disclaimer (hidden on print) */}
        <div className="p-3 bg-amber-50 text-amber-800 text-[11px] rounded-lg border border-amber-200 flex gap-2 items-start print:hidden">
          <Receipt className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            <strong>Tax Disclosure:</strong> This document is a local demonstration statement for college evaluation. It does not constitute official legal, tax, or financial advice.
          </p>
        </div>

        {/* Completed Jobs Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-950">Earnings breakdown</h3>
          
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3.5">Job ID</th>
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Service Description</th>
                  <th className="p-3.5">Date Completed</th>
                  <th className="p-3.5 text-right">Receipt Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr key={booking.bookingId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">#00{booking.bookingId}</td>
                    <td className="p-3.5 font-medium text-slate-700">{booking.customerName}</td>
                    <td className="p-3.5 text-slate-600">{booking.serviceTitle}</td>
                    <td className="p-3.5 text-slate-500">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 text-right font-bold text-emerald-600">${booking.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
