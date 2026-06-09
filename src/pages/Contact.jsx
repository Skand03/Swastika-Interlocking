import React, { useState, useEffect, useRef } from 'react';

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
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

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

    try {
      const response = await fetch('/api/chat.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.text })
      });
      
      if (response.status !== 200) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      const result = await response.json();
      
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: result.response || (language === 'hi' ? 'माफ़ कीजिये, मैं समझ नहीं पाया।' : "Sorry, I didn't quite catch that.")
          }
        ]);
        setIsTyping(false);
      }, 600);
    } catch (err) {
      console.error(err);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: t.errorMsg
          }
        ]);
        setIsTyping(false);
      }, 600);
    }
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
              ? 'कोई प्रश्न है जैसे "आपका कार्यालय कहाँ है?" या "क्या आप थोक में बिक्री करते हैं?" - कृपया नीचे दिए गए फॉर्म को भरें और हमारी टीम आपसे संपर्क करेगी।' 
              : 'Have a question like "Where is your office?" or "Do you do wholesale?" - Please fill out the form below and our team will get back to you.'}
          </p>

          <form className="space-y-6" onSubmit={async (e) => {
            e.preventDefault();
            if (!inputValue.name || !inputValue.phone || !inputValue.message) {
              setMessages([{ type: 'error', text: language === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें।' : 'Please fill all required fields.' }]);
              return;
            }
            setIsTyping(true);
            try {
              const res = await fetch('/api/submit_contact.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: inputValue.name, phone: inputValue.phone, requirements: inputValue.message })
              });
              if (res.status !== 200) {
                throw new Error(`HTTP Error ${res.status}`);
              }
              const data = await res.json();
              if (data.success) {
                setMessages([{ type: 'success', text: language === 'hi' ? 'संदेश सफलतापूर्वक भेजा गया!' : 'Message sent successfully!' }]);
                setInputValue({ name: '', phone: '', message: '' });
              } else {
                setMessages([{ type: 'error', text: data.message || 'Error submitting form.' }]);
              }
            } catch (err) {
              setMessages([{ type: 'error', text: (language === 'hi' ? 'कनेक्शन एरर: ' : 'Connection error: ') + err.message }]);
            } finally {
              setIsTyping(false);
            }
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-on-surface">
                  {language === 'hi' ? 'नाम *' : 'Name *'}
                </label>
                <input 
                  type="text" 
                  value={inputValue.name || ''} 
                  onChange={e => setInputValue({...inputValue, name: e.target.value})}
                  className="w-full bg-white border border-outline-variant/50 rounded-xl p-3 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                  placeholder={language === 'hi' ? 'अपना नाम दर्ज करें' : 'Enter your name'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-on-surface">
                  {language === 'hi' ? 'फोन नंबर *' : 'Phone Number *'}
                </label>
                <input 
                  type="tel" 
                  value={inputValue.phone || ''} 
                  onChange={e => setInputValue({...inputValue, phone: e.target.value})}
                  className="w-full bg-white border border-outline-variant/50 rounded-xl p-3 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                  placeholder={language === 'hi' ? '10-अंकीय मोबाइल नंबर' : '10-digit mobile number'}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-on-surface">
                {language === 'hi' ? 'संदेश *' : 'Message *'}
              </label>
              <textarea 
                rows="4" 
                value={inputValue.message || ''} 
                onChange={e => setInputValue({...inputValue, message: e.target.value})}
                className="w-full bg-white border border-outline-variant/50 rounded-xl p-3 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                placeholder={language === 'hi' ? 'आप क्या जानना चाहते हैं?' : 'How can we help you?'}
              ></textarea>
            </div>

            {messages.length > 0 && messages[0].type && (
              <div className={`p-4 rounded-lg font-bold text-sm ${messages[0].type === 'error' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
                {messages[0].text}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isTyping}
              className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isTyping 
                ? (language === 'hi' ? 'भेजा जा रहा है...' : 'Sending...') 
                : (language === 'hi' ? 'संदेश भेजें' : 'Send Message')}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
