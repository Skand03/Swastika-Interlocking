import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Auth({ language }) {
  const navigate = useNavigate();
  const [panel, setPanel] = useState('login'); // 'login', 'register', 'forgot'
  
  // Login fields
  const [loginPhone, setLoginPhone] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' or 'password'

  // Register fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Forgot password fields
  const [forgotPhone, setForgotPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [statusMsg, setStatusMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Clear errors when panel switches
  useEffect(() => {
    setStatusMsg('');
  }, [panel]);

  // Handle standard login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('');

    let phone = loginPhone;
    let password = loginPassword;

    if (loginMethod === 'otp') {
      // For WhatsApp OTP simulation, we allow bypass for mock users or prompt them
      if (loginPhone === '9876543210') {
        password = 'password';
      } else if (loginPhone === '9999999999') {
        password = 'admin';
      } else {
        setStatusMsg(language === 'hi' ? 'कृपया पासवर्ड लॉगिन का उपयोग करें या पहले रजिस्टर करें।' : 'Please use password login or register first.');
        setIsSuccess(false);
        return;
      }
    }

    if (!phone || !password) {
      setStatusMsg(language === 'hi' ? 'फोन नंबर और पासवर्ड आवश्यक हैं।' : 'Phone and password are required.');
      setIsSuccess(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('./api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });
      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        setStatusMsg(language === 'hi' ? 'लॉगिन सफल! रीडायरेक्ट किया जा रहा है...' : 'Login successful! Redirecting...');
        localStorage.setItem('user', JSON.stringify(result.user));
        
        setTimeout(() => {
          if (result.user.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/customer-dashboard');
          }
          // Force page refresh to sync Navbar status
          window.location.reload();
        }, 1000);
      } else {
        setIsSuccess(false);
        setStatusMsg(result.message || 'Login failed.');
      }
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setStatusMsg(language === 'hi' ? 'सर्वर से कनेक्ट करने में विफल।' : 'Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  // Handle register submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('');

    if (!regName || !regPhone || !regCity || !regPassword) {
      setStatusMsg(language === 'hi' ? 'कृपया सभी फ़ील्ड भरें।' : 'Please fill all fields.');
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

    try {
      const response = await fetch('./api/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: regName,
          phone: regPhone,
          city: regCity,
          password: regPassword
        })
      });
      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        setStatusMsg(result.message);
        setTimeout(() => {
          setPanel('login');
          setLoginPhone(regPhone);
          setLoginMethod('password');
        }, 1500);
      } else {
        setIsSuccess(false);
        setStatusMsg(result.message || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setStatusMsg(language === 'hi' ? 'सर्वर एरर।' : 'Server error.');
    } finally {
      setLoading(false);
    }
  };

  // OTP inputs keyup helpers
  const handleOtpInput = (val, idx) => {
    const nextDigits = [...otpDigits];
    nextDigits[idx] = val.slice(-1);
    setOtpDigits(nextDigits);

    // Auto focus next box
    if (val && idx < 3) {
      const nextInput = document.getElementById(`otp-${idx + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      const prevInput = document.getElementById(`otp-${idx - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Simulate Reset Password
  const handleResetSubmit = (e) => {
    e.preventDefault();
    setStatusMsg('');

    const enteredOtp = otpDigits.join('');
    if (enteredOtp !== '1234') {
      setStatusMsg(language === 'hi' ? 'गलत ओटीपी! कृपया 1234 का उपयोग करें।' : 'Invalid OTP! Please use 1234.');
      setIsSuccess(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setStatusMsg(language === 'hi' ? 'पासवर्ड मेल नहीं खाते।' : 'Passwords do not match.');
      setIsSuccess(false);
      return;
    }

    setStatusMsg(language === 'hi' ? 'पासवर्ड सफलतापूर्वक बदल गया! लॉगिन करें।' : 'Password reset successfully! Logging you in.');
    setIsSuccess(true);

    setTimeout(() => {
      setPanel('login');
      setLoginPhone(forgotPhone);
      setLoginMethod('password');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface text-on-surface pt-16 select-none">
      
      {/* Left branding panel */}
      <div className="bg-[#1C2B1A] w-full md:w-1/2 flex flex-col justify-center items-center p-gutter text-center py-12">
        <div className="max-w-md space-y-6">
          <img 
            alt="Swastika Interlocking Logo" 
            className="w-32 h-32 mx-auto object-contain bg-white rounded-full p-2" 
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
            <div className={`p-4 rounded-lg text-xs font-semibold mb-6 ${isSuccess ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#E8F5E9]' : 'bg-error-container text-on-error-container border border-error/30'}`}>
              {statusMsg}
            </div>
          )}

          {/* PANEL 1: LOGIN */}
          {panel === 'login' && (
            <div>
              <h2 className="font-headline-md text-xl text-[#E8650A] mb-6 text-center font-bold">
                {language === 'hi' ? 'Login करें' : 'Sign In'}
              </h2>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                <div className="flex bg-surface-container p-1 rounded-lg border border-outline/10 text-xs font-bold mb-4">
                  <button 
                    type="button"
                    onClick={() => setLoginMethod('otp')}
                    className={`flex-1 py-2 rounded-md transition-all cursor-pointer ${loginMethod === 'otp' ? 'bg-[#25D366] text-white' : 'text-on-surface-variant'}`}
                  >
                    WhatsApp OTP
                  </button>
                  <button 
                    type="button"
                    onClick={() => setLoginMethod('password')}
                    className={`flex-1 py-2 rounded-md transition-all cursor-pointer ${loginMethod === 'password' ? 'bg-primary text-white' : 'text-on-surface-variant'}`}
                  >
                    Password
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-2">
                    {language === 'hi' ? 'फोन नंबर' : 'Phone Number'}
                  </label>
                  <div className="flex border border-outline/20 rounded-lg overflow-hidden bg-surface-container-low focus-within:ring-1 focus-within:ring-primary">
                    <span className="flex items-center px-4 bg-surface-variant text-on-surface-variant text-sm border-r border-outline/10 font-bold">+91</span>
                    <input 
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      className="flex-1 bg-transparent p-3 outline-none text-sm font-semibold"
                      placeholder="98765 43210" 
                      type="tel"
                      required
                    />
                  </div>
                </div>

                {loginMethod === 'password' && (
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-2">Password</label>
                    <input 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full border border-outline/20 bg-surface-container-low focus:ring-primary focus:border-primary rounded-lg p-3 text-sm font-semibold outline-none" 
                      type="password"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                )}

                {loginMethod === 'otp' ? (
                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-[#25D366] hover:opacity-95 text-white w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md text-sm"
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                    {language === 'hi' ? 'WhatsApp OTP लॉगिन' : 'Login via WhatsApp OTP'}
                  </button>
                ) : (
                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-[#E8650A] hover:bg-primary-container text-white w-full py-4 rounded-full font-bold transition-all active:scale-95 cursor-pointer shadow-md text-sm"
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                )}
              </form>

              <div className="mt-8 space-y-4 text-center text-xs">
                <button 
                  onClick={() => setPanel('forgot')}
                  className="block text-[#E8650A] font-bold hover:underline mx-auto cursor-pointer"
                >
                  {language === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot password?'}
                </button>
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

          {/* PANEL 2: REGISTER */}
          {panel === 'register' && (
            <div>
              <h2 className="font-headline-md text-xl text-[#E8650A] mb-6 text-center font-bold">
                {language === 'hi' ? 'नया अकाउंट बनाएं' : 'Create Account'}
              </h2>
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
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
                    {language === 'hi' ? 'फोन नंबर' : 'Phone Number'}
                  </label>
                  <input 
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full border border-outline/20 bg-surface-container-low focus:ring-primary focus:border-primary rounded-lg p-2.5 text-sm font-semibold outline-none" 
                    type="tel"
                    placeholder="e.g. 9876543210"
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">Password</label>
                    <input 
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full border border-outline/20 bg-surface-container-low focus:ring-primary focus:border-primary rounded-lg p-2.5 text-sm font-semibold outline-none" 
                      type="password"
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
                      required
                    />
                  </div>
                </div>
                <div className="flex items-start gap-3 py-2">
                  <input 
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 rounded text-primary focus:ring-primary cursor-pointer" 
                    type="checkbox"
                    required
                  />
                  <label className="text-xs text-on-surface-variant font-medium">
                    {language === 'hi' 
                      ? 'मैं निर्माण सेवाओं के नियम और शर्तों से सहमत हूँ।' 
                      : 'I agree to the Terms & Conditions for construction services.'}
                  </label>
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-[#E8650A] hover:bg-primary-container text-white w-full py-4 rounded-full font-bold transition-all active:scale-95 shadow-md text-sm cursor-pointer"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>
              <div className="mt-6 text-center text-xs">
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

          {/* PANEL 3: FORGOT PASSWORD */}
          {panel === 'forgot' && (
            <div>
              <div className="mb-6 text-center">
                <h2 className="font-headline-md text-xl text-[#E8650A] mb-2 font-bold">
                  {language === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
                </h2>
                <p className="text-on-surface-variant text-xs leading-relaxed">
                  {language === 'hi' 
                    ? 'अपना मोबाइल नंबर दर्ज करें और रीसेट ओटीपी प्राप्त करें।' 
                    : 'Enter your mobile number to receive a secure reset OTP.'}
                </p>
              </div>
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-2">
                    {language === 'hi' ? 'फोन नंबर' : 'Phone Number'}
                  </label>
                  <div className="flex gap-2">
                    <input 
                      value={forgotPhone}
                      onChange={(e) => setForgotPhone(e.target.value)}
                      className="flex-grow border border-outline/20 bg-surface-container-low focus:ring-primary focus:border-primary rounded-lg p-3 text-sm font-semibold outline-none" 
                      placeholder="98765 43210" 
                      type="tel"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (forgotPhone) {
                          setOtpSent(true);
                          setStatusMsg(language === 'hi' ? 'ओटीपी भेजा गया! रीसेट के लिए 1234 दर्ज करें।' : 'OTP Sent! Enter 1234 to reset.');
                          setIsSuccess(true);
                        } else {
                          setStatusMsg(language === 'hi' ? 'कृपया फोन नंबर दर्ज करें।' : 'Please enter phone number.');
                          setIsSuccess(false);
                        }
                      }}
                      className="bg-[#25D366] px-4 rounded-lg text-white font-bold text-xs hover:brightness-95 cursor-pointer"
                    >
                      Send OTP
                    </button>
                  </div>
                </div>

                {otpSent && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-3 text-center">Enter 4-digit OTP</label>
                      <div className="flex justify-between gap-4 max-w-[240px] mx-auto">
                        {[0, 1, 2, 3].map((idx) => (
                          <input 
                            key={idx}
                            id={`otp-${idx}`}
                            value={otpDigits[idx]}
                            onChange={(e) => handleOtpInput(e.target.value, idx)}
                            onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                            className="w-12 h-12 text-center text-xl font-bold border-2 border-outline/20 bg-surface rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                            maxLength={1} 
                            type="text" 
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant mb-1">New Password</label>
                        <input 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full border border-outline/20 bg-surface-container-low focus:ring-primary focus:border-primary rounded-lg p-2.5 text-sm font-semibold outline-none" 
                          type="password"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant mb-1">Confirm New Password</label>
                        <input 
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="w-full border border-outline/20 bg-surface-container-low focus:ring-primary focus:border-primary rounded-lg p-2.5 text-sm font-semibold outline-none" 
                          type="password"
                          required
                        />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      className="bg-[#E8650A] hover:bg-primary-container text-white w-full py-4 rounded-full font-bold transition-all active:scale-95 shadow-md text-sm cursor-pointer"
                    >
                      Reset Password
                    </button>
                  </>
                )}
              </form>
              <div className="mt-8 text-center text-xs">
                <button 
                  onClick={() => setPanel('login')}
                  className="text-on-surface-variant font-bold flex items-center justify-center gap-1 hover:text-primary mx-auto cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  Back to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
