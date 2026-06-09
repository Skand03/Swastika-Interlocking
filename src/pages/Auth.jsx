import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Auth({ language }) {
  const navigate = useNavigate();
  const { dbUser, loginWithEmail, loginWithGoogle, registerWithEmail, completeGoogleProfile, authError, setAuthError } = useAuth();

  const [panel, setPanel] = useState('login'); // 'login', 'register', 'google-profile'
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

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

  // Google profile completion fields
  const [googlePhone, setGooglePhone] = useState('');
  const [googleCity, setGoogleCity] = useState('');
  const [googleAddress, setGoogleAddress] = useState('');
  const [googlePincode, setGooglePincode] = useState('');
  const [googleName, setGoogleName] = useState('');

  const [statusMsg, setStatusMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (dbUser) {
      if (dbUser.role === 'admin') {
        window.location.href = '#/admin-dashboard';
      } else {
        window.location.href = '#/customer-dashboard';
      }
    }
  }, [dbUser]);

  // Clear errors on panel switch
  useEffect(() => {
    setStatusMsg('');
    setAuthError('');
  }, [panel, setAuthError]);

  // Show auth errors from context
  useEffect(() => {
    if (authError) {
      setStatusMsg(authError);
      setIsSuccess(false);
    }
  }, [authError]);

  const handlePhoneChange = (val, setter) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 10);
    setter(cleaned);
  };

  // --- Email/Password Login ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('');

    if (!loginEmail || !loginPassword) {
      setStatusMsg(language === 'hi' ? 'ईमेल और पासवर्ड आवश्यक हैं।' : 'Email and password are required.');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    const result = await loginWithEmail(loginEmail, loginPassword);
    setLoading(false);

    if (result.success) {
      setIsSuccess(true);
      setStatusMsg(language === 'hi' ? 'लॉगिन सफल! रीडायरेक्ट हो रहा है...' : 'Login successful! Redirecting...');
      setTimeout(() => {
        window.location.href = result.user.role === 'admin' ? '#/admin-dashboard' : '#/customer-dashboard';
        window.location.reload();
      }, 800);
    } else {
      setIsSuccess(false);
      setStatusMsg(result.message);
    }
  };

  // --- Google Sign-In ---
  const handleGoogleSignIn = async () => {
    setStatusMsg('');
    setLoading(true);
    const result = await loginWithGoogle();
    setLoading(false);

    if (result.success && result.needsProfile) {
      // Google auth succeeded but user doesn't exist in our DB yet — need phone + city
      setGoogleName(result.firebaseUser?.displayName || '');
      setPanel('google-profile');
      setStatusMsg(language === 'hi' ? 'Google से लॉगिन सफल! कृपया अपना प्रोफाइल पूरा करें।' : 'Google sign-in successful! Please complete your profile.');
      setIsSuccess(true);
    } else if (result.success && !result.needsProfile) {
      setIsSuccess(true);
      setStatusMsg(language === 'hi' ? 'लॉगिन सफल! रीडायरेक्ट हो रहा है...' : 'Login successful! Redirecting...');
      setTimeout(() => {
        window.location.href = result.user.role === 'admin' ? '#/admin-dashboard' : '#/customer-dashboard';
        window.location.reload();
      }, 800);
    } else {
      setIsSuccess(false);
      setStatusMsg(result.message);
    }
  };

  // --- Google Profile Completion ---
  const handleGoogleProfileSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('');

    if (!googlePhone || googlePhone.length !== 10) {
      setStatusMsg(language === 'hi' ? 'फ़ोन नंबर ठीक 10 अंकों का होना चाहिए।' : 'Phone number must be exactly 10 digits.');
      setIsSuccess(false);
      return;
    }

    if (!googlePincode || googlePincode.length !== 6) {
      setStatusMsg(language === 'hi' ? 'पिनकोड ठीक 6 अंकों का होना चाहिए।' : 'Pincode must be exactly 6 digits.');
      setIsSuccess(false);
      return;
    }

    if (!googleAddress) {
      setStatusMsg(language === 'hi' ? 'कृपया पूरा पता दर्ज करें।' : 'Please enter your full address.');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    const result = await completeGoogleProfile(googlePhone, googleCity, googleAddress, googlePincode, googleName);
    setLoading(false);

    if (result.success) {
      setIsSuccess(true);
      setStatusMsg(language === 'hi' ? 'प्रोफाइल पूरा हुआ! रीडायरेक्ट हो रहा है...' : 'Profile completed! Redirecting...');
      setTimeout(() => {
        window.location.href = result.user.role === 'admin' ? '#/admin-dashboard' : '#/customer-dashboard';
        window.location.reload();
      }, 800);
    } else {
      setIsSuccess(false);
      setStatusMsg(result.message);
    }
  };

  // --- Registration ---
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('');

    if (!regName || !regEmail || !regPhone || !regCity || !regAddress || !regPincode || !regPassword) {
      setStatusMsg(language === 'hi' ? 'कृपया सभी फ़ील्ड भरें।' : 'Please fill all fields.');
      setIsSuccess(false);
      return;
    }

    if (regPhone.length !== 10) {
      setStatusMsg(language === 'hi' ? 'फ़ोन नंबर ठीक 10 अंकों का होना चाहिए।' : 'Phone number must be exactly 10 digits.');
      setIsSuccess(false);
      return;
    }

    if (regPincode.length !== 6) {
      setStatusMsg(language === 'hi' ? 'पिनकोड ठीक 6 अंकों का होना चाहिए।' : 'Pincode must be exactly 6 digits.');
      setIsSuccess(false);
      return;
    }

    if (regPassword.length < 6) {
      setStatusMsg(language === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters.');
      setIsSuccess(false);
      return;
    }

    if (regPassword !== regConfirm) {
      setStatusMsg(language === 'hi' ? 'पासवर्ड मेल नहीं खाते।' : 'Passwords do not match.');
      setIsSuccess(false);
      return;
    }

    if (!agreeTerms) {
      setStatusMsg(language === 'hi' ? 'कृपया सेवा की शर्तों से सहमत हों।' : 'Please agree to the terms.');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    const result = await registerWithEmail(regEmail, regPassword, regName, regPhone, regCity, regAddress, regPincode);
    setLoading(false);

    if (result.success) {
      setIsSuccess(true);
      setStatusMsg(language === 'hi' ? 'रजिस्ट्रेशन सफल! रीडायरेक्ट हो रहा है...' : 'Registration successful! Redirecting...');
      setTimeout(() => {
        window.location.href = result.user.role === 'admin' ? '#/admin-dashboard' : '#/customer-dashboard';
        window.location.reload();
      }, 1000);
    } else {
      setIsSuccess(false);
      setStatusMsg(result.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface text-on-surface pt-16 select-none animate-fade-in">
      
      {/* Left branding panel */}
      <div className="bg-[#1C2B1A] w-full md:w-1/2 flex flex-col justify-center items-center p-gutter text-center py-12">
        <div className="max-w-md space-y-6">
          <img 
            alt="Swastika Interlocking Logo" 
            className="w-32 h-32 mx-auto object-contain bg-white rounded-full p-2 shadow-lg" 
            src="/logo.svg" 
          />
          <h1 className="font-display-lg text-2xl md:text-3xl text-white leading-tight font-bold">
            {language === 'hi' ? 'स्वस्तिका इंटरलॉकिंग' : 'Swastika Interlocking'}
          </h1>
          <p className="font-headline-md text-lg text-[#E8650A] font-semibold">
            {language === 'hi' ? 'निर्माण में विश्वास' : 'Trusted in Construction'}
          </p>
          <div className="space-y-4 text-left inline-block text-white pt-6">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#E8650A]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="text-sm font-semibold">{language === 'hi' ? 'प्रीमियम गुणवत्ता' : 'Premium Quality'}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#E8650A]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="text-sm font-semibold">{language === 'hi' ? 'समय पर डिलीवरी' : 'Timely Delivery'}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#E8650A]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="text-sm font-semibold">{language === 'hi' ? 'सर्वोत्तम बाजार मूल्य' : 'Best Market Price'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="bg-[#FAF7F2] w-full md:w-1/2 flex items-center justify-center p-gutter py-12">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-outline/10">
          
          {statusMsg && (
            <div className={`flex items-start gap-3 p-4 rounded-xl mb-6 border-2 shadow-md transition-all duration-500 ${
              isSuccess
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-400'
                : 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-400'
            }`}>
              <span className="material-symbols-outlined text-xl text-white shrink-0 mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>
                {isSuccess ? 'check_circle' : 'error'}
              </span>
              <div>
                <p className="font-bold text-sm">{isSuccess ? '✅ Success!' : '❌ Error'}</p>
                <p className="text-white/90 text-xs mt-0.5">{statusMsg}</p>
              </div>
            </div>
          )}

          {/* ====== LOGIN PANEL ====== */}
          {panel === 'login' && (
            <div>
              <h2 className="font-headline-md text-xl text-[#E8650A] mb-6 text-center font-bold">
                {language === 'hi' ? 'Login करें' : 'Sign In'}
              </h2>
              
              {/* Google Sign-In Button */}
              <button 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-outline/20 py-3.5 rounded-full font-bold text-sm text-on-surface hover:bg-surface-container hover:border-primary/30 transition-all active:scale-95 shadow-sm mb-5 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {language === 'hi' ? 'Google से लॉगिन करें' : 'Continue with Google'}
              </button>

              <div className="flex items-center gap-4 mb-5">
                <div className="flex-1 h-px bg-outline/15"></div>
                <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">{language === 'hi' ? 'या' : 'or'}</span>
                <div className="flex-1 h-px bg-outline/15"></div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-2">
                    {language === 'hi' ? 'ईमेल' : 'Email Address'}
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
                  <label className="block text-xs font-bold text-on-surface-variant mb-2">
                    {language === 'hi' ? 'पासवर्ड' : 'Password'}
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
                      placeholder="Enter password"
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

                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-[#E8650A] hover:brightness-110 text-white w-full py-4 rounded-full font-bold transition-all active:scale-95 cursor-pointer shadow-md text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span> {language === 'hi' ? 'लॉगिन हो रहा है...' : 'Signing in...'}</>
                  ) : (
                    <><span className="material-symbols-outlined text-lg">login</span> {language === 'hi' ? 'Login करें' : 'Sign In'}</>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center text-xs">
                <p className="text-on-surface-variant">
                  {language === 'hi' ? 'रजिस्टर नहीं किया?' : 'New here?'}{' '}
                  <button 
                    onClick={() => setPanel('register')}
                    className="text-[#E8650A] font-extrabold hover:underline cursor-pointer"
                  >
                    {language === 'hi' ? 'अकाउंट बनाएं' : 'Create Account'}
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ====== REGISTER PANEL ====== */}
          {panel === 'register' && (
            <div>
              <h2 className="font-headline-md text-xl text-[#E8650A] mb-6 text-center font-bold">
                {language === 'hi' ? 'नया अकाउंट बनाएं' : 'Create Account'}
              </h2>

              {/* Google Sign-In Button */}
              <button 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-outline/20 py-3 rounded-full font-bold text-sm text-on-surface hover:bg-surface-container hover:border-primary/30 transition-all active:scale-95 shadow-sm mb-4 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {language === 'hi' ? 'Google से साइन अप करें' : 'Sign up with Google'}
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-px bg-outline/15"></div>
                <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">{language === 'hi' ? 'या' : 'or'}</span>
                <div className="flex-1 h-px bg-outline/15"></div>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    {language === 'hi' ? 'पूरा नाम' : 'Full Name'}
                  </label>
                  <input 
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full border border-outline/20 bg-surface-container-low focus:ring-primary focus:border-primary rounded-lg p-2.5 text-sm font-semibold outline-none" 
                    type="text"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    {language === 'hi' ? 'ईमेल' : 'Email Address'}
                  </label>
                  <input 
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full border border-outline/20 bg-surface-container-low focus:ring-primary focus:border-primary rounded-lg p-2.5 text-sm font-semibold outline-none" 
                    type="email"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    {language === 'hi' ? 'फोन नंबर' : 'Phone Number'}
                  </label>
                  <input 
                    value={regPhone}
                    onChange={(e) => handlePhoneChange(e.target.value, setRegPhone)}
                    className="w-full border border-outline/20 bg-surface-container-low focus:ring-primary focus:border-primary rounded-lg p-2.5 text-sm font-semibold outline-none" 
                    type="tel"
                    placeholder="e.g. 9876543210"
                    pattern="[0-9]{10}"
                    title="10-digit mobile number"
                    maxLength={10}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    {language === 'hi' ? 'शहर या गाँव' : 'City or Village'}
                  </label>
                  <input 
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full border border-outline/20 bg-surface-container-low focus:ring-primary focus:border-primary rounded-lg p-2.5 text-sm font-semibold outline-none" 
                    type="text"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    {language === 'hi' ? 'पिनकोड' : 'Pincode'} <span className="text-primary">*</span>
                  </label>
                  <input 
                    value={regPincode}
                    onChange={(e) => handlePhoneChange(e.target.value, setRegPincode)}
                    className="w-full border border-outline/20 bg-surface-container-low focus:ring-primary focus:border-primary rounded-lg p-2.5 text-sm font-semibold outline-none" 
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 110001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    {language === 'hi' ? 'पूरा पता' : 'Full Address'} <span className="text-primary">*</span>
                  </label>
                  <textarea 
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    className="w-full border border-outline/20 bg-surface-container-low focus:ring-primary focus:border-primary rounded-lg p-2.5 text-sm font-semibold outline-none" 
                    rows="3"
                    placeholder="Street, locality, landmark"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">Password</label>
                    <input 
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full border border-outline/20 bg-surface-container-low focus:ring-primary focus:border-primary rounded-lg p-2.5 text-sm font-semibold outline-none" 
                      type="password"
                      placeholder="Min 6 chars"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">Confirm</label>
                    <input 
                      value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      className="w-full border border-outline/20 bg-surface-container-low focus:ring-primary focus:border-primary rounded-lg p-2.5 text-sm font-semibold outline-none" 
                      type="password"
                      placeholder="Confirm"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-start gap-3 py-1">
                  <input 
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 rounded text-primary focus:ring-primary cursor-pointer" 
                    type="checkbox"
                    required
                  />
                  <label className="text-xs text-on-surface-variant font-medium select-none">
                    {language === 'hi' ? (
                      <>
                        मैं{' '}
                        <button 
                          type="button"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowTermsModal(true); }}
                          className="text-[#E8650A] font-extrabold hover:underline cursor-pointer bg-primary/10 px-2 py-0.5 rounded"
                        >
                          नियम और शर्तों (Terms & Conditions)
                        </button>{' '}
                        से सहमत हूँ।
                      </>
                    ) : (
                      <>
                        I agree to the{' '}
                        <button 
                          type="button"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowTermsModal(true); }}
                          className="text-[#E8650A] font-extrabold hover:underline cursor-pointer bg-primary/10 px-2 py-0.5 rounded"
                        >
                          Terms & Conditions
                        </button>{' '}
                        for construction services.
                      </>
                    )}
                  </label>
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-[#E8650A] hover:brightness-110 text-white w-full py-4 rounded-full font-bold transition-all active:scale-95 shadow-md text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span> Registering...</>
                  ) : (
                    <><span className="material-symbols-outlined text-lg">person_add</span> {language === 'hi' ? 'रजिस्टर करें' : 'Create Account'}</>
                  )}
                </button>
              </form>
              <div className="mt-5 text-center text-xs">
                <p className="text-on-surface-variant">
                  {language === 'hi' ? 'अकाउंट पहले से है?' : 'Already have an account?'}{' '}
                  <button 
                    onClick={() => setPanel('login')}
                    className="text-[#E8650A] font-bold hover:underline cursor-pointer"
                  >
                    Login
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ====== GOOGLE PROFILE COMPLETION PANEL ====== */}
          {panel === 'google-profile' && (
            <div>
              <div className="mb-6 text-center">
                <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-3xl text-[#2E7D32]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                </div>
                <h2 className="font-headline-md text-xl text-[#E8650A] mb-2 font-bold">
                  {language === 'hi' ? 'प्रोफाइल पूरा करें' : 'Complete Your Profile'}
                </h2>
                <p className="text-on-surface-variant text-xs leading-relaxed">
                  {language === 'hi' 
                    ? 'Google से लॉगिन सफल हुआ। कृपया अपना फ़ोन नंबर और शहर दर्ज करें।' 
                    : 'Google sign-in successful. Please provide your phone number and city to complete setup.'}
                </p>
              </div>
              <form onSubmit={handleGoogleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    {language === 'hi' ? 'पूरा नाम' : 'Full Name'}
                  </label>
                  <input 
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    className="w-full border border-outline/20 bg-surface-container-low rounded-lg p-2.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-primary" 
                    type="text"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    {language === 'hi' ? 'फोन नंबर' : 'Phone Number'} <span className="text-primary">*</span>
                  </label>
                  <input 
                    value={googlePhone}
                    onChange={(e) => handlePhoneChange(e.target.value, setGooglePhone)}
                    className="w-full border border-outline/20 bg-surface-container-low rounded-lg p-2.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-primary" 
                    type="tel"
                    placeholder="e.g. 9876543210"
                    maxLength={10}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    {language === 'hi' ? 'शहर या गाँव' : 'City or Village'}
                  </label>
                  <input 
                    value={googleCity}
                    onChange={(e) => setGoogleCity(e.target.value)}
                    className="w-full border border-outline/20 bg-surface-container-low rounded-lg p-2.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-primary" 
                    type="text"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    {language === 'hi' ? 'पिनकोड' : 'Pincode'} <span className="text-primary">*</span>
                  </label>
                  <input 
                    value={googlePincode}
                    onChange={(e) => handlePhoneChange(e.target.value, setGooglePincode)}
                    className="w-full border border-outline/20 bg-surface-container-low rounded-lg p-2.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-primary" 
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 110001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    {language === 'hi' ? 'पूरा पता' : 'Full Address'} <span className="text-primary">*</span>
                  </label>
                  <textarea 
                    value={googleAddress}
                    onChange={(e) => setGoogleAddress(e.target.value)}
                    className="w-full border border-outline/20 bg-surface-container-low rounded-lg p-2.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-primary" 
                    rows="3"
                    placeholder="Street, locality, landmark"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-[#E8650A] hover:brightness-110 text-white w-full py-4 rounded-full font-bold transition-all active:scale-95 shadow-md text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span> Saving...</>
                  ) : (
                    <><span className="material-symbols-outlined text-lg">check</span> {language === 'hi' ? 'पूर्ण करें' : 'Complete Setup'}</>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-outline/10">
            <div className="bg-[#1C2B1A] text-white p-6 flex justify-between items-center">
              <h3 className="font-display-lg text-lg font-bold">
                {language === 'hi' ? 'नियम और शर्तें — स्वस्तिका इंटरलॉकिंग' : 'Terms & Conditions — Swastika Interlocking'}
              </h3>
              <button 
                onClick={() => setShowTermsModal(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-sm leading-relaxed text-on-surface-variant">
              {language === 'hi' ? (
                <>
                  <h4 className="font-bold text-on-surface text-base">1. सामान्य नियम</h4>
                  <p>स्वस्तिका इंटरलॉकिंग में आपका स्वागत है। हमारी सेवाएं और उत्पाद खरीदने या किराए पर लेने पर ये शर्तें लागू होती हैं।</p>
                  <h4 className="font-bold text-on-surface text-base">2. उत्पाद की गुणवत्ता</h4>
                  <p>हम केवल स्वीकृत मानकों के अनुसार निर्मित पेवर ब्लॉक, सीमेंट, और आरसीसी पाइप प्रदान करते हैं।</p>
                  <h4 className="font-bold text-on-surface text-base">3. डिलीवरी और परिवहन</h4>
                  <p>सामग्री की डिलीवरी स्थल तक पहुंचाने का किराया ग्राहक द्वारा वहन किया जाएगा।</p>
                  <h4 className="font-bold text-on-surface text-base">4. भुगतान की शर्तें</h4>
                  <p>ऑर्डर की पुष्टि के लिए कुल राशि का कम से कम 50% अग्रिम भुगतान आवश्यक है।</p>
                </>
              ) : (
                <>
                  <h4 className="font-bold text-on-surface text-base">1. General Overview</h4>
                  <p>Welcome to Swastika Interlocking. These terms govern the use of our services and supply of materials.</p>
                  <h4 className="font-bold text-on-surface text-base">2. Product Quality</h4>
                  <p>We provide paver blocks, cement, and RCC pipes manufactured to approved standards (IS:15658).</p>
                  <h4 className="font-bold text-on-surface text-base">3. Delivery & Transport</h4>
                  <p>Transportation charges to the delivery site are borne by the customer unless agreed otherwise in writing.</p>
                  <h4 className="font-bold text-on-surface text-base">4. Payment Terms</h4>
                  <p>A minimum of 50% advance payment is required to confirm any order.</p>
                </>
              )}
            </div>
            <div className="p-4 border-t border-outline/10 flex justify-end">
              <button 
                onClick={() => { setShowTermsModal(false); setAgreeTerms(true); }}
                className="bg-[#E8650A] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:brightness-110 cursor-pointer"
              >
                {language === 'hi' ? 'मैं सहमत हूँ' : 'I Agree'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
