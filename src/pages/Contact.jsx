import React, { useState, useEffect, useRef } from 'react';
import { createInquiry } from '../services/inquiryService';
import { useAuth } from '../auth/AuthContext';

// Local AI chatbot — rule-based responses, no PHP needed
const getChatbotResponse = (message, language) => {
  const msg = message.toLowerCase();
  
  const responses = {
    hi: [
      { keywords: ['price', 'cost', 'rate', 'कीमत', 'दाम', 'रेट'], 
        response: 'हमारे इंटरलॉकिंग ब्लॉक की कीमत साइज़ और क्वालिटी के अनुसार अलग होती है। सटीक कोटेशन के लिए कृपया हमें कॉल करें: +91 84009 36290 या WhatsApp पर संपर्क करें।' },
      { keywords: ['order', 'book', 'ऑर्डर', 'बुक'], 
        response: 'ऑर्डर बुक करने के लिए आप हमारी "Order" पेज पर जाएं या सीधे +91 84009 36290 पर कॉल करें।' },
      { keywords: ['delivery', 'deliver', 'डिलीवरी', 'शिपिंग'], 
        response: 'हम पूरे उत्तर प्रदेश में डिलीवरी करते हैं। ऑर्डर कन्फर्म होने के बाद 3-5 कार्य दिवसों में डिलीवरी होती है।' },
      { keywords: ['shuttering', 'shutter', 'शटरिंग'], 
        response: 'हम स्टील प्लेट्स, H-फ्रेम, प्रॉप्स और क्लैंप्स किराए और बिक्री के लिए उपलब्ध करते हैं। जानकारी के लिए /shuttering पेज देखें।' },
      { keywords: ['rcc', 'road', 'सड़क', 'आरसीसी'], 
        response: 'हम RCC सड़क निर्माण का पूरा काम करते हैं — सर्वे से लेकर हैंडओवर तक। enquiry के लिए /rcc-enquiry पर जाएं।' },
      { keywords: ['product', 'products', 'उत्पाद', 'सामान'], 
        response: 'हमारे पास इंटरलॉकिंग पेवर ब्लॉक, सीमेंट, रेत, बजरी और पाइप्स उपलब्ध हैं। पूरी सूची के लिए /products पेज देखें।' },
      { keywords: ['contact', 'address', 'location', 'संपर्क', 'पता'], 
        response: 'हमारा पता: गिरधरपुर ऊंचर, कौड़ीराम, उत्तर प्रदेश। फोन: +91 84009 36290, +91 79059 87260' },
    ],
    en: [
      { keywords: ['price', 'cost', 'rate', 'how much', 'pricing'], 
        response: 'Our interlocking block prices vary by size and quality. For an accurate quote, please call us at +91 84009 36290 or WhatsApp us.' },
      { keywords: ['order', 'book', 'purchase', 'buy'], 
        response: 'To book an order, visit our "Order" page or call us directly at +91 84009 36290.' },
      { keywords: ['delivery', 'deliver', 'shipping', 'dispatch'], 
        response: 'We deliver across Uttar Pradesh. Delivery takes 3-5 working days after order confirmation.' },
      { keywords: ['shuttering', 'shutter', 'scaffold', 'formwork'], 
        response: 'We offer steel plates, H-frames, props and clamps for rent and sale. Check our /shuttering page for details.' },
      { keywords: ['rcc', 'road', 'construction', 'project'], 
        response: 'We handle complete RCC road construction from survey to handover. Submit an enquiry at /rcc-enquiry.' },
      { keywords: ['product', 'products', 'catalogue', 'catalog'], 
        response: 'We offer interlocking paver blocks, cement, sand, gravel, and pipes. See our full catalog at /products.' },
      { keywords: ['contact', 'address', 'location', 'where'], 
        response: 'Address: Girdharpur Unchar, Kauriram, Uttar Pradesh. Phone: +91 84009 36290, +91 79059 87260' },
    ]
  };

  const langResponses = responses[language] || responses.en;
  
  for (const item of langResponses) {
    if (item.keywords.some(k => msg.includes(k))) {
      return item.response;
    }
  }
  
  return language === 'hi'
    ? 'मैं इस सवाल का जवाब नहीं दे सकता। कृपया हमें +91 84009 36290 पर कॉल करें या WhatsApp करें।'
    : 'I am not sure about that. Please call us at +91 84009 36290 or WhatsApp for a quick response!';
};

