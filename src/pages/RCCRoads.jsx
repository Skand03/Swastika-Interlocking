import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProducts } from '../services/productService';

const TRANSLATIONS = {
  hi: {
    home: 'होम',
    rccRoads: 'आरसीसी सड़कें',
    products: 'उत्पाद',
    projects: 'प्रोजेक्ट्स',
    portalLogin: 'पोर्टल लॉगिन',
    knowMore: 'और जानें',
    viewDetails: 'विवरण देखें',
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
    date: 'दिनांक'
  },
  en: {
    home: 'Home',
    rccRoads: 'RCC Roads',
    products: 'Products',
    projects: 'Projects',
    portalLogin: 'Portal Login',
    knowMore: 'Know More',
    viewDetails: 'View Details',
    getConsultation: 'Get Free Consultation',
    requestEnquiry: 'Request Enquiry',
    bookOrder: 'Book Order',
    rccConstruction: 'RCC Road Construction',
    heroSub: 'Quality roads, delivered on time. We build the strongest and most durable roads in India.',
    getQuote: '{t.getQuote}',
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
    whatsappNow: '{t.whatsappNow}',
    ourProjects: 'Our Projects',
    total: 'Total',
    completed: 'Completed',
    ongoing: 'Ongoing',
    length: 'Length',
    filterAll: 'All',
    filterVillage: 'Village Roads',
    filterTown: 'Town Roads',
    filterColony: 'Colony Roads',
    loadMore: '{t.loadMore}',
    estEnd: 'Est. End',
    date: 'Date'
  }
};

