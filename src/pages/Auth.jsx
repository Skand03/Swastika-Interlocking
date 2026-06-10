import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const GoogleIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// Simple email format check
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Map raw Supabase error messages → user-friendly text
const parseAuthError = (message, isHi) => {
  if (!message) return isHi ? 'अज्ञात त्रुटि।' : 'An unknown error occurred.';
  const m = message.toLowerCase();

  // Specifically handle the "Registration setup issue" error
  if (m.includes('registration setup issue') || m.includes('database error saving new user')) {
    return isHi
      ? 'रजिस्ट्रेशन सेटअप समस्या। कृपया Supabase डैशबोर्ड में "Confirm email" बंद करें।'
      : 'Registration setup issue. Please disable "Confirm email" in your Supabase Auth settings -> Providers -> Email, or configure SMTP.';
  }

  if (m.includes('invalid login credentials') || m.includes('invalid credentials') || m.includes('no password')) {
    return isHi
      ? 'गलत पासवर्ड। कृपया पुनः प्रयास करें।'
      : 'Incorrect password. Please try again.';
  }
  if (m.includes('email rate limit') || m.includes('rate limit') || m.includes('too many requests')) {
    return isHi
      ? 'बहुत अधिक प्रयास किए गए। कृपया 5-10 मिनट बाद दोबारा कोशिश करें।'
      : 'Too many attempts. Please wait 5-10 minutes and try again.';
  }
  if (m.includes('user not found') || m.includes('no such user')) {
    return isHi
      ? 'खाता नहीं मिला। कृपया पहले खाता बनाएं।'
      : 'Account not found. Please create an account first.';
  }
  if (m.includes('user already registered') || m.includes('already registered')) {
    return isHi
      ? 'यह ईमेल पहले से पंजीकृत है। कृपया लॉगिन करें।'
      : 'This email is already registered. Please sign in instead.';
  }
  if ((m.includes('unique') || m.includes('duplicate') || m.includes('23505')) && m.includes('phone')) {
    return isHi
      ? 'यह फोन नंबर पहले से पंजीकृत है! कृपया दूसरा फोन नंबर उपयोग करें।'
      : 'This phone number is already registered. Please use a different phone number.';
  }
  if (m.includes('password') && (m.includes('weak') || m.includes('short'))) {
    return isHi
      ? 'पासवर्ड बहुत कमजोर है। कम से कम 6 अक्षर उपयोग करें।'
      : 'Password is too weak. Use at least 6 characters.';
  }
  if (m.includes('network') || m.includes('fetch')) {
    return isHi
      ? 'नेटवर्क त्रुटि। इंटरनेट कनेक्शन जांचें।'
      : 'Network error. Please check your internet connection.';
  }
  // Return raw message if no specific match — still better than generic
  return message || (isHi ? 'कुछ गलत हुआ। कृपया पुनः प्रयास करें।' : 'Something went wrong. Please try again.');
};