const TRANSLATIONS = {
  hi: {
    title: 'विशेषज्ञों से संपर्क करें',
    sub: 'टिकाऊ, भारी-शुल्क वाले पेवर समाधानों के लिए स्वस्तिका इंटरलॉकिंग से जुड़ें। हम अटूट विश्वास के साथ आपके बुनियादी ढांचे का निर्माण करने के लिए यहां हैं।',
    mfgUnit: 'मुख्य विनिर्माण इकाई',
    industrialHub: 'औद्योगिक हब',
    address: 'पता / Address',
    callUs: 'कॉल करें / Call Us',
    waHeader: 'WhatsApp बिज़नेस सपोर्ट',
    waSub: 'हिन्दी और अंग्रेजी में त्वरित उद्धरण और तकनीकी सहायता।',
    waCTA: 'संपर्क करें',
    email: 'ईमेल / Email',
    hours: 'कार्य समय / Hours',
    hoursVal: 'सोम - शनि: सुबह 9:00 बजे - शाम 7:00 बजे',
    sunday: 'रविवार: बंद',
    social: 'सोशल / Social',
    chatHeader: 'स्वस्तिका सहायक',
    chatStatus: 'ऑनलाइन',
    chatPlaceholder: 'उत्पादों, कीमतों या आकार के बारे में पूछें...',
    sendBtn: 'भेजें',
    welcomeMsg: 'नमस्ते! स्वस्तिका इंटरलॉकिंग में आपका स्वागत है। मैं आपकी सहायता के लिए यहाँ हूँ। आप मुझसे हमारे उत्पादों, कीमतों या ऑर्डर बुकिंग के बारे में पूछ सकते हैं।',
    typing: 'टाइप कर रहा है...',
    errorMsg: 'कनेक्शन में त्रुटि हुई। कृपया पुनः प्रयास करें।'
  },
  en: {
    title: 'Contact Our Experts',
    sub: 'Connect with Swastika Interlocking for durable, heavy-duty paver solutions. We are here to help build your infrastructure with unshakeable trust.',
    mfgUnit: 'Main Manufacturing Unit',
    industrialHub: 'Industrial Hub',
    address: 'Address',
    callUs: 'Call Us',
    waHeader: 'WhatsApp Business Support',
    waSub: 'Instant quotes and technical support in Hindi and English.',
    waCTA: 'Get In Touch',
    email: 'Email',
    hours: 'Hours',
    hoursVal: 'Mon - Sat: 9:00 AM - 7:00 PM',
    sunday: 'Sunday: Closed',
    social: 'Social',
    chatHeader: 'Swastika Assistant',
    chatStatus: 'Online',
    chatPlaceholder: 'Ask about products, price, custom sizes...',
    sendBtn: 'Send',
    welcomeMsg: 'Hello! Welcome to Swastika Interlocking. I am here to assist you. You can ask me about our products, pricing, or order booking.',
    typing: 'Typing...',
    errorMsg: 'Connection error. Please try again.'
  }
};