export default function RCCRoads({ language }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const navigate = useNavigate();
  const [hasMoreProjects, setHasMoreProjects] = useState(false);
  const [rccProjects, setRccProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProducts();
        let mapped = [];
        if (data) {
          mapped = data
            .filter(p => p.category === 'RCC')
            .map(p => ({
              id: p.id,
              name: language === 'hi' ? p.name_hi : p.name_en,
              desc: language === 'hi' ? p.desc_hi : p.desc_en,
              status: parseInt(p.stock) > 0 ? t.completed : t.ongoing,
              length: p.price,
              image: p.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_Ptu8XPOZvhrRRG2Ox-TI45MfVGvtbWr3cgUsHGsVJMefaOTl5_6ZOFPYrAE1MeBdkXlHE2hSQf4W_XmgdTGhheYthMJ9hULE_onZmHu8XCkOdyPnHMBYdFyJbkvLxlwowAP8uU92xT68_YyEoxnvgdlPdQim37NWjzAQ0xF5SQ47_7hQ_08uhZqLJWH5R6ryJHUtJ2XgD6dfRZgiQtZFFYfwXyTVXSjowOPfJ0m54L7Cad-YURytq7xoa14wJeYqN9lNRHq1ZSw',
            }));
        }
        
        // Fallback demo projects so the gallery isn't empty if DB only has 1 or 0 products
        const fallbacks = [
          { id: 'mock-1', name: 'NH-44 Highway Extension', desc: 'A heavy-duty RCC road built to withstand high commercial traffic.', status: t.completed, length: '12 km', image: 'https://images.unsplash.com/photo-1517482813155-273a215b2447?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
          { id: 'mock-2', name: 'Smart City Boulevard', desc: 'Urban grid road with integrated drainage and utility ducts.', status: t.ongoing, length: '4.5 km', image: 'https://images.unsplash.com/photo-1541888087895-d226a2c30656?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
          { id: 'mock-3', name: 'Industrial Park Connectivity', desc: 'Reinforced concrete road specifically designed for heavy manufacturing zones.', status: t.completed, length: '8 km', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
        ];

        if (mapped.length < 4) {
           mapped = [...mapped, ...fallbacks.slice(0, 4 - mapped.length)];
        }
        
        setRccProjects(mapped);
      } catch (err) {
        console.error("Error fetching RCC projects:", err);
      }
    };
    fetchProjects();
  }, [language, t.completed, t.ongoing]);

  return (
    <div className="">
      

    <main className="pt-20 md:pt-24 min-h-screen">
{/*  PAGE 1: RCC ROADS SERVICES  */}
<section className="relative" id="rcc-roads">
{/*  HERO SECTION  */}
<div className="relative w-full h-[600px] overflow-hidden">
<img className="absolute inset-0 w-full h-full object-cover" data-alt="A cinematic wide-angle photograph of a heavy-duty road construction site at twilight. Steam rises from fresh RCC concrete being poured into reinforced steel meshes. The scene is illuminated by industrial floodlights, casting long dramatic shadows. A corporate modern aesthetic with high-contrast tones of charcoal, cool grey, and deep forest green highlights. Professional engineering precision is the focal point." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj--bAytX_DzqRLa9WEhGxaoLdZwFwLgWi4rOiGuOwj7vJC51O6y5_E8xN5M88pQjWT9JddWvOIW-vWKAjFGaJHd4jPzlaJ0z51QP45gB-IG5E0B_m6W4oYJFlPc-0NDBN7R9jw9c3kJtjN4KPN4UuMtVhXkhE1DFLEbfne4kHUJnK6c04vIRUqCWObNjyshpI06KX_-CGTbvxuR--K8LxbCmF9nCZUzLOa5imSLsBcGCzHQgH8aUfBagPYOpPGuftsVJzjHGU10Y"/>
<div className="absolute inset-0 bg-black/60 flex items-center">
<div className="px-gutter max-w-container-max mx-auto w-full text-left">
<h1 className="font-display-lg text-display-lg text-white mb-4 leading-tight">{t.rccConstruction}</h1>
<p className="font-body-lg text-body-lg text-surface-variant max-w-xl mb-8">{t.heroSub}</p>
<div className="flex flex-wrap sm:flex-nowrap gap-3 mb-12">
<Link to="/rcc-enquiry" className="bg-primary text-white px-6 py-2 rounded-full font-bold flex items-center justify-center gap-1.5 hover:bg-opacity-90 transition-all text-sm whitespace-nowrap shadow-md">
  Get Quote <span className="material-symbols-outlined text-sm">arrow_forward</span>
</Link>
<a href="#projects" className="border border-white/80 text-white px-6 py-2 rounded-full font-bold flex items-center justify-center hover:bg-white hover:text-black transition-all text-sm whitespace-nowrap shadow-md backdrop-blur-sm">
  {t.seeOurWork}
</a>
</div>
<div className="flex flex-wrap gap-8 py-4 border-t border-white/20">
<div className="text-white"><span className="font-bold">25+</span> Roads Built</div>
<div className="text-white"><span className="font-bold">50,000+</span> sq.ft Constructed</div>
<div className="text-white"><span className="font-bold">100%</span> On-Time</div>
</div>
</div>
</div>
</div>
{/*  STATS BAR  */}
<div className="bg-primary-container py-8">
<div className="max-w-container-max mx-auto px-gutter grid grid-cols-2 md:grid-cols-4 gap-8">
<div className="text-center">
<div className="text-white font-display-lg text-3xl md:text-display-lg">25+</div>
<div className="text-on-primary-container/80 text-sm font-label-sm">{t.roadsBuilt}</div>
</div>
<div className="text-center">
<div className="text-white font-display-lg text-3xl md:text-display-lg">10+</div>
<div className="text-on-primary-container/80 text-sm font-label-sm">{t.yearsExp}</div>
</div>
<div className="text-center">
<div className="text-white font-display-lg text-3xl md:text-display-lg">5</div>
<div className="text-on-primary-container/80 text-sm font-label-sm">{t.districts}</div>
</div>
<div className="text-center">
<div className="text-white font-display-lg text-3xl md:text-display-lg">100%</div>
<div className="text-on-primary-container/80 text-sm font-label-sm">{t.satisfaction}</div>
</div>
</div>
</div>
{/*  SERVICES SECTION  */}
<section className="py-24 px-gutter max-w-container-max mx-auto">
<div className="text-center mb-16">
<h2 className="font-headline-md text-headline-md text-on-surface mb-2">{t.ourServices}</h2>
<div className="h-1 w-24 bg-secondary mx-auto"></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{/*  Service Card 1  */}
<div className="bg-white p-card-padding border-t-[3px] border-secondary shadow-sm hover:shadow-xl transition-shadow group">
<div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined">architecture</span>
</div>
<h3 className="font-headline-md text-xl mb-2">{t.surveyTitle}<br/><span className="text-secondary font-medium">{t.surveySub}</span></h3>
<p className="text-on-surface-variant mb-6">{t.surveyDesc}</p>
<Link to="/rcc-enquiry" className="text-secondary font-bold flex items-center gap-1 hover:gap-3 transition-all">{t.knowMore} <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
</div>
{/*  Service Card 2  */}
<div className="bg-white p-card-padding border-t-[3px] border-secondary shadow-sm hover:shadow-xl transition-shadow group">
<div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined">request_quote</span>
</div>
<h3 className="font-headline-md text-xl mb-2">{t.costTitle}<br/><span className="text-secondary font-medium">{t.costSub}</span></h3>
<p className="text-on-surface-variant mb-6">{t.costDesc}</p>
<Link to="/rcc-enquiry" className="text-secondary font-bold flex items-center gap-1 hover:gap-3 transition-all">{t.knowMore} <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
</div>
{/*  Service Card 3  */}
<div className="bg-white p-card-padding border-t-[3px] border-secondary shadow-sm hover:shadow-xl transition-shadow group">
<div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined">engineering</span>
</div>
<h3 className="font-headline-md text-xl mb-2">{t.constructTitle}<br/><span className="text-secondary font-medium">{t.constructSub}</span></h3>
<p className="text-on-surface-variant mb-6">{t.constructDesc}</p>
<Link to="/rcc-enquiry" className="text-secondary font-bold flex items-center gap-1 hover:gap-3 transition-all">{t.knowMore} <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
</div>
{/*  Service Card 4  */}
<div className="bg-white p-card-padding border-t-[3px] border-secondary shadow-sm hover:shadow-xl transition-shadow group">
<div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined">water_drop</span>
</div>
<h3 className="font-headline-md text-xl mb-2">{t.drainTitle}<br/><span className="text-secondary font-medium">{t.drainSub}</span></h3>
<p className="text-on-surface-variant mb-6">{t.drainDesc}</p>
<Link to="/rcc-enquiry" className="text-secondary font-bold flex items-center gap-1 hover:gap-3 transition-all">{t.knowMore} <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
</div>
{/*  Service Card 5  */}
<div className="bg-white p-card-padding border-t-[3px] border-secondary shadow-sm hover:shadow-xl transition-shadow group">
<div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined">verified</span>
</div>
<h3 className="font-headline-md text-xl mb-2">{t.finishTitle}<br/><span className="text-secondary font-medium">{t.finishSub}</span></h3>
<p className="text-on-surface-variant mb-6">{t.finishDesc}</p>
<Link to="/rcc-enquiry" className="text-secondary font-bold flex items-center gap-1 hover:gap-3 transition-all">{t.knowMore} <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
</div>
{/*  Service Card 6  */}
<div className="bg-white p-card-padding border-t-[3px] border-secondary shadow-sm hover:shadow-xl transition-shadow group">
<div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined">handshake</span>
</div>
<h3 className="font-headline-md text-xl mb-2">{t.maintTitle}<br/><span className="text-secondary font-medium">{t.maintSub}</span></h3>
<p className="text-on-surface-variant mb-6">{t.maintDesc}</p>
<Link to="/rcc-enquiry" className="text-secondary font-bold flex items-center gap-1 hover:gap-3 transition-all">{t.knowMore} <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
</div>
</div>
</section>
{/*  PROCESS TIMELINE  */}
<section className="bg-[#F6F2EC] py-24 overflow-hidden relative">
<div className="max-w-container-max mx-auto px-gutter relative z-10">
<div className="text-center mb-20">
<h2 className="font-display-lg text-4xl md:text-5xl text-[#2D3748] mb-4">{t.processTitle} <span className="text-primary font-light">/ Workflow</span></h2>
<p className="text-on-surface-variant font-medium max-w-2xl mx-auto">A systematic, engineering-first approach to delivering high-performance RCC roads.</p>
</div>

<div className="relative">
<div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-4 relative">
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

    <div className="w-20 h-20 rounded-2xl bg-white border border-primary/20 text-secondary flex items-center justify-center shadow-lg group-hover:-translate-y-2 transition-transform duration-300 z-10 mb-6 relative">
      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm border-2 border-white">{step.num}</div>
      <span className="material-symbols-outlined text-4xl">{step.icon}</span>
    </div>
    
    <h4 className="font-headline-md text-lg font-bold mb-2 text-on-surface">{step.title}</h4>
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
<div className="max-w-container-max mx-auto px-gutter py-12">
{/*  STATS ROW  */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
<div className="bg-surface-container p-4 rounded-xl text-center border border-outline-variant">
<div className="text-2xl font-bold text-on-surface">28</div>
<div className="text-xs text-on-surface-variant uppercase tracking-wider">{t.total}</div>
</div>
<div className="bg-surface-container p-4 rounded-xl text-center border border-outline-variant">
<div className="text-2xl font-bold text-secondary">25</div>
<div className="text-xs text-on-surface-variant uppercase tracking-wider">{t.completed}</div>
</div>
<div className="bg-surface-container p-4 rounded-xl text-center border border-outline-variant">
<div className="text-2xl font-bold text-primary">3</div>
<div className="text-xs text-on-surface-variant uppercase tracking-wider">{t.ongoing}</div>
</div>
<div className="bg-surface-container p-4 rounded-xl text-center border border-outline-variant">
<div className="text-2xl font-bold text-on-surface">42 km</div>
<div className="text-xs text-on-surface-variant uppercase tracking-wider">{t.length}</div>
</div>
</div>
{/*  FILTER PILLS  */}
<div className="flex flex-wrap gap-2 mb-12 justify-center">
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
    className={`px-6 py-2 rounded-full border border-outline font-label-sm transition-colors ${
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
<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
  {rccProjects.filter(p => {
    if (activeFilter === 'All') return true;
    if (activeFilter === t.completed) return p.status === t.completed;
    if (activeFilter === t.ongoing) return p.status === t.ongoing;
    if (activeFilter === 'Village') return p.name.toLowerCase().includes('village') || p.desc.toLowerCase().includes('village');
    if (activeFilter === 'Town') return p.name.toLowerCase().includes('town') || p.name.toLowerCase().includes('city') || p.desc.toLowerCase().includes('urban');
    if (activeFilter === 'Colony') return p.name.toLowerCase().includes('colony') || p.name.toLowerCase().includes('park') || p.desc.toLowerCase().includes('colony');
    return true;
  }).map((project, idx) => (
    <div key={project.id || idx} className="group">
      <div className="relative h-[400px] overflow-hidden rounded-xl mb-6 bg-surface-container-highest flex items-center justify-center">
        <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={project.name} src={project.image}/>
        <span className={`absolute top-4 right-4 text-white px-4 py-1 rounded text-sm font-bold ${project.status === t.completed ? 'bg-secondary' : 'bg-primary'}`}>{project.status}</span>
      </div>
      <div className="space-y-4">
        <div className="flex gap-2">
          {project.length && <span className="bg-surface-variant px-2 py-0.5 text-xs font-bold rounded">{project.length}</span>}
        </div>
        <h3 className="font-headline-md text-2xl group-hover:text-secondary transition-colors">{project.name}</h3>
        <p className="text-on-surface-variant line-clamp-2">{project.desc}</p>
        <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
          <Link to="/rcc-enquiry" className="text-secondary font-bold flex items-center gap-1 group-hover:gap-2 transition-all">{t.viewDetails} <span className="material-symbols-outlined">arrow_right_alt</span></Link>
        </div>
      </div>
    </div>
  ))}
  {rccProjects.length === 0 && (
    <p className="text-on-surface-variant col-span-full">No projects currently available.</p>
  )}
</div>
{/*  PAGINATION  */}
<div className="flex justify-center mt-20">
  {hasMoreProjects && (
    <button className="bg-surface-container-highest hover:bg-secondary hover:text-white text-on-surface px-8 py-3 rounded-lg font-bold transition-all flex items-center gap-2">
                            Load More Projects <span className="material-symbols-outlined">expand_more</span>
    </button>
  )}
</div>
</div>
</section>
</main>
{/*  FOOTER  */}

    </div>
  );
}
