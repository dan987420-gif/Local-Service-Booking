import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';

// Pages - Public
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetails } from './pages/ServiceDetails';

// Pages - Customer
import { CustomerDashboard } from './pages/CustomerDashboard';
import { MyBookings } from './pages/MyBookings';
import { BookingDetails } from './pages/BookingDetails';
import { ReviewsPage } from './pages/ReviewsPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { CustomerProfile } from './pages/CustomerProfile';
import { SettingsPage } from './pages/SettingsPage';

// Pages - Provider (Existing)
import { ProviderDashboard } from './pages/ProviderDashboard';
import { ProviderProfilePage } from './pages/ProviderProfilePage';
import { KYCVerification } from './pages/KYCVerification';
import { ProviderRegistration } from './pages/ProviderRegistration';

// Pages - Provider (To create in Phase 2)
import { ProviderServices } from './pages/ProviderServices';
import { ProviderBookings } from './pages/ProviderBookings';
import { Availability } from './pages/Availability';
import { ProviderEarnings } from './pages/ProviderEarnings';
import { ProviderComplaints } from './pages/ProviderComplaints';
import { ProviderAnalytics } from './pages/ProviderAnalytics';
import { ProviderReports } from './pages/ProviderReports';
import { ProviderNotifications } from './pages/ProviderNotifications';
import { EmergencySOS } from './pages/EmergencySOS';
import { CustomerChat } from './pages/CustomerChat';
import { LiveTracking } from './pages/LiveTracking';
import { CertificateUpload } from './pages/CertificateUpload';
import { ProviderReviews } from './pages/ProviderReviews';
import { ProviderSettings } from './pages/ProviderSettings';

// Pages - Admin (To create in Phase 3)
import { AdminDashboard } from './pages/AdminDashboard';
import { UserManagement } from './pages/UserManagement';
import { KYCManagement } from './pages/KYCManagement';
import { ServiceManagement } from './pages/ServiceManagement';
import { BookingManagement } from './pages/BookingManagement';
import { ReviewManagement } from './pages/ReviewManagement';
import { ComplaintManagement } from './pages/ComplaintManagement';
import { NotificationManagement } from './pages/NotificationManagement';
import { Reports } from './pages/Reports';

// Protected Route Wrapper with Role Authorization
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === 'Admin') return <Navigate to="/admin-dashboard" replace />;
    if (user?.role === 'Provider') return <Navigate to="/provider-dashboard" replace />;
    return <Navigate to="/customer-dashboard" replace />;
  }

  return <Outlet />;
};

// Layout for Public Pages
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Layout for Protected Dashboards
const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <div className="flex flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />
        <main className="flex-1 min-w-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 overflow-x-auto transition-colors duration-200">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/provider-register" element={<ProviderRegistration />} />
          <Route path="/provider-registration" element={<ProviderRegistration />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
        </Route>

        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Customer']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/customer-dashboard" element={<CustomerDashboard />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/complaints" element={<ComplaintsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/customer-profile" element={<CustomerProfile />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Shared Booking Details Route (accessible by Customer and Provider) */}
        <Route element={<ProtectedRoute allowedRoles={['Customer', 'Provider', 'Admin']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/bookings/:id" element={<BookingDetails />} />
            <Route path="/customer-chat" element={<CustomerChat />} />
            <Route path="/live-tracking" element={<LiveTracking />} />
          </Route>
        </Route>

        {/* Protected Provider Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Provider']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/provider-dashboard" element={<ProviderDashboard />} />
            <Route path="/provider-profile" element={<ProviderProfilePage />} />
            <Route path="/provider-services" element={<ProviderServices />} />
            <Route path="/provider-bookings" element={<ProviderBookings />} />
            <Route path="/availability" element={<Availability />} />
            <Route path="/provider-earnings" element={<ProviderEarnings />} />
            <Route path="/kyc-verification" element={<KYCVerification />} />
            <Route path="/certificate-upload" element={<CertificateUpload />} />
            <Route path="/provider-reviews" element={<ProviderReviews />} />
            <Route path="/provider-complaints" element={<ProviderComplaints />} />
            <Route path="/provider-analytics" element={<ProviderAnalytics />} />
            <Route path="/provider-reports" element={<ProviderReports />} />
            <Route path="/provider-settings" element={<ProviderSettings />} />
            <Route path="/provider-notifications" element={<ProviderNotifications />} />
            <Route path="/emergency-sos" element={<EmergencySOS />} />
          </Route>
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/kyc-management" element={<KYCManagement />} />
            <Route path="/service-management" element={<ServiceManagement />} />
            <Route path="/booking-management" element={<BookingManagement />} />
            <Route path="/review-management" element={<ReviewManagement />} />
            <Route path="/complaint-management" element={<ComplaintManagement />} />
            <Route path="/notification-management" element={<NotificationManagement />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
        </Route>

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