export default function Auth({ language }) {
  const navigate = useNavigate();
  const {
    profile,
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail,
    resetPassword,
    authError,
    setAuthError,
    session,
    checkEmailExists,
    supabase,
  } = useAuth();

  const isHi = language === 'hi';
  const [panel, setPanel] = useState('login'); // 'login' | 'register' | 'forgot' | 'reset'

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPincode, setRegPincode] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');

  // Reset password
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const [statusMsg, setStatusMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if we're in password reset mode (only if URL has recovery token)
  useEffect(() => {
    // Only show reset password form if URL has recovery params (from email link)
    const hash = window.location.hash;
    if (hash && (hash.includes('type=recovery') || hash.includes('access_token'))) {
      setPanel('reset');
    }
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (profile && panel !== 'reset') {
      navigate(profile.role === 'admin' ? '/admin-dashboard' : '/customer-dashboard', { replace: true });
    }
  }, [profile, navigate, panel]);

  // Sync auth errors from context
  useEffect(() => {
    if (authError) {
      setStatusMsg(parseAuthError(authError, isHi));
      setIsSuccess(false);
    }
  }, [authError]);

  // Clear messages when switching panels
  useEffect(() => {
    setStatusMsg('');
    setAuthError('');
  }, [panel, setAuthError]);

  const onlyDigits = (val, maxLen) => val.replace(/\D/g, '').slice(0, maxLen);

  // ── Login ─────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    if (!loginEmail || !loginPassword) {
      setStatusMsg(isHi ? 'ईमेल और पासवर्ड आवश्यक हैं।' : 'Email and password are required.');
      setIsSuccess(false);
      return;
    }
    if (!isValidEmail(loginEmail)) {
      setStatusMsg(isHi ? 'कृपया सही ईमेल दर्ज करें। (जैसे: name@gmail.com)' : 'Please enter a valid email address. (e.g., name@gmail.com)');
      setIsSuccess(false);
      return;
    }
    setLoading(true);

    const emailExists = await checkEmailExists(loginEmail);
    if (!emailExists) {
      setLoading(false);
      setIsSuccess(false);
      setStatusMsg(isHi ? 'खाता नहीं मिला। कृपया पहले खाता बनाएं।' : 'No account exists with this email address. Please create an account first.');
      return;
    }

    const result = await signInWithEmail(loginEmail, loginPassword);
    setLoading(false);
    if (!result.success) {
      setIsSuccess(false);
      setStatusMsg(parseAuthError(result.message, isHi));
    }
  };

  // ── Google ────────────────────────────────────────────────
  const handleGoogle = async () => {
    setLoading(true);
    await signInWithGoogle();
    setLoading(false);
  };

  // ── Register ──────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setStatusMsg('');

    if (!regName || !regEmail || !regPhone || !regCity || !regAddress || !regPincode || !regPassword) {
      setStatusMsg(isHi ? 'कृपया सभी फ़ील्ड भरें।' : 'Please fill all fields.');
      setIsSuccess(false);
      return;
    }
    if (!isValidEmail(regEmail)) {
      setStatusMsg(isHi ? 'कृपया सही ईमेल दर्ज करें। (जैसे: name@gmail.com)' : 'Please enter a valid email address. (e.g., name@gmail.com)');
      setIsSuccess(false);
      return;
    }
    if (regPhone.length !== 10) {
      setStatusMsg(isHi ? 'फ़ोन नंबर ठीक 10 अंकों का होना चाहिए।' : 'Phone number must be exactly 10 digits.');
      setIsSuccess(false);
      return;
    }
    if (regPincode.length !== 6) {
      setStatusMsg(isHi ? 'पिनकोड ठीक 6 अंकों का होना चाहिए।' : 'Pincode must be exactly 6 digits.');
      setIsSuccess(false);
      return;
    }
    if (regPassword.length < 6) {
      setStatusMsg(isHi ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters.');
      setIsSuccess(false);
      return;
    }
    if (regPassword !== regConfirm) {
      setStatusMsg(isHi ? 'पासवर्ड मेल नहीं खाते।' : 'Passwords do not match.');
      setIsSuccess(false);
      return;
    }
    if (!agreeTerms) {
      setStatusMsg(isHi ? 'कृपया नियम और शर्तों से सहमत हों।' : 'Please agree to the Terms & Conditions.');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    const result = await signUpWithEmail(regEmail, regPassword, {
      full_name: regName,
      phone: regPhone,
      city: regCity,
      address: regAddress,
      pincode: regPincode,
    });
    setLoading(false);

    if (result.success) {
      setIsSuccess(true);
      setStatusMsg(
        isHi
          ? 'रजिस्ट्रेशन सफल! आपका स्वागत है।'
          : 'Registration successful! Welcome to Swastika Interlocking.'
      );
      // Explicitly navigate since auth listener might miss the newly created profile initially
      setTimeout(() => {
        navigate('/customer-dashboard', { replace: true });
      }, 1500);
    } else {
      setIsSuccess(false);
      setStatusMsg(parseAuthError(result.message, isHi));
    }
  };

  // ── Forgot Password ───────────────────────────────────────
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    if (!forgotEmail) {
      setStatusMsg(isHi ? 'ईमेल दर्ज करें।' : 'Please enter your email.');
      setIsSuccess(false);
      return;
    }
    if (!isValidEmail(forgotEmail)) {
      setStatusMsg(isHi ? 'कृपया सही ईमेल दर्ज करें।' : 'Please enter a valid email address.');
      setIsSuccess(false);
      return;
    }
    setLoading(true);

    const result = await resetPassword(forgotEmail);
    setLoading(false);
    if (result.success) {
      setIsSuccess(true);
      setStatusMsg(
        isHi
          ? 'पासवर्ड रीसेट लिंक सफलतापूर्वक भेजा गया! अपना ईमेल चेक करें।'
          : 'Password reset link sent successfully. Please check your email.'
      );
    } else {
      setIsSuccess(false);
      setStatusMsg(parseAuthError(result.message, isHi));
    }
  };

  // ── Reset Password ────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    if (!newPassword || !confirmNewPassword) {
      setStatusMsg(isHi ? 'कृपया दोनों फ़ील्ड भरें।' : 'Please fill in both fields.');
      setIsSuccess(false);
      return;
    }
    if (newPassword.length < 6) {
      setStatusMsg(isHi ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters.');
      setIsSuccess(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setStatusMsg(isHi ? 'पासवर्ड मेल नहीं खाते।' : 'Passwords do not match.');
      setIsSuccess(false);
      return;
    }
    setResetLoading(true);
    try {
      if (!supabase) throw new Error('Supabase not configured');
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setIsSuccess(true);
      setStatusMsg(isHi ? 'पासवर्ड सफलतापूर्वक बदला गया! लॉगिन करें।' : 'Password updated successfully! Please log in.');
      // Sign out the user after password reset
      await supabase.auth.signOut();
      setPanel('login');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setIsSuccess(false);
      setStatusMsg(parseAuthError(err.message, isHi));
    } finally {
      setResetLoading(false);
    }
  };

  // ── Shared UI ─────────────────────────────────────────────
  const inputCls = 'w-full border border-outline/20 bg-surface-container-low rounded-lg p-3 text-sm font-semibold outline-none focus:ring-1 focus:ring-primary transition-all';

  const StatusBanner = () => statusMsg ? (
    <div className={`flex items-start gap-3 p-4 rounded-xl mb-5 border-2 shadow-md ${
      isSuccess
        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-400'
        : 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-400'
    }`}>
      <span className="material-symbols-outlined text-xl text-white shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
        {isSuccess ? 'check_circle' : 'error'}
      </span>
      <p className="text-sm font-medium leading-relaxed">{statusMsg}</p>
    </div>
  ) : null;

  const Divider = () => (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-outline/15" />
      <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">{isHi ? 'या' : 'or'}</span>
      <div className="flex-1 h-px bg-outline/15" />
    </div>
  );

  const GoogleBtn = ({ label }) => (
    <button
      type="button"
      onClick={handleGoogle}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 bg-white border-2 border-outline/20 py-3 rounded-full font-bold text-sm text-on-surface hover:bg-surface-container hover:border-primary/30 transition-all active:scale-95 shadow-sm cursor-pointer disabled:opacity-50"
    >
      <GoogleIcon />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface text-on-surface pt-16 select-none">

      {/* Left branding panel */}
      <div className="bg-[#1C2B1A] w-full md:w-1/2 flex flex-col justify-center items-center p-8 text-center py-12">
        <div className="max-w-sm space-y-6">
          <img alt="Swastika Interlocking Logo" className="w-28 h-28 mx-auto object-contain bg-white rounded-full p-2 shadow-lg" src="/logo.svg" />
          <h1 className="font-display-lg text-2xl md:text-3xl text-white font-bold leading-tight">
            {isHi ? 'स्वस्तिका इंटरलॉकिंग' : 'Swastika Interlocking'}
          </h1>
          <p className="text-lg text-[#E8650A] font-semibold">
            {isHi ? 'निर्माण में विश्वास' : 'Trusted in Construction'}
          </p>
          <div className="space-y-4 text-left text-white pt-4">
            {[
              isHi ? 'प्रीमियम गुणवत्ता' : 'Premium Quality',
              isHi ? 'समय पर डिलीवरी' : 'Timely Delivery',
              isHi ? 'सर्वोत्तम बाजार मूल्य' : 'Best Market Price',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#E8650A]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-sm font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="bg-[#FAF7F2] w-full md:w-1/2 flex items-center justify-center p-6 py-12">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-outline/10">

          <StatusBanner />

          {/* ── LOGIN ── */}
          {panel === 'login' && (
            <>
              <h2 className="text-xl text-[#E8650A] mb-6 text-center font-bold">
                {isHi ? 'Login करें' : 'Sign In'}
              </h2>

              <GoogleBtn label={isHi ? 'Google से लॉगिन करें' : 'Continue with Google'} />
              <Divider />

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    {isHi ? 'ईमेल' : 'Email Address'}
                  </label>
                  <div className="flex border border-outline/20 rounded-lg overflow-hidden bg-surface-container-low focus-within:ring-1 focus-within:ring-primary">
                    <span className="flex items-center px-3 bg-surface-variant text-on-surface-variant border-r border-outline/10">
                      <span className="material-symbols-outlined text-lg">mail</span>
                    </span>
                    <input
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="flex-1 bg-transparent p-3 outline-none text-sm font-semibold"
                      placeholder="your@email.com"
                      type="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    {isHi ? 'पासवर्ड' : 'Password'}
                  </label>
                  <div className="flex border border-outline/20 rounded-lg overflow-hidden bg-surface-container-low focus-within:ring-1 focus-within:ring-primary">
                    <span className="flex items-center px-3 bg-surface-variant text-on-surface-variant border-r border-outline/10">
                      <span className="material-symbols-outlined text-lg">lock</span>
                    </span>
                    <input
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="flex-1 bg-transparent p-3 outline-none text-sm font-semibold"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={isHi ? 'पासवर्ड दर्ज करें' : 'Enter password'}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="px-3 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => { setPanel('forgot'); setForgotEmail(loginEmail); }}
                    className="text-xs text-primary hover:underline cursor-pointer"
                  >
                    {isHi ? 'पासवर्ड भूल गए?' : 'Forgot password?'}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#E8650A] hover:brightness-110 text-white w-full py-3.5 rounded-full font-bold transition-all active:scale-95 cursor-pointer shadow-md text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading
                    ? <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>{isHi ? 'लॉगिन हो रहा है...' : 'Signing in...'}</>
                    : <><span className="material-symbols-outlined text-lg">login</span>{isHi ? 'Login करें' : 'Sign In'}</>
                  }
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-on-surface-variant">
                {isHi ? 'रजिस्टर नहीं किया?' : 'New here?'}{' '}
                <button onClick={() => setPanel('register')} className="text-[#E8650A] font-extrabold hover:underline cursor-pointer">
                  {isHi ? 'अकाउंट बनाएं' : 'Create Account'}
                </button>
              </p>
            </>
          )}

          {/* ── REGISTER ── */}
          {panel === 'register' && (
            <>
              <h2 className="text-xl text-[#E8650A] mb-5 text-center font-bold">
                {isHi ? 'नया अकाउंट बनाएं' : 'Create Account'}
              </h2>

              <GoogleBtn label={isHi ? 'Google से साइन अप करें' : 'Sign up with Google'} />
              <Divider />

              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">{isHi ? 'पूरा नाम' : 'Full Name'}</label>
                  <input value={regName} onChange={(e) => setRegName(e.target.value)} className={inputCls} type="text" placeholder={isHi ? 'पूरा नाम' : 'Full Name'} required />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">{isHi ? 'ईमेल' : 'Email Address'}</label>
                  <input value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className={inputCls} type="email" placeholder="your@email.com" required />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">{isHi ? 'फोन नंबर' : 'Phone Number'}</label>
                  <input
                    value={regPhone}
                    onChange={(e) => setRegPhone(onlyDigits(e.target.value, 10))}
                    className={inputCls}
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">{isHi ? 'शहर' : 'City'}</label>
                    <input value={regCity} onChange={(e) => setRegCity(e.target.value)} className={inputCls} type="text" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">{isHi ? 'पिनकोड' : 'Pincode'}</label>
                    <input
                      value={regPincode}
                      onChange={(e) => setRegPincode(onlyDigits(e.target.value, 6))}
                      className={inputCls}
                      type="text"
                      placeholder="110001"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">{isHi ? 'पूरा पता' : 'Full Address'}</label>
                  <textarea value={regAddress} onChange={(e) => setRegAddress(e.target.value)} className={inputCls} rows="2" placeholder={isHi ? 'गली, लोकेलिटी, लैंडमार्क' : 'Street, locality, landmark'} required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">{isHi ? 'पासवर्ड' : 'Password'}</label>
                    <input value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className={inputCls} type="password" placeholder="Min 6 chars" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">{isHi ? 'पुष्टि करें' : 'Confirm'}</label>
                    <input value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} className={inputCls} type="password" placeholder="Confirm" required />
                  </div>
                </div>

                <div className="flex items-start gap-3 py-1">
                  <input checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-1 rounded text-primary cursor-pointer" type="checkbox" />
                  <label className="text-xs text-on-surface-variant font-medium select-none">
                    {isHi ? 'मैं ' : 'I agree to the '}
                    <button type="button" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} className="text-[#E8650A] font-extrabold hover:underline cursor-pointer">
                      {isHi ? 'नियम और शर्तों' : 'Terms & Conditions'}
                    </button>
                    {isHi ? ' से सहमत हूँ।' : '.'}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#E8650A] hover:brightness-110 text-white w-full py-3.5 rounded-full font-bold transition-all active:scale-95 cursor-pointer shadow-md text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading
                    ? <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span> Registering...</>
                    : <><span className="material-symbols-outlined text-lg">person_add</span>{isHi ? 'रजिस्टर करें' : 'Create Account'}</>
                  }
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-on-surface-variant">
                {isHi ? 'अकाउंट पहले से है?' : 'Already have an account?'}{' '}
                <button onClick={() => setPanel('login')} className="text-[#E8650A] font-bold hover:underline cursor-pointer">Login</button>
              </p>
            </>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {panel === 'forgot' && (
            <>
              <div className="text-center mb-6">
                <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>lock_reset</span>
                <h2 className="text-xl text-[#E8650A] mt-2 font-bold">
                  {isHi ? 'पासवर्ड रीसेट करें' : 'Reset Password'}
                </h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  {isHi
                    ? 'हम आपके ईमेल पर रीसेट लिंक भेजेंगे। Google से लॉगिन करने वाले उपयोगकर्ता इससे पासवर्ड सेट कर सकते हैं।'
                    : "We'll send a reset link to your email. Google sign-in users can also use this to set a password."}
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">{isHi ? 'ईमेल' : 'Email Address'}</label>
                  <input
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className={inputCls}
                    type="email"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#E8650A] hover:brightness-110 text-white w-full py-3.5 rounded-full font-bold transition-all active:scale-95 cursor-pointer shadow-md text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading
                    ? <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>{isHi ? 'भेजा जा रहा है...' : 'Sending...'}</>
                    : <><span className="material-symbols-outlined text-lg">send</span>{isHi ? 'रीसेट लिंक भेजें' : 'Send Reset Link'}</>
                  }
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-on-surface-variant">
                <button onClick={() => setPanel('login')} className="text-[#E8650A] font-bold hover:underline cursor-pointer flex items-center gap-1 mx-auto">
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  {isHi ? 'वापस लॉगिन पर जाएं' : 'Back to Login'}
                </button>
              </p>
            </>
          )}

          {/* ── RESET PASSWORD ── */}
          {panel === 'reset' && (
            <>
              <div className="text-center mb-6">
                <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>lock</span>
                <h2 className="text-xl text-[#E8650A] mt-2 font-bold">
                  {isHi ? 'नया पासवर्ड सेट करें' : 'Set New Password'}
                </h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  {isHi
                    ? 'कृपया अपना नया पासवर्ड डालें।'
                    : "Please enter your new password."}
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">{isHi ? 'नया पासवर्ड' : 'New Password'}</label>
                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputCls}
                    type="password"
                    placeholder={isHi ? 'कम से कम 6 अक्षर' : 'Min 6 characters'}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">{isHi ? 'पासवर्ड पुष्टि करें' : 'Confirm New Password'}</label>
                  <input
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className={inputCls}
                    type="password"
                    placeholder={isHi ? 'पासवर्ड फिर से डालें' : 'Re-enter password'}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="bg-[#E8650A] hover:brightness-110 text-white w-full py-3.5 rounded-full font-bold transition-all active:scale-95 cursor-pointer shadow-md text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {resetLoading
                    ? <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>{isHi ? 'अपडेट हो रहा है...' : 'Updating...'}</>
                    : <><span className="material-symbols-outlined text-lg">check_circle</span>{isHi ? 'पासवर्ड बदलें' : 'Update Password'}</>
                  }
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-on-surface-variant">
                <button onClick={() => setPanel('login')} className="text-[#E8650A] font-bold hover:underline cursor-pointer flex items-center gap-1 mx-auto">
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  {isHi ? 'वापस लॉगिन पर जाएं' : 'Back to Login'}
                </button>
              </p>
            </>
          )}

        </div>
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-outline/10">
            <div className="bg-[#1C2B1A] text-white p-5 flex justify-between items-center">
              <h3 className="font-bold text-base">
                {isHi ? 'नियम और शर्तें — स्वस्तिका इंटरलॉकिंग' : 'Terms & Conditions — Swastika Interlocking'}
              </h3>
              <button onClick={() => setShowTermsModal(false)} className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-sm leading-relaxed text-on-surface-variant">
              {isHi ? (
                <>
                  <h4 className="font-bold text-on-surface">1. सामान्य नियम</h4>
                  <p>स्वस्तिका इंटरलॉकिंग में आपका स्वागत है। हमारी सेवाएं और उत्पाद खरीदने पर ये शर्तें लागू होती हैं।</p>
                  <h4 className="font-bold text-on-surface">2. उत्पाद की गुणवत्ता</h4>
                  <p>हम स्वीकृत मानकों के अनुसार निर्मित पेवर ब्लॉक, सीमेंट और पाइप प्रदान करते हैं।</p>
                  <h4 className="font-bold text-on-surface">3. डिलीवरी और परिवहन</h4>
                  <p>डिलीवरी का किराया ग्राहक द्वारा वहन किया जाएगा।</p>
                  <h4 className="font-bold text-on-surface">4. भुगतान की शर्तें</h4>
                  <p>ऑर्डर की पुष्टि के लिए कम से कम 50% अग्रिम भुगतान आवश्यक है।</p>
                </>
              ) : (
                <>
                  <h4 className="font-bold text-on-surface">1. General Overview</h4>
                  <p>Welcome to Swastika Interlocking. These terms govern the use of our services and supply of materials.</p>
                  <h4 className="font-bold text-on-surface">2. Product Quality</h4>
                  <p>We provide paver blocks, cement, and RCC pipes manufactured to approved standards (IS:15658).</p>
                  <h4 className="font-bold text-on-surface">3. Delivery & Transport</h4>
                  <p>Transportation charges to the delivery site are borne by the customer.</p>
                  <h4 className="font-bold text-on-surface">4. Payment Terms</h4>
                  <p>A minimum of 50% advance payment is required to confirm any order.</p>
                </>
              )}
            </div>
            <div className="p-4 border-t border-outline/10 flex justify-end">
              <button
                onClick={() => { setShowTermsModal(false); setAgreeTerms(true); }}
                className="bg-[#E8650A] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:brightness-110 cursor-pointer"
              >
                {isHi ? 'मैं सहमत हूँ' : 'I Agree'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
