import React, { useEffect, useState } from 'react';
import { reviewService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Star, User, Calendar, MessageCircle } from 'lucide-react';

export const ProviderReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.providerId) {
      reviewService.getProviderReviews(user.providerId)
        .then((res) => {
          setReviews(res.data);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Customer Reviews</h1>
        <p className="text-xs text-slate-500 mt-1">Browse feedback, ratings, and ratings left by your completed job clients.</p>
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description="Customer ratings and reviews will appear here once you complete jobs."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <div key={review.reviewId} className="sc-card p-5 border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
              
              {/* Header: Rating & Customer */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                    {review.customerName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{review.customerName}</span>
                    <span className="text-[10px] text-slate-400">Client</span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{review.rating}.0</span>
                </div>
              </div>

              {/* Comment */}
              <p className="text-xs text-slate-600 flex-1 leading-relaxed">
                "{review.comment || 'No comment provided.'}"
              </p>

              {/* Date & Booking reference */}
              <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-3">
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
