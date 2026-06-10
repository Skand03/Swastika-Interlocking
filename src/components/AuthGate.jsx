import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

/**
 * AuthGate — wraps any page/section that requires login.
 * Shows a "please register/login" prompt if the user is not authenticated.
 * While auth is loading, shows a spinner.
 */
export default function AuthGate({ language, children, message }) {
  const { user, loading } = useAuth();
  const isHi = language === 'hi';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-5xl text-primary animate-spin">autorenew</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              lock
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-on-surface mb-3">
            {isHi ? 'लॉगिन आवश्यक है' : 'Login Required'}
          </h2>

          {/* Message */}
          <p className="text-on-surface-variant mb-8 leading-relaxed">
            {message || (isHi
              ? 'ऑर्डर बुक करने या पूछताछ करने के लिए कृपया पहले अपना अकाउंट बनाएं या लॉगिन करें।'
              : 'Please create an account or sign in to place an order or submit an enquiry.'
            )}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/auth"
              state={{ intent: 'register' }}
              className="flex-1 sm:flex-none px-8 py-3.5 bg-primary text-white font-bold rounded-full hover:brightness-110 transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">person_add</span>
              {isHi ? 'रजिस्टर करें' : 'Create Account'}
            </Link>
            <Link
              to="/auth"
              className="flex-1 sm:flex-none px-8 py-3.5 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary/5 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">login</span>
              {isHi ? 'लॉगिन करें' : 'Sign In'}
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 pt-6 border-t border-outline/10 grid grid-cols-3 gap-4 text-xs text-on-surface-variant">
            <div className="flex flex-col items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              {isHi ? 'मुफ्त रजिस्ट्रेशन' : 'Free Registration'}
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>order_approve</span>
              {isHi ? 'ऑर्डर ट्रैकिंग' : 'Order Tracking'}
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
              {isHi ? '24/7 सहायता' : '24/7 Support'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
