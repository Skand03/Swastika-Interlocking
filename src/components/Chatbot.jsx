import React, { useState, useEffect, useRef } from 'react';

const KB = {
  en: [
    {
      match: (m) => /^(hi|hello|helo|hey|namaste|good\s*(morning|afternoon|evening)|howdy|sup|greet)/i.test(m),
      response: "Hello! 👋 Welcome to Swastika Interlocking. I'm your assistant. Ask me about products, prices, orders, shuttering, RCC roads, or anything else!"
    },
    {
      match: (m) => /about|company|who\s*are|swastika|business|history|founded|since|owner/i.test(m),
      response: "Swastika Interlocking is a family-run business established in Girdharpur Uncher Kauriram, Uttar Pradesh. We've been serving the community with quality construction materials and solutions."
    },
    {
      match: (m) => /\bproduct|item|material|catalog|catalogue|what.*sell|what.*offer|what.*make/i.test(m),
      response: "We offer:\n• Interlocking Paver Blocks (Zigzag, I-Shape, Square, Hexagon)\n• Petrol Pump Bricks\n• Cement, Sand, Gravel\n• Shuttering Materials (rent/sale)\n• RCC Road Construction\n\nVisit /products to see everything."
    },
    {
      match: (m) => /interlocking|paver|block|brick|zigzag|i.shape|hexagon|square|pavement|tile/i.test(m),
      response: "We provide interlocking paver blocks:\n• Zigzag\n• I-Shape\n• Hexagon\n• Grass Paver\n• Petrol Pump Bricks\n\nSee /products for details."
    },
    {
      match: (m) => /price|cost|rate|how\s*much|charge|fee|rupee|₹|rs\.|amount/i.test(m),
      response: "Prices depend on product type and quantity:\n• Standard paver blocks\n• Petrol pump bricks\n• Cement\n• Sand, gravel\n\nFor Building Materials/RCC Roads, contact us directly. Or book on /order."
    },
    {
      match: (m) => /cement|concrete|opc|ppc/i.test(m),
      response: "We supply premium grade OPC/PPC cement. Available for bulk orders."
    },
    {
      match: (m) => /\bsand\b|reet/i.test(m),
      response: "We supply fine and coarse construction sand. Ideal for all building work."
    },
    {
      match: (m) => /gravel|stone|gitti|aggregate|grit|crush/i.test(m),
      response: "We supply 10–40mm stone aggregates (gitti) for concrete mixing and foundation work. Available in bulk."
    },
    {
      match: (m) => /shuttering|shutter|formwork|scaffold|prop|h.frame|steel\s*plate|centering|mould/i.test(m),
      response: "We offer shuttering materials for rent and sale:\n• Steel Plates\n• Adjustable Props\n• H-Frame Scaffolding\n• Beam Clamps, Wallers, Plywood\n\nVisit /shuttering."
    },
    {
      match: (m) => /\brcc\b|road|sarak|construction|highway|village\s*road|colony\s*road|project/i.test(m),
      response: "We provide complete RCC road construction:\n✓ Site Survey & Planning\n✓ Cost Estimation\n✓ Construction (village, colony, highway)\n✓ Drainage Integration\n✓ Finishing & Curing\n✓ Maintenance Contract\n\nSubmit your project details at /rcc-roads."
    },
    {
      match: (m) => /order|book|buy|purchase|enquir|inquiry|quote|quotation|kharid/i.test(m),
      response: "To place an order:\n1. Visit the /order page\n2. Select products & quantity\n3. Fill your delivery address\n4. Submit – we confirm within 24 hrs\n\nOr contact us directly!"
    },
    {
      match: (m) => /deliver|shipping|dispatch|transport|lorry|truck|supply/i.test(m),
      response: "We deliver across Uttar Pradesh and nearby areas. Delivery typically takes 3–5 working days after order confirmation. Lorry/truck transport charges apply depending on your location."
    },
    {
      match: (m) => /contact|address|location|where|office|phone|number|call|reach|visit|map|place/i.test(m),
      response: "📍 Girdharpur Uncher Kauriram, Uttar Pradesh - 273413\n\nWorking hours: Mon–Sat, 9 AM – 7 PM\nSunday: By appointment"
    },
    {
      match: (m) => /whatsapp|wa|message|chat/i.test(m),
      response: "Click the green WhatsApp button on screen for instant chat!"
    },
    {
      match: (m) => /login|register|account|dashboard|sign\s*in|sign\s*up|portal|password/i.test(m),
      response: "You can create a free account or login at /auth. After login, your customer dashboard (/customer-dashboard) lets you track orders, view inquiries, and update your profile."
    },
    {
      match: (m) => /quality|standard|grade|strength|durable|durability|certif|IS\s*code|m30|m50|compressive/i.test(m),
      response: "Our products meet Indian Standards. Block grades range from M25 to M50 compressive strength. We use computerized mixing and proper curing for maximum durability."
    },
    {
      match: (m) => /minimum|min\s*order|moq|least|small\s*order/i.test(m),
      response: "Minimum order quantities:\n• Paver blocks – 100 pieces\n• Cement – 1 bag\n• Sand/Gravel – 1 truck load\n• Shuttering – as per requirement"
    },
    {
      match: (m) => /colou?r|shade|red|grey|gray|yellow|green|variant|finish/i.test(m),
      response: "Our paver blocks are available in multiple colours:\n• Standard Grey\n• Red / Saffron\n• Yellow\n• Lacquer Finish (premium)\n• Dual-tone\n\nVisit /products."
    },
    {
      match: (m) => /thickness|size|dimension|mm|60mm|80mm|thick/i.test(m),
      response: "Available thicknesses:\n• 40mm – light pedestrian\n• 50mm – walkways, gardens\n• 60mm – standard driveways\n• 80mm – heavy vehicles, industrial\n• 100mm – extreme load\n\nWe recommend 80mm for petrol pumps and industrial yards."
    },
    {
      match: (m) => /about\s*page|our\s*story|manufacturing|process|how.*made|factory/i.test(m),
      response: "Visit our /about page to learn about our story and values!"
    },
    {
      match: (m) => /thank|thanks|ok|okay|got\s*it|bye|goodbye|see\s*you|great|awesome|perfect|nice/i.test(m),
      response: "You're welcome! 😊 Feel free to ask if you need anything else."
    },
  ],

  hi: [
    {
      match: (m) => /^(hi|hello|helo|hey|नमस्ते|नमस्कार|प्रणाम|सुप्रभात|सुप्रभात|हाय|हेलो)/i.test(m),
      response: "नमस्ते! 👋 स्वस्तिका इंटरलॉकिंग में आपका स्वागत है। मैं आपका सहायक हूँ। आप उत्पाद, कीमत, ऑर्डर, शटरिंग, RCC सड़क या किसी भी विषय में पूछ सकते हैं!"
    },
    {
      match: (m) => /about|कंपनी|स्वस्तिका|इतिहास|कौन|business|मालिक|भाई|owner/i.test(m),
      response: "स्वस्तिका इंटरलॉकिंग एक पारिवारिक व्यवसाय है जो गिरधारपुर उंचेर कौरीराम, उत्तर प्रदेश में स्थापित है। हम गुणवत्तापूर्ण निर्माण सामग्री और समाधानों से समुदाय की सेवा कर रहे हैं।"
    },
    {
      match: (m) => /product|उत्पाद|सामग्री|catalog|क्या.*बेचते|क्या.*है/i.test(m),
      response: "हमारे उत्पाद:\n• इंटरलॉकिंग पेवर ब्लॉक (जिगजैग, आई-शेप, हेक्सागन)\n• पेट्रोल पंप ब्रिक्स\n• सीमेंट, रेत, बजरी\n• शटरिंग सामग्री (किराए/बिक्री)\n• RCC सड़क निर्माण\n\nपूरी सूची के लिए /products देखें।"
    },
    {
      match: (m) => /interlocking|paver|block|brick|ब्लॉक|ईंट|जिगजैग|पेवर/i.test(m),
      response: "हम इंटरलॉकिंग पेवर ब्लॉक्स प्रदान करते हैं:\n• जिगजैग\n• आई-शेप\n• हेक्सागन\n• ग्रास पेवर\n• पेट्रोल पंप ब्रिक्स\n\n/products पर विवरण देखें।"
    },
    {
      match: (m) => /price|cost|rate|कीमत|दाम|रेट|कितना|मूल्य|₹/i.test(m),
      response: "कीमत उत्पाद और मात्रा के अनुसार अलग होती है:\n• पेवर ब्लॉक्स\n• सीमेंट\n• रेत, बजरी\n\nबिल्डिंग मैटेरियल्स/RCC रोड्स के लिए सीधे हमसे संपर्क करें। या /order पर बुक करें।"
    },
    {
      match: (m) => /shuttering|शटरिंग|prop|h.frame|steel.*plate|किराया|scaffold/i.test(m),
      response: "हम शटरिंग सामग्री किराए और बिक्री पर उपलब्ध कराते हैं:\n• स्टील प्लेट्स\n• प्रॉप्स\n• H-फ्रेम\n\n/shuttering देखें।"
    },
    {
      match: (m) => /rcc|सड़क|road|निर्माण|construction|project|प्रोजेक्ट/i.test(m),
      response: "हम RCC सड़क निर्माण का पूरा काम करते हैं:\n✓ साइट सर्वे\n✓ लागत अनुमान\n✓ ग्राम/कॉलोनी सड़क निर्माण\n✓ ड्रेनेज\n✓ फिनिशिंग और क्योरिंग\n\nअपना प्रोजेक्ट /rcc-roads पर भेजें।"
    },
    {
      match: (m) => /order|ऑर्डर|बुक|खरीद|quote|कोटेशन/i.test(m),
      response: "ऑर्डर बुक करने के लिए:\n1. /order पेज पर जाएं\n2. उत्पाद और मात्रा चुनें\n3. पता भरें और सबमिट करें\n4. 24 घंटे में कन्फर्म होगा\n\nया सीधे हमसे संपर्क करें!"
    },
    {
      match: (m) => /deliver|डिलीवरी|शिपिंग|transport|लॉरी|ट्रक/i.test(m),
      response: "हम उत्तर प्रदेश और आसपास के क्षेत्रों में डिलीवरी करते हैं। ऑर्डर कन्फर्म होने के बाद 3–5 कार्य दिवसों में डिलीवरी होती है। लॉरी भाड़ा स्थान के अनुसार अतिरिक्त।"
    },
    {
      match: (m) => /contact|address|पता|location|phone|नंबर|call|कॉल|where|कहाँ/i.test(m),
      response: "📍 गिरधारपुर उंचेर कौरीराम, उत्तर प्रदेश - 273413\n\nकार्य समय: सोम–शनि, सुबह 9 बजे – शाम 7 बजे\nरविवार: अपॉइंटमेंट पर"
    },
    {
      match: (m) => /thank|धन्यवाद|शुक्रिया|ok|okay|ठीक|समझ|अच्छा|bye|बाय/i.test(m),
      response: "आपका स्वागत है! 😊 कोई भी प्रश्न हो तो बेझिझक पूछें।"
    },
  ]
};

