import React, { useEffect, useState } from 'react';
import { serviceService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Search, Filter, Trash2, DollarSign, Clock, User, Wrench } from 'lucide-react';

export const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    setLoading(true);
    serviceService.getAllServices()
      .then((res) => {
        setServices(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this service from the platform catalog?')) {
      setLoading(true);
      serviceService.deleteService(id)
        .then(() => {
          fetchServices();
        })
        .catch((err) => {
          console.error(err);
          alert('Failed to delete service.');
          setLoading(false);
        });
    }
  };

  const filteredServices = services.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.providerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading && services.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Services Catalogue</h1>
        <p className="text-xs text-slate-500 mt-1">Audit, search, and manage all active service offerings listed by platform providers.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by service title, provider name, or business name..."
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
          >
            <option value="All">All Categories</option>
            <option value="Electrician">Electrician</option>
            <option value="Plumber">Plumber</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Pest Control">Pest Control</option>
            <option value="Appliance Repair">Appliance Repair</option>
            <option value="Painting">Painting</option>
          </select>
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <EmptyState
          title="No services match search criteria"
          description="Try modifying search keywords or selected category filters."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredServices.map((service) => (
            <div key={service.serviceId} className="sc-card p-5 flex flex-col justify-between gap-4">
              
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wide">
                    {service.category}
                  </span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                    ★ {service.providerRating} Rating
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-950">{service.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{service.description || 'No description provided.'}</p>
              </div>

              {/* Provider Info */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-[11px] text-slate-600">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800">{service.businessName}</span>
                  <span className="text-slate-400 block text-[10px]">Managed by {service.providerName}</span>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <div className="flex items-center gap-4 text-slate-700">
                  <div className="flex items-center gap-1 font-semibold">
                    <DollarSign className="w-4 h-4 text-indigo-500" />
                    <span>${service.price}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{service.durationMinutes} mins</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(service.serviceId)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent"
                  title="Remove Service Listing"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
