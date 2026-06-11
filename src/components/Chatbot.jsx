import React, { useState, useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────
// KNOWLEDGE BASE — covers every section of the website
// ─────────────────────────────────────────────────────────
const KB = {
  en: [
    // Greetings
    {
      match: (m) => /^(hi|hello|helo|hey|namaste|good\s*(morning|afternoon|evening)|howdy|sup|greet)/i.test(m),
      response: "Hello! 👋 Welcome to Swastika Interlocking (Chaubey Brothers). I'm your assistant. Ask me about products, prices, orders, shuttering, RCC roads, pipes, or anything else!"
    },
    // About company
    {
      match: (m) => /about|company|who\s*are|swastika|business|history|founded|since|owner|brother/i.test(m),
      response: "Swastika Interlocking is a family-run business founded by brothers Dilip Chaubey and Alok Chaubey in Deesa, Banaskantha, Gujarat. We've been serving the community for over a decade with quality construction materials and solutions."
    },
    // Owners
    {
      match: (m) => /dilip|alok|chaubey|malik|owner|proprietor|brother/i.test(m),
      response: "We have two expert owners:\n\n🧱 Dilip Chaubey (Proprietor & Founder)\n- Building Materials (Paver Blocks, Sand, Gravel, Cement)\n- Shuttering Materials (Rent/Sale)\n- RCC Road Construction\n📞 Call: +91 84009 36290\n\n🔧 Alok Chaubey (Co-Owner, Pipes Division)\n- Drainage Pipes\n- Water Supply Pipes\n- Pool Pipes\n- Industrial Pipes\n📞 Call: +91 97228 32661"
    },
    // Products general
    {
      match: (m) => /\bproduct|item|material|catalog|catalogue|what.*sell|what.*offer|what.*make/i.test(m),
      response: "We offer:\n• Interlocking Paver Blocks (Zigzag, I-Shape, Square, Hexagon)\n• Petrol Pump Bricks\n• Cement, Sand, Gravel\n• Drainage Pipes, Water Supply Pipes, Pool Pipes\n• Shuttering Materials (rent/sale)\n• RCC Road Construction\n\nVisit /products or /pipes to see everything."
    },
    // Interlocking / paver blocks
    {
      match: (m) => /interlocking|paver|block|brick|zigzag|i.shape|hexagon|square|pavement|tile/i.test(m),
      response: "🧱 Dilip Chaubey handles our interlocking paver blocks:\n• Zigzag — ₹18–₹22/piece (heavy duty)\n• I-Shape — ₹16–₹18/piece (walkways)\n• Hexagon — ₹22–₹24/piece (plazas)\n• Grass Paver — ₹28–₹32/piece (eco)\n• Petrol Pump Bricks — special grade\n\nSee /products for details and images. Call Dilip bhai: +91 84009 36290"
    },
    // Price
    {
      match: (m) => /price|cost|rate|how\s*much|charge|fee|rupee|₹|rs\.|amount/i.test(m),
      response: "Prices depend on the product type and quantity:\n• Standard paver blocks — ₹16–₹32/piece\n• Petrol pump bricks — ₹70–₹92/sqft\n• Cement — ₹380–₹420/bag\n• Sand, gravel — available on request\n• Pipes — various sizes available\n\nFor Building Materials/RCC Roads: Call +91 84009 36290 (Dilip Chaubey)\nFor Pipes: Call +91 97228 32661 (Alok Chaubey)\nOr book on /order."
    },
    // Cement
    {
      match: (m) => /cement|concrete|opc|ppc/i.test(m),
      response: "🧱 Dilip Chaubey supplies premium grade OPC/PPC cement at ₹380–₹420 per bag. Available for bulk orders. Call +91 84009 36290 for current rates and availability."
    },
    // Sand
    {
      match: (m) => /\bsand\b|baalu|balu|reet/i.test(m),
      response: "🧱 Dilip Chaubey supplies fine and coarse construction sand (Red and White). Ideal for all building work. Contact us at +91 84009 36290 for pricing and truck-load delivery."
    },
    // Gravel / stone / gitti
    {
      match: (m) => /gravel|stone|gitti|aggregate|grit|crush/i.test(m),
      response: "🧱 Dilip Chaubey supplies 10–40mm stone aggregates (gitti) for concrete mixing and foundation work. Available in bulk. Call +91 84009 36290 for rates."
    },
    // Pipes
    {
      match: (m) => /pipe|drainage|hume|culvert|sewer|water|pool|swimming|industrial/i.test(m),
      response: "🔧 Alok Chaubey handles our complete pipes & drainage division:\n• Drainage Pipes (6\", 12\", etc.)\n• Water Supply Pipes\n• Swimming Pool Pipes\n• Industrial Pipes\n\nSee /pipes for all products. Call Alok bhai: +91 97228 32661"
    },
    // Shuttering
    {
      match: (m) => /shuttering|shutter|formwork|scaffold|prop|h.frame|steel\s*plate|centering|mould/i.test(m),
      response: "🧱 Dilip Chaubey offers shuttering materials for rent and sale:\n• Steel Plates — ₹45/day/piece\n• Adjustable Props — ₹15/day\n• H-Frame Scaffolding — ₹120/day\n• Beam Clamps, Wallers, Plywood\n\nVisit /shuttering. Call +91 84009 36290."
    },
    // RCC roads
    {
      match: (m) => /\brcc\b|road|sarak|construction|highway|village\s*road|colony\s*road|project/i.test(m),
      response: "🧱 Dilip Chaubey provides complete RCC road construction:\n✓ Site Survey & Planning\n✓ Cost Estimation\n✓ Construction (village, colony, highway)\n✓ Drainage Integration\n✓ Finishing & Curing\n✓ Maintenance Contract\n\nSubmit your project details at /rcc-roads. Call +91 84009 36290."
    },
    // Order
    {
      match: (m) => /order|book|buy|purchase|enquir|inquiry|quote|quotation|kharid/i.test(m),
      response: "To place an order:\n1. Visit the /order page\n2. Select products & quantity\n3. Fill your delivery address\n4. Submit — we confirm within 24 hrs\n\nOr call directly:\n• Building Materials/Roads: +91 84009 36290 (Dilip Chaubey)\n• Pipes: +91 97228 32661 (Alok Chaubey)"
    },
    // Delivery
    {
      match: (m) => /deliver|shipping|dispatch|transport|lorry|truck|supply/i.test(m),
      response: "We deliver across Deesa, Banaskantha, Patan, Mehsana, and nearby Gujarat areas. Delivery typically takes 3–5 working days after order confirmation. Lorry/truck transport charges apply depending on your location.\n• Building Materials: Call +91 84009 36290\n• Pipes: Call +91 97228 32661"
    },
    // Contact / address / phone
    {
      match: (m) => /contact|address|location|where|office|phone|number|call|reach|visit|map|place/i.test(m),
      response: "📍 Deesa, Banaskantha, Gujarat - 385535\n\n🧱 Dilip Chaubey (Building Materials, Shuttering, RCC Roads)\n📞 Call: +91 84009 36290\n� WhatsApp: https://wa.me/918400936290\n\n🔧 Alok Chaubey (Pipes & Drainage)\n📞 Call: +91 97228 32661\n💬 WhatsApp: https://wa.me/919722832661\n\nWorking hours: Mon–Sat, 9 AM – 7 PM\nSunday: By appointment"
    },
    // WhatsApp
    {
      match: (m) => /whatsapp|wa|message|chat/i.test(m),
      response: "Choose who to WhatsApp:\n\n🧱 Dilip Chaubey (Building Materials/Roads)\nhttps://wa.me/918400936290\n\n🔧 Alok Chaubey (Pipes & Drainage)\nhttps://wa.me/919722832661\n\nClick the green WhatsApp button on screen for instant chat!"
    },
    // Customer / login / dashboard / account
    {
      match: (m) => /login|register|account|dashboard|sign\s*in|sign\s*up|portal|password/i.test(m),
      response: "You can create a free account or login at /auth. After login, your customer dashboard (/customer-dashboard) lets you track orders, view inquiries, and update your profile."
    },
    // Quality / standard
    {
      match: (m) => /quality|standard|grade|strength|durable|durability|certif|IS\s*code|m30|m50|compressive/i.test(m),
      response: "Our products meet Indian Standards (IS:15658). Block grades range from M25 to M50 compressive strength. We use computerized mixing and proper curing for maximum durability."
    },
    // Minimum order
    {
      match: (m) => /minimum|min\s*order|moq|least|small\s*order/i.test(m),
      response: "Minimum order quantities:\n• Paver blocks — 100 pieces\n• Cement — 1 bag\n• Sand/Gravel — 1 truck load\n• Shuttering — as per requirement\n\nBuilding Materials: +91 84009 36290 (Dilip Chaubey)\nPipes: +91 97228 32661 (Alok Chaubey)"
    },
    // Colors / variants
    {
      match: (m) => /colou?r|shade|red|grey|gray|yellow|green|variant|finish/i.test(m),
      response: "Our paver blocks are available in multiple colors:\n• Standard Grey\n• Red / Saffron\n• Yellow\n• Lacquer Finish (premium)\n• Dual-tone\n\nVisit /products or call Dilip bhai: +91 84009 36290"
    },
    // Thickness / size
    {
      match: (m) => /thickness|size|dimension|mm|60mm|80mm|thick/i.test(m),
      response: "Available thicknesses:\n• 40mm — light pedestrian\n• 50mm — walkways, gardens\n• 60mm — standard driveways\n• 80mm — heavy vehicles, industrial\n• 100mm — extreme load\n\nWe recommend 80mm for petrol pumps and industrial yards. Call +91 84009 36290 (Dilip Chaubey)."
    },
    // About page
    {
      match: (m) => /about\s*page|our\s*story|manufacturing|process|how.*made|factory/i.test(m),
      response: "Visit our /about page to learn about our owners, our story, and our values!"
    },
    // Thanks / bye
    {
      match: (m) => /thank|thanks|ok|okay|got\s*it|bye|goodbye|see\s*you|great|awesome|perfect|nice/i.test(m),
      response: "You're welcome! 😊 Feel free to ask if you need anything else.\n🧱 Dilip Chaubey: +91 84009 36290\n🔧 Alok Chaubey: +91 97228 32661"
    },
  ],

  hi: [
    // Greetings
    {
      match: (m) => /^(hi|hello|helo|hey|नमस्ते|नमस्कार|प्रणाम|सुप्रभात|सुप्रभात|हाय|हेलो)/i.test(m),
      response: "नमस्ते! 👋 स्वस्तिका इंटरलॉकिंग (चौबे ब्रदर्स) में आपका स्वागत है। मैं आपका सहायक हूँ। आप उत्पाद, कीमत, ऑर्डर, शटरिंग, RCC रोड, पाइप या किसी भी विषय में पूछ सकते हैं!"
    },
    // About
    {
      match: (m) => /about|कंपनी|स्वस्तिका|इतिहास|कौन|business|मालिक|भाई|owner/i.test(m),
      response: "स्वस्तिका इंटरलॉकिंग एक पारिवारिक व्यवसाय है जिसे भाइयों दिलीप चौबे और आलोक चौबे ने दीसा, बनासकांठा, गुजरात में स्थापित किया। हम एक दशक से अधिक समय से गुणवत्तापूर्ण निर्माण सामग्री और समाधानों से समुदाय की सेवा कर रहे हैं।"
    },
    // Owners
    {
      match: (m) => /dilip|alok|chaubey|मालिक|मalik|proprietor|भाई/i.test(m),
      response: "हमारे दो विशेषज्ञ मालिक हैं:\n\n🧱 दिलीप चौबे (संस्थापक)\n- बिल्डिंग मैटेरियल्स (पेवर ब्लॉक, रेत, बजरी, सीमेंट)\n- शटरिंग सामग्री (किराए/बिक्री)\n- RCC सड़क निर्माण\n📞 कॉल: +91 84009 36290\n\n🔧 आलोक चौबे (सह-मालिक, पाइप डिवीजन)\n- ड्रेनेज पाइप्स\n- वॉटर सप्लाई पाइप्स\n- पूल पाइप्स\n- इंडस्ट्रियल पाइप्स\n📞 कॉल: +91 97228 32661"
    },
    // Products
    {
      match: (m) => /product|उत्पाद|सामान|catalog|क्या.*बेचते|क्या.*है/i.test(m),
      response: "हमारे उत्पाद:\n• इंटरलॉकिंग पेवर ब्लॉक (जिगजैग, आई-शेप, हेक्सागन)\n• पेट्रोल पंप ब्रिक्स\n• सीमेंट, रेत, बजरी\n• ड्रेनेज पाइप्स, वॉटर सप्लाई पाइप्स, पूल पाइप्स\n• शटरिंग सामग्री (किराए/बिक्री)\n• RCC सड़क निर्माण\n\nपूरी सूची के लिए /products या /pipes देखें।"
    },
    // Interlocking
    {
      match: (m) => /interlocking|paver|block|brick|ब्लॉक|ईंट|जिगजैग|पेवर/i.test(m),
      response: "🧱 दिलीप चौबे हमारे पेवर ब्लॉक्स हैंडल करते हैं:\n• जिगजैग — ₹18–₹22/पीस\n• आई-शेप — ₹16–₹18/पीस\n• हेक्सागन — ₹22–₹24/पीस\n• ग्रास पेवर — ₹28–₹32/पीस\n• पेट्रोल पंप ब्रिक्स — विशेष ग्रेड\n\n/products पर विवरण देखें। दिलीप भाई को कॉल करें: +91 84009 36290"
    },
    // Price
    {
      match: (m) => /price|cost|rate|कीमत|दाम|रेट|कितना|मूल्य|₹/i.test(m),
      response: "कीमत उत्पाद और मात्रा के अनुसार अलग होती है:\n• पेवर ब्लॉक — ₹16–₹32/पीस\n• सीमेंट — ₹380–₹420/बैग\n• रेत, बजरी — अनुरोध पर\n• पाइप्स — विभिन्न साइज उपलब्ध\n\nबिल्डिंग मैटेरियल्स/RCC रोड: +91 84009 36290 (दिलीप चौबे)\nपाइप्स: +91 97228 32661 (आलोक चौबे)\nया /order पर बुक करें।"
    },
    // Shuttering
    {
      match: (m) => /shuttering|शटरिंग|prop|h.frame|steel.*plate|किराया|scaffold/i.test(m),
      response: "🧱 दिलीप चौबे शटरिंग सामग्री किराए और बिक्री पर उपलब्ध कराते हैं:\n• स्टील प्लेट्स — ₹45/दिन\n• प्रॉप्स — ₹15/दिन\n• H-फ्रेम — ₹120/दिन\n\n/shuttering देखें। +91 84009 36290 पर कॉल करें।"
    },
    // RCC
    {
      match: (m) => /rcc|सड़क|road|निर्माण|construction|project|प्रोजेक्ट/i.test(m),
      response: "🧱 दिलीप चौबे RCC सड़क निर्माण का पूरा काम करते हैं:\n✓ साइट सर्वे\n✓ लागत अनुमान\n✓ ग्राम/कॉलोनी सड़क निर्माण\n✓ ड्रेनेज\n✓ फिनिशिंग और क्योरिंग\n\nअपना प्रोजेक्ट /rcc-roads पर भेजें। +91 84009 36290 पर कॉल करें।"
    },
    // Pipes
    {
      match: (m) => /pipe|drainage|पाइप|नाली|पानी|पूल|स्विमिंग|industrial/i.test(m),
      response: "🔧 आलोक चौबे हमारा पूरा पाइप और ड्रेनेज डिवीजन हैंडल करते हैं:\n• ड्रेनेज पाइप्स (6\", 12\", आदि)\n• वॉटर सप्लाई पाइप्स\n• स्विमिंग पूल पाइप्स\n• इंडस्ट्रियल पाइप्स\n\nसभी उत्पादों के लिए /pipes देखें। आलोक भाई को कॉल करें: +91 97228 32661"
    },
    // Order
    {
      match: (m) => /order|ऑर्डर|बुक|खरीद|quote|कोटेशन/i.test(m),
      response: "ऑर्डर बुक करने के लिए:\n1. /order पेज पर जाएं\n2. उत्पाद और मात्रा चुनें\n3. पता भरें और सबमिट करें\n4. 24 घंटे में कन्फर्म होगा\n\nया सीधे कॉल करें:\n• बिल्डिंग मैटेरियल्स/रोड: +91 84009 36290 (दिलीप चौबे)\n• पाइप्स: +91 97228 32661 (आलोक चौबे)"
    },
    // Delivery
    {
      match: (m) => /deliver|डिलीवरी|शिपिंग|transport|लॉरी|ट्रक/i.test(m),
      response: "हम दीसा, बनासकांठा, पाटन, मेहसाणा और आसपास के गुजरात क्षेत्रों में डिलीवरी करते हैं। ऑर्डर कन्फर्म होने के बाद 3–5 कार्य दिवसों में डिलीवरी होती है। लॉरी भाड़ा स्थान के अनुसार अतिरिक्त।\n• बिल्डिंग मैटेरियल्स: +91 84009 36290\n• पाइप्स: +91 97228 32661"
    },
    // Contact
    {
      match: (m) => /contact|address|पता|location|phone|नंबर|call|कॉल|where|कहाँ/i.test(m),
      response: "📍 दीसा, बनासकांठा, गुजरात - 385535\n\n🧱 दिलीप चौबे (बिल्डिंग मैटेरियल्स, शटरिंग, RCC रोड)\n📞 कॉल: +91 84009 36290\n� WhatsApp: https://wa.me/918400936290\n\n🔧 आलोक चौबे (पाइप्स & ड्रेनेज)\n📞 कॉल: +91 97228 32661\n💬 WhatsApp: https://wa.me/919722832661\n\nकार्य समय: सोम–शनि, सुबह 9 बजे – शाम 7 बजे\nरविवार: अपॉइंटमेंट पर"
    },
    // Thanks
    {
      match: (m) => /thank|धन्यवाद|शुक्रिया|ok|okay|ठीक|समझ|अच्छा|bye|बाय/i.test(m),
      response: "आपका स्वागत है! 😊 कोई भी प्रश्न हो तो बेझिझक पूछें।\n🧱 दिलीप चौबे: +91 84009 36290\n🔧 आलोक चौबे: +91 97228 32661"
    },
  ]
};

// ─────────────────────────────────────────────────────────
// Quick reply suggestions shown after each bot message
// ─────────────────────────────────────────────────────────
const QUICK_REPLIES = {
  en: ['Product prices', 'Place an order', 'Shuttering rental', 'RCC road project', 'Pipes division', 'Contact owners'],
  hi: ['उत्पाद की कीमत', 'ऑर्डर करें', 'शटरिंग किराया', 'RCC सड़क प्रोजेक्ट', 'पाइप डिवीजन', 'मालिक से संपर्क'],
};

const getResponse = (message, language) => {
  const lang = language === 'hi' ? 'hi' : 'en';
  const rules = KB[lang];
  for (const rule of rules) {
    if (rule.match(message)) return rule.response;
  }
  // fallback
  return lang === 'hi'
    ? 'माफ़ करें, मैं यह नहीं समझ सका। कृपया अपना सवाल दोबारा पूछें या हमें कॉल करें:\n🧱 दिलीप चौबे: +91 84009 36290\n🔧 आलोक चौबे: +91 97228 32661'
    : "Sorry, I didn't quite understand that. Please rephrase, or call us:\n🧱 Dilip Chaubey: +91 84009 36290\n🔧 Alok Chaubey: +91 97228 32661";
};

// ─────────────────────────────────────────────────────────
const TRANSLATIONS = {
  hi: {
    header: 'स्वस्तिका सहायक',
    status: 'ऑनलाइन',
    welcome: 'नमस्ते! 👋 स्वस्तिका इंटरलॉकिंग, देसा, गुजरात में आपका स्वागत है।\n\nहमारे दो विभाग:\n🧱 दिलीप भाई — पेवर ब्लॉक, सीमेंट, शटरिंग, RCC सड़क\n   📞 84009 36290\n\n🔧 आलोक भाई — पाइप्स और ड्रेनेज\n   📞 97228 32661\n\nआप क्या जानना चाहते हैं?',
    placeholder: 'अपना सवाल यहाँ लिखें...',
  },
  en: {
    header: 'Swastika Assistant',
    status: 'Online',
    welcome: "Hello! 👋 Welcome to Swastika Interlocking, Deesa, Gujarat.\n\nTwo divisions ready to help:\n🧱 Dilip bhai — Paver Blocks, Cement, Shuttering, RCC Roads\n   📞 84009 36290\n\n🔧 Alok bhai — Pipes & Drainage\n   📞 97228 32661\n\nWhat can I help you with?",
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
