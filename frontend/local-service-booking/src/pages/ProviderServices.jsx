import React, { useEffect, useState } from 'react';
import { serviceService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Loader2, DollarSign, Clock, HelpCircle } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';

export const ProviderServices = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('60');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    setLoading(true);
    serviceService.getAllServices()
      .then((res) => {
        // Filter services for the current provider
        const myServices = res.data.filter((s) => s.providerId === user?.providerId);
        setServices(myServices);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load services. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory(user?.provider?.category || '');
    setPrice('');
    setDuration('60');
    setEditMode(false);
    setCurrentServiceId(null);
    setError('');
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEditModal = (service) => {
    resetForm();
    setTitle(service.title);
    setDescription(service.description || '');
    setCategory(service.category);
    setPrice(service.price.toString());
    setDuration(service.durationMinutes.toString());
    setCurrentServiceId(service.serviceId);
    setEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !category || !price) {
      setError('Please fill in all required fields.');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid price greater than 0.');
      return;
    }

    const durationNum = parseInt(duration, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      setError('Please enter a valid duration.');
      return;
    }

    const data = {
      title,
      description,
      category,
      price: priceNum,
      durationMinutes: durationNum,
    };

    setLoading(true);
    const apiCall = editMode
      ? serviceService.updateService(currentServiceId, data)
      : serviceService.createService(data);

    apiCall
      .then(() => {
        setShowModal(false);
        fetchServices();
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.message || 'Operation failed. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
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

  const handleToggleActive = (service) => {
    setLoading(true);
    serviceService.updateService(service.serviceId, { isActive: !service.isActive })
      .then(() => {
        fetchServices();
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to update status.');
        setLoading(false);
      });
  };

  if (loading && services.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Manage Services</h1>
          <p className="text-xs text-slate-500 mt-1">Configure your local service offerings, prices, and job durations.</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn-primary text-xs py-2 px-3">
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {services.length === 0 ? (
        <EmptyState
          title="No services added yet"
          description="Offer services on the marketplace so customers can find and book you."
          actionText="Add Your First Service"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <div key={service.serviceId} className="sc-card p-5 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-100 uppercase tracking-wide">
                    {service.category}
                  </span>
                  <button
                    onClick={() => handleToggleActive(service)}
                    className="text-slate-400 hover:text-indigo-600 transition-colors"
                    title={service.isActive ? 'Disable Service' : 'Enable Service'}
                  >
                    {service.isActive ? (
                      <ToggleRight className="w-8 h-8 text-indigo-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-300" />
                    )}
                  </button>
                </div>
                <h3 className="text-sm font-bold text-slate-950">{service.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{service.description || 'No description provided.'}</p>
              </div>

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

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(service)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100"
                    title="Edit Service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.serviceId)}
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-slate-100"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {showModal && (
        <Modal title={editMode ? 'Edit Service' : 'Add New Service'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">{error}</div>}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Service Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Bedroom Deep Cleaning"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                required
              >
                <option value="">Select Category</option>
                <option value="Electrician">Electrician</option>
                <option value="Plumber">Plumber</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Pest Control">Pest Control</option>
                <option value="Appliance Repair">Appliance Repair</option>
                <option value="Painting">Painting</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Duration (Minutes)</label>
                <input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="60"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what the service includes, tools provided, etc."
                rows="3"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn-outline text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary text-xs py-2 px-4"
              >
                {editMode ? 'Save Changes' : 'Create Service'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