export default function Contact({ language }) {
  const t = TRANSLATIONS[language];
  const { profile } = useAuth();
  
  // Chatbot state
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Contact form state (separate from chatbot)
  const [contactForm, setContactForm] = useState({ 
    name: profile?.full_name || '', 
    phone: profile?.phone || '', 
    message: '' 
  });
  const [formStatus, setFormStatus] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: TRANSLATIONS[language].welcomeMsg
      }
    ]);
  }, [language]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getChatbotResponse(userMessage.text, language);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botResponse
        }
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <main className="pt-32 pb-20 px-gutter max-w-container-max mx-auto min-h-screen">
      {/* Hero Section */}
      <section className="mb-16 text-center md:text-left select-none animate-fade-in">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-4">{t.title}</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
          {t.sub}
        </p>
      </section>

      {/* Bento Contact Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Map on Left */}
        <div className="lg:col-span-5 rounded-xl overflow-hidden shadow-sm border border-surface-variant/30 h-full min-h-[500px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3570.661898870162!2d83.44953537542526!3d26.49882887689632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjbCsDI5JzU1LjgiTiA4M8KwMjcnMDcuNiJF!5e0!3m2!1sen!2sin!4v1780881087813!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{border: 0, minHeight: '500px'}} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map Location"
          ></iframe>
        </div>

        {/* Contact Cards on Right */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Address Card */}
            <div className="p-card-padding bento-card rounded-xl flex flex-col gap-4 border border-surface-variant/30 shadow-sm">
            <div className="flex items-center gap-4 text-primary select-none font-semibold">
              <span className="material-symbols-outlined">location_on</span>
              <h4 className="font-headline-md text-headline-md">{t.address}</h4>
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-label-sm text-label-sm text-outline mb-1">ENGLISH</p>
                <p className="font-body-md text-body-md text-on-surface leading-relaxed">Girdharpur uncher, Kauriram, Uttar Pradesh</p>
              </div>
              <div className="pt-2 border-t border-outline-variant/20">
                <p className="font-label-sm text-label-sm text-outline mb-1">HINDI</p>
                <p className="font-body-md text-body-md text-on-surface leading-relaxed">गिरधरपुर ऊंचर, कौड़ीराम, उत्तर प्रदेश</p>
              </div>
            </div>
          </div>

          {/* Call Card */}
          <div className="p-card-padding bento-card rounded-xl flex flex-col gap-4 border border-surface-variant/30 shadow-sm justify-between">
            <div className="flex items-center gap-4 text-primary select-none font-semibold">
              <span className="material-symbols-outlined">call</span>
              <h4 className="font-headline-md text-headline-md">{t.callUs}</h4>
            </div>
            <div className="flex flex-col gap-3 py-2">
              <a className="font-body-lg text-body-lg font-bold text-on-surface hover:text-primary transition-colors flex items-center gap-2" href="tel:+918400936290">
                <span className="material-symbols-outlined text-sm shrink-0">call</span>
                +918400936290
              </a>
              <a className="font-body-lg text-body-lg font-bold text-on-surface hover:text-primary transition-colors flex items-center gap-2" href="tel:+917905887340">
                <span className="material-symbols-outlined text-sm shrink-0">call</span>
                +917905887340
              </a>
              <a className="font-body-lg text-body-lg font-bold text-on-surface hover:text-primary transition-colors flex items-center gap-2" href="tel:+919722832661">
                <span className="material-symbols-outlined text-sm shrink-0">call</span>
                +919722832661
              </a>

            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-card-padding bento-card rounded-xl border border-surface-variant/30 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl select-none">✉️</span>
                <h5 className="font-headline-md text-headline-md font-semibold">{t.email}</h5>
              </div>
              <div className="space-y-1">
                <p className="font-body-md text-body-md text-on-surface-variant">sales@swastikainterlocking.com</p>
                <p className="font-body-md text-body-md text-on-surface-variant">info@swastikainterlocking.com</p>
              </div>
            </div>

            <div className="p-card-padding bento-card rounded-xl border border-surface-variant/30 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl select-none">🔗</span>
                <h5 className="font-headline-md text-headline-md font-semibold">{t.social}</h5>
              </div>
              <div className="flex gap-4">
                <a className="text-on-surface-variant hover:text-primary transition-all underline" href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
                <a className="text-on-surface-variant hover:text-primary transition-all underline" href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <section className="mt-16 max-w-3xl mx-auto">
        <div className="bg-surface-container-low p-8 sm:p-10 rounded-2xl shadow-sm border border-surface-variant/30">
          <h3 className="font-headline-md text-headline-md mb-2">{language === 'hi' ? 'हमें एक संदेश भेजें' : 'Send us a Message'}</h3>
          <p className="text-on-surface-variant mb-8 text-sm">
            {language === 'hi' 
              ? 'कोई प्रश्न है? नीचे फॉर्म भरें और हमारी टीम आपसे संपर्क करेगी।' 
              : 'Have a question? Fill out the form below and our team will get back to you.'}
          </p>

          {formStatus && (
            <div className={`p-4 rounded-lg font-bold text-sm mb-6 ${formSuccess ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {formSuccess ? '✅ ' : '❌ '}{formStatus}
            </div>
          )}

          <form className="space-y-6" onSubmit={async (e) => {
            e.preventDefault();
            if (!contactForm.name || !contactForm.phone || !contactForm.message) {
              setFormStatus(language === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें।' : 'Please fill all required fields.');
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
                source: 'contact_form',
                subject: 'Contact Form Submission',
              });
              setFormSuccess(true);
              setFormStatus(language === 'hi' ? 'संदेश सफलतापूर्वक भेजा गया!' : 'Message sent successfully!');
              setContactForm({ name: '', phone: '', message: '' });
            } catch (err) {
              setFormSuccess(false);
              setFormStatus((language === 'hi' ? 'कनेक्शन एरर: ' : 'Error: ') + err.message);
            } finally {
              setFormLoading(false);
            }
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-on-surface">
                  {language === 'hi' ? 'नाम *' : 'Name *'}
                </label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-white border border-outline-variant/50 rounded-xl p-3 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                  placeholder={language === 'hi' ? 'अपना नाम दर्ज करें' : 'Enter your name'}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-on-surface">
                  {language === 'hi' ? 'फोन नंबर *' : 'Phone Number *'}
                </label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={e => setContactForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                  className="w-full bg-white border border-outline-variant/50 rounded-xl p-3 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                  placeholder={language === 'hi' ? '10-अंकीय मोबाइल नंबर' : '10-digit mobile number'}
                  maxLength={10}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-on-surface">
                {language === 'hi' ? 'संदेश *' : 'Message *'}
              </label>
              <textarea
                rows="4"
                value={contactForm.message}
                onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                className="w-full bg-white border border-outline-variant/50 rounded-xl p-3 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                placeholder={language === 'hi' ? 'आप क्या जानना चाहते हैं?' : 'How can we help you?'}
                required
              />
            </div>
            <button
              type="submit"
              disabled={formLoading}
              className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {formLoading
                ? (language === 'hi' ? 'भेजा जा रहा है...' : 'Sending...')
                : (language === 'hi' ? 'संदेश भेजें' : 'Send Message')}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