const QUICK_REPLIES = {
  en: ['Product prices', 'Place an order', 'Shuttering rental', 'RCC road project', 'Contact us'],
  hi: ['उत्पाद की कीमत', 'ऑर्डर करें', 'शटरिंग किराया', 'RCC सड़क प्रोजेक्ट', 'हमसे संपर्क करें'],
};

const getResponse = (message, language) => {
  const lang = language === 'hi' ? 'hi' : 'en';
  const rules = KB[lang];
  for (const rule of rules) {
    if (rule.match(message)) return rule.response;
  }
  return lang === 'hi'
    ? 'माफ़ करें, मैं यह नहीं समझ सका। कृपया अपना सवाल दोबारा पूछें या हमसे संपर्क करें।'
    : "Sorry, I didn't quite understand that. Please rephrase, or contact us directly!";
};

const TRANSLATIONS = {
  hi: {
    header: 'स्वस्तिका सहायक',
    status: 'ऑनलाइन',
    welcome: 'नमस्ते! 👋 स्वस्तिका इंटरलॉकिंग, गिरधारपुर में आपका स्वागत है।\n\nआप क्या जानना चाहते हैं?',
    placeholder: 'अपना सवाल यहाँ लिखें...',
  },
  en: {
    header: 'Swastika Assistant',
    status: 'Online',
    welcome: "Hello! 👋 Welcome to Swastika Interlocking, Girdharpur.\n\nWhat can I help you with?",
    placeholder: 'Ask me anything...',
  }
};

