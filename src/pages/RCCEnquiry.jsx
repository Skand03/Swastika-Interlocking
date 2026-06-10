import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createInquiry } from '../services/inquiryService';
import { useAuth } from '../auth/AuthContext';
import AuthGate from '../components/AuthGate';

const TRANSLATIONS = {
  hi: {
    pageTitle: 'आरसीसी सड़क प्रोजेक्ट पूछताछ',
    pageDesc: 'अपनी प्रोजेक्ट आवश्यकताएं भरें और हम 24 घंटे में संपर्क करेंगे।',
    submitBtn: 'पूछताछ भेजें',
    submitting: 'भेजा जा रहा है...',
  },
  en: {
    pageTitle: 'RCC Road Project Enquiry',
    pageDesc: 'Fill in your project requirements and we will contact you within 24 hours.',
    submitBtn: 'Submit Enquiry',
    submitting: 'Submitting...',
  }
};

const STATE_DISTRICTS = {
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Noida']
};

export default function RCCEnquiry({ language }) {
  const { profile } = useAuth();
  const [formData, setFormData] = React.useState({ 
    customer_name: profile?.full_name || '', 
    phone: profile?.phone || '', 
    state: '', 
    city: '', 
    product_type: 'RCC Project', 
    quantity: '', 
    address: '', 
    special_req: '' 
  });
  const [statusMsg, setStatusMsg] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);

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
        message: `RCC Road Project Enquiry | Type: ${formData.product_type} | Road Length: ${formData.quantity}m | Location: ${formData.address}, ${formData.city}, ${formData.state} | Notes: ${formData.special_req}`,
        source: 'rcc_enquiry',
        division: 'rcc',
        subject: `RCC Road Project - ${formData.product_type}`,
      });
      setIsSuccess(true);
      setStatusMsg(language === 'hi' ? 'आपका अनुरोध दर्ज कर लिया गया है।' : 'Your request has been submitted successfully.');
      setFormData({ customer_name: '', phone: '', state: '', city: '', product_type: 'RCC Project', quantity: '', address: '', special_req: '' });
    } catch(err) { setIsSuccess(false); setStatusMsg((language === 'hi' ? 'कनेक्शन एरर: ' : 'Connection Error: ') + err.message); }
    finally { setLoading(false); }
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const navigate = useNavigate();

  return (
    <AuthGate language={language}>
    <div className="pt-16">
      
{/*  Main Content Layout  */}
<main className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-16">
<div className="flex flex-col md:grid md:grid-cols-10 gap-gutter">
{/*  LEFT COLUMN: Form  */}
<div className="md:col-span-7">
<div className="bg-surface-container-lowest p-card-padding rounded-xl shadow-sm border border-surface-container-highest">
<h2 className="font-headline-md text-primary mb-8">अपना प्रोजेक्ट बताएं / Tell Us Your Project</h2>
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
        {isSuccess ? '🎉 RCC Enquiry Submitted!' : '❌ Something went wrong'}
      </p>
      <p className="text-white/90 text-sm leading-relaxed">{statusMsg}</p>
    </div>
  </div>
)}
<form onSubmit={handleSubmit} className="space-y-8">
{/*  Project Type Radio Cards  */}
<div>
<label className="block font-label-sm text-on-surface-variant mb-4">PROJECT TYPE / प्रोजेक्ट का प्रकार</label>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
<label className="cursor-pointer">
<input checked={formData.product_type === 'Village Road'} onChange={() => setFormData({...formData, product_type: 'Village Road'})} className="hidden peer" name="project_type_select" type="radio"/>
<div className="border-2 border-surface-container-highest rounded-xl p-4 text-center peer-checked:border-secondary peer-checked:bg-secondary-container/10 transition-all">
<span className="material-symbols-outlined text-secondary block mb-2" data-weight="fill">landscape</span>
<div className="font-bold text-on-surface">Village Road</div>
<div className="text-sm text-on-surface-variant">ग्राम सड़क</div>
</div>
</label>
<label className="cursor-pointer">
<input checked={formData.product_type === 'Colony Road'} onChange={() => setFormData({...formData, product_type: 'Colony Road'})} className="hidden peer" name="project_type_select" type="radio"/>
<div className="border-2 border-surface-container-highest rounded-xl p-4 text-center peer-checked:border-secondary peer-checked:bg-secondary-container/10 transition-all">
<span className="material-symbols-outlined text-secondary block mb-2" data-weight="fill">location_city</span>
<div className="font-bold text-on-surface">Colony Road</div>
<div className="text-sm text-on-surface-variant">कॉलोनी सड़क</div>
</div>
</label>
<label className="cursor-pointer">
<input checked={formData.product_type === 'Other'} onChange={() => setFormData({...formData, product_type: 'Other'})} className="hidden peer" name="project_type_select" type="radio"/>
<div className="border-2 border-surface-container-highest rounded-xl p-4 text-center peer-checked:border-secondary peer-checked:bg-secondary-container/10 transition-all">
<span className="material-symbols-outlined text-secondary block mb-2" data-weight="fill">more_horiz</span>
<div className="font-bold text-on-surface">Other</div>
<div className="text-sm text-on-surface-variant">अन्य</div>
</div>
</label>
</div>
</div>
{/*  General Fields  */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="block font-label-sm text-on-surface-variant mb-2">Contact Person Name / नाम</label>
<input name="customer_name" value={formData.customer_name} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant/30 rounded-lg p-3 form-input-focus" placeholder="Enter Full Name" type="text" required/>
</div>
<div>
<label className="block font-label-sm text-on-surface-variant mb-2">Phone / फोन</label>
<div className="flex">
<span className="bg-surface-container-highest border border-r-0 border-outline-variant/30 rounded-l-lg px-4 flex items-center text-on-surface-variant">+91</span>
<input className="w-full bg-surface-container border border-outline-variant/30 rounded-r-lg p-3 form-input-focus" placeholder="10-digit number" type="tel" name="phone" maxLength={10} value={formData.phone} onChange={handleChange} required/>
</div>
</div>
<div className="md:col-span-2">
<label className="block font-label-sm text-on-surface-variant mb-2">Organization / Village / Gram Panchayat Name</label>
<input name="address" value={formData.address} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant/30 rounded-lg p-3 form-input-focus" placeholder="Entity name for the project" type="text" required/>
</div>
<div>
<label className="block font-label-sm text-on-surface-variant mb-2">State</label>
<select name="state" value={formData.state} onChange={(e) => {
  setFormData(prev => ({ ...prev, state: e.target.value, city: '' }));
}} className="w-full bg-surface-container border border-outline-variant/30 rounded-lg p-3 form-input-focus appearance-none" required>
<option value="">Select State</option>
{Object.keys(STATE_DISTRICTS).map(st => (
  <option key={st} value={st}>{st}</option>
))}
</select>
</div>
<div>
<label className="block font-label-sm text-on-surface-variant mb-2">District</label>
<select name="city" value={formData.city} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant/30 rounded-lg p-3 form-input-focus appearance-none" required disabled={!formData.state}>
<option value="">Select District</option>
{formData.state && STATE_DISTRICTS[formData.state]?.map(dist => (
  <option key={dist} value={dist}>{dist}</option>
))}
</select>
</div>
<div>
<label className="block font-label-sm text-on-surface-variant mb-2">Pincode</label>
<input className="w-full bg-surface-container border border-outline-variant/30 rounded-lg p-3 form-input-focus" placeholder="6-digit PIN" type="text"/>
</div>
<div>
<label className="block font-label-sm text-on-surface-variant mb-2">Road Length (meters)</label>
<input name="quantity" value={formData.quantity} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant/30 rounded-lg p-3 form-input-focus" placeholder="e.g. 500" type="number" required/>
</div>
<div>
<label className="block font-label-sm text-on-surface-variant mb-2">Road Width (meters)</label>
<input className="w-full bg-surface-container border border-outline-variant/30 rounded-lg p-3 form-input-focus" placeholder="e.g. 7" type="number"/>
</div>
<div>
<label className="block font-label-sm text-on-surface-variant mb-2">Budget Range</label>
<select className="w-full bg-surface-container border border-outline-variant/30 rounded-lg p-3 form-input-focus appearance-none">
<option>Under ₹5L</option>
<option>₹5–15L</option>
<option>₹15–30L</option>
<option>₹30L+</option>
</select>
</div>
<div>
<label className="block font-label-sm text-on-surface-variant mb-2">Road Type</label>
<select className="w-full bg-surface-container border border-outline-variant/30 rounded-lg p-3 form-input-focus appearance-none">
<option>New Construction</option>
<option>Repair &amp; Restoration</option>
<option>Widening</option>
</select>
</div>
</div>
<div>
<label className="block font-label-sm text-on-surface-variant mb-2">Special Requirements</label>
<textarea className="w-full bg-surface-container border border-outline-variant/30 rounded-lg p-3 form-input-focus" placeholder="Any specific details or constraints..." rows="4" name="special_req" value={formData.special_req} onChange={handleChange}></textarea>
</div>
{/*  File Drop Zone  */}
<div>
<label className="block font-label-sm text-on-surface-variant mb-2">Upload Site Photo</label>
<div className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${selectedFile ? 'border-primary bg-primary-container/10' : 'border-secondary bg-secondary-container/5 hover:bg-secondary-container/10'}`}>
<input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/jpeg, image/png" onChange={(e) => {
  const file = e.target.files[0];
  if(file) {
    setSelectedFile(file);
  }
}} />
{selectedFile ? (
  <div className="flex flex-col items-center">
    <span className="material-symbols-outlined text-primary text-4xl mb-2">check_circle</span>
    <p className="font-bold text-primary">{selectedFile.name}</p>
    <p className="text-sm text-on-surface-variant mt-1">Click to change file</p>
  </div>
) : (
  <div className="flex flex-col items-center">
    <span className="material-symbols-outlined text-secondary text-4xl mb-2">cloud_upload</span>
    <p className="font-bold text-on-surface">Drag &amp; drop or click to upload</p>
    <p className="text-sm text-on-surface-variant mt-1">Max size 10MB (JPG, PNG)</p>
  </div>
)}
</div>
</div>
<div>
<label className="block font-label-sm text-on-surface-variant mb-2">Preferred Site Visit Date</label>
<input className="w-full bg-surface-container border border-outline-variant/30 rounded-lg p-3 form-input-focus" type="date"/>
</div>
{/*  Buttons  */}
<div className="space-y-4 pt-4">
<button className="w-full bg-[#8B1A00] text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity shadow-lg" type="submit" disabled={loading}>
  {loading ? t.submitting : (language === 'hi' ? 'Enquiry भेजें' : 'Send Enquiry')}
</button>
<a href={`https://wa.me/918400936290?text=Hello,%20I%20want%20to%20enquire%20about%20RCC%20Road%20Project%20in%20${formData.city || 'my%20area'}`} target="_blank" rel="noreferrer" className="w-full bg-[#25D366] text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg" type="button">
<span className="material-symbols-outlined">chat</span>
                                WhatsApp पर भेजें
</a>
</div>
</form>
</div>
</div>
{/*  RIGHT COLUMN: Sidebar  */}
<aside className="md:col-span-3 space-y-6">
{/*  Contact Info Card  */}
<div className="bg-surface-container-low p-card-padding rounded-xl border border-surface-container-highest">
<h3 className="font-headline-md text-on-surface mb-6">Contact Info</h3>
<div className="space-y-6">
<div className="flex gap-4">
<span className="material-symbols-outlined text-primary">call</span>
<div>
<p className="font-bold">Phone Numbers</p>
<p className="text-on-surface-variant text-sm">+91 84009 36290</p>
<p className="text-on-surface-variant text-sm">+91 79059 78260</p>
</div>
</div>
<div className="flex gap-4">
<span className="material-symbols-outlined text-primary">location_on</span>
<div>
<p className="font-bold">Address</p>
<p className="text-on-surface-variant text-sm">Girdharpur Uncher, Kauriram, Uttar Pradesh</p>
</div>
</div>
<div className="flex gap-4">
<span className="material-symbols-outlined text-primary">schedule</span>
<div>
<p className="font-bold">Working Hours</p>
<p className="text-on-surface-variant text-sm">Mon - Sat: 9:00 AM - 7:00 PM</p>
<p className="text-on-surface-variant text-sm">Sunday: Closed</p>
</div>
</div>
<button className="w-full border-2 border-primary text-primary py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition-all">
                            Call Now
                        </button>
</div>
</div>
{/*  Google Map  */}
<div className="rounded-xl overflow-hidden aspect-square relative border border-outline-variant">
<iframe
  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3570.661898870162!2d83.44953537542526!3d26.49882887689632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjbCsDI5JzU1LjgiTiA4M8KwMjcnMDcuNiJF!5e0!3m2!1sen!2sin!4v1780881087813!5m2!1sen!2sin"
  width="100%"
  height="100%"
  style={{border: 0, minHeight: '300px'}}
  allowFullScreen=""
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  title="Swastika Interlocking Location"
></iframe>
</div>
{/*  Trust Badge Card  */}
<div className="bg-secondary-container/10 p-card-padding rounded-xl border border-secondary/20">
<div className="flex items-center gap-3 mb-4">
<span className="material-symbols-outlined text-secondary" style={{"fontVariationSettings": "'FILL' 1", }}>verified</span>
<h4 className="font-bold text-secondary">Quality Certified</h4>
</div>
<p className="text-sm text-on-surface-variant">All our RCC road projects strictly adhere to IRC guidelines and state PWD specifications for long-lasting durability.</p>
</div>
</aside>
</div>
</main>
{/*  Footer  */}

    </div>
    </AuthGate>
  );
}
