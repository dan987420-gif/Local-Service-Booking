import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { serviceService } from '../services/api';
import { ServiceCard } from '../components/ServiceCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Wrench, ShieldCheck, Clock, Star, Zap, Sparkles, CheckCircle2, ArrowRight, Award } from 'lucide-react';

export const Home = () => {
  const [recommendedServices, setRecommendedServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    serviceService.getRecommendedServices(6)
      .then((res) => {
        setRecommendedServices(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { name: 'Electrician', icon: Zap, count: '14+ Active Pros', bg: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30' },
    { name: 'Plumber', icon: Wrench, count: '20+ Active Pros', bg: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30' },
    { name: 'Cleaning', icon: Sparkles, count: '35+ Active Pros', bg: 'bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/30' },
    { name: 'Appliance Repair', icon: Award, count: '18+ Active Pros', bg: 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30' },
  ];

  return (
    <div className="space-y-16 pb-16 fade-in">
      
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-b-[2rem] border-b border-indigo-900/30 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent_60%)]"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Trusted Local Services, Simplified
            </span>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Book Verified Local Experts in Seconds.
            </h1>

            <p className="text-slate-300 text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              From emergency plumbing to electrical upgrades and deep home cleaning, ServiceConnect matches you with certified local providers with transparent pricing and live status tracking.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to="/services" className="btn-primary py-3 px-6 text-base font-semibold shadow-lg shadow-indigo-600/30 btn-glow">
                Explore Services
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/provider-registration" className="btn-secondary py-3 px-6 text-base font-semibold shadow-lg shadow-teal-600/30">
                Join as Provider
              </Link>
            </div>

            <div className="pt-6 border-t border-indigo-700/30 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <span className="text-2xl font-bold text-white">5,000+</span>
                <p className="text-xs text-indigo-200 mt-0.5">Services Completed</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">4.9 ★</span>
                <p className="text-xs text-indigo-200 mt-0.5">Average Rating</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">100%</span>
                <p className="text-xs text-indigo-200 mt-0.5">KYC Verified Pros</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block relative perspective-1000 animate-float">
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl space-y-4 transform rotate-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base">Verified & Insured Professionals</h4>
                  <p className="text-slate-300 text-xs">Background checks & identity verified by Admin</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl p-4 space-y-3 shadow-lg border border-slate-100 dark:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Popular Instant Request</span>
                  <span className="badge-accepted">Available Today</span>
                </div>
                <h5 className="font-extrabold text-sm">Full Home Electrical Safety Inspection</h5>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <span>Provider: Apex Electrical</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">$120.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Explore Top Categories</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select a category to view instant pricing and provider availability</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/services?category=${encodeURIComponent(cat.name)}`}
                className="sc-card-3d p-6 text-center space-y-3 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center transition-colors duration-300 ${cat.bg}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-sm transition-colors">{cat.name}</h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">{cat.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* AI Recommended Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">AI Recommended Services</h2>
              <span className="bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 transition-colors">
                Rule-Based AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Top-rated certified professionals curated based on ratings & popularity</p>
          </div>
          <Link to="/services" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1">
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedServices.map((service) => (
              <ServiceCard key={service.serviceId} service={service} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
