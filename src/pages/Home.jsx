import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createInquiry } from '../services/inquiryService';
import SEOHead from '../components/SEO/SEOHead';
import { faqSchema, getBreadcrumbSchema } from '../components/SEO/schemas';
import { useAuth } from '../auth/AuthContext';
import AuthGate from '../components/AuthGate';

const MARQUEE_ITEMS = [
  '✓ 10+ Years Experience',
  '🧱 Interlocking Paver Blocks',
  '🏗️ Shuttering Materials',
  '🚰 RCC Pipes',
  '🛣️ RCC Road Solutions',
  '📍 Serving Kauriram & Gorakhpur Region',
  '✓ Quality Assured Materials',
  '📞 Direct Owner Support',
  '🚚 Fast Delivery Available',
  '✓ Trusted by Contractors & Homeowners',
];

const TRANSLATIONS = {
  hi: {
    ourBusiness: 'हमारा व्यवसाय',

    buildingMaterials: 'निर्माण सामग्री',
    buildingMaterialsDesc: 'सभी निर्माण आवश्यकताओं के लिए प्रीमियम इंटरलॉकिंग पेवर ब्लॉक, रेत, गिट्टी और सीमेंट।',

    paverBlocks: 'पेवर ब्लॉक',
    sand: 'रेत',
    gravel: 'गिट्टी',
    cement: 'सीमेंट',

    shutteringMaterials: 'शटरिंग सामग्री',
    shutteringMaterialsDesc: 'भारी-भरकम स्टील प्लेटें, प्रॉप्स, एच-फ्रेम और क्लैंप किराये तथा बिक्री के लिए उपलब्ध हैं।',

    steelPlates: 'स्टील प्लेटें',
    props: 'प्रॉप्स',
    hFrames: 'एच-फ्रेम',
    clamps: 'क्लैंप',

    viewShuttering: 'शटरिंग देखें',

    rccRoadConstruction: 'आरसीसी सड़क निर्माण',
    rccRoadConstructionDesc: 'प्रारंभिक सर्वेक्षण से लेकर अंतिम हस्तांतरण तक सम्पूर्ण आरसीसी सड़क निर्माण सेवाएँ।',

    survey: 'सर्वेक्षण',
    estimation: 'अनुमान',
    construction: 'निर्माण',
    handover: 'हस्तांतरण',

    viewProjects: 'परियोजनाएँ देखें',

    heroTitle: 'स्वास्तिक इंटरलॉकिंग',
    heroSub: 'निर्माण में विश्वास',

    orderNow: 'अभी ऑर्डर करें',
    viewProducts: 'निर्माण सामग्री देखें',

    whyChoose: 'हमें क्यों चुनें',
    excellenceFeatures: 'श्रेष्ठता की विशेषताएँ',

    mfgTitle: 'निर्माण इकाई',
    mfgDesc: 'आधुनिक उत्पादन सुविधाएँ जो प्रत्येक ब्लॉक में गुणवत्ता और सटीकता सुनिश्चित करती हैं।',

    deliveryTitle: 'तेज़ डिलीवरी',
    deliveryDesc: 'समर्पित लॉजिस्टिक्स नेटवर्क जो समय पर डिलीवरी सुनिश्चित करता है।',

    materialsTitle: 'उच्च गुणवत्ता सामग्री',
    materialsDesc: 'अधिकतम मजबूती और टिकाऊपन के लिए प्रीमियम ग्रेड सीमेंट और एग्रीगेट का उपयोग।',

    customTitle: 'कस्टम ऑर्डर',
    customDesc: 'आपकी आवश्यकताओं के अनुसार डिज़ाइन, रंग और पैटर्न उपलब्ध।',

    prodCat: 'निर्माण सामग्री एवं इंफ्रास्ट्रक्चर समाधान',
    prodCatDesc: 'हमारी सम्पूर्ण निर्माण सामग्री श्रृंखला का अन्वेषण करें।',

    viewCatalog: '250+ उत्पाद उपलब्ध →',

    heavyDuty: 'हेवी ड्यूटी',

    indPaver: 'इंटरलॉकिंग स्ट्रीट पेवर',
    indPaverDesc: 'गोदामों, पेट्रोल पंपों और सार्वजनिक क्षेत्रों जैसे भारी उपयोग वाले स्थानों के लिए उपयुक्त।',

    landscape: 'निर्माण',

    resPaver: 'शटरिंग एवं आरसीसी',
    resPaverDesc: 'उच्च गुणवत्ता वाली शटरिंग सामग्री और सम्पूर्ण आरसीसी सड़क निर्माण समाधान।',

    infrastructure: 'इन्फ्रास्ट्रक्चर',

    curbTitle: 'पेट्रोल पंप ईंटें',
    curbDesc: 'पेट्रोल पंपों और भारी भार वाले क्षेत्रों के लिए विशेष रूप से डिज़ाइन की गई इंटरलॉकिंग ईंटें।',

    getQuote: 'कोटेशन प्राप्त करें',

    testimonials: 'हमारे ग्राहक क्या कहते हैं',

    quoteText: '"स्वास्तिक इंटरलॉकिंग ने हमारे 10,000 वर्ग फुट औद्योगिक पार्क के लिए पेवर उपलब्ध कराए। उनकी गुणवत्ता और फिनिशिंग बेहतरीन है। कठिन समय सीमा के बावजूद डिलीवरी समय पर हुई।"',

    director: 'राजेश कुमार',
    designation: 'प्रबंध निदेशक, बिल्डटेक इंफ्रास्ट्रक्चर',

    customQuote: 'कस्टम कोटेशन प्राप्त करें',

    quoteFormDesc: 'अपनी परियोजना का विवरण भेजें, हम आपको प्रतिस्पर्धी मूल्य के साथ संपर्क करेंगे।',

    nameLabel: 'नाम',
    phoneLabel: 'फोन नंबर',

    reqLabel: 'आवश्यकता का विवरण',

    reqPlaceholder: 'ब्लॉक के प्रकार, क्षेत्रफल या आवश्यक मात्रा के बारे में बताएं...',

    submitBtn: 'अनुरोध भेजें',

    submitting: 'भेजा जा रहा है...',

    valErr: 'कृपया अपना नाम और फोन नंबर दर्ज करें।',

    successMsg: 'आपका अनुरोध सफलतापूर्वक प्राप्त हुआ! हम जल्द ही आपसे संपर्क करेंगे।',

    connErr: 'सर्वर से कनेक्ट करने में समस्या हुई। कृपया पुनः प्रयास करें।',

    topPartner: 'कौड़ीराम का #1 निर्माण सहयोगी',

    safePayment: 'सुरक्षित भुगतान',
    fastDelivery: 'तेज़ डिलीवरी',
    qualityGuaranteed: 'गुणवत्ता की गारंटी',

    location: 'कौड़ीराम, उत्तर प्रदेश',

    qualityCertified: 'गुणवत्ता प्रमाणित',

    yearsExperience: 'वर्षों का अनुभव',
    happyCustomers: 'संतुष्ट ग्राहक',
    majorProjects: 'प्रमुख परियोजनाएँ',
    supportGuaranteed: 'सहायता की गारंटी',

    newOrder: 'नया ऑर्डर प्राप्त हुआ',

    justNow: 'कौड़ीराम, उत्तर प्रदेश — अभी',

    talkDirectly: 'मालिकों से सीधे बात करें',

    noMiddleman: 'कोई बिचौलिया नहीं — हमेशा सीधे संपर्क करें',

    buildingMaterialsRcc: 'निर्माण सामग्री एवं आरसीसी सड़कें',

    buildingMaterialsRccDesc: 'पेवर ब्लॉक, निर्माण सामग्री, शटरिंग किराया और आरसीसी सड़क कार्यों के लिए संपर्क करें।',

    pipesDrainage: 'पाइप एवं ड्रेनेज समाधान',

    pipesDrainageDesc: 'ड्रेनेज पाइप, जल आपूर्ति, स्विमिंग पूल निर्माण और औद्योगिक पाइपिंग के लिए संपर्क करें।',

    pipesAndDrainage: 'पाइप एवं ड्रेनेज',

    pipesAndDrainageDesc: 'सभी परियोजनाओं के लिए उच्च गुणवत्ता वाले आरसीसी पाइप और जल निकासी समाधान।',

    rccPipes: 'आरसीसी पाइप',
    drainage: 'जल निकासी',
    waterSupply: 'जल आपूर्ति',

    productCategories: 'निर्माण सामग्री एवं इंफ्रास्ट्रक्चर समाधान',

    exploreCategory: 'श्रेणी देखें →',

    interlockingPaver: 'इंटरलॉकिंग एवं पेवर ब्लॉक',

    interlockingDesc: 'सड़कों, रास्तों और व्यावसायिक परियोजनाओं के लिए मजबूत पेवर समाधान।',

    rccPipesDrainage: 'आरसीसी पाइप एवं ड्रेनेज',

    rccPipesDesc: 'जल निकासी और इंफ्रास्ट्रक्चर परियोजनाओं के लिए मजबूत पाइप समाधान।',

    sandAggregateRaw: 'रेत, गिट्टी एवं कच्ची सामग्री',

    sandAggregateDesc: 'हर निर्माण चरण के लिए गुणवत्तापूर्ण निर्माण सामग्री।',

    scrollToExplore: 'और जानने के लिए स्क्रॉल करें',

    scrollDown: 'नीचे स्क्रॉल करें'
  },
  en: {
    ourBusiness: 'Our Business Divisions',
    buildingMaterials: 'Building Materials',
    buildingMaterialsDesc: 'Premium interlocking paver blocks, sand, gravel, cement for all construction needs.',
    paverBlocks: 'Paver Blocks',
    sand: 'Sand',
    gravel: 'Gravel',
    cement: 'Cement',
    shutteringMaterials: 'Shuttering Materials',
    shutteringMaterialsDesc: 'Heavy-duty steel plates, props, H-frames, and clamps available for rent and sale.',
    steelPlates: 'Steel Plates',
    props: 'Props',
    hFrames: 'H-Frames',
    clamps: 'Clamps',
    viewShuttering: 'View Shuttering',
    rccRoadConstruction: 'RCC Road Construction',
    rccRoadConstructionDesc: 'Complete RCC road construction contracts, from initial survey to finish delivery.',
    survey: 'Survey',
    estimation: 'Estimation',
    construction: 'Construction',
    handover: 'Handover',
    viewProjects: 'View Projects',
    heroTitle: 'Swastika Interlocking',
    heroSub: 'Trusted in Construction',
    orderNow: 'Order Now',
    viewProducts: 'View Building Materials',
    whyChoose: 'Why Choose Us',
    excellenceFeatures: 'Excellence Features',
    mfgTitle: 'Manufacturing',
    mfgDesc: 'Modern production facilities ensuring consistent quality and precision in every block.',
    deliveryTitle: 'Fast Delivery',
    deliveryDesc: 'Dedicated logistics network providing timely delivery to sites across the region.',
    materialsTitle: 'Quality Materials',
    materialsDesc: 'Using premium grade cement and aggregates for maximum durability and strength.',
    customTitle: 'Custom Orders',
    customDesc: 'Tailored designs, colours, and patterns to meet your unique architectural requirements.',
    prodCat: 'Building Materials & Infrastructure Solutions',
    prodCatDesc: 'Explore our complete range of building materials.',
    viewCatalog: '250+ Products Available →',
    heavyDuty: 'Heavy Duty',
    indPaver: 'Interlocking Street Pavers',
    indPaverDesc: 'Built for high-traffic environments like warehouses, fuel stations, and public plazas.',
    landscape: 'Construction',
    resPaver: 'Shuttering & RCC',
    resPaverDesc: 'High-quality shuttering materials and complete RCC road construction solutions.',
    infrastructure: 'Infrastructure',
    curbTitle: 'Petrol Pump Bricks',
    curbDesc: 'Durable interlocking bricks specifically designed for petrol pumps and heavy load areas.',
    getQuote: 'Get Quote',
    testimonials: 'What Our Partners Say',
    quoteText: '"Swastika Interlocking provided the pavers for our 10,000 sq.ft industrial park. The durability and finish are unmatched. Their delivery was on point even with tight deadlines."',
    director: 'Rajesh Kumar',
    designation: 'Managing Director, BuildTech Infrastructure',
    customQuote: 'Get a Custom Quote',
    quoteFormDesc: 'Send us your project details and we will get back to you with a competitive estimate.',
    nameLabel: 'Name',
    phoneLabel: 'Phone Number',
    reqLabel: 'Requirement Details',
    reqPlaceholder: 'Tell us about block types, area in sq. ft or quantity needed...',
    submitBtn: 'Submit Request',
    submitting: 'Submitting...',
    valErr: 'Please enter your name and phone number.',
    successMsg: 'Your request has been successfully received! We will contact you soon.',
    connErr: 'Error connecting to the server. Please try again.',
    topPartner: 'Kauriram\'s #1 Construction Partner',
    safePayment: 'Safe Payment',
    fastDelivery: 'Fast Delivery',
    qualityGuaranteed: 'Quality Guaranteed',
    location: 'Kauriram, UP',
    qualityCertified: 'QUALITY CERTIFIED',
    yearsExperience: 'Years Experience',
    happyCustomers: 'Happy Customers',
    majorProjects: 'Major Projects',
    supportGuaranteed: 'Support Guaranteed',
    newOrder: 'New order placed',
    justNow: 'Kauriram, UP — just now',
    talkDirectly: 'Talk Directly to the Owners',
    noMiddleman: 'No middleman — direct contact always',
    buildingMaterialsRcc: 'Building Materials & RCC Roads',
    buildingMaterialsRccDesc: 'Contact for paver blocks, building materials, shuttering rental, and RCC roads.',
    pipesDrainage: 'Pipes & Drainage Solutions',
    pipesDrainageDesc: 'Contact for drainage pipes, water supply, pool construction, and industrial piping.',
    pipesAndDrainage: 'Pipes & Drainage',
    pipesAndDrainageDesc: 'High-quality RCC pipes, drainage solutions, and water supply pipes for all projects.',
    rccPipes: 'RCC Pipes',
    drainage: 'Drainage',
    waterSupply: 'Water Supply',
    productCategories: 'Building Materials & Infrastructure Solutions',
    exploreCategory: 'Explore Category →',
    interlockingPaver: 'Interlocking & Paver Blocks',
    interlockingDesc: 'Durable paving solutions for roads, pathways and commercial projects.',
    rccPipesDrainage: 'RCC Pipes & Drainage',
    rccPipesDesc: 'Heavy-duty pipe solutions for water flow and infrastructure projects.',
    sandAggregateRaw: 'Sand, Aggregate & Raw Materials',
    sandAggregateDesc: 'Quality construction materials for every project stage.',
    shutteringMaterialsDesc: 'Reliable formwork systems for construction and RCC structures.',
    scrollToExplore: 'Scroll to explore',
    scrollDown: 'Scroll down'
  }
};

