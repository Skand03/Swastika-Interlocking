import React, { useState, useEffect, useRef } from 'react';
import { createInquiry } from '../services/inquiryService';
import { useAuth } from '../auth/AuthContext';
import SEOHead from '../components/SEO/SEOHead';
import { getBreadcrumbSchema } from '../components/SEO/schemas';

const TRANSLATIONS = {
  hi: {
    title: 'संपर्क करें',
    sub: 'हम आपकी मदद के लिए यहां हैं',
    address: 'पता',
    addressVal: 'Deesa, Banaskantha, Gujarat - 385535',
    hours: 'कार्य समय',
    hoursVal: 'सोम - शनि: 9:00 AM - 7:00 PM',
    sunday: 'रविवार: अपॉइंटमेंट पर',
    email: 'ईमेल',
    emailVal: 'info@swastikainterlocking.com',
    askQuestion: 'कोई भी सवाल पूछें',
    name: 'आपका नाम',
    phone: 'फोन नंबर',
    division: 'किस विभाग से?',
    divisionBuilding: 'बिल्डिंग मैटेरियल्स (दिलीप चौबे)',
    divisionPipes: 'पाइप्स विभाग (आलोक चौबे)',
    divisionGeneral: 'सामान्य संपर्क',
    message: 'आपका संदेश',
    sendBtn: 'भेजें',
    sending: 'भेजा जा रहा है...',
    success: 'संदेश सफलतापूर्वक भेजा गया!',
    error: 'कनेक्शन एरर: ',
    required: 'कृपया सभी आवश्यक फ़ील्ड भरें।'
  },
  en: {
    title: 'Contact Us',
    sub: 'We are here to help',
    address: 'Address',
    addressVal: 'Deesa, Banaskantha, Gujarat - 385535',
    hours: 'Hours',
    hoursVal: 'Mon - Sat: 9:00 AM - 7:00 PM',
    sunday: 'Sunday: By Appointment',
    email: 'Email',
    emailVal: 'info@swastikainterlocking.com',
    askQuestion: 'Ask Any Question',
    name: 'Your Name',
    phone: 'Phone Number',
    division: 'Which Division?',
    divisionBuilding: 'Building Materials (Dilip Chaubey)',
    divisionPipes: 'Pipes Division (Alok Chaubey)',
    divisionGeneral: 'General Inquiry',
    message: 'Your Message',
    sendBtn: 'Send Message',
    sending: 'Sending...',
    success: 'Message sent successfully!',
    error: 'Connection error: ',
    required: 'Please fill all required fields.'
  }
};

