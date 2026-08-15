import React from 'react';
import { Wrench, Heart, Shield, Award, Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold text-white">Service<span className="text-indigo-400">Connect</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trusted Local Services, Simplified. Connecting homeowners and businesses with vetted local service professionals across 20+ service categories.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/services" className="hover:text-white transition-colors">Electricians</a></li>
              <li><a href="/services" className="hover:text-white transition-colors">Plumbing Services</a></li>
              <li><a href="/services" className="hover:text-white transition-colors">Home Cleaning</a></li>
              <li><a href="/services" className="hover:text-white transition-colors">Appliance Repair</a></li>
            </ul>
          </div>

          {/* User Roles */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/login" className="hover:text-white transition-colors">Customer Portal</a></li>
              <li><a href="/provider-registration" className="hover:text-white transition-colors">Become a Provider</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Admin Access</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">Terms & Privacy</a></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Support</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>+1 (800) 555-SERV</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>support@serviceconnect.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>Metro City, NY 10001</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ServiceConnect. 3rd-Year CSE College Project.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Engineered with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> React & ASP.NET Core
          </p>
        </div>
      </div>
    </footer>
  );
};