export default function Chatbot({ language }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const quickReplies = QUICK_REPLIES[language] || QUICK_REPLIES.en;

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
      <div className="fixed bottom-4 right-4 z-50 pointer-events-none select-none">
        <button onClick={() => setIsOpen(!isOpen)}
          className="bg-[#9b4000] text-white w-14 h-14 shrink-0 pointer-events-auto shadow-lg hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer rounded-full"
          aria-label="Chat Assistant"
        >
          <span className="material-symbols-outlined text-2xl">{isOpen ? 'close' : 'smart_toy'}</span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-4 w-[360px] max-w-[94vw] bg-surface rounded-2xl chat-shadow overflow-hidden z-[70] border border-surface-variant/40 flex flex-col h-[520px]">
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
          </div>

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

          {!isTyping && messages.length <= 3 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 bg-surface-container-low">
              {quickReplies.map((qr, i) => (
                <button key={i} onClick={() => sendMessage(qr)}
                  className="text-xs px-3 py-1.5 bg-white border border-primary/30 text-primary rounded-full font-semibold hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  {qr}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-3 border-t border-surface-variant/30 bg-surface flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={t.placeholder}
              className="flex-grow bg-surface-container border border-outline/20 px-3 py-2.5 rounded-xl text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
            />
            <button type="submit"
              className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-container active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
