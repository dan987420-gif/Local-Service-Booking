import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { Wrench, UserPlus, User, Briefcase } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState('Customer'); // Customer or Provider
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    // Provider specific
    businessName: '',
    category: 'Electrician',
    bio: '',
    experienceYears: 2,
    hourlyRate: 50,
    city: '',
    state: '',
    zipCode: '',
  });

  const categories = ['Electrician', 'Plumber', 'Cleaning', 'Appliance Repair', 'Carpentry', 'Painting'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let res;
      if (role === 'Customer') {
        res = await authService.registerCustomer({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
        });
      } else {
        res = await authService.registerProvider({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          businessName: formData.businessName,
          category: formData.category,
          bio: formData.bio,
          experienceYears: parseInt(formData.experienceYears) || 0,
          hourlyRate: parseFloat(formData.hourlyRate) || 0,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        });
      }

      login(res.data);
      navigate(role === 'Provider' ? '/provider-dashboard' : '/customer-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 py-8">
      <div className="sc-card w-full max-w-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-md">
            <Wrench className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
          <p className="text-xs text-slate-500">Join ServiceConnect to book or offer local services</p>
        </div>

        {/* Role toggle */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setRole('Customer')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              role === 'Customer' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('Provider')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              role === 'Provider' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Service Provider
          </button>
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />

            <FormInput
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              required
            />

            <FormInput
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 555-0199"
            />
          </div>

          <FormInput
            label="Street Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main Street"
          />

          {/* Additional fields for Provider */}
          {role === 'Provider' && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h4 className="text-xs font-bold text-teal-700 uppercase tracking-wider">Business & Service Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Business / Company Name"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Apex Plumbing Solutions"
                  required
                />

                <FormInput
                  label="Service Category"
                  type="select"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  options={categories}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Experience (Years)"
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Hourly Rate ($)"
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <FormInput label="City" name="city" value={formData.city} onChange={handleChange} placeholder="Metro City" />
                <FormInput label="State" name="state" value={formData.state} onChange={handleChange} placeholder="NY" />
                <FormInput label="Zip Code" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="10001" />
              </div>

              <FormInput
                label="Provider Bio / Services Description"
                type="textarea"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Brief summary of your expertise and services offered..."
              />
            </div>
          )}

          <Button type="submit" loading={loading} variant={role === 'Provider' ? 'secondary' : 'primary'} className="w-full">
            <UserPlus className="w-4 h-4" />
            Register as {role}
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
