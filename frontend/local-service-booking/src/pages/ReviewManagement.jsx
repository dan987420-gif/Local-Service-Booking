import React, { useEffect, useState } from 'react';
import { reviewService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Star, User, Calendar, ShieldCheck, Search } from 'lucide-react';

export const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = () => {
    setLoading(true);
    reviewService.getAllReviews()
      .then((res) => {
        setReviews(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const filteredReviews = reviews.filter((r) => {
    return r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           r.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (r.comment && r.comment.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  if (loading && reviews.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Feedback & Reviews</h1>
        <p className="text-xs text-slate-500 mt-1">Audit customer ratings, review comments, and moderate feedback submissions.</p>
      </div>

      {/* Search Input bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by customer name, provider business name, or comment keywords..."
          className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
        />
      </div>

      {filteredReviews.length === 0 ? (
        <EmptyState
          title="No reviews found"
          description="Customer-provider review submissions will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((review) => (
            <div key={review.reviewId} className="sc-card p-5 border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
              
              {/* Header: Customer & Provider details */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                    {review.customerName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{review.customerName}</span>
                    <span className="text-[10px] text-slate-400">reviewed <span className="font-bold text-slate-600">{review.businessName}</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{review.rating}.0</span>
                </div>
              </div>

              {/* Comment text */}
              <p className="text-xs text-slate-600 leading-relaxed italic flex-1">
                "{review.comment || 'No comment text provided.'}"
              </p>

              {/* Footer Meta */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
                <span className="font-semibold text-slate-500">Booking Ref: #{review.bookingId}</span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