export default function Contact({ language }) {
  const t = TRANSLATIONS[language];
  const { profile } = useAuth();
  
  const [contactForm, setContactForm] = useState({ 
    name: profile?.full_name || '', 
    phone: profile?.phone || '', 
    division: 'general',
    message: '' 
  });
  const [formStatus, setFormStatus] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  return (
    <main className="pt-16 pb-20 px-gutter max-w-container-max mx-auto min-h-screen">
      <SEOHead
        title="Contact Swastika Interlocking - Deesa Gujarat | Call WhatsApp"
        description="Contact Swastika Interlocking in Deesa, Gujarat. Call or WhatsApp for paver blocks, shuttering rental, RCC roads, and pipes solutions."
        keywords="Swastika Interlocking contact, paver blocks Deesa, Dilip Chaubey, Alok Chaubey, pipes solutions Deesa Gujarat"
        url="/contact"
        breadcrumb={getBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])}
        language={language}
      />
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/95 to-primary/85"></div>
        <div className="max-w-container-max mx-auto px-gutter relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-display-lg text-white mb-4">{t.title}</h1>
          <p className="text-xl text-white/90">{t.sub}</p>
        </div>
      </section>

      {/* Owner Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Dilip Card - Building Materials */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-primary/10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-primary">apartment</span>
            </div>
            <div>
              <h3 className="font-display-md text-2xl font-bold text-on-surface">Dilip Chaubey</h3>
              <p className="text-primary font-semibold">Building Materials, Shuttering, RCC Roads</p>
            </div>
          </div>
          <p className="text-on-surface-variant mb-6">
            {language === 'hi' 
              ? 'पेवर ब्लॉक, निर्माण सामग्री, शटरिंग किराए और RCC सड़क के लिए संपर्क करें।' 
              : 'Contact for paver blocks, building materials, shuttering rental, and RCC roads.'}
          </p>
          <div className="flex gap-3 flex-wrap">
            <a 
              href="tel:+918400936290" 
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
            >
              <span className="material-symbols-outlined">call</span>
              Call Now
            </a>
            <a 
              href="https://wa.me/918400936290" 
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#1DA852] transition-colors"
            >
              <span className="material-symbols-outlined">chat</span>
              WhatsApp
            </a>
          </div>
        </div>

        {/* Alok Card - Pipes Division */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#1565C0]/10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-[#1565C0]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-[#1565C0]">plumbing</span>
            </div>
            <div>
              <h3 className="font-display-md text-2xl font-bold text-on-surface">Alok Chaubey</h3>
              <p className="text-[#1565C0] font-semibold">Drainage Pipes, Water Supply, Pool Pipes</p>
            </div>
          </div>
          <p className="text-on-surface-variant mb-6">
            {language === 'hi' 
              ? 'ड्रेनेज पाइप, जल आपूर्ति, पूल निर्माण और औद्योगिक पाइपिंग के लिए संपर्क करें।' 
              : 'Contact for drainage pipes, water supply, pool construction, and industrial piping.'}
          </p>
          <div className="flex gap-3 flex-wrap">
            <a 
              href="tel:+919722832661" 
              className="flex items-center gap-2 px-6 py-3 bg-[#1565C0] text-white rounded-xl font-semibold hover:bg-[#0D47A1] transition-colors"
            >
              <span className="material-symbols-outlined">call</span>
              Call Now
            </a>
            <a 
              href="https://wa.me/919722832661" 
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#1DA852] transition-colors"
            >
              <span className="material-symbols-outlined">chat</span>
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Business Info & Map */}
        <div className="space-y-8">
          {/* Business Info Card */}
          <div className="bg-surface-container-low p-8 rounded-2xl shadow-sm border border-surface-variant/30">
            <h3 className="font-display-md text-xl font-bold mb-6">Business Info</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-outline mb-1">{t.address}</p>
                <p className="text-on-surface">{t.addressVal}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-outline mb-1">{t.email}</p>
                <p className="text-on-surface">{t.emailVal}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-outline mb-1">{t.hours}</p>
                <p className="text-on-surface">{t.hoursVal}</p>
                <p className="text-sm text-on-surface-variant mt-1">{t.sunday}</p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-sm border border-surface-variant/30 h-[400px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117221.1253096064!2d72.02875669726562!3d24.258026299999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395f0238e70a6cc1%3A0xfbb80d9656a55c88!2sDeesa%2C%20Gujarat%20385535!5e0!3m2!1sen!2sin!4v1781134000000!5m2!1sen!2sin"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map Location"
            />
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface-variant/30">
          <h3 className="font-display-md text-xl font-bold mb-2">{t.askQuestion}</h3>

          {formStatus && (
            <div className={`p-4 rounded-lg font-bold text-sm mb-6 ${formSuccess ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {formSuccess ? '✅ ' : '❌ '}{formStatus}
            </div>
          )}

          <form className="space-y-6" onSubmit={async (e) => {
            e.preventDefault();
            if (!contactForm.name || !contactForm.phone || !contactForm.message) {
              setFormStatus(t.required);
              setFormSuccess(false);
              return;
            }
            setFormLoading(true);
            setFormStatus('');
            try {
              await createInquiry({
                customer_name: contactForm.name,
                customer_phone: contactForm.phone,
                customer_id: profile?.id || null,
                message: contactForm.message,
                requirements: contactForm.message,
                source: `contact_form_${contactForm.division}`,
                subject: `Inquiry - ${t[`division${contactForm.division.charAt(0).toUpperCase() + contactForm.division.slice(1)}`]}`,
              });
              setFormSuccess(true);
              setFormStatus(t.success);
              setContactForm({ name: '', phone: '', division: 'general', message: '' });
            } catch (err) {
              setFormSuccess(false);
              setFormStatus(t.error + err.message);
            } finally {
              setFormLoading(false);
            }
          }}>
            <div>
              <label className="block text-sm font-medium mb-2 text-on-surface">{t.name} *</label>
              <input
                type="text"
                value={contactForm.name}
                onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
                className="w-full bg-white border border-outline-variant/50 rounded-xl p-3 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-on-surface">{t.phone} *</label>
              <input
                type="tel"
                value={contactForm.phone}
                onChange={e => setContactForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                className="w-full bg-white border border-outline-variant/50 rounded-xl p-3 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                maxLength={10}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-on-surface">{t.division}</label>
              <select
                value={contactForm.division}
                onChange={e => setContactForm(p => ({ ...p, division: e.target.value }))}
                className="w-full bg-white border border-outline-variant/50 rounded-xl p-3 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
              >
                <option value="general">{t.divisionGeneral}</option>
                <option value="building">{t.divisionBuilding}</option>
                <option value="pipes">{t.divisionPipes}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-on-surface">{t.message} *</label>
              <textarea
                rows="4"
                value={contactForm.message}
                onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                className="w-full bg-white border border-outline-variant/50 rounded-xl p-3 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {formLoading ? t.sending : t.sendBtn}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