export default function Home({ language }) {
  const navigate = useNavigate();
  const { user: authUser, profile } = useAuth();
  const t = TRANSLATIONS[language];

  const heroImages = [
    '/images/hero-background.png'
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    requirements: ''
  });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setStatusMsg(t.valErr);
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setStatusMsg('');

    try {
      await createInquiry({
        customer_name: formData.name,
        customer_phone: formData.phone,
        message: formData.requirements,
        source: 'contact_form',
        subject: 'Quick Quote Request from Homepage',
        customer_id: profile?.id || null
      });

      setIsSuccess(true);
      setStatusMsg(t.successMsg);
      setFormData({ name: '', phone: '', requirements: '' });
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setStatusMsg(t.connErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16">
      <SEOHead
        title="Swastika Interlocking | Paver Blocks & RCC Roads - Kauriram, UP"
        description="Swastika Interlocking - Leading manufacturer of interlocking paver blocks in Kauriram, Uttar Pradesh. Quality RCC road construction, shuttering materials rental. Call now for best prices."
        keywords="paver blocks kauriram, interlocking blocks up, rcc roads uttar pradesh, shuttering materials kauriram, cement blocks manufacturer up"
        url="/"
        schema={[faqSchema]}
        breadcrumb={getBreadcrumbSchema([{ name: 'Home', path: '/' }])}
        language={language}
      />

      <section className="relative w-full min-h-[100svh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/footer-background.png')` }}
        />
        <div className="absolute inset-0 bg-[#1a1a3e]/85" />

        <div className="relative z-10 w-full max-w-container-max mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 sm:px-4 py-1.5 text-white text-xs sm:text-sm font-semibold backdrop-blur-sm">
              <span className="text-yellow-400">★</span>
              {t.topPartner}
            </div>

            <div>
              {language === 'hi' ? (
                <>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black text-white leading-tight">
                    निर्माण करें
                  </h1>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black text-[#E8650A] leading-tight">
                    पूरे विश्वास के साथ
                  </h1>
                  <p className="text-white/70 text-base sm:text-xl mt-2 font-medium italic">
                    गुणवत्ता, मजबूती और भरोसे का वादा
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black text-white leading-tight">
                    Build with
                  </h1>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black text-[#E8650A] leading-tight">
                    Confidence
                  </h1>
                  <p className="text-white/70 text-base sm:text-xl mt-2 font-medium">{t.heroSub}</p>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/order"
                className="flex items-center gap-2 bg-[#E8650A] hover:bg-[#c25408] text-white px-5 sm:px-6 py-3 rounded-lg font-bold text-sm transition-all active:scale-95 shadow-lg"
              >
                {t.orderNow}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
              <a
                href="tel:+918400936290"
                className="flex items-center gap-2 bg-white/10 border border-white/30 text-white hover:bg-white/20 px-4 sm:px-5 py-3 rounded-lg font-bold text-sm transition-all backdrop-blur-sm"
              >
                <span className="material-symbols-outlined text-sm">call</span>
                84009 36290
              </a>
              <a
                href="https://wa.me/918400936290"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white px-4 sm:px-5 py-3 rounded-lg font-bold text-sm transition-all"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                WhatsApp
              </a>
            </div>

            <div className="flex flex-wrap gap-x-4 sm:gap-x-5 gap-y-1 text-white/50 text-xs pt-1">
              {[t.safePayment, t.fastDelivery, t.qualityGuaranteed, t.location].map((tag, idx) => (
                <span key={idx} className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-green-500 text-white text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full shadow-lg">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              {t.qualityCertified}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {[
                { number: '10+', label: t.yearsExperience, sub: '', color: 'text-[#E8650A]' },
                { number: '500+', label: t.happyCustomers, sub: '', color: 'text-[#25D366]' },
                { number: '25+', label: t.majorProjects, sub: '', color: 'text-[#FAF0E6]' },
                { number: '100%', label: t.supportGuaranteed, sub: '', color: 'text-[#25D366]' }
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 md:p-6 border border-white/20 text-center"
                >
                  <p className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-2 ${stat.color}`}>{stat.number}</p>
                  <p className="text-white font-semibold text-xs sm:text-base md:text-lg">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="absolute -bottom-6 sm:-bottom-8 left-0 right-0 mx-auto w-fit bg-white rounded-xl shadow-xl px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm font-semibold text-gray-800">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span>
                {t.newOrder}
                <span className="text-gray-400 font-normal ml-1 text-xs">
                  {t.justNow}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs flex flex-col items-center gap-1 z-10">
          <span>{t.scrollToExplore}</span>
          <span className="material-symbols-outlined animate-bounce text-lg">expand_more</span>
        </div>
      </section>

      <section className="bg-[#1a1a3e] py-3 sm:py-4 overflow-hidden">
        <div className="flex items-center gap-6 sm:gap-8 animate-marquee whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((text, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3 text-white text-xs sm:text-sm font-semibold">
              {text}
            </div>
          ))}
        </div>
      </section>

      <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden bg-[#FAF0E6]">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-gutter relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#1a1a3e] mb-3 sm:mb-4 leading-tight font-black">
              {t.talkDirectly}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#1a1a3e]/70 leading-relaxed">
              {t.noMiddleman}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-4 sm:gap-5 mb-5 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FAF0E6] rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl sm:text-4xl text-[#1a1a3e]">person</span>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1a1a3e]">Dilip Chaubey</h3>
                  <p className="text-[#E8650A] font-semibold text-sm sm:text-base">{t.buildingMaterialsRcc}</p>
                </div>
              </div>
              <p className="text-[#1a1a3e]/70 text-base sm:text-lg mb-5 sm:mb-6">
                {t.buildingMaterialsRccDesc}
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <a href="tel:8400936290" className="flex items-center gap-2 sm:gap-3 px-5 sm:px-7 py-3 sm:py-4 bg-[#E8650A] text-white rounded-xl font-bold text-base sm:text-lg hover:bg-[#c25408] transition-colors">
                  <span className="material-symbols-outlined">call</span>
                  84009 36290
                </a>
                <a href="https://wa.me/918400936290" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 sm:gap-3 px-5 sm:px-7 py-3 sm:py-4 bg-[#25D366] text-white rounded-xl font-bold text-base sm:text-lg hover:bg-[#1da851] transition-colors">
                  <span className="material-symbols-outlined">chat</span>
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-lg border border-blue-100">
              <div className="flex items-center gap-4 sm:gap-5 mb-5 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#E3F2FD] rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl sm:text-4xl text-[#1565C0]">person</span>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1a1a3e]">Alok Chaubey</h3>
                  <p className="text-[#1565C0] font-semibold text-sm sm:text-base">{t.pipesDrainage}</p>
                </div>
              </div>
              <p className="text-[#1a1a3e]/70 text-base sm:text-lg mb-5 sm:mb-6">
                {t.pipesDrainageDesc}
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <a href="tel:9722832661" className="flex items-center gap-2 sm:gap-3 px-5 sm:px-7 py-3 sm:py-4 bg-[#1565C0] text-white rounded-xl font-bold text-base sm:text-lg hover:bg-[#0d4b8a] transition-colors">
                  <span className="material-symbols-outlined">call</span>
                  97228 32661
                </a>
                <a href="https://wa.me/919722832661" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 sm:gap-3 px-5 sm:px-7 py-3 sm:py-4 bg-[#25D366] text-white rounded-xl font-bold text-base sm:text-lg hover:bg-[#1da851] transition-colors">
                  <span className="material-symbols-outlined">chat</span>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-gutter max-w-container-max mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1a1a3e]">{t.ourBusiness}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-gutter">
          <div className="group relative overflow-hidden rounded-2xl bg-surface h-[380px] sm:h-[450px] md:h-[500px] shadow-xl border-l-4 border-[#E8650A]">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/images/Building-Material-image.png')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20"></div>
            <div className="absolute inset-0 p-5 sm:p-6 md:p-8 flex flex-col justify-end">
              <h3 className="text-white font-bold text-xl sm:text-2xl mb-2">{t.buildingMaterials}</h3>
              <p className="text-white/70 text-sm mb-5 sm:mb-6 line-clamp-2">{t.buildingMaterialsDesc}</p>
              <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">{t.paverBlocks}</span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">{t.sand}</span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">{t.gravel}</span>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-surface h-[380px] sm:h-[450px] md:h-[500px] shadow-xl border-l-4 border-[#1565C0]">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/Business-division-shuttering.png')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20"></div>
            <div className="absolute inset-0 p-5 sm:p-6 md:p-8 flex flex-col justify-end">
              <h3 className="text-white font-bold text-xl sm:text-2xl mb-2">{t.shutteringMaterials}</h3>
              <p className="text-white/70 text-sm mb-5 sm:mb-6 line-clamp-2">{t.shutteringMaterialsDesc}</p>
              <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">{t.steelPlates}</span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">{t.props}</span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">{t.hFrames}</span>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-surface h-[380px] sm:h-[450px] md:h-[500px] shadow-xl border-l-4 border-[#2E7D32]">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/Business-division-rcc.png')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20"></div>
            <div className="absolute inset-0 p-5 sm:p-6 md:p-8 flex flex-col justify-end">
              <h3 className="text-white font-bold text-xl sm:text-2xl mb-2">{t.rccRoadConstruction}</h3>
              <p className="text-white/70 text-sm mb-5 sm:mb-6 line-clamp-2">{t.rccRoadConstructionDesc}</p>
              <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">{t.survey}</span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">{t.construction}</span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">{t.handover}</span>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-surface h-[380px] sm:h-[450px] md:h-[500px] shadow-xl border-l-4 border-[#8B4513]">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/drainage-image.png')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20"></div>
            <div className="absolute inset-0 p-5 sm:p-6 md:p-8 flex flex-col justify-end">
              <h3 className="text-white font-bold text-xl sm:text-2xl mb-2">{t.pipesAndDrainage}</h3>
              <p className="text-white/70 text-sm mb-5 sm:mb-6 line-clamp-2">{t.pipesAndDrainageDesc}</p>
              <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">{t.rccPipes}</span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">{t.drainage}</span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">{t.waterSupply}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-gutter max-w-container-max mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1a1a3e]">{t.whyChoose}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-gutter">
          <div className="bg-surface-container border border-outline-variant p-5 sm:p-card-padding rounded-xl hover:shadow-lg transition-all group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6 text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
              <span className="material-symbols-outlined text-2xl sm:text-3xl">precision_manufacturing</span>
            </div>
            <h3 className="font-bold text-lg sm:text-xl mb-3">{t.mfgTitle}</h3>
            <p className="text-on-surface-variant text-sm sm:text-base">{t.mfgDesc}</p>
          </div>
          <div className="bg-surface-container border border-outline-variant p-5 sm:p-card-padding rounded-xl hover:shadow-lg transition-all group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6 text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-all">
              <span className="material-symbols-outlined text-2xl sm:text-3xl">local_shipping</span>
            </div>
            <h3 className="font-bold text-lg sm:text-xl mb-3">{t.deliveryTitle}</h3>
            <p className="text-on-surface-variant text-sm sm:text-base">{t.deliveryDesc}</p>
          </div>
          <div className="bg-surface-container border border-outline-variant p-5 sm:p-card-padding rounded-xl hover:shadow-lg transition-all group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-tertiary/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6 text-tertiary group-hover:bg-tertiary group-hover:text-on-tertiary transition-all">
              <span className="material-symbols-outlined text-2xl sm:text-3xl">verified</span>
            </div>
            <h3 className="font-bold text-lg sm:text-xl mb-3">{t.materialsTitle}</h3>
            <p className="text-on-surface-variant text-sm sm:text-base">{t.materialsDesc}</p>
          </div>
          <div className="bg-surface-container border border-outline-variant p-5 sm:p-card-padding rounded-xl hover:shadow-lg transition-all group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-fixed-dim/20 rounded-lg flex items-center justify-center mb-4 sm:mb-6 text-primary group-hover:bg-primary-fixed-dim group-hover:text-on-surface transition-all">
              <span className="material-symbols-outlined text-2xl sm:text-3xl">dashboard_customize</span>
            </div>
            <h3 className="font-bold text-lg sm:text-xl mb-3">{t.customTitle}</h3>
            <p className="text-on-surface-variant text-sm sm:text-base">{t.customDesc}</p>
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-gutter">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-center text-[#1a1a3e] mb-10 sm:mb-12">{t.productCategories}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
                title: t.interlockingPaver,
                desc: t.interlockingDesc,
                image: '/interlocking-street-image-3x.jpg',
                to: '/products',
                bg: 'bg-[#1a1a3e]',
              },
              {
                title: t.rccPipesDrainage,
                desc: t.rccPipesDesc,
                image: '/drainage-image.png',
                to: '/products',
                bg: 'bg-[#E8650A]',
              },
              {
                title: t.shutteringMaterials,
                desc: t.shutteringMaterialsDesc,
                image: '/Business-division-shuttering.png',
                to: '/shuttering',
                bg: 'bg-[#1a1a3e]',
              },
              {
                title: t.sandAggregateRaw,
                desc: t.sandAggregateDesc,
                image: '/images/Building-Material-image.png',
                to: '/products',
                bg: 'bg-[#E8650A]',
              },
            ].map((cat, i) => (
              <Link
                key={i}
                to={cat.to}
                className="group relative h-[240px] sm:h-[280px] md:h-[320px] rounded-2xl overflow-hidden shadow-xl border-4 border-transparent hover:border-[#E8650A] transition-all duration-500"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url("${cat.image}")` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1f]/95 via-[#0a0a1f]/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                  <h3 className="text-white font-bold text-xl sm:text-2xl mb-2">{cat.title}</h3>
                  <p className="text-white/80 mb-5 sm:mb-6 text-sm sm:text-base">{cat.desc}</p>
                  <span className="inline-flex items-center gap-2 bg-[#E8650A] text-white px-4 sm:px-5 py-2 rounded-lg font-bold hover:bg-[#c25408] transition-colors text-sm">
                    {t.exploreCategory}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <AuthGate language={language}>
        <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-gutter max-w-container-max mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="bg-inverse-surface text-inverse-on-surface p-5 sm:p-6 md:p-10 rounded-2xl shadow-2xl">
              <h3 className="font-bold text-xl sm:text-2xl mb-2 text-center">{t.customQuote}</h3>
              <p className="text-surface-variant mb-6 sm:mb-8 text-center text-sm sm:text-base">{t.quoteFormDesc}</p>
              <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.nameLabel}</label>
                    <input className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:border-primary outline-none transition-all" type="text" name="name" value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.phoneLabel}</label>
                    <input className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:border-primary outline-none transition-all" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.reqLabel}</label>
                  <textarea className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:border-primary outline-none transition-all" rows="4" name="requirements" value={formData.requirements} onChange={handleInputChange}></textarea>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary text-on-primary py-4 rounded-lg font-bold hover:bg-primary-container hover:-translate-y-1 active:scale-95 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md">
                  {loading ? t.submitting : t.submitBtn}
                </button>
                {statusMsg && <div className={`mt-4 p-4 rounded-lg font-bold text-center ${isSuccess ? 'bg-primary-fixed/20 text-primary-fixed' : 'bg-error-container text-error'}`}>{statusMsg}</div>}
              </form>
            </div>
          </div>
        </section>
      </AuthGate>
    </div>
  );
}
