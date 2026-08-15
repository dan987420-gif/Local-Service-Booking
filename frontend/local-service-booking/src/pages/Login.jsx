import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { Wrench, LogIn, Lock, Mail } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authService.login(formData);
      login(res.data);

      if (res.data.role === 'Admin') navigate('/admin-dashboard');
      else if (res.data.role === 'Provider') navigate('/provider-dashboard');
      else navigate('/customer-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCreds = (role) => {
    if (role === 'Customer') setFormData({ email: 'customer@serviceconnect.com', password: 'Password123!' });
    if (role === 'Provider') setFormData({ email: 'electrician@serviceconnect.com', password: 'Password123!' });
    if (role === 'Admin') setFormData({ email: 'admin@serviceconnect.com', password: 'Password123!' });
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="sc-card w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-md">
            <Wrench className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500">Sign in to manage your local service bookings</p>
        </div>

        {/* Demo login shortcuts for college presentation */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">Demo Quick Fill</span>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button type="button" onClick={() => fillDemoCreds('Customer')} className="py-1 px-2 bg-white border border-slate-200 rounded font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600">
              Customer
            </button>
            <button type="button" onClick={() => fillDemoCreds('Provider')} className="py-1 px-2 bg-white border border-slate-200 rounded font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-600">
              Provider
            </button>
            <button type="button" onClick={() => fillDemoCreds('Admin')} className="py-1 px-2 bg-white border border-slate-200 rounded font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-600">
              Admin
            </button>
          </div>
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="user@example.com"
            required
          />

          <FormInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <Button type="submit" loading={loading} className="w-full">
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
