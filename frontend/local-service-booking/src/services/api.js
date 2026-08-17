import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('sc_token');
      localStorage.removeItem('sc_user');
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (data) => api.post('/auth/login', data),
  registerCustomer: (data) => api.post('/auth/register', data),
  registerProvider: (data) => api.post('/auth/register-provider', data),
  getCurrentUser: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),
};

// User Profile Services
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

// Provider Services
export const providerService = {
  getAllProviders: (params) => api.get('/providers', { params }),
  getProviderById: (id) => api.get(`/providers/${id}`),
  uploadKyc: (data) => api.post('/providers/kyc', data),
  uploadCertificate: (data) => api.post('/providers/certificate', data),
  getWallet: () => api.get('/providers/wallet'),
  getTrustScore: (id) => api.get(`/providers/${id}/trust-score`),
};

// Services Management
export const serviceService = {
  getAllServices: (params) => api.get('/services', { params }),
  getRecommendedServices: (limit = 6) => api.get(`/services/recommended?limit=${limit}`),
  getServiceById: (id) => api.get(`/services/${id}`),
  createService: (data) => api.post('/services', data),
  updateService: (id, data) => api.put(`/services/${id}`, data),
  deleteService: (id) => api.delete(`/services/${id}`),
};

// Booking Services
export const bookingService = {
  createBooking: (data) => api.post('/bookings', data),
  getCustomerBookings: () => api.get('/bookings/my-bookings'),
  getProviderBookings: () => api.get('/bookings/provider-bookings'),
  getAllBookings: () => api.get('/bookings'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  updateBookingStatus: (id, status, remarks) => api.put(`/bookings/${id}/status`, { status, remarks }),
  cancelBooking: (id) => api.post(`/bookings/${id}/cancel`),
  getStatusHistory: (id) => api.get(`/bookings/${id}/status-history`),
};

// Review Services
export const reviewService = {
  createReview: (data) => api.post('/reviews', data),
  getProviderReviews: (providerId) => api.get(`/reviews/provider/${providerId}`),
  getAllReviews: () => api.get('/reviews'),
};

// Complaint Services
export const complaintService = {
  createComplaint: (data) => api.post('/complaints', data),
  getCustomerComplaints: () => api.get('/complaints/my-complaints'),
  getProviderComplaints: () => api.get('/complaints/provider-complaints'),
  getAllComplaints: () => api.get('/complaints'),
  updateComplaintStatus: (id, status) => api.put(`/complaints/${id}/status`, { status }),
};

// Notification Services
export const notificationService = {
  getUserNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// Admin Services
export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getPendingKyc: () => api.get('/admin/kyc-pending'),
  verifyKyc: (providerId, status) => api.put(`/admin/kyc/${providerId}/verify`, { status }),
  getAllUsers: () => api.get('/admin/users'),
  toggleUserStatus: (userId, isActive) => api.put(`/admin/users/${userId}/status`, { isActive }),
  sendNotification: (data) => api.post('/admin/notifications/send', data),
};

// Report Services
export const reportService = {
  getAdminReport: () => api.get('/reports/admin'),
  getProviderReport: () => api.get('/reports/provider'),
};

// Chat Services
export const chatService = {
  getChatMessages: (bookingId) => api.get(`/chat/booking/${bookingId}`),
  sendMessage: (data) => api.post('/chat/send', data),
};

export default api;
