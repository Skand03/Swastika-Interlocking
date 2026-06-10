import React, { useState, useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────
// KNOWLEDGE BASE — covers every section of the website
// ─────────────────────────────────────────────────────────
const KB = {
  en: [
    // Greetings
    {
      match: (m) => /^(hi|hello|helo|hey|namaste|good\s*(morning|afternoon|evening)|howdy|sup|greet)/i.test(m),
      response: "Hello! 👋 Welcome to Swastika Interlocking. I'm your assistant. Ask me about products, prices, orders, shuttering, RCC roads, or anything else!"
    },
    // About company
    {
      match: (m) => /about|company|who\s*are|swastika|business|history|founded|since/i.test(m),
      response: "Swastika Interlocking is a family-run business based in Girdharpur Uncher, Kauriram, Uttar Pradesh. Since the 1990s we manufacture high-quality interlocking paver blocks and supply building materials. We also offer shuttering rental and complete RCC road construction."
    },
    // Products general
    {
      match: (m) => /\bproduct|item|material|catalog|catalogue|what.*sell|what.*offer|what.*make/i.test(m),
      response: "We offer:\n• Interlocking Paver Blocks (Zigzag, I-Shape, Square, Hexagon)\n• Petrol Pump Bricks\n• Cement, Sand, Gravel\n• Drainage Pipes\n• Shuttering Materials (rent/sale)\n\nVisit /products to see everything."
    },
    // Interlocking / paver blocks
    {
      match: (m) => /interlocking|paver|block|brick|zigzag|i.shape|hexagon|square|pavement|tile/i.test(m),
      response: "We manufacture premium interlocking paver blocks:\n• Zigzag — ₹18–₹22/piece (heavy duty)\n• I-Shape — ₹16–₹18/piece (walkways)\n• Hexagon — ₹22–₹24/piece (plazas)\n• Grass Paver — ₹28–₹32/piece (eco)\n• Petrol Pump Bricks — special grade\n\nSee /products for details and images."
    },
    // Price
    {
      match: (m) => /price|cost|rate|how\s*much|charge|fee|rupee|₹|rs\.|amount/i.test(m),
      response: "Prices depend on the product type and quantity:\n• Standard paver blocks — ₹16–₹32/piece\n• Petrol pump bricks — ₹70–₹92/sqft\n• Cement — ₹380–₹420/bag\n• Sand, gravel — available on request\n\nFor a custom bulk quote call +91 84009 36290 or book on /order."
    },
    // Cement
    {
      match: (m) => /cement|concrete|opc|ppc/i.test(m),
      response: "We supply premium grade OPC/PPC cement at ₹380–₹420 per bag. Available for bulk orders. Call +91 84009 36290 for current rates and availability."
    },
    // Sand
    {
      match: (m) => /\bsand\b|baalu|balu|reet/i.test(m),
      response: "We supply fine and coarse construction sand (Red and White). Ideal for all building work. Contact us at +91 84009 36290 for pricing and truck-load delivery."
    },
    // Gravel / stone / gitti
    {
      match: (m) => /gravel|stone|gitti|aggregate|grit|crush/i.test(m),
      response: "We supply 10–40mm stone aggregates (gitti) for concrete mixing and foundation work. Available in bulk. Call +91 84009 36290 for rates."
    },
    // Pipes
    {
      match: (m) => /pipe|drainage|hume|culvert|sewer/i.test(m),
      response: "We stock concrete drainage pipes in various sizes for roads, drainage systems, and culverts. Ideal for infrastructure projects. Call +91 84009 36290 or visit /products."
    },
    // Shuttering
    {
      match: (m) => /shuttering|shutter|formwork|scaffold|prop|h.frame|steel\s*plate|centering|mould/i.test(m),
      response: "Shuttering materials available for rent and sale:\n• Steel Plates — ₹45/day/piece\n• Adjustable Props — ₹15/day\n• H-Frame Scaffolding — ₹120/day\n• Beam Clamps, Wallers, Plywood\n\nVisit /shuttering or submit enquiry at /shuttering-enquiry."
    },
    // RCC roads
    {
      match: (m) => /\brcc\b|road|sarak|construction|highway|village\s*road|colony\s*road|project/i.test(m),
      response: "We provide complete RCC road construction:\n✓ Site Survey & Planning\n✓ Cost Estimation\n✓ Construction (village, colony, highway)\n✓ Drainage Integration\n✓ Finishing & Curing\n✓ Maintenance Contract\n\nSubmit your project details at /rcc-enquiry."
    },
    // Order
    {
      match: (m) => /order|book|buy|purchase|enquir|inquiry|quote|quotation|kharid/i.test(m),
      response: "To place an order:\n1. Visit the /order page\n2. Select products & quantity\n3. Fill your delivery address\n4. Submit — we confirm within 24 hrs\n\nOr call us directly at +91 84009 36290."
    },
    // Delivery
    {
      match: (m) => /deliver|shipping|dispatch|transport|lorry|truck|supply/i.test(m),
      response: "We deliver across Uttar Pradesh and nearby states. Delivery typically takes 3–5 working days after order confirmation. Lorry/truck transport charges apply depending on your location. Call +91 84009 36290 for your area."
    },
    // Contact / address / phone
    {
      match: (m) => /contact|address|location|where|office|phone|number|call|reach|visit|map|place/i.test(m),
      response: "📍 Girdharpur Uncher, Kauriram, Uttar Pradesh\n\n📞 +91 84009 36290\n📞 +91 79059 78260\n📞 +91 97228 32661\n\n💬 WhatsApp: +91 79059 78260\n\nWorking hours: Mon–Sat, 9 AM – 7 PM\nSunday: Closed"
    },
    // WhatsApp
    {
      match: (m) => /whatsapp|wa|message|chat/i.test(m),
      response: "You can WhatsApp us at +91 79059 78260. Click the green WhatsApp button on screen for instant chat, or I can connect you now!"
    },
    // Customer / login / dashboard / account
    {
      match: (m) => /login|register|account|dashboard|sign\s*in|sign\s*up|portal|password/i.test(m),
      response: "You can create a free account or login at /auth. After login, your customer dashboard (/customer-dashboard) lets you track orders, view inquiries, and update your profile."
    },
    // Quality / standard
    {
      match: (m) => /quality|standard|grade|strength|durable|durability|certif|IS\s*code|m30|m50|compressive/i.test(m),
      response: "Our products meet Indian Standards (IS:15658). Block grades range from M25 to M50 compressive strength. We use computerized mixing and 14-day water curing for maximum durability."
    },
    // Minimum order
    {
      match: (m) => /minimum|min\s*order|moq|least|small\s*order/i.test(m),
      response: "Minimum order quantities:\n• Paver blocks — 100 pieces\n• Cement — 1 bag\n• Sand/Gravel — 1 truck load\n• Shuttering — as per requirement\n\nContact us at +91 84009 36290 for custom orders."
    },
    // Colors / variants
    {
      match: (m) => /colou?r|shade|red|grey|gray|yellow|green|variant|finish/i.test(m),
      response: "Our paver blocks are available in multiple colors:\n• Standard Grey\n• Red / Saffron\n• Yellow\n• Lacquer Finish (premium)\n• Dual-tone\n\nVisit /products or call us to discuss your requirement."
    },
    // Thickness / size
    {
      match: (m) => /thickness|size|dimension|mm|60mm|80mm|thick/i.test(m),
      response: "Available thicknesses:\n• 40mm — light pedestrian\n• 50mm — walkways, gardens\n• 60mm — standard driveways\n• 80mm — heavy vehicles, industrial\n• 100mm — extreme load\n\nWe recommend 80mm for petrol pumps and industrial yards."
    },
    // About page
    {
      match: (m) => /about\s*page|our\s*story|manufacturing|process|how.*made|factory/i.test(m),
      response: "Visit our /about page to learn about our manufacturing process — from raw material sourcing, computerized mixing, vibration moulding, to 14-day water curing before delivery."
    },
    // Thanks / bye
    {
      match: (m) => /thank|thanks|ok|okay|got\s*it|bye|goodbye|see\s*you|great|awesome|perfect|nice/i.test(m),
      response: "You're welcome! 😊 Feel free to ask if you need anything else. You can also reach us at +91 84009 36290 or WhatsApp anytime!"
    },
  ],

  hi: [
    // Greetings
    {
      match: (m) => /^(hi|hello|helo|hey|नमस्ते|नमस्कार|प्रणाम|सुप्रभात|सुप्रभात|हाय|हेलो)/i.test(m),
      response: "नमस्ते! 👋 स्वस्तिका इंटरलॉकिंग में आपका स्वागत है। मैं आपका सहायक हूँ। आप उत्पाद, कीमत, ऑर्डर, शटरिंग, RCC रोड या किसी भी विषय में पूछ सकते हैं!"
    },
    // About
    {
      match: (m) => /about|कंपनी|स्वस्तिका|इतिहास|कौन|business/i.test(m),
      response: "स्वस्तिका इंटरलॉकिंग एक पारिवारिक व्यवसाय है, जो गिरधरपुर ऊंचर, कौड़ीराम, उत्तर प्रदेश में स्थित है। 1990 के दशक से हम उच्च गुणवत्ता के पेवर ब्लॉक बना रहे हैं। हम शटरिंग किराए और RCC सड़क निर्माण भी करते हैं।"
    },
    // Products
    {
      match: (m) => /product|उत्पाद|सामान|catalog|क्या.*बेचते|क्या.*है/i.test(m),
      response: "हमारे उत्पाद:\n• इंटरलॉकिंग पेवर ब्लॉक (जिगजैग, आई-शेप, हेक्सागन)\n• पेट्रोल पंप ब्रिक्स\n• सीमेंट, रेत, बजरी\n• ड्रेनेज पाइप्स\n• शटरिंग सामग्री (किराए/बिक्री)\n\nपूरी सूची के लिए /products देखें।"
    },
    // Interlocking
    {
      match: (m) => /interlocking|paver|block|brick|ब्लॉक|ईंट|जिगजैग|पेवर/i.test(m),
      response: "हमारे पेवर ब्लॉक:\n• जिगजैग — ₹18–₹22/पीस\n• आई-शेप — ₹16–₹18/पीस\n• हेक्सागन — ₹22–₹24/पीस\n• ग्रास पेवर — ₹28–₹32/पीस\n• पेट्रोल पंप ब्रिक्स — विशेष ग्रेड\n\n/products पर विवरण देखें।"
    },
    // Price
    {
      match: (m) => /price|cost|rate|कीमत|दाम|रेट|कितना|मूल्य|₹/i.test(m),
      response: "कीमत उत्पाद और मात्रा के अनुसार अलग होती है:\n• पेवर ब्लॉक — ₹16–₹32/पीस\n• सीमेंट — ₹380–₹420/बैग\n• रेत, बजरी — अनुरोध पर\n\nबल्क कोटेशन के लिए +91 84009 36290 पर कॉल करें।"
    },
    // Shuttering
    {
      match: (m) => /shuttering|शटरिंग|prop|h.frame|steel.*plate|किराया|scaffold/i.test(m),
      response: "शटरिंग सामग्री किराए और बिक्री पर उपलब्ध:\n• स्टील प्लेट्स — ₹45/दिन\n• प्रॉप्स — ₹15/दिन\n• H-फ्रेम — ₹120/दिन\n\nजानकारी के लिए /shuttering देखें या /shuttering-enquiry पर भेजें।"
    },
    // RCC
    {
      match: (m) => /rcc|सड़क|road|निर्माण|construction|project|प्रोजेक्ट/i.test(m),
      response: "हम RCC सड़क निर्माण का पूरा काम करते हैं:\n✓ साइट सर्वे\n✓ लागत अनुमान\n✓ ग्राम/कॉलोनी सड़क निर्माण\n✓ ड्रेनेज\n✓ फिनिशिंग और क्योरिंग\n\nअपना प्रोजेक्ट भेजें: /rcc-enquiry"
    },
    // Order
    {
      match: (m) => /order|ऑर्डर|बुक|खरीद|quote|कोटेशन/i.test(m),
      response: "ऑर्डर बुक करने के लिए:\n1. /order पेज पर जाएं\n2. उत्पाद और मात्रा चुनें\n3. पता भरें और सबमिट करें\n4. 24 घंटे में कन्फर्म होगा\n\nया +91 84009 36290 पर कॉल करें।"
    },
    // Delivery
    {
      match: (m) => /deliver|डिलीवरी|शिपिंग|transport|लॉरी|ट्रक/i.test(m),
      response: "हम पूरे उत्तर प्रदेश में डिलीवरी करते हैं। ऑर्डर कन्फर्म होने के बाद 3–5 कार्य दिवसों में डिलीवरी होती है। लॉरी भाड़ा स्थान के अनुसार अतिरिक्त।"
    },
    // Contact
    {
      match: (m) => /contact|address|पता|location|phone|नंबर|call|कॉल|where|कहाँ/i.test(m),
      response: "📍 गिरधरपुर ऊंचर, कौड़ीराम, उत्तर प्रदेश\n\n📞 +91 84009 36290\n📞 +91 79059 78260\n📞 +91 97228 32661\n\n💬 WhatsApp: +91 79059 78260\n\nकार्य समय: सोम–शनि, सुबह 9 बजे – शाम 7 बजे\nरविवार: बंद"
    },
    // Thanks
    {
      match: (m) => /thank|धन्यवाद|शुक्रिया|ok|okay|ठीक|समझ|अच्छा|bye|बाय/i.test(m),
      response: "आपका स्वागत है! 😊 कोई भी प्रश्न हो तो बेझिझक पूछें। हम +91 84009 36290 पर भी उपलब्ध हैं।"
    },
  ]
};

// ─────────────────────────────────────────────────────────
// Quick reply suggestions shown after each bot message
// ─────────────────────────────────────────────────────────
const QUICK_REPLIES = {
  en: ['Product prices', 'Place an order', 'Shuttering rental', 'RCC road project', 'Contact & address'],
  hi: ['उत्पाद की कीमत', 'ऑर्डर करें', 'शटरिंग किराया', 'RCC सड़क प्रोजेक्ट', 'संपर्क और पता'],
};

const getResponse = (message, language) => {
  const lang = language === 'hi' ? 'hi' : 'en';
  const rules = KB[lang];
  for (const rule of rules) {
    if (rule.match(message)) return rule.response;
  }
  // fallback
  return lang === 'hi'
    ? 'माफ़ करें, मैं यह नहीं समझ सका। कृपया अपना सवाल दोबारा पूछें या हमें +91 84009 36290 पर कॉल करें।'
    : "Sorry, I didn't quite understand that. Please rephrase, or call us at +91 84009 36290 for immediate help!";
};

// ─────────────────────────────────────────────────────────
const TRANSLATIONS = {
  hi: {
    header: 'स्वस्तिका सहायक',
    status: 'ऑनलाइन',
    welcome: 'नमस्ते! 👋 स्वस्तिका इंटरलॉकिंग में आपका स्वागत है। मैं आपकी सहायता के लिए यहाँ हूँ।\n\nआप मुझसे पूछ सकते हैं:\n• उत्पाद और कीमतें\n• ऑर्डर बुकिंग\n• शटरिंग किराया\n• RCC सड़क प्रोजेक्ट\n• डिलीवरी और संपर्क',
    placeholder: 'अपना सवाल यहाँ लिखें...',
  },
  en: {
    header: 'Swastika Assistant',
    status: 'Online',
    welcome: "Hello! 👋 Welcome to Swastika Interlocking. I'm here to help you.\n\nYou can ask me about:\n• Products & pricing\n• Order booking\n• Shuttering rental\n• RCC road projects\n• Delivery & contact",
    placeholder: 'Ask me anything...',
  }
};

export default function Chatbot({ language }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDialOpen, setIsDialOpen] = useState(false);
  const chatEndRef = useRef(null);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const quickReplies = QUICK_REPLIES[language] || QUICK_REPLIES.en;
  const waUrl = `https://wa.me/917905978260?text=${encodeURIComponent("Hello Swastika Interlocking, I would like to know more.")}`;

  useEffect(() => {
    setMessages([{ id: 1, sender: 'bot', text: t.welcome }]);
  }, [language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), sender: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    setTimeout(() => {
      const botText = getResponse(text.trim(), language);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botText }]);
      setIsTyping(false);
    }, 700);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <>
      {/* Floating buttons */}
      <div className="fixed bottom-2 right-2 md:bottom-4 md:right-4 flex flex-col items-center gap-3 z-50 pointer-events-none select-none">
        <div className={`flex flex-col items-center gap-3 transition-all duration-300 origin-bottom ${isDialOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-4 pointer-events-none'}`}>
          <a href={waUrl} target="_blank" rel="noreferrer"
            className="bg-[#1b6d24] text-white w-12 h-12 md:w-14 md:h-14 shrink-0 pointer-events-auto shadow-lg hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer"
            style={{ borderRadius: '50%' }} aria-label="WhatsApp">
            <span className="material-symbols-outlined text-[20px] md:text-2xl">chat</span>
          </a>
          <button onClick={() => { setIsOpen(true); setIsDialOpen(false); }}
            className="bg-[#9b4000] text-white w-12 h-12 md:w-14 md:h-14 shrink-0 pointer-events-auto shadow-lg hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer"
            style={{ borderRadius: '50%' }} aria-label="Chat Assistant">
            <span className="material-symbols-outlined text-[20px] md:text-2xl">smart_toy</span>
          </button>
        </div>
        <button onClick={() => { if (isOpen) setIsOpen(false); else setIsDialOpen(!isDialOpen); }}
          className="bg-primary text-on-primary w-12 h-12 md:w-14 md:h-14 shrink-0 pointer-events-auto shadow-lg hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer z-50"
          style={{ borderRadius: '50%' }} aria-label="Toggle">
          <span className={`material-symbols-outlined text-[24px] md:text-3xl transition-transform duration-300 ${isDialOpen ? 'rotate-180' : ''} ${isOpen ? 'rotate-45' : ''}`}>
            {isOpen ? 'close' : 'keyboard_arrow_up'}
          </span>
        </button>
      </div>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-3 md:right-6 w-[360px] max-w-[94vw] bg-surface rounded-2xl chat-shadow overflow-hidden z-[70] border border-surface-variant/40 flex flex-col h-[520px]">
          {/* Header */}
          <div className="bg-primary p-4 flex items-center justify-between text-white select-none shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">smart_toy</span>
              </div>
              <div>
                <h3 className="font-bold text-sm">{t.header}</h3>
                <p className="text-[10px] text-white/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span>
                  {t.status}
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white cursor-pointer p-1">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-surface-container-low">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-white border border-outline-variant/30 text-on-surface rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-outline-variant/30 rounded-2xl rounded-tl-none px-3.5 py-3 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick replies */}
          {!isTyping && messages.length <= 3 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 bg-surface-container-low">
              {quickReplies.map((qr, i) => (
                <button key={i} onClick={() => sendMessage(qr)}
                  className="text-xs px-3 py-1.5 bg-white border border-primary/30 text-primary rounded-full font-semibold hover:bg-primary/5 transition-colors cursor-pointer">
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-surface-variant/30 bg-surface flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={t.placeholder}
              className="flex-grow bg-surface-container border border-outline/20 px-3 py-2.5 rounded-xl text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
            />
            <button type="submit"
              className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-container active:scale-95 transition-all cursor-pointer shrink-0">
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
