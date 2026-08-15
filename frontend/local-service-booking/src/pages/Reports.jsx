import React, { useEffect, useState } from 'react';
import { reportService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { FileText, Printer, Download, DollarSign, TrendingUp, BarChart2, PieChart, Info } from 'lucide-react';

export const Reports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService.getAdminReport()
      .then((res) => {
        setReport(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    if (!report) return;
    
    // Prepare categories CSV
    const headers = ['Category', 'ServicesCount', 'BookingsCount'];
    const rows = (report.categoryBreakdown || []).map((c) => [
      c.category,
      c.serviceCount,
      c.bookingCount
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ServiceConnect_Admin_Report_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const totalRevenue = report?.totalRevenue ?? 0;
  const adminCommission = totalRevenue * 0.10; // 10% Platform fee simulation
  const avgRating = report?.averageRating ?? 5.0;

  return (
    <div className="space-y-6 print:p-0 print:bg-white print:border-none print:shadow-none">
      
      {/* Header (hidden during print) */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Platform Reports</h1>
          <p className="text-xs text-slate-500 mt-1">Generate system audit ledgers, verify platform transaction commissions, and inspect service categories.</p>
        </div>

        <div className="flex gap-2">
          <button onClick={handlePrint} className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5">
            <Printer className="w-4 h-4" />
            Print Ledger
          </button>
          <button onClick={handleExportCsv} className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="sc-card p-6 border border-slate-200 shadow-sm space-y-6 print:border-none print:shadow-none">
        
        {/* Printable Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">ServiceConnect Global Audit Statement</h2>
            <p className="text-[10px] text-slate-400">Statement Generated: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <h3 className="text-sm font-bold text-indigo-600">Platform Administration Panel</h3>
            <p className="text-[10px] text-slate-500">Database Context: SQL Server (LocalServiceBooking)</p>
          </div>
        </div>

        {/* Global Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Gross Volume</span>
            <span className="text-base font-extrabold text-slate-950">${totalRevenue.toFixed(2)}</span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Platform Comm. (10%)</span>
            <span className="text-base font-extrabold text-emerald-600">${adminCommission.toFixed(2)}</span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Completed Bookings</span>
            <span className="text-base font-extrabold text-slate-950">{report?.completedBookings ?? 0}</span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Average Rating</span>
            <span className="text-base font-extrabold text-slate-950">{avgRating.toFixed(2)} ★</span>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-indigo-600" />
            Category Catalogue Performance
          </h3>
          
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3.5">Category Name</th>
                  <th className="p-3.5">Active Services Count</th>
                  <th className="p-3.5 text-right">Associated Bookings Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(report?.categoryBreakdown || []).map((cat) => (
                  <tr key={cat.category} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{cat.category}</td>
                    <td className="p-3.5 font-medium text-slate-600">{cat.serviceCount}</td>
                    <td className="p-3.5 text-right font-bold text-slate-900">{cat.bookingCount} jobs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Informational Disclaimer (hidden on print) */}
        <div className="p-3 bg-indigo-50/50 text-slate-700 text-[11px] rounded-lg border border-indigo-100 flex gap-2 items-start print:hidden">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600" />
          <p>
            <strong>College Demonstration Disclaimer:</strong> This ledger statement gathers totals directly from SQL Server relational database tables for project evaluation.
          </p>
        </div>

      </div>

    </div>
  );
};
