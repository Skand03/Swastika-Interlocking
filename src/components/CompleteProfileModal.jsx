import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';

const CompleteProfileModal = ({ isOpen, onClose, onComplete }) => {
  const { profile, isPhoneInUse } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    city: '',
    pincode: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        city: profile.city || '',
        pincode: profile.pincode || '',
        address: profile.address || ''
      });
    }
  }, [profile]);

  // Check phone uniqueness on blur
  const handlePhoneBlur = async () => {
    if (formData.phone.length !== 10) return;
    // Skip check if phone hasn't changed from existing profile phone
    if (profile?.phone === formData.phone) {
      setPhoneError('');
      return;
    }
    const inUse = await isPhoneInUse(formData.phone);
    if (inUse) {
      setPhoneError('This phone number is already registered. Please use a different number.');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation
    if (!formData.phone || formData.phone.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      setLoading(false);
      return;
    }
    if (!formData.full_name.trim()) {
      setError('Full name is required.');
      setLoading(false);
      return;
    }

    try {
      const { supabase } = await import('../supabase/client');
      const { error: updateError } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', profile.id);

      if (updateError) throw updateError;

      onComplete(formData);
      onClose();
    } catch (err) {
      console.error(err);
      // Parse Supabase error codes into user-friendly messages
      const msg = err?.message || '';
      const code = err?.code || '';

      if (code === '23505' || msg.toLowerCase().includes('unique') || msg.toLowerCase().includes('duplicate')) {
        if (msg.toLowerCase().includes('phone')) {
          setError('This phone number is already registered with another account. Please use a different number.');
        } else {
          setError('This information is already in use. Please check your details and try again.');
        }
      } else if (code === '23502' || msg.toLowerCase().includes('not null')) {
        setError('Please fill in all required fields.');
      } else if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('fetch')) {
        setError('Network error. Please check your internet connection and try again.');
      } else if (msg) {
        setError(msg);
      } else {
        setError('Failed to save profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md mx-4 shadow-xl animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-on-surface">Complete Your Profile</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-variant hover:bg-surface-dim transition-colors flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Full Name</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className="w-full bg-surface border border-outline-variant/50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                setPhoneError('');
                setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }));
              }}
              onBlur={handlePhoneBlur}
              maxLength={10}
              placeholder="10-digit mobile number"
              className={`w-full bg-surface border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none ${phoneError ? 'border-red-400 bg-red-50' : 'border-outline-variant/50'}`}
              required
            />
            {phoneError && (
              <p className="mt-1.5 text-xs text-red-600 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {phoneError}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full bg-surface border border-outline-variant/50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">Pincode</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                maxLength={6}
                className="w-full bg-surface border border-outline-variant/50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Full Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              rows={3}
              className="w-full bg-surface border border-outline-variant/50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="Enter your full delivery address"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !!phoneError}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="animate-spin material-symbols-outlined">hourglass_empty</span>
                Saving...
              </>
            ) : (
              <>
                Save Profile
                <span className="material-symbols-outlined">check_circle</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfileModal;