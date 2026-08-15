import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { serviceService, providerService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/Modal';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Star, ShieldCheck, Clock, Calendar, MapPin, CheckCircle2, User, Phone, Mail, Award, ArrowLeft } from 'lucide-react';

export const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const [service, setService] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const [bookingForm, setBookingForm] = useState({
    bookingDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    scheduledTime: '10:00 AM - 11:30 AM',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    notes: '',
  });

  const timeSlots = [
    '08:00 AM - 09:30 AM',
    '10:00 AM - 11:30 AM',
    '01:00 PM - 02:30 PM',
    '03:00 PM - 04:30 PM',
    '05:00 PM - 06:30 PM',
  ];

  useEffect(() => {
    fetchServiceData();
  }, [id]);

  const fetchServiceData = async () => {
    setLoading(true);
    try {
      const res = await serviceService.getServiceById(id);
      setService(res.data);

      if (res.data.providerId) {
        const pRes = await providerService.getProviderById(res.data.providerId);
        setProvider(pRes.data);
      }
    } catch (err) {
      setError('Failed to load service details.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    setBookingError('');

    try {
      const res = await bookingService.createBooking({
        serviceId: service.serviceId,
        bookingDate: new Date(bookingForm.bookingDate).toISOString(),
        scheduledTime: bookingForm.scheduledTime,
        address: bookingForm.address,
        city: bookingForm.city,
        notes: bookingForm.notes,
      });

      setIsBookingOpen(false);
      navigate('/my-bookings');
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to complete booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading service & provider profile..." />;
  if (error || !service) return <div className="p-8 text-center"><ErrorMessage message={error || 'Service not found.'} /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 fade-in">
      
      <Link to="/services" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Services
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Service Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="sc-card-3d p-6 space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <span className="bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 text-xs font-semibold px-3 py-1 rounded-md border border-indigo-100 dark:border-indigo-900/30 transition-colors">
                {service.category}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Duration: {service.durationMinutes} Mins
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{service.title}</h1>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {service.description || 'Comprehensive professional local service delivered by certified specialists using industry-standard equipment.'}
            </p>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
              <div>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium block">Fixed Service Fee</span>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">${service.price}</span>
              </div>

              {role === 'Provider' ? (
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium italic">Viewing in Provider Mode</span>
              ) : (
                <Button onClick={() => setIsBookingOpen(true)} className="py-2.5 px-6 btn-glow">
                  <Calendar className="w-4 h-4" />
                  Book Service Now
                </Button>
              )}
            </div>
          </div>

          {/* Provider Profile Info Card */}
          {provider && (
            <div className="sc-card-3d p-6 space-y-4 transition-colors">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">About Service Provider</h3>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-md shrink-0">
                  {provider.businessName.substring(0, 2).toUpperCase()}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{provider.businessName}</h4>
                    {provider.isKycVerified === 'Verified' && (
                      <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/30 flex items-center gap-1 transition-colors">
                        <ShieldCheck className="w-3 h-3" />
                        Verified Pro
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Owner: {provider.fullName}</p>
                  
                  <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {provider.rating} ({provider.totalReviews} reviews)
                    </span>
                    <span>• {provider.experienceYears} Years Exp.</span>
                    <span>• ${provider.hourlyRate}/hr</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 mt-1 border-t border-slate-100 dark:border-slate-800 transition-colors">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">🛡 Provider Trust Score:</span>
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-extrabold transition-colors ${
                      (provider.trustScore !== undefined ? provider.trustScore : 100) >= 90 ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-indigo-900/30' :
                      (provider.trustScore !== undefined ? provider.trustScore : 100) >= 75 ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/30' :
                      (provider.trustScore !== undefined ? provider.trustScore : 100) >= 60 ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/30' :
                      'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700'
                    }`}>
                      {provider.trustScore !== undefined ? provider.trustScore : 100}/100 ({provider.trustBadge || 'Excellent'})
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                {provider.bio || 'Dedicated local professional committed to top-quality craftsmanship and 100% customer satisfaction.'}
              </p>
            </div>
          )}

          {/* Reviews List */}
          {provider?.reviews && (
            <div className="sc-card-3d p-6 space-y-4 transition-colors">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Customer Reviews ({provider.reviews.length})</h3>

              {provider.reviews.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 italic">No reviews submitted yet for this provider.</p>
              ) : (
                <div className="space-y-3">
                  {provider.reviews.map((rev) => (
                    <div key={rev.reviewId} className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700/50 space-y-1.5 transition-colors">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{rev.customerName}</span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{rev.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Sidebar Summary Card */}
        <div className="space-y-6">
          <div className="sc-card-3d p-6 space-y-4 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 transition-colors">Service Guarantee</h3>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-450 shrink-0 mt-0.5" />
                <span>100% Satisfaction Guarantee</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span>Verified License & Background Check</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Award className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <span>Upfront Transparent Pricing</span>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={() => setIsBookingOpen(true)} className="w-full btn-glow">
                Book This Service
              </Button>
            </div>
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      <Modal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} title={`Book: ${service.title}`}>
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <ErrorMessage message={bookingError} />

          <FormInput
            label="Booking Date"
            type="date"
            name="bookingDate"
            value={bookingForm.bookingDate}
            onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
            required
          />

          <FormInput
            label="Preferred Time Slot"
            type="select"
            name="scheduledTime"
            value={bookingForm.scheduledTime}
            onChange={(e) => setBookingForm({ ...bookingForm, scheduledTime: e.target.value })}
            options={timeSlots}
            required
          />

          <FormInput
            label="Service Address"
            name="address"
            value={bookingForm.address}
            onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
            placeholder="742 Evergreen Terrace"
            required
          />

          <FormInput
            label="City"
            name="city"
            value={bookingForm.city}
            onChange={(e) => setBookingForm({ ...bookingForm, city: e.target.value })}
            placeholder="Springfield"
            required
          />

          <FormInput
            label="Additional Notes / Special Instructions"
            type="textarea"
            name="notes"
            value={bookingForm.notes}
            onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
            placeholder="Describe any specific instructions or issues..."
          />

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs transition-colors">
            <span className="font-semibold text-slate-600 dark:text-slate-400">Total Price:</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">${service.price}</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={bookingLoading} className="btn-glow">
              Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
