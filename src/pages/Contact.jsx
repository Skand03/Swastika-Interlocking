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
      const response = await fetch('./api/chat.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.text })
      });
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
    <main class="pt-32 pb-20 px-gutter max-w-container-max mx-auto min-h-screen">
      {/* Hero Section */}
      <section class="mb-16 text-center md:text-left select-none animate-fade-in">
        <h1 class="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-4">{t.title}</h1>
        <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
          {t.sub}
        </p>
      </section>

      {/* Bento Contact & Chat Layout */}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Contact Info & Details Bento Grid */}
        <div class="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Map Placeholder */}
          <div class="md:col-span-12 rounded-xl overflow-hidden bento-card h-[350px] relative group border border-surface-variant/30 select-none shadow-sm">
            <img 
              class="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 transition-all duration-700" 
              alt="Industrial Map Layout"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNYbCTNUNbtXHduKpSg5bWwPGFefJK-kjlJwvQkVcGU8Hf4Hx2FD31tf1iNRTqnnNIPWiMv0ynVzefPnzmLgv4YTcEMMFtqEJo-sDVsIEtZSQU4cidP-3dtIs2ofam17CAeF8MP6w13fID77Qz5WBUEMBFANvKjEp31Djb03h2ggkLsoaIKkAYMvTRrutIuyG5fvkm8POhFLKCQeC3PCOLEqCeYTCwEqfDSWtqHB_TiTuDkQOyP1l71ywkrc05ay33V6opwD_0qYs"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-surface-container/60 to-transparent flex items-end p-6">
              <div class="bg-surface-bright p-4 rounded-lg shadow-sm border border-outline-variant/30">
                <p class="font-label-sm text-label-sm text-primary mb-1 uppercase tracking-wider">{t.industrialHub}</p>
                <h3 class="font-headline-md text-headline-md text-on-surface font-semibold">{t.mfgUnit}</h3>
              </div>
            </div>
          </div>

          {/* Address Card */}
          <div class="md:col-span-6 p-card-padding bento-card rounded-xl flex flex-col gap-4 border border-surface-variant/30 shadow-sm">
            <div class="flex items-center gap-4 text-primary select-none font-semibold">
              <span class="material-symbols-outlined">location_on</span>
              <h4 class="font-headline-md text-headline-md">{t.address}</h4>
            </div>
            <div class="space-y-3">
              <div>
                <p class="font-label-sm text-label-sm text-outline mb-1">ENGLISH</p>
                <p class="font-body-md text-body-md text-on-surface leading-relaxed">Plot 42, Industrial Area Phase II, Okhla, New Delhi - 110020</p>
              </div>
              <div class="pt-2 border-t border-outline-variant/20">
                <p class="font-label-sm text-label-sm text-outline mb-1">HINDI</p>
                <p class="font-body-md text-body-md text-on-surface leading-relaxed">प्लाट ४२, औद्योगिक क्षेत्र फेज II, ओखला, नई दिल्ली - ११००२०</p>
              </div>
            </div>
          </div>

          {/* Call Card */}
          <div class="md:col-span-6 p-card-padding bento-card rounded-xl flex flex-col gap-4 border border-surface-variant/30 shadow-sm justify-between">
            <div class="flex items-center gap-4 text-primary select-none font-semibold">
              <span class="material-symbols-outlined">call</span>
              <h4 class="font-headline-md text-headline-md">{t.callUs}</h4>
            </div>
            <div class="flex flex-col gap-3 py-2">
              <a class="font-body-lg text-body-lg font-bold text-on-surface hover:text-primary transition-colors flex items-center gap-2" href="tel:+919876543210">
                <span class="material-symbols-outlined text-sm shrink-0">call</span>
                +91 98765 43210
              </a>
              <a class="font-body-lg text-body-lg font-bold text-on-surface hover:text-primary transition-colors flex items-center gap-2" href="tel:+91112345678">
                <span class="material-symbols-outlined text-sm shrink-0">call</span>
                +91 11 2345 678
              </a>
            </div>
          </div>

          {/* WhatsApp CTA (Wide) */}
          <div class="md:col-span-12">
            <a 
              class="w-full bg-[#1b6d24] hover:bg-[#217128] text-white p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all shadow-sm hover:shadow-md active:scale-[0.99] cursor-pointer" 
              href="https://wa.me/919876543210" 
              target="_blank" 
              rel="noreferrer"
            >
              <div class="flex items-center gap-6">
                <div class="bg-white/20 p-4 rounded-full flex items-center justify-center shrink-0 select-none">
                  <span class="material-symbols-outlined scale-150">chat</span>
                </div>
                <div class="text-center md:text-left">
                  <h3 class="font-headline-md text-headline-md font-bold mb-1">{t.waHeader}</h3>
                  <p class="font-body-md text-body-md opacity-90">{t.waSub}</p>
                </div>
              </div>
              <div class="bg-white text-secondary font-bold px-8 py-3 rounded-full flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-widest group shrink-0">
                {t.waCTA} 
                <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </a>
          </div>

          {/* Additional Info Cards */}
          <div class="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-card-padding bento-card rounded-xl border border-surface-variant/30 shadow-sm flex flex-col justify-between">
              <div>
                <span class="material-symbols-outlined text-primary mb-4 select-none">mail</span>
                <h5 class="font-headline-md text-headline-md mb-2 font-semibold">{t.email}</h5>
              </div>
              <div class="space-y-1">
                <p class="font-body-md text-body-md text-on-surface-variant">sales@swastikainterlocking.com</p>
                <p class="font-body-md text-body-md text-on-surface-variant">info@swastikainterlocking.com</p>
              </div>
            </div>
            
            <div class="p-card-padding bento-card rounded-xl border border-surface-variant/30 shadow-sm flex flex-col justify-between">
              <div>
                <span class="material-symbols-outlined text-primary mb-4 select-none">schedule</span>
                <h5 class="font-headline-md text-headline-md mb-2 font-semibold">{t.hours}</h5>
              </div>
              <div class="space-y-1">
                <p class="font-body-md text-body-md text-on-surface-variant">{t.hoursVal}</p>
                <p class="font-body-md text-body-md text-on-surface-variant">{t.sunday}</p>
              </div>
            </div>

            <div class="p-card-padding bento-card rounded-xl border border-surface-variant/30 shadow-sm flex flex-col justify-between">
              <div>
                <span class="material-symbols-outlined text-primary mb-4 select-none">link</span>
                <h5 class="font-headline-md text-headline-md mb-2 font-semibold">{t.social}</h5>
              </div>
              <div class="flex gap-4">
                <a class="text-on-surface-variant hover:text-primary transition-all underline" href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
                <a class="text-on-surface-variant hover:text-primary transition-all underline" href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Embedded Chatbot Container */}
        <div class="lg:col-span-5 bg-surface rounded-2xl border border-surface-variant/30 shadow-md overflow-hidden flex flex-col h-[525px]">
          {/* Chat Header */}
          <div class="bg-primary p-4 flex items-center gap-3 text-white select-none">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">smart_toy</span>
            </div>
            <div>
              <h3 class="font-bold text-sm leading-tight">{t.chatHeader}</h3>
              <p class="text-[10px] text-white/80">{t.chatStatus}</p>
            </div>
          </div>

          {/* Chat message body */}
          <div class="flex-grow p-4 overflow-y-auto space-y-4 bg-surface-container-low">
            {messages.map(msg => (
              <div 
                key={msg.id} 
                class={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  class={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-surface border border-outline-variant/30 text-on-surface rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div class="flex justify-start">
                <div class="bg-surface border border-outline-variant/30 text-on-surface rounded-2xl rounded-tl-none p-3 text-sm flex items-center gap-1.5 shadow-sm">
                  <span class="w-2 h-2 bg-on-surface/40 rounded-full animate-bounce"></span>
                  <span class="w-2 h-2 bg-on-surface/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span class="w-2 h-2 bg-on-surface/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} class="p-3 border-t border-surface-variant/30 bg-surface flex items-center gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t.chatPlaceholder}
              class="flex-grow bg-surface-container border border-outline/20 p-3 rounded-xl text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            />
            <button 
              type="submit" 
              class="w-11 h-11 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-container active:scale-95 transition-all cursor-pointer"
            >
              <span class="material-symbols-outlined text-lg leading-none">{t.sendBtn}</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
