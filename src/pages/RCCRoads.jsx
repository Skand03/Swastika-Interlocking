import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProductsByDivision } from '../services/productService';
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
    home: 'होम',
    rccRoads: 'आरसीसी सड़कें',
    products: 'उत्पाद',
    projects: 'प्रोजेक्ट्स',
    portalLogin: 'पोर्टल लॉगिन',
    knowMore: 'और जानें',
    viewDetails: 'विवरण देखें →',
    getConsultation: 'मुफ्त परामर्श प्राप्त करें',
    requestEnquiry: 'पूछताछ अनुरोध',
    bookOrder: 'ऑर्डर बुक करें',
    rccConstruction: 'आरसीसी सड़क निर्माण',
    heroSub: 'गुणवत्तापूर्ण सड़कें, समय पर डिलीवरी। हम भारत की सबसे मजबूत और टिकाऊ सड़कों का निर्माण करते हैं।',
    getQuote: 'कोट प्राप्त करें',
    seeOurWork: 'हमारा काम देखें',
    roadsBuilt: 'सड़कें बनाई गईं',
    sqftConstructed: 'वर्गफुट निर्मित',
    onTime: 'समय पर',
    yearsExp: 'वर्षों का अनुभव',
    districts: 'जिले',
    satisfaction: 'संतुष्टि',
    ourServices: 'हमारी सेवाएं',
    surveyTitle: 'साइट सर्वे और प्लानिंग',
    surveySub: 'साइट सर्वे',
    surveyDesc: 'इष्टतम सड़क स्थायित्व के लिए विशेषज्ञ भू-भाग विश्लेषण।',
    costTitle: 'लागत अनुमान',
    costSub: 'लागत अनुमान',
    costDesc: 'पारदर्शी और प्रतिस्पर्धी मूल्य निर्धारण, कोई छिपी हुई फीस नहीं।',
    constructTitle: 'आरसीसी निर्माण',
    constructSub: 'RCC निर्माण',
    constructDesc: 'भारी ट्रैफिक लोड के लिए हैवी-ड्यूटी कंक्रीट सड़कें।',
    drainTitle: 'ड्रेनेज एकीकरण',
    drainSub: 'ड्रेनेज',
    drainDesc: 'लंबे जीवन के लिए निर्बाध जल प्रबंधन।',
    finishTitle: 'फिनिशिंग और क्योरिंग',
    finishSub: 'फिनिशिंग',
    finishDesc: 'अंतिम ताकत के लिए सावधानीपूर्वक क्योरिंग प्रक्रिया।',
    maintTitle: 'रखरखाव अनुबंध',
    maintSub: 'रखरखाव',
    maintDesc: 'चिंता मुक्त संचालन के लिए दीर्घकालिक देखभाल।',
    processTitle: 'निर्माण प्रक्रिया',
    step1: 'पूछताछ',
    step2: 'साइट का दौरा',
    step3: 'लागत आकलन',
    step4: 'निर्माण',
    step5: 'सौंपना',
    contactToday: 'आज ही संपर्क करें',
    contactDesc: 'अपने रोड प्रोजेक्ट के लिए मुफ्त परामर्श प्राप्त करें।',
    requestCallback: 'कॉल बैक का अनुरोध करें',
    whatsappNow: 'अभी व्हाट्सएप करें',
    ourProjects: 'हमारे प्रोजेक्ट',
    total: 'कुल',
    completed: 'पूरा',
    ongoing: 'चल रहा है',
    length: 'लंबाई',
    filterAll: 'सभी',
    filterVillage: 'गांव की सड़कें',
    filterTown: 'शहर की सड़कें',
    filterColony: 'कॉलोनी की सड़कें',
    loadMore: 'और प्रोजेक्ट लोड करें',
    estEnd: 'अनुमानित समाप्ति',
    date: 'दिनांक',
    processSubtitle: '/ कार्यप्रवाह',
    processDesc: 'उच्च प्रदर्शन वाली आरसीसी सड़कें वितरित करने के लिए एक व्यवस्थित, इंजीनियरिंग-प्रथम दृष्टिकोण।',
    noProjects: 'वर्तमान में कोई प्रोजेक्ट उपलब्ध नहीं है।',
    loadMoreBtn: 'और प्रोजेक्ट लोड करें'
  },
  en: {
    home: 'Home',
    rccRoads: 'RCC Roads',
    products: 'Products',
    projects: 'Projects',
    portalLogin: 'Portal Login',
    knowMore: 'Know More',
    viewDetails: 'View Details →',
    getConsultation: 'Get Free Consultation',
    requestEnquiry: 'Request Enquiry',
    bookOrder: 'Book Order',
    rccConstruction: 'RCC Road Construction',
    heroSub: 'Quality roads, delivered on time. We build the strongest and most durable roads in India.',
    getQuote: 'Get Quote',
    seeOurWork: 'See Our Work',
    roadsBuilt: 'Roads Built',
    sqftConstructed: 'sq.ft Constructed',
    onTime: 'On-Time',
    yearsExp: 'Years Experience',
    districts: 'Districts',
    satisfaction: 'Satisfaction',
    ourServices: 'Our Services',
    surveyTitle: 'Site Survey & Planning',
    surveySub: 'Site Survey',
    surveyDesc: 'Expert terrain analysis for optimal road durability.',
    costTitle: 'Cost Estimation',
    costSub: 'Cost Estimation',
    costDesc: 'Transparent and competitive pricing with no hidden fees.',
    constructTitle: 'RCC Construction',
    constructSub: 'RCC Construction',
    constructDesc: 'Heavy duty concrete roads for high traffic load.',
    drainTitle: 'Drainage Integration',
    drainSub: 'Drainage',
    drainDesc: 'Seamless water management for longevity.',
    finishTitle: 'Finishing & Curing',
    finishSub: 'Finishing',
    finishDesc: 'Meticulous curing process for ultimate strength.',
    maintTitle: 'Maintenance Contract',
    maintSub: 'Maintenance',
    maintDesc: 'Long-term care for worry-free operation.',
    processTitle: 'Construction Process',
    step1: 'Enquiry',
    step2: 'Site Visit',
    step3: 'Estimation',
    step4: 'Construction',
    step5: 'Handover',
    contactToday: 'Contact Today',
    contactDesc: 'Get a free consultation for your road project.',
    requestCallback: 'Request Callback',
    whatsappNow: 'WhatsApp Now',
    ourProjects: 'Our Projects',
    total: 'Total',
    completed: 'Completed',
    ongoing: 'Ongoing',
    length: 'Length',
    filterAll: 'All',
    filterVillage: 'Village Roads',
    filterTown: 'Town Roads',
    filterColony: 'Colony Roads',
    loadMore: 'Load More Projects',
    estEnd: 'Est. End',
    date: 'Date',
    processSubtitle: '/ Workflow',
    processDesc: 'A systematic, engineering-first approach to delivering high-performance RCC roads.',
    noProjects: 'No projects currently available.',
    loadMoreBtn: 'Load More Projects'
  }
};

