import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { createInquiry } from '../services/inquiryService';
import AuthGate from '../components/AuthGate';

const TRANSLATIONS = {
  hi: {
    home: 'होम',
    shuttering: 'शटरिंग',
    enquiryForm: 'पूछताछ और बुकिंग फॉर्म',
    pageTitle: 'शटरिंग पूछताछ और बुकिंग',
    pageDesc: 'अपनी आवश्यकताएं भरें और हम 24 घंटे में संपर्क करेंगे।',
    submitBtn: 'अनुरोध भेजें',
    submitting: 'भेजा जा रहा है...',
  },
  en: {
    home: 'Home',
    shuttering: 'Shuttering',
    enquiryForm: 'Enquiry & Booking Form',
    pageTitle: 'Shuttering Enquiry & Booking',
    pageDesc: 'Fill in your requirements and we will contact you within 24 hours.',
    submitBtn: 'Submit Request',
    submitting: 'Submitting...',
  }
};

export default function ShutteringEnquiry({ language }) {
  const { profile } = useAuth();
  const [formData, setFormData] = React.useState({ 
    customer_name: profile ? profile.full_name : '', 
    phone: profile ? profile.phone : '', 
    city: profile ? profile.city : '', 
    product_type: 'Shuttering Enquiry', 
    quantity: '', 
    address: profile && profile.address ? profile.address : '', 
    special_req: '' 
  });
  const [orderType, setOrderType] = React.useState('Rent');
  const [statusMsg, setStatusMsg] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const location = useLocation();

  // Update form if user logs in after page load
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        customer_name: prev.customer_name || profile.full_name,
        phone: prev.phone || profile.phone,
        city: prev.city || profile.city,
        address: prev.address || (profile.address || '')
      }));
    }
  }, [profile]);

  // Auto-fill from product details page
  useEffect(() => {
    if (location.state) {
      const { productName, quantity, duration, totalCost, type } = location.state;
      const prefill = [];
      if (type) prefill.push(`Type: ${type}`);
      if (productName) prefill.push(`Product: ${productName}`);
      if (quantity) prefill.push(`Qty: ${quantity}`);
      if (duration) prefill.push(`Duration: ${duration} days`);
      if (totalCost) prefill.push(`Est. Cost: ₹${totalCost.toLocaleString('en-IN')}`);

      setFormData(prev => ({
        ...prev,
        product_type: productName ? `Shuttering - ${productName}` : prev.product_type,
        quantity: quantity ? String(quantity) : prev.quantity,
        special_req: prefill.join(' | ')
      }));
    }
  }, [location.state]);

  // SEO Optimization
  useEffect(() => {
    document.title = language === 'hi' ? 'शटरिंग पूछताछ और बुकिंग - स्वस्तिका इंटरलॉकिंग' : 'Shuttering Enquiry & Booking - Swastika Interlocking';
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = language === 'hi' ? 'किराए या खरीदने के लिए उच्च गुणवत्ता वाली स्टील शटरिंग, मचान और डोर फ्रेम बुक करें।' : 'Book high-quality steel shuttering, scaffolding, and door frames for rent or to buy from Swastika Interlocking.';
  }, [language]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, phone: cleaned }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      setIsSuccess(false);
      setStatusMsg(language === 'hi' ? 'फ़ोन नंबर ठीक 10 अंकों का होना चाहिए।' : 'Phone number must be exactly 10 digits.');
      return;
    }
    setLoading(true); setStatusMsg('');
    try {
      await createInquiry({
        customer_name: formData.customer_name,
        customer_phone: formData.phone,
        customer_id: profile?.id || null,
        city: formData.city,
        message: `${formData.product_type} - [WANTS TO ${orderType.toUpperCase()}] | Qty: ${formData.quantity} | Site: ${formData.address} | Notes: ${formData.special_req}`,
        source: 'shuttering_enquiry',
        division: 'shuttering',
        subject: `Shuttering ${orderType} Request`,
        budget_range: formData.quantity
      });
      setIsSuccess(true);
      setStatusMsg(language === 'hi' ? 'आपका अनुरोध दर्ज कर लिया गया है।' : 'Your request has been submitted successfully.');
      setFormData({ customer_name: '', phone: '', city: '', product_type: 'Shuttering Enquiry', quantity: '', address: '', special_req: '' });
    } catch(err) { 
      setIsSuccess(false); 
      setStatusMsg((language === 'hi' ? 'कनेक्शन एरर: ' : 'Connection Error: ') + err.message); 
    }
    finally { setLoading(false); }
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const navigate = useNavigate();

  return (
    <AuthGate language={language}>
    <div className="pt-16">
      
{/*  Hero Banner  */}
<section className="relative h-48 md:h-64 flex items-center overflow-hidden">
<div className="absolute inset-0 z-0">
<img alt="Shuttering Infrastructure" className="w-full h-full object-cover grayscale brightness-50" data-alt="A panoramic construction site background featuring scaffolding, steel frameworks, and sunset lighting. The scene is industrial and textured, suggesting strength and infrastructure development. The atmosphere is professional and authoritative with a dark moody overlay to contrast the bright interface text." src="https://lh3.googleusercontent.com/aida-public/AB6AXuADotX2EZyVU5xYwFJDhQqAptmw2WS4jmoX4ijBRFndcUDTKI3vvpnW7pXd5-KxhyHuqXonTofXZ0Mwe2RAU_dAznVQXaorYYa3mSJrlYpQcZEA2WMzkh5bvkHkju3YrGQAm5oegzJHqp0bcbIupUDRD0_fynU8JtRpjf3JRSkwSp1UEIdjLNWjkMLIAG0SFXLsK--oaQkt3g_0NPVgowmVE5TehbU0abKXkOsne2wc5eQklFZkytOm910XW0k85jRN2-g3YStGtx4"/>
<div className="absolute inset-0 bg-black/60"></div>
</div>
<div className="relative z-10 w-full max-w-container-max mx-auto px-gutter text-white">
<nav aria-label="Breadcrumb" className="flex mb-4 text-sm opacity-80">
<ol className="flex items-center space-x-2">
<li><Link to="/" className="hover:underline">{t.home}</Link></li>
<li><span className="material-symbols-outlined text-xs">chevron_right</span></li>
<li><Link to="/shuttering" className="hover:underline">{t.shuttering}</Link></li>
<li><span className="material-symbols-outlined text-xs">chevron_right</span></li>
<li className="font-semibold">Enquiry</li>
</ol>
</nav>
<h1 className="font-display-lg text-display-lg-mobile md:text-display-lg font-bold">शटरिंग बुकिंग / Shuttering Enquiry</h1>
</div>
</section>
{/*  Form Section  */}
<main className="w-full max-w-container-max mx-auto px-gutter py-12 md:py-20">
<div className="max-w-3xl mx-auto">
<div className="bg-surface-container-low shadow-sm rounded-xl overflow-hidden border border-outline-variant/30">
{statusMsg && (
  <div className={`flex items-start gap-4 p-5 rounded-xl mb-6 border-2 shadow-lg transition-all duration-500 ${
    isSuccess
      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-400 shadow-emerald-200'
      : 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-400 shadow-red-200'
  }`}>
    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-white/20">
      <span className="material-symbols-outlined text-2xl text-white" style={{fontVariationSettings: "'FILL' 1"}}>
        {isSuccess ? 'check_circle' : 'error'}
      </span>
    </div>
    <div className="flex-1">
      <p className="font-bold text-base mb-0.5">
        {isSuccess ? 'Enquiry Submitted Successfully!' : 'Something went wrong'}
      </p>
      <p className="text-white/90 text-sm leading-relaxed">{statusMsg}</p>
    </div>
  </div>
)}
<form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
{/*  Type Selector  */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<label className="relative cursor-pointer group">
<input checked={orderType === 'Rent'} onChange={() => setOrderType('Rent')} className="peer sr-only" name="order_type" type="radio"/>
<div className={`flex items-center justify-between p-6 rounded-xl border-2 transition-all bg-white ${orderType === 'Rent' ? 'border-[#1a1a3e] shadow-md' : 'border-outline-variant/30 hover:border-outline-variant/60'}`}>
<div className="flex flex-col">
<span className={`font-bold text-lg ${orderType === 'Rent' ? 'text-[#1a1a3e]' : 'text-on-surface'}`}>किराए के लिए / For Rent</span>
<span className="text-on-surface-variant text-sm">Flexible rental durations</span>
</div>
<span className={`material-symbols-outlined ${orderType === 'Rent' ? 'text-[#1a1a3e]' : 'text-outline-variant/50'}`} style={{"fontVariationSettings": orderType === 'Rent' ? "'FILL' 1" : "'FILL' 0" }}>{orderType === 'Rent' ? 'check_circle' : 'radio_button_unchecked'}</span>
</div>
</label>
<label className="relative cursor-pointer group">
<input checked={orderType === 'Buy'} onChange={() => setOrderType('Buy')} className="peer sr-only" name="order_type" type="radio"/>
<div className={`flex items-center justify-between p-6 rounded-xl border-2 transition-all bg-white ${orderType === 'Buy' ? 'border-[#1a1a3e] shadow-md' : 'border-outline-variant/30 hover:border-outline-variant/60'}`}>
<div className="flex flex-col">
<span className={`font-bold text-lg ${orderType === 'Buy' ? 'text-[#1a1a3e]' : 'text-on-surface'}`}>खरीदने के लिए / To Buy</span>
<span className="text-on-surface-variant text-sm">High-quality steel assets</span>
</div>
<span className={`material-symbols-outlined ${orderType === 'Buy' ? 'text-[#1a1a3e]' : 'text-outline-variant/50'}`} style={{"fontVariationSettings": orderType === 'Buy' ? "'FILL' 1" : "'FILL' 0" }}>{orderType === 'Buy' ? 'check_circle' : 'radio_button_unchecked'}</span>
</div>
</label>
</div>
{/*  Personal Info Grid  */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="block font-bold text-on-surface-variant">Full Name / पूरा नाम</label>
<input name="customer_name" value={formData.customer_name} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 focus:ring-2 focus:ring-saffron focus:border-saffron outline-none transition-all" placeholder="Enter your name" type="text" required/>
</div>
<div className="space-y-2">
<label className="block font-bold text-on-surface-variant">Phone Number / फोन नंबर</label>
<div className="flex">
<span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-outline-variant/50 bg-surface-container-highest font-semibold text-on-surface-variant">+91</span>
<input className="w-full bg-surface-container border border-outline-variant/50 rounded-r-lg p-3 focus:ring-2 focus:ring-saffron focus:border-saffron outline-none transition-all" placeholder="10-digit mobile number" type="tel" name="phone" maxLength={10} value={formData.phone} onChange={handleChange} required/>
</div>
</div>
<div className="space-y-2 md:col-span-2">
<label className="block font-bold text-on-surface-variant">City / Village / शहर या गांव</label>
<input name="city" value={formData.city} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 focus:ring-2 focus:ring-saffron focus:border-saffron outline-none transition-all" placeholder="Enter city or village name" type="text" required/>
</div>
<div className="space-y-2 md:col-span-2">
<label className="block font-bold text-on-surface-variant">Site Address / साइट पता</label>
<textarea name="address" value={formData.address} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 focus:ring-2 focus:ring-saffron focus:border-saffron outline-none transition-all" placeholder="Full address of the construction site" rows="3" required></textarea>
</div>
</div>
{/*  Item Checklist  */}
<div className="space-y-4">
<label className="block font-bold text-on-surface-variant border-b border-outline-variant pb-2">Items Required / आवश्यक वस्तुएं</label>
<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
<label className="flex items-center gap-3 cursor-pointer group">
<input onChange={(e) => setFormData({...formData, special_req: formData.special_req + ' [Steel Plates]'})} className="form-checkbox h-5 w-5 text-steel-blue border-outline-variant rounded transition-all focus:ring-steel-blue" type="checkbox"/>
<span className="group-hover:text-steel-blue transition-colors">Steel Plates</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input onChange={(e) => setFormData({...formData, special_req: formData.special_req + ' [Props]'})} className="form-checkbox h-5 w-5 text-steel-blue border-outline-variant rounded transition-all focus:ring-steel-blue" type="checkbox"/>
<span className="group-hover:text-steel-blue transition-colors">Props (Jacks)</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input onChange={(e) => setFormData({...formData, special_req: formData.special_req + ' [H-Frames]'})} className="form-checkbox h-5 w-5 text-steel-blue border-outline-variant rounded transition-all focus:ring-steel-blue" type="checkbox"/>
<span className="group-hover:text-steel-blue transition-colors">H-Frames</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input onChange={(e) => setFormData({...formData, special_req: formData.special_req + ' [Beam Clamps]'})} className="form-checkbox h-5 w-5 text-steel-blue border-outline-variant rounded transition-all focus:ring-steel-blue" type="checkbox"/>
<span className="group-hover:text-steel-blue transition-colors">Beam Clamps</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input onChange={(e) => setFormData({...formData, special_req: formData.special_req + ' [Wallers]'})} className="form-checkbox h-5 w-5 text-steel-blue border-outline-variant rounded transition-all focus:ring-steel-blue" type="checkbox"/>
<span className="group-hover:text-steel-blue transition-colors">Wallers</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input onChange={(e) => setFormData({...formData, special_req: formData.special_req + ' [Plywood]'})} className="form-checkbox h-5 w-5 text-steel-blue border-outline-variant rounded transition-all focus:ring-steel-blue" type="checkbox"/>
<span className="group-hover:text-steel-blue transition-colors">Plywood</span>
</label>
</div>
</div>
{/*  Quantity and Dates  */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="block font-bold text-on-surface-variant">Quantity Needed / मात्रा</label>
<input name="quantity" value={formData.quantity} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="e.g., 500 sq ft or 200 units" type="text" required/>
</div>
<div className="space-y-2">
<label className="block font-bold text-on-surface-variant">How did you hear about us?</label>
<select className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
<option>Social Media</option>
<option>Website Search</option>
<option>Referral</option>
<option>Advertisement</option>
<option>Other</option>
</select>
</div>
{orderType === 'Rent' && (
  <>
<div className="space-y-2">
<label className="block font-bold text-on-surface-variant">Rental Start Date</label>
<input className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" type="date"/>
</div>
<div className="space-y-2">
<label className="block font-bold text-on-surface-variant">End Date (Estimated)</label>
<input className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" type="date"/>
</div>
  </>
)}
</div>
<div className="space-y-2">
<label className="block font-bold text-on-surface-variant">Special Requirements (textarea)</label>
<textarea name="special_req" value={formData.special_req} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 focus:ring-2 focus:ring-saffron focus:border-saffron outline-none transition-all" placeholder="Any specific instructions or additional items?" rows="4"></textarea>
</div>
{/*  Actions  */}
<div className="space-y-4 pt-4">
<button className="w-full bg-[#8B1A00] text-white py-4 rounded-lg font-bold text-lg hover:bg-primary transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2" type="submit" disabled={loading}>
  {loading ? t.submitting : (language === 'hi' ? 'Enquiry भेजें' : 'Send Enquiry')}
  <span className="material-symbols-outlined">send</span>
</button>
<a href={`https://wa.me/918400936290?text=Hello,%20I%20want%20to%20enquire%20about%20shuttering%20in%20${formData.city || 'my%20area'}`} target="_blank" rel="noreferrer" className="w-full bg-[#25D366] text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2" type="button">
                            WhatsApp पर भेजें / Send on WhatsApp
                            <span className="material-symbols-outlined">chat</span>
</a>
</div>
</form>
</div>
</div>
</main>
    </div>
    </AuthGate>
  );
}
