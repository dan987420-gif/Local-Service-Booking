import React from 'react';
import { Star, User, Calendar } from 'lucide-react';

export const ReviewCard = ({ review }) => {
  const dateFormatted = new Date(review.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="sc-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
            {review.customerName ? review.customerName.substring(0, 2).toUpperCase() : 'CU'}
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-800">{review.customerName}</h5>
            <span className="text-[10px] text-slate-400 font-medium">Verified Customer</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed italic">"{review.comment}"</p>

      <div className="text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-100 pt-2">
        <span>Provider: {review.businessName}</span>
        <span>{dateFormatted}</span>
      </div>
    </div>
  );
};
