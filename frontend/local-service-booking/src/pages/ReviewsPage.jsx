import React, { useEffect, useState } from 'react';
import { reviewService } from '../services/api';
import { ReviewCard } from '../components/ReviewCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Star } from 'lucide-react';

export const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewService.getAllReviews()
      .then((res) => setReviews(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Service Reviews & Ratings</h1>
        <p className="text-xs text-slate-500">Verified customer feedback and provider ratings</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No Reviews Yet"
          description="Be the first customer to complete a service and leave feedback."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <ReviewCard key={rev.reviewId} review={rev} />
          ))}
        </div>
      )}
    </div>
  );
};
