import React, { useEffect, useState } from 'react';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Save, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ProviderProfilePage = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    businessName: '',
    bio: '',
    hourlyRate: 0,
    city: '',
    state: '',
    zipCode: '',
    isAvailable: true,
  });

  useEffect(() => {
    userService.getProfile()
      .then((res) => {
        setProfile(res.data);
        const p = res.data.providerProfile || {};
        setFormData({
          fullName: res.data.fullName || '',
          phone: res.data.phone || '',
          businessName: p.businessName || '',
          bio: p.bio || '',
          hourlyRate: p.hourlyRate || 0,
          city: p.city || '',
          state: p.state || '',
          zipCode: p.zipCode || '',
          isAvailable: p.isAvailable ?? true,
        });
      })
      .catch((err) => setError('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      await userService.updateProfile(formData);
      updateUser({ fullName: formData.fullName });
      setMessage('Provider profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading provider profile..." />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Provider Business Profile</h1>
          <p className="text-xs text-slate-500">Update business details, hourly rate, and service availability</p>
        </div>

        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-4 h-4" />
          KYC: {profile?.providerProfile?.isKycVerified || 'Pending'}
        </span>
      </div>

      <div className="sc-card p-6 space-y-6">
        {message && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {message}
          </div>
        )}

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />

            <FormInput
              label="Business / Company Name"
              name="businessName"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <FormInput
              label="Hourly Rate ($)"
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FormInput label="City" name="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
            <FormInput label="State" name="state" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
            <FormInput label="Zip Code" name="zipCode" value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} />
          </div>

          <FormInput
            label="Business Bio & Credentials Summary"
            type="textarea"
            name="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <input
              type="checkbox"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <label htmlFor="isAvailable" className="text-xs font-semibold text-slate-700">
              Available for New Bookings
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" loading={saving} variant="secondary">
              <Save className="w-4 h-4" />
              Update Business Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
