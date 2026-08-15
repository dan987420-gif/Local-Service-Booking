import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const ServiceCard = ({ service }) => {
  return (
    <div className="sc-card p-5 flex flex-col justify-between h-full group hover:border-indigo-200">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-indigo-100">
            {service.category}
          </span>
          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span>{service.providerRating || 5.0}</span>
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {service.title}
        </h3>

        <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>{service.businessName || service.providerName || 'Verified Provider'}</span>
        </p>

        <div className="flex items-center gap-1.5 mt-2.5 text-xs font-semibold">
          <span className="text-slate-500">🛡 Trust Score:</span>
          <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
            (service.trustScore !== undefined ? service.trustScore : 100) >= 90 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
            (service.trustScore !== undefined ? service.trustScore : 100) >= 75 ? 'bg-blue-50 text-blue-700 border-blue-100' :
            (service.trustScore !== undefined ? service.trustScore : 100) >= 60 ? 'bg-amber-50 text-amber-700 border-amber-100' :
            'bg-slate-50 text-slate-600 border-slate-100'
          }`}>
            {service.trustScore !== undefined ? service.trustScore : 100}/100 ({service.trustBadge || 'Excellent'})
          </span>
        </div>

        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
          {service.description || 'Professional local service provided by experienced certified specialist.'}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 font-medium block">Starting Price</span>
          <span className="text-lg font-extrabold text-slate-900">${service.price}</span>
          <span className="text-[10px] text-slate-500 font-medium ml-1">/ {service.durationMinutes || 60} mins</span>
        </div>

        <Link
          to={`/services/${service.serviceId}`}
          className="btn-primary text-xs py-1.5 px-3 rounded-lg flex items-center gap-1"
        >
          Book Now
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
