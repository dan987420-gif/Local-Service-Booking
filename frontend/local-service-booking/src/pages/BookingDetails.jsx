import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingService, reviewService, complaintService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Calendar, Clock, MapPin, DollarSign, User, ShieldCheck, Star, AlertCircle, MessageSquare, Navigation, ArrowLeft } from 'lucide-react';

export const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();

  const [booking, setBooking] = useState(null);
  const [history, setHistory] = useState([]);
  const [statusRemarks, setStatusRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintLoading, setComplaintLoading] = useState(false);

  useEffect(() => {
    fetchBookingData();
  }, [id]);

  const fetchBookingData = () => {
    setLoading(true);
    Promise.all([
      bookingService.getBookingById(id),
      bookingService.getStatusHistory(id).catch(() => ({ data: [] }))
    ])
      .then(([bookingRes, historyRes]) => {
        setBooking(bookingRes.data);
        setHistory(historyRes.data);
      })
      .catch((err) => setError('Failed to load booking details.'))
      .finally(() => setLoading(false));
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingService.cancelBooking(id);
      fetchBookingData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await bookingService.updateBookingStatus(id, newStatus, statusRemarks);
      setStatusRemarks('');
      fetchBookingData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      await reviewService.createReview({
        bookingId: parseInt(id),
        rating: reviewRating,
        comment: reviewComment,
      });
      setIsReviewOpen(false);
      fetchBookingData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    setComplaintLoading(true);
    try {
      await complaintService.createComplaint({
        bookingId: parseInt(id),
        subject: complaintSubject,
        description: complaintDesc,
      });
      setIsComplaintOpen(false);
      alert('Complaint registered successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit complaint.');
    } finally {
      setComplaintLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading booking details..." />;
  if (error || !booking) return <div className="p-8 text-center"><ErrorMessage message={error || 'Booking not found.'} /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <Link to={role === 'Provider' ? '/provider-bookings' : '/my-bookings'} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600">
        <ArrowLeft className="w-4 h-4" />
        Back to Bookings
      </Link>

      <div className="sc-card p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400">Booking #BK-{booking.bookingId}</span>
              <StatusBadge status={booking.status} />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">{booking.serviceTitle}</h1>
            <p className="text-xs text-slate-500 font-medium">{booking.serviceCategory} Category</p>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/customer-chat?bookingId=${booking.bookingId}`} className="btn-outline text-xs py-2 px-3">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              Chat
            </Link>
            <Link to={`/live-tracking?bookingId=${booking.bookingId}`} className="btn-secondary text-xs py-2 px-3">
              <Navigation className="w-4 h-4" />
              Live Track
            </Link>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Appointment Details</h4>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Date: {new Date(booking.bookingDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Scheduled Time: {booking.scheduledTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Location: {booking.address}, {booking.city}</span>
            </div>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Parties Information</h4>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              <span>Customer: {booking.customerName} ({booking.customerPhone || booking.customerEmail})</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Provider: {booking.businessName || booking.providerName} ({booking.providerPhone || 'Verified Pro'})</span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200 font-bold text-sm text-slate-900">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Total Price: ${booking.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          
          {/* Customer Actions */}
          {role === 'Customer' && (
            <div className="flex items-center gap-2">
              {['Pending', 'Accepted'].includes(booking.status) && (
                <Button variant="danger" onClick={handleCancelBooking} className="text-xs">
                  Cancel Booking
                </Button>
              )}

              {booking.status === 'Completed' && !booking.hasReview && (
                <Button variant="primary" onClick={() => setIsReviewOpen(true)} className="text-xs">
                  <Star className="w-3.5 h-3.5" />
                  Write Review
                </Button>
              )}

              <Button variant="outline" onClick={() => setIsComplaintOpen(true)} className="text-xs">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Report Issue
              </Button>
            </div>
          )}

          {/* Provider Actions */}
          {role === 'Provider' && (
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <input
                type="text"
                value={statusRemarks}
                onChange={(e) => setStatusRemarks(e.target.value)}
                placeholder="Remarks (optional)..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex items-center gap-2">
                {booking.status === 'Pending' && (
                  <>
                    <Button variant="secondary" onClick={() => handleUpdateStatus('Accepted')} className="text-xs">
                      Accept Booking
                    </Button>
                    <Button variant="danger" onClick={() => handleUpdateStatus('Rejected')} className="text-xs">
                      Reject
                    </Button>
                  </>
                )}

                {booking.status === 'Accepted' && (
                  <Button variant="primary" onClick={() => handleUpdateStatus('InProgress')} className="text-xs">
                    Start Service
                  </Button>
                )}

                {booking.status === 'InProgress' && (
                  <Button variant="secondary" onClick={() => handleUpdateStatus('Completed')} className="text-xs">
                    Mark as Completed
                  </Button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Booking Timeline Section */}
      {history && history.length > 0 && (
        <div className="sc-card p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            🛡 Booking Timeline & Audit Trail
          </h3>
          <div className="relative pl-6 border-l border-slate-200 ml-3 space-y-6">
            {history.map((log) => (
              <div key={log.historyId} className="relative">
                {/* Bullet dot */}
                <div className={`absolute -left-[31px] mt-1.5 w-3.5 h-3.5 rounded-full border-4 border-white shadow ${
                  log.newStatus === 'Completed' ? 'bg-emerald-600' :
                  log.newStatus === 'Cancelled' || log.newStatus === 'Rejected' ? 'bg-rose-600' :
                  log.newStatus === 'InProgress' ? 'bg-amber-500' :
                  'bg-indigo-600'
                }`}></div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {log.newStatus}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        by {log.changedByName} ({log.changedByRole})
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold font-mono whitespace-nowrap">
                      {new Date(log.changedAt).toLocaleString()}
                    </span>
                  </div>
                  {log.remarks && (
                    <p className="text-xs text-slate-500 italic bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-100">
                      "{log.remarks}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Modal */}
      <Modal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} title="Submit Review">
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Rating (1 to 5 Stars)</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="p-1 text-amber-500 hover:scale-110 transition-transform"
                >
                  <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-500' : 'text-slate-200'}`} />
                </button>
              ))}
            </div>
          </div>

          <FormInput
            label="Your Review Comment"
            type="textarea"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Describe your experience with this service provider..."
            required
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsReviewOpen(false)}>Cancel</Button>
            <Button type="submit" loading={reviewLoading}>Submit Review</Button>
          </div>
        </form>
      </Modal>

      {/* Complaint Modal */}
      <Modal isOpen={isComplaintOpen} onClose={() => setIsComplaintOpen(false)} title="Register Complaint">
        <form onSubmit={handleComplaintSubmit} className="space-y-4">
          <FormInput
            label="Subject"
            value={complaintSubject}
            onChange={(e) => setComplaintSubject(e.target.value)}
            placeholder="e.g. Service delayed / Damage issue"
            required
          />

          <FormInput
            label="Detailed Description"
            type="textarea"
            value={complaintDesc}
            onChange={(e) => setComplaintDesc(e.target.value)}
            placeholder="Provide clear details of the issue faced..."
            required
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsComplaintOpen(false)}>Cancel</Button>
            <Button type="submit" loading={complaintLoading} variant="danger">Submit Complaint</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
