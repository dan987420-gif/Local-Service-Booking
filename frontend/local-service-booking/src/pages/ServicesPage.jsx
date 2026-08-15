import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { serviceService } from '../services/api';
import { ServiceCard } from '../components/ServiceCard';
import { SearchBar } from '../components/SearchBar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Filter, Wrench } from 'lucide-react';

export const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const categories = ['All', 'Electrician', 'Plumber', 'Cleaning', 'Appliance Repair', 'Carpentry', 'Painting'];

  useEffect(() => {
    fetchServices();
  }, [selectedCategory]);

  const fetchServices = () => {
    setLoading(true);
    const params = {};
    if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;

    serviceService.getAllServices(params)
      .then((res) => setServices(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const filteredServices = services.filter((s) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      s.title.toLowerCase().includes(query) ||
      (s.description && s.description.toLowerCase().includes(query)) ||
      s.businessName.toLowerCase().includes(query) ||
      s.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Explore Local Services</h1>
        <p className="text-xs text-slate-500">Book verified local professionals with upfront pricing</p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-96">
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="Search by service title or provider..."
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                const newCat = cat === 'All' ? '' : cat;
                setSelectedCategory(newCat);
                if (newCat) setSearchParams({ category: newCat });
                else setSearchParams({});
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                (cat === 'All' && !selectedCategory) || selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Service Cards Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredServices.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No Services Found"
          description="We couldn't find any services matching your filter criteria."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setSelectedCategory('');
            setSearchParams({});
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.serviceId} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};