export default function RCCRoads({ language }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const navigate = useNavigate();
  const [hasMoreProjects, setHasMoreProjects] = useState(false);
  const [rccProjects, setRccProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await getProductsByDivision('rcc');
        const mapped = (data || []).map(p => ({
          id: p.id,
          name: language === 'hi' ? (p.name_hi || p.name_en) : p.name_en,
          desc: language === 'hi' ? (p.description_hi || p.description_en) : p.description_en,
          status: (p.stock_quantity || 0) > 0 ? t.completed : t.ongoing,
          length: p.price_min ? `${p.price_min} km` : '',
          image: p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1517482813155-273a215b2447?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        }));
        
        // Fallback demo projects so the gallery isn't empty
        const fallbacks = [
          { id: 'mock-1', name: language === 'hi' ? 'NH-44 हाईवे विस्तार' : 'NH-44 Highway Extension', desc: language === 'hi' ? 'उच्च वाणिज्यिक यातायात को सहन करने के लिए निर्मित एक भारी शुल्क आरसीसी सड़क।' : 'A heavy-duty RCC road built to withstand high commercial traffic.', status: t.completed, length: '12 km', image: 'https://images.unsplash.com/photo-1517482813155-273a215b2447?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
          { id: 'mock-2', name: language === 'hi' ? 'स्मार्ट सिटी बुलेवार्ड' : 'Smart City Boulevard', desc: language === 'hi' ? 'एकीकृत जल निकासी और उपयोगिता नलिकाओं के साथ शहरी ग्रिड सड़क।' : 'Urban grid road with integrated drainage and utility ducts.', status: t.ongoing, length: '4.5 km', image: 'https://images.unsplash.com/photo-1541888087895-d226a2c30656?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
          { id: 'mock-3', name: language === 'hi' ? 'इंडस्ट्रियल पार्क कनेक्टिविटी' : 'Industrial Park Connectivity', desc: language === 'hi' ? 'भारी निर्माण क्षेत्रों के लिए विशेष रूप से डिज़ाइन की गई प्रबलित कंक्रीट सड़क।' : 'Reinforced concrete road specifically designed for heavy manufacturing zones.', status: t.completed, length: '8 km', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
        ];

        // Combine and limit
        const finalProjects = mapped.length > 0 ? mapped : fallbacks;
        setRccProjects(finalProjects);
      } catch (err) {
        console.error("Error fetching RCC projects:", err);
        // Fallback to demo projects on error
        const fallbacks = [
          { id: 'mock-1', name: language === 'hi' ? 'NH-44 हाईवे विस्तार' : 'NH-44 Highway Extension', desc: language === 'hi' ? 'उच्च वाणिज्यिक यातायात को सहन करने के लिए निर्मित एक भारी शुल्क आरसीसी सड़क।' : 'A heavy-duty RCC road built to withstand high commercial traffic.', status: t.completed, length: '12 km', image: 'https://images.unsplash.com/photo-1517482813155-273a215b2447?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
          { id: 'mock-2', name: language === 'hi' ? 'स्मार्ट सिटी बुलेवार्ड' : 'Smart City Boulevard', desc: language === 'hi' ? 'एकीकृत जल निकासी और उपयोगिता नलिकाओं के साथ शहरी ग्रिड सड़क।' : 'Urban grid road with integrated drainage and utility ducts.', status: t.ongoing, length: '4.5 km', image: 'https://images.unsplash.com/photo-1541888087895-d226a2c30656?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
          { id: 'mock-3', name: language === 'hi' ? 'इंडस्ट्रियल पार्क कनेक्टिविटी' : 'Industrial Park Connectivity', desc: language === 'hi' ? 'भारी निर्माण क्षेत्रों के लिए विशेष रूप से डिज़ाइन की गई प্রबलित कंक्रीट सड़क।' : 'Reinforced concrete road specifically designed for heavy manufacturing zones.', status: t.completed, length: '8 km', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
        ];
        setRccProjects(fallbacks);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [language, t.completed, t.ongoing]);

  return (
    <div className="pt-16">
      <SEOHead
        title="RCC Road Construction Contractor - Deesa Banaskantha Gujarat | Swastika"
        description="Expert RCC road construction in Deesa, Banaskantha, Gujarat. Village roads, colony roads, M20/M25/M30 grade concrete. 25+ roads completed. Call for free survey."
        keywords="RCC road contractor Deesa, road construction Gujarat, gram panchayat road Banaskantha, concrete road contractor Gujarat, RCC सड़क निर्माण देसा"
        url="/rcc-roads"
        breadcrumb={getBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'RCC Roads', path: '/rcc-roads' }])}
        language={language}
      />
      
{/*  PAGE 1: RCC ROADS SERVICES  */}
<section className="relative" id="rcc-roads">
{/*  HERO SECTION  */}
<header className="relative h-[350px] sm:h-[400px] md:h-[480px] w-full flex items-center overflow-hidden">
  <div className="absolute inset-0 bg-[#0E0E55]/80 z-10"></div>
  <img 
    className="absolute inset-0 w-full h-full object-cover opacity-70" 
    data-alt="RCC Construction" 
    src="/rcc-hero.jpg" 
    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517482813155-273a215b2447?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'; }} 
  />
  <div className="relative max-w-container-max mx-auto px-4 sm:px-gutter w-full z-20 pt-16 sm:pt-20">
    <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-2">{t.rccConstruction}</h1>
    <p className="font-body-lg text-body-lg text-surface-variant/80 max-w-xl mb-6 sm:mb-8">{t.heroSub}</p>
    <div className="flex flex-wrap gap-4 mb-6 sm:mb-8">
      <Link 
        to="/rcc-enquiry" 
        className="bg-[#8B1A00] text-white px-6 sm:px-8 py-3 sm:py-4 font-bold rounded-lg flex items-center gap-2 hover:brightness-110 transition-all"
      >
        {t.getQuote} <span className="material-symbols-outlined">arrow_forward</span>
      </Link>
    </div>
  </div>
</header>

{/*  MARQUEE  */}
<section className="bg-[#1a1a3e] py-3 sm:py-4 overflow-hidden">
  <div className="flex items-center gap-6 sm:gap-8 animate-marquee whitespace-nowrap">
    {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((text, i) => (
      <div key={i} className="flex items-center gap-2 sm:gap-3 text-white text-xs sm:text-sm font-semibold">
        {text}
      </div>
    ))}
  </div>
</section>

{/*  SERVICES SECTION  */}
<section className="py-12 sm:py-16 md:py-24 px-4 sm:px-gutter max-w-container-max mx-auto">
  <div className="text-center mb-12 sm:mb-16">
    <h2 className="font-headline-md text-headline-md text-on-surface mb-2">{t.ourServices}</h2>
    <div className="h-1 w-24 bg-secondary mx-auto"></div>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
    {/*  Service Card 1  */}
    <div className="bg-white p-4 sm:p-card-padding border-t-[3px] border-secondary shadow-sm hover:shadow-xl transition-shadow group">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-xl sm:text-2xl">architecture</span>
      </div>
      <h3 className="font-headline-md text-lg sm:text-xl mb-2">{t.surveyTitle}<br/><span className="text-secondary font-medium">{t.surveySub}</span></h3>
      <p className="text-on-surface-variant mb-4 sm:mb-6">{t.surveyDesc}</p>
      <Link to="/rcc-enquiry" className="text-secondary font-bold flex items-center gap-1 hover:gap-3 transition-all">{t.knowMore} <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
    </div>
    {/*  Service Card 2  */}
    <div className="bg-white p-4 sm:p-card-padding border-t-[3px] border-secondary shadow-sm hover:shadow-xl transition-shadow group">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-xl sm:text-2xl">request_quote</span>
      </div>
      <h3 className="font-headline-md text-lg sm:text-xl mb-2">{t.costTitle}<br/><span className="text-secondary font-medium">{t.costSub}</span></h3>
      <p className="text-on-surface-variant mb-4 sm:mb-6">{t.costDesc}</p>
      <Link to="/rcc-enquiry" className="text-secondary font-bold flex items-center gap-1 hover:gap-3 transition-all">{t.knowMore} <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
    </div>
    {/*  Service Card 3  */}
    <div className="bg-white p-4 sm:p-card-padding border-t-[3px] border-secondary shadow-sm hover:shadow-xl transition-shadow group">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-xl sm:text-2xl">engineering</span>
      </div>
      <h3 className="font-headline-md text-lg sm:text-xl mb-2">{t.constructTitle}<br/><span className="text-secondary font-medium">{t.constructSub}</span></h3>
      <p className="text-on-surface-variant mb-4 sm:mb-6">{t.constructDesc}</p>
      <Link to="/rcc-enquiry" className="text-secondary font-bold flex items-center gap-1 hover:gap-3 transition-all">{t.knowMore} <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
    </div>
    {/*  Service Card 4  */}
    <div className="bg-white p-4 sm:p-card-padding border-t-[3px] border-secondary shadow-sm hover:shadow-xl transition-shadow group">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-xl sm:text-2xl">water_drop</span>
      </div>
      <h3 className="font-headline-md text-lg sm:text-xl mb-2">{t.drainTitle}<br/><span className="text-secondary font-medium">{t.drainSub}</span></h3>
      <p className="text-on-surface-variant mb-4 sm:mb-6">{t.drainDesc}</p>
      <Link to="/rcc-enquiry" className="text-secondary font-bold flex items-center gap-1 hover:gap-3 transition-all">{t.knowMore} <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
    </div>
    {/*  Service Card 5  */}
    <div className="bg-white p-4 sm:p-card-padding border-t-[3px] border-secondary shadow-sm hover:shadow-xl transition-shadow group">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-xl sm:text-2xl">verified</span>
      </div>
      <h3 className="font-headline-md text-lg sm:text-xl mb-2">{t.finishTitle}<br/><span className="text-secondary font-medium">{t.finishSub}</span></h3>
      <p className="text-on-surface-variant mb-4 sm:mb-6">{t.finishDesc}</p>
      <Link to="/rcc-enquiry" className="text-secondary font-bold flex items-center gap-1 hover:gap-3 transition-all">{t.knowMore} <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
    </div>
    {/*  Service Card 6  */}
    <div className="bg-white p-4 sm:p-card-padding border-t-[3px] border-secondary shadow-sm hover:shadow-xl transition-shadow group">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-xl sm:text-2xl">handshake</span>
      </div>
      <h3 className="font-headline-md text-lg sm:text-xl mb-2">{t.maintTitle}<br/><span className="text-secondary font-medium">{t.maintSub}</span></h3>
      <p className="text-on-surface-variant mb-4 sm:mb-6">{t.maintDesc}</p>
      <Link to="/rcc-enquiry" className="text-secondary font-bold flex items-center gap-1 hover:gap-3 transition-all">{t.knowMore} <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
    </div>
  </div>
</section>

{/*  PROCESS TIMELINE  */}
<section className="bg-[#F6F2EC] py-12 sm:py-16 md:py-24 overflow-hidden relative">
  <div className="max-w-container-max mx-auto px-4 sm:px-gutter relative z-10">
    <div className="text-center mb-12 sm:mb-20">
      <h2 className="font-display-lg text-2xl sm:text-3xl md:text-4xl md:text-5xl text-[#2D3748] mb-2 sm:mb-4">{t.processTitle} <span className="text-primary font-light">{t.processSubtitle}</span></h2>
      <p className="text-on-surface-variant font-medium max-w-2xl mx-auto">{t.processDesc}</p>
    </div>

    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative">
        {[
          { num: 1, title: t.step1, icon: 'engineering' },
          { num: 2, title: t.step2, icon: 'location_on' },
          { num: 3, title: t.step3, icon: 'calculate' },
          { num: 4, title: t.step4, icon: 'precision_manufacturing' },
          { num: 5, title: t.step5, icon: 'verified' }
        ].map((step, idx) => (
          <div key={idx} className="relative text-center flex flex-col items-center group">
            {/* Connecting Arrow for Desktop (Horizontal) */}
            {idx < 4 && (
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-12 text-secondary/30 z-0">
                <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                  {idx % 2 === 0 ? (
                    /* Arch Up */
                    <path d="M 0,25 C 30,-15 70,-15 95,20" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" fill="none" />
                  ) : (
                    /* Arch Down */
                    <path d="M 0,25 C 30,65 70,65 95,30" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" fill="none" />
                  )}
                  {idx % 2 === 0 ? (
                    <polygon points="90,12 100,24 88,26" fill="currentColor" />
                  ) : (
                    <polygon points="88,24 100,26 90,38" fill="currentColor" />
                  )}
                </svg>
              </div>
            )}

            {/* Connecting Arrow for Mobile (Vertical) */}
            {idx < 4 && (
              <div className="md:hidden absolute top-[100%] left-1/2 -translate-x-1/2 w-12 h-12 text-secondary/30 z-0">
                <svg viewBox="0 0 50 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                  <path d="M 25,0 C 60,30 -10,70 25,95" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" fill="none" />
                  <polygon points="15,85 25,100 35,85" fill="currentColor" />
                </svg>
              </div>
            )}

            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-primary/20 text-secondary flex items-center justify-center shadow-lg group-hover:-translate-y-2 transition-transform duration-300 z-10 mb-4 sm:mb-6 relative">
              <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs sm:text-sm border-2 border-white">{step.num}</div>
              <span className="material-symbols-outlined text-2xl sm:text-4xl">{step.icon}</span>
            </div>
            
            <h4 className="font-headline-md text-base sm:text-lg font-bold mb-2 text-on-surface">{step.title}</h4>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
</section>

{/*  PAGE 2: PROJECT GALLERY  */}
<section className="" id="projects">

{/*  FILTERS & CONTENT  */}
<div className="max-w-container-max mx-auto px-4 sm:px-gutter py-12 sm:py-16">
  {/*  STATS ROW  */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
    <div className="bg-surface-container p-3 sm:p-4 rounded-xl text-center border border-outline-variant">
      <div className="text-xl sm:text-2xl font-bold text-on-surface">28</div>
      <div className="text-[10px] sm:text-xs text-on-surface-variant uppercase tracking-wider">{t.total}</div>
    </div>
    <div className="bg-surface-container p-3 sm:p-4 rounded-xl text-center border border-outline-variant">
      <div className="text-xl sm:text-2xl font-bold text-secondary">25</div>
      <div className="text-[10px] sm:text-xs text-on-surface-variant uppercase tracking-wider">{t.completed}</div>
    </div>
    <div className="bg-surface-container p-3 sm:p-4 rounded-xl text-center border border-outline-variant">
      <div className="text-xl sm:text-2xl font-bold text-primary">3</div>
      <div className="text-[10px] sm:text-xs text-on-surface-variant uppercase tracking-wider">{t.ongoing}</div>
    </div>
    <div className="bg-surface-container p-3 sm:p-4 rounded-xl text-center border border-outline-variant">
      <div className="text-xl sm:text-2xl font-bold text-on-surface">42 km</div>
      <div className="text-[10px] sm:text-xs text-on-surface-variant uppercase tracking-wider">{t.length}</div>
    </div>
  </div>

  {/*  FILTER PILLS  */}
  <div className="flex flex-wrap gap-2 mb-8 sm:mb-12 justify-center">
    {[
      { label: t.filterAll, value: 'All' },
      { label: t.completed, value: t.completed },
      { label: t.ongoing, value: t.ongoing },
      { label: t.filterVillage, value: 'Village' },
      { label: t.filterTown, value: 'Town' },
      { label: t.filterColony, value: 'Colony' }
    ].map(filter => (
      <button 
        key={filter.value}
        onClick={() => setActiveFilter(filter.value)}
        className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full border border-outline font-label-sm text-xs sm:text-sm transition-colors ${
          activeFilter === filter.value
            ? 'bg-secondary text-white border-secondary shadow-md' 
            : 'hover:bg-secondary/10'
        }`}
      >
        {filter.label}
      </button>
    ))}
  </div>

  {/*  PROJECT GRID  */}
  {loading ? (
    <div className="flex justify-center items-center py-12 sm:py-16">
      <div className="flex flex-col items-center gap-3">
        <span className="material-symbols-outlined text-4xl sm:text-5xl text-primary animate-spin">autorenew</span>
        <p className="text-on-surface-variant font-medium">{language === 'hi' ? 'प्रोजेक्ट्स लोड हो रहे हैं...' : 'Loading projects...'}</p>
      </div>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12">
      {rccProjects.filter(p => {
        if (activeFilter === 'All') return true;
        if (activeFilter === t.completed) return p.status === t.completed;
        if (activeFilter === t.ongoing) return p.status === t.ongoing;
        if (activeFilter === 'Village') return (p.name?.toLowerCase() || '').includes('village') || (p.desc?.toLowerCase() || '').includes('village') || (p.name?.toLowerCase() || '').includes('गांव');
        if (activeFilter === 'Town') return (p.name?.toLowerCase() || '').includes('town') || (p.name?.toLowerCase() || '').includes('city') || (p.desc?.toLowerCase() || '').includes('urban') || (p.name?.toLowerCase() || '').includes('शहर');
        if (activeFilter === 'Colony') return (p.name?.toLowerCase() || '').includes('colony') || (p.name?.toLowerCase() || '').includes('park') || (p.desc?.toLowerCase() || '').includes('colony') || (p.name?.toLowerCase() || '').includes('कॉलोनी');
        return true;
      }).map((project, idx) => (
        <div key={project.id || idx} className="group">
          <div className="relative h-[250px] sm:h-[300px] md:h-[400px] overflow-hidden rounded-xl mb-4 sm:mb-6 bg-surface-container-highest flex items-center justify-center">
            <img 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              alt={project.name} 
              src={project.image} 
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517482813155-273a215b2447?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; }}
            />
            <span className={`absolute top-2 sm:top-4 right-2 sm:right-4 text-white px-2 sm:px-4 py-1 rounded text-[10px] sm:text-sm font-bold ${project.status === t.completed ? 'bg-secondary' : 'bg-primary'}`}>{project.status}</span>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex gap-2">
              {project.length && <span className="bg-surface-variant px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded">{project.length}</span>}
            </div>
            <h3 className="font-headline-md text-xl sm:text-2xl group-hover:text-secondary transition-colors">{project.name}</h3>
            <p className="text-on-surface-variant text-sm sm:text-base line-clamp-2">{project.desc}</p>
            <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-outline-variant">
              <Link to="/rcc-enquiry" className="text-secondary font-bold flex items-center gap-1 group-hover:gap-2 transition-all text-sm">{t.viewDetails} <span className="material-symbols-outlined">arrow_right_alt</span></Link>
            </div>
          </div>
        </div>
      ))}
      {rccProjects.filter(p => {
        if (activeFilter === 'All') return true;
        if (activeFilter === t.completed) return p.status === t.completed;
        if (activeFilter === t.ongoing) return p.status === t.ongoing;
        if (activeFilter === 'Village') return (p.name?.toLowerCase() || '').includes('village') || (p.desc?.toLowerCase() || '').includes('village');
        if (activeFilter === 'Town') return (p.name?.toLowerCase() || '').includes('town') || (p.name?.toLowerCase() || '').includes('city') || (p.desc?.toLowerCase() || '').includes('urban');
        if (activeFilter === 'Colony') return (p.name?.toLowerCase() || '').includes('colony') || (p.name?.toLowerCase() || '').includes('park') || (p.desc?.toLowerCase() || '').includes('colony');
        return true;
      }).length === 0 && rccProjects.length > 0 && (
        <div className="col-span-full text-center py-12 text-on-surface-variant">
          {language === 'hi' ? 'इस श्रेणी में कोई प्रोजेक्ट नहीं मिला।' : 'No projects found in this category.'}
        </div>
      )}
      {rccProjects.length === 0 && (
        <div className="col-span-full text-center py-12 text-on-surface-variant">{t.noProjects}</div>
      )}
    </div>
  )}

  {/*  PAGINATION  */}
  <div className="flex justify-center mt-12 sm:mt-20">
    {hasMoreProjects && (
      <button className="bg-surface-container-highest hover:bg-secondary hover:text-white text-on-surface px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold transition-all flex items-center gap-2 text-sm">
        {t.loadMoreBtn} <span className="material-symbols-outlined">expand_more</span>
      </button>
    )}
  </div>
</div>
</section>

    </div>
  );
}
