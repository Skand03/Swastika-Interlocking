import React, { useState } from 'react';
import { createInquiry } from '../services/inquiryService';
import { useAuth } from '../auth/AuthContext';
import SEOHead from '../components/SEO/SEOHead';
import { getBreadcrumbSchema } from '../components/SEO/schemas';

const MARQUEE_ITEMS = [
  '✓ 10+ Years Experience',
  '🧱 Interlocking Paver Blocks',
  '🏗 Shuttering Materials',
  '🚰 RCC Pipes',
  '🛣 RCC Road Solutions',
  '📍 Serving Kauriram & Gorakhpur Region',
  '✓ Quality Assured Materials',
  '📞 Direct Owner Support',
  '🚚 Fast Delivery Available',
  '✓ Trusted by Contractors & Homeowners',
];

const TRANSLATIONS = {
  hi: {
    title: 'संपर्क करें',
    sub: 'हम आपकी मदद के लिए यहाँ हैं',
    address: 'पता',
    addressVal: 'गिरधारपुर उंचेर कौरीराम, उत्तर प्रदेश - 273413',
    hours: 'कार्य समय',
    hoursVal: 'सोम - शनि: 9:00 AM - 7:00 PM',
    sunday: 'रविवार: अपॉइंटमेंट पर',
    email: 'ईमेल',
    emailVal: 'skandchaubey03@gmail.com',
    askQuestion: 'कोई भी सवाल पूछें',
    name: 'आपका नाम',
    phone: 'फोन नंबर',
    division: 'विभाग चुनें',
    divisionBuilding: 'बिल्डिंग मैटेरियल्स',
    divisionShuttering: 'शटरिंग',
    divisionRcc: 'RCC सड़कें',
    divisionGeneral: 'सामान्य संपर्क',
    message: 'आपका संदेश',
    sendBtn: 'भेजें',
    sending: 'भेजा जा रहा है...',
    success: 'संदेश सफलतापूर्वक भेजा गया!',
    error: 'कनेक्शन एरर: ',
    required: 'कृपया सभी आवश्यक फील्ड भरें।'
  },
  en: {
    title: 'Contact Us',
    sub: 'We are here to help',
    address: 'Address',
    addressVal: 'Girdharpur Uncher Kauriram, Uttar Pradesh - 273413',
    hours: 'Hours',
    hoursVal: 'Mon - Sat: 9:00 AM - 7:00 PM',
    sunday: 'Sunday: By Appointment',
    email: 'Email',
    emailVal: 'skandchaubey03@gmail.com',
    askQuestion: 'Ask Any Question',
    name: 'Your Name',
    phone: 'Phone Number',
    division: 'Which Division?',
    divisionBuilding: 'Building Materials',
    divisionShuttering: 'Shuttering',
    divisionRcc: 'RCC Roads',
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
    <main className="pt-16 pb-12 md:pb-20 px-4 md:px-gutter max-w-container-max mx-auto min-h-screen">
      <SEOHead
        title="Contact Swastika Interlocking - Girdharpur UP"
        description="Contact Swastika Interlocking in Girdharpur Uncher Kauriram, Uttar Pradesh. Call or WhatsApp for paver blocks, shuttering rental, RCC roads."
        keywords="Swastika Interlocking contact, paver blocks Girdharpur, RCC roads Uttar Pradesh"
        url="/contact"
        breadcrumb={getBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])}
        language={language}
      />
      <section className="relative py-12 md:py-16 overflow-hidden mb-8 md:mb-12">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 to-primary/85"></div>
        <div className="max-w-container-max mx-auto px-4 md:px-gutter relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-display-lg text-white mb-4">{t.title}</h1>
          <p className="text-base md:text-xl text-white/90">{t.sub}</p>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="bg-[#1a1a3e] py-3 md:py-4 overflow-hidden mb-8 md:mb-12">
        <div className="flex items-center gap-6 md:gap-8 animate-marquee whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((text, i) => (
            <div key={i} className="flex items-center gap-2 md:gap-3 text-white text-xs md:text-sm font-semibold">
              {text}
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
        <div className="space-y-6 md:space-y-8">
          <div className="bg-surface-container-low p-6 md:p-8 rounded-2xl shadow-sm border border-surface-variant/30">
            <h3 className="font-display-md text-lg md:text-xl font-bold mb-4 md:mb-6">Business Info</h3>
            <div className="space-y-3 md:space-y-4">
              <div>
                <p className="text-xs font-semibold text-outline mb-1">{t.address}</p>
                <p className="text-sm md:text-base text-on-surface">{t.addressVal}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-outline mb-1">{t.email}</p>
                <p className="text-sm md:text-base text-on-surface">{t.emailVal}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-outline mb-1">{t.hours}</p>
                <p className="text-sm md:text-base text-on-surface">{t.hoursVal}</p>
                <p className="text-xs md:text-sm text-on-surface-variant mt-1">{t.sunday}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-surface-variant/30">
          <h3 className="font-display-md text-lg md:text-xl font-bold mb-2">{t.askQuestion}</h3>

          {formStatus && (
            <div className={`p-3 md:p-4 rounded-lg font-bold text-xs md:text-sm mb-4 md:mb-6 ${formSuccess ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {formSuccess ? '✅ ' : '❌ '}{formStatus}
            </div>
          )}

          <form className="space-y-4 md:space-y-6" onSubmit={async (e) => {
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
                source: `contact_form_${contactForm.division}`,
                division: contactForm.division === 'building' ? 'building_materials' : contactForm.division,
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
                <option value="shuttering">{t.divisionShuttering}</option>
                <option value="rcc">{t.divisionRcc}</option>
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
              className="w-full bg-primary text-on-primary py-3 md:py-4 rounded-xl font-bold hover:bg-primary-container hover:-translate-y-1 active:scale-95 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {formLoading ? t.sending : t.sendBtn}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
