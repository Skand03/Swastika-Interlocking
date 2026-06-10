import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createInquiry } from '../services/inquiryService';
import SEOHead from '../components/SEO/SEOHead';
import { faqSchema, getBreadcrumbSchema } from '../components/SEO/schemas';
import { useAuth } from '../auth/AuthContext';
import AuthGate from '../components/AuthGate';

const TRANSLATIONS = {
  hi: {
    ourBusiness: 'हमारे व्यवसाय',
    buildingMaterials: 'निर्माण सामग्री',
    paverBlocks: 'पेवर ब्लॉक',
    sand: 'रेत',
    gravel: 'बजरी',
    cement: 'सीमेंट',
    pipes: 'पाइप्स',
    shutteringMaterials: 'शटरिंग सामग्री',
    steelPlates: 'स्टील प्लेट्स',
    props: 'प्रॉप्स',
    hFrames: 'एच-फ्रेम्स',
    clamps: 'क्लैंप्स',
    viewShuttering: 'शटरिंग देखें',
    rccRoadConstruction: 'आरसीसी सड़क निर्माण',
    survey: 'सर्वेक्षण',
    estimation: 'अनुमान',
    construction: 'निर्माण',
    handover: 'हैंडओवर',
    viewProjects: 'प्रोजेक्ट्स देखें',
    heroTitle: 'स्वस्तिका इंटरलॉकिंग',
    heroSub: 'निर्माण में विश्वास',
    orderNow: 'अभी ऑर्डर करें',
    viewProducts: 'उत्पाद देखें',
    whyChoose: 'हमें क्यों चुनें',
    excellenceFeatures: 'उत्कृष्टता की विशेषताएं',
    mfgTitle: 'विनिर्माण (Manufacturing)',
    mfgDesc: 'निरंतर गुणवत्ता और प्रत्येक ब्लॉक में सटीकता सुनिश्चित करने वाली आधुनिक उत्पादन सुविधाएं।',
    deliveryTitle: 'तेज़ डिलीवरी (Fast Delivery)',
    deliveryDesc: 'पूरे क्षेत्र में साइटों पर समय पर डिलीवरी प्रदान करने वाला समर्पित रसद नेटवर्क।',
    materialsTitle: 'गुणवत्ता सामग्री (Quality Materials)',
    materialsDesc: 'अधिकतम स्थायित्व और मजबूती के लिए प्रीमियम ग्रेड सीमेंट और समुच्चय का उपयोग।',
    customTitle: 'अनुकूलित ऑर्डर (Custom Orders)',
    customDesc: 'आपकी अनूठी वास्तुकला आवश्यकताओं को पूरा करने के लिए कस्टम डिजाइन, रंग और पैटर्न।',
    prodCat: 'उत्पाद श्रेणियां',
    prodCatDesc: 'भारी-शुल्क यातायात और सुरुचिपूर्ण भूदृश्य के लिए डिज़ाइन किए गए इंटरलॉकिंग समाधानों की विविध श्रृंखला देखें।',
    viewCatalog: 'पूर्ण सूची देखें',
    heavyDuty: 'भारी शुल्क (Heavy Duty)',
    indPaver: 'औद्योगिक पेवर्स',
    indPaverDesc: 'गोदामों, ईंधन स्टेशनों और सार्वजनिक प्लाजा जैसे उच्च-यातायात वातावरण के लिए निर्मित।',
    landscape: 'भूदृश्य (Landscape)',
    resPaver: 'आवासीय गार्डन ब्लॉक',
    resPaverDesc: 'सुरुचिपूर्ण डिज़ाइन जो रास्ते, आंगन और बगीचों को सुंदर स्थानों में बदल देते हैं।',
    infrastructure: 'बुनियादी ढांचा (Infrastructure)',
    curbTitle: 'कर्बिंग और एड्जिंग',
    curbDesc: 'सड़क परियोजनाओं और बड़े पैमाने पर शहरी विकास के लिए सटीक-इंजीनियर कर्ब पत्थर।',
    getQuote: 'कोटेशन प्राप्त करें',
    testimonials: 'हमारे साझेदार क्या कहते हैं',
    quoteText: '"स्वस्तिका इंटरलॉकिंग ने हमारे 10,000 वर्ग फुट के औद्योगिक पार्क के लिए पेवर प्रदान किए। स्थायित्व और फिनिश बेजोड़ हैं। तंग समय सीमा के बाद भी उनकी डिलीवरी सही समय पर थी।"',
    director: 'राजेश कुमार',
    designation: 'प्रबंध निदेशक, बिल्डटेक इंफ्रास्ट्रक्चर',
    customQuote: 'कस्टम कोट प्राप्त करें',
    quoteFormDesc: 'हमें अपने प्रोजेक्ट का विवरण भेजें और हम एक प्रतिस्पर्धी अनुमान के साथ आपसे संपर्क करेंगे।',
    nameLabel: 'नाम',
    phoneLabel: 'फोन नंबर',
    reqLabel: 'आवश्यकता का विवरण',
    reqPlaceholder: 'ब्लॉक प्रकार, क्षेत्र वर्ग फुट में या मात्रा की आवश्यकता के बारे में बताएं...',
    submitBtn: 'अनुरोध भेजें',
    submitting: 'भेजा जा रहा है...',
    valErr: 'कृपया नाम और फोन नंबर दर्ज करें।',
    successMsg: 'आपका अनुरोध सफलतापूर्वक प्राप्त हो गया है! हम जल्द ही आपसे संपर्क करेंगे।',
    connErr: 'सर्वर से कनेक्ट करने में त्रुटि हुई। कृपया पुनः प्रयास करें।'
  },
  en: {
    ourBusiness: 'Our Business Divisions',
    buildingMaterials: 'Building Materials',
    paverBlocks: 'Paver Blocks',
    sand: 'Sand',
    gravel: 'Gravel',
    cement: 'Cement',
    pipes: 'Pipes',
    shutteringMaterials: 'Shuttering Materials',
    steelPlates: 'Steel Plates',
    props: 'Props',
    hFrames: 'H-Frames',
    clamps: 'Clamps',
    viewShuttering: 'View Shuttering',
    rccRoadConstruction: 'RCC Road Construction',
    survey: 'Survey',
    estimation: 'Estimation',
    construction: 'Construction',
    handover: 'Handover',
    viewProjects: 'View Projects',
    heroTitle: 'Swastika Interlocking',
    heroSub: 'Trusted in Construction',
    orderNow: 'Order Now',
    viewProducts: 'View Products',
    whyChoose: 'Why Choose Us',
    excellenceFeatures: 'Excellence Features',
    mfgTitle: 'Manufacturing',
    mfgDesc: 'Modern production facilities ensuring consistent quality and precision in every block.',
    deliveryTitle: 'Fast Delivery',
    deliveryDesc: 'Dedicated logistics network providing timely delivery to sites across the region.',
    materialsTitle: 'Quality Materials',
    materialsDesc: 'Using premium grade cement and aggregates for maximum durability and strength.',
    customTitle: 'Custom Orders',
    customDesc: 'Tailored designs, colors, and patterns to meet your unique architectural requirements.',
    prodCat: 'Building Materials & Infrastructure Solutions',
    prodCatDesc: 'Explore our complete range of building materials.',
    viewCatalog: '250+ Products Available →',
    heavyDuty: 'Heavy Duty',
    indPaver: 'Interlocking Street Pavers',
    indPaverDesc: 'Built for high-traffic environments like warehouses, fuel stations, and public plazas.',
    landscape: 'Construction',
    resPaver: 'Different Size Pipes',
    resPaverDesc: 'High-quality concrete pipes for drainage and infrastructure projects.',
    infrastructure: 'Infrastructure',
    curbTitle: 'Petrol Pump Bricks',
    curbDesc: 'Durable interlocking bricks specifically designed for petrol stations and heavy load areas.',
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
    reqPlaceholder: 'Tell us about block types, area in sq. ft. or quantity needed...',
    submitBtn: 'Submit Request',
    submitting: 'Submitting...',
    valErr: 'Please enter your name and phone number.',
    successMsg: 'Your request has been successfully received! We will contact you soon.',
    connErr: 'Error connecting to the server. Please try again.'
  }
};

export default function Home({ language }) {
  const navigate = useNavigate();
  const { user: authUser, profile } = useAuth();
  const t = TRANSLATIONS[language];

  const heroImages = [
    '/images/scroll.jpg',
    '/images/scroll-2-.jpg',
    '/images/scroll-cement-.jpg',
    '/images/scroll-all-.jpg'
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
        title="Swastika Interlocking | Paver Blocks & RCC Roads - Deesa, Gujarat"
        description="Swastika Interlocking - Leading manufacturer of interlocking paver blocks in Deesa, Gujarat. Quality RCC road construction, shuttering materials rental. Call now for best prices."
        keywords="पेवर ब्लॉक देसा, interlocking blocks Gujarat, RCC roads Banaskantha, shuttering materials Deesa, cement blocks manufacturer Gujarat"
        url="/"
        schema={[faqSchema]}
        breadcrumb={getBreadcrumbSchema([{ name: 'Home', path: '/' }])}
        language={language}
      />
{/*  Hero Section  */}
<section className="relative w-full mt-4 group">
<div className="relative w-full overflow-hidden bg-surface flex items-center justify-center">
  {/* Invisible spacer to set height based on natural aspect ratio */}
  <img src={heroImages[0]} alt="spacer" className="w-full h-auto invisible pointer-events-none" />
  
  {heroImages.map((img, index) => (
    <img 
      key={index} 
      src={img}
      alt={`Slide ${index + 1}`}
      className={`absolute top-0 left-0 w-full h-auto transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
    />
  ))}
  
  {/* Navigation Arrows */}
  <button 
    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)} 
    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white text-black w-8 h-12 md:w-10 md:h-16 flex items-center justify-center shadow-md z-20 hover:bg-gray-100 transition-colors opacity-90 hover:opacity-100"
  >
    <span className="material-symbols-outlined">chevron_left</span>
  </button>
  <button 
    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)} 
    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white text-black w-8 h-12 md:w-10 md:h-16 flex items-center justify-center shadow-md z-20 hover:bg-gray-100 transition-colors opacity-90 hover:opacity-100"
  >
    <span className="material-symbols-outlined">chevron_right</span>
  </button>
</div>
</section>
<section className="py-16 md:py-24 px-gutter max-w-container-max mx-auto">
<div className="text-center mb-16">
<h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface">{t.ourBusiness}</h2>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
  {/* Building Materials */}
  <div className="group relative overflow-hidden rounded-2xl bg-surface h-[450px] sm:h-[500px] shadow-xl border-l-4 border-[#E8650A]">
    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{backgroundImage:"url('/Business-division-Bulding-Material.png')"}}></div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20"></div>
    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
      <span className="material-symbols-outlined text-4xl text-[#E8650A] mb-4">bricks</span>
      <h3 className="text-white font-headline-md text-headline-md mb-2">{t.buildingMaterials}</h3>
      <p className="text-white/70 text-sm mb-6 line-clamp-2">Premium interlocking paver blocks, sand, gravel, cement, and drainage pipes for all construction needs.</p>
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">{t.paverBlocks}</span>
        <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">{t.sand}</span>
        <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">{t.gravel}</span>
      </div>
      <Link to="/products" className="w-full sm:w-auto px-6 py-2.5 bg-transparent border border-white/80 text-white text-sm sm:text-base font-bold rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm backdrop-blur-sm">
        {t.viewProducts} <span className="material-symbols-outlined text-sm sm:text-base">arrow_forward</span>
      </Link>
    </div>
  </div>

  {/* Shuttering */}
  <div className="group relative overflow-hidden rounded-2xl bg-surface h-[450px] sm:h-[500px] shadow-xl border-l-4 border-[#1565C0]">
    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{backgroundImage:"url('/Business-division-shuttering.png')"}}></div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20"></div>
    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
      <span className="material-symbols-outlined text-4xl text-[#1565C0] mb-4">architecture</span>
      <h3 className="text-white font-headline-md text-headline-md mb-2">{t.shutteringMaterials}</h3>
      <p className="text-white/70 text-sm mb-6 line-clamp-2">Heavy-duty steel plates, props, H-frames, and clamps available for rent and sale.</p>
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">{t.steelPlates}</span>
        <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">{t.props}</span>
        <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">{t.hFrames}</span>
      </div>
      <Link to="/shuttering" className="w-full sm:w-auto px-6 py-2.5 bg-transparent border border-white/80 text-white text-sm sm:text-base font-bold rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm backdrop-blur-sm">
        {t.viewShuttering} <span className="material-symbols-outlined text-sm sm:text-base">arrow_forward</span>
      </Link>
    </div>
  </div>

  {/* RCC Roads */}
  <div className="group relative overflow-hidden rounded-2xl bg-surface h-[450px] sm:h-[500px] shadow-xl border-l-4 border-[#2E7D32]">
    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{backgroundImage:"url('/Business-division-rcc.png')"}}></div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20"></div>
    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
      <span className="material-symbols-outlined text-4xl text-[#2E7D32] mb-4">engineering</span>
      <h3 className="text-white font-headline-md text-headline-md mb-2">{t.rccRoadConstruction}</h3>
      <p className="text-white/70 text-sm mb-6 line-clamp-2">Complete RCC road construction contracts, from initial survey to finish delivery.</p>
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">{t.survey}</span>
        <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">{t.construction}</span>
        <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">{t.handover}</span>
      </div>
      <Link to="/rcc-roads" className="w-full sm:w-auto px-6 py-2.5 bg-transparent border border-white/80 text-white text-sm sm:text-base font-bold rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm backdrop-blur-sm">
        {t.viewProjects} <span className="material-symbols-outlined text-sm sm:text-base">arrow_forward</span>
      </Link>
    </div>
  </div>
</div>
</section>
{/*  Features Bento Grid  */}
<section className="py-16 md:py-24 px-gutter max-w-container-max mx-auto">
<div className="text-center mb-16">
<span className="inline-block px-4 py-1 bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm rounded-full mb-4">{t.whyChoose}</span>
<h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface">{t.excellenceFeatures}</h2>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
{/*  Manufacturing  */}
<div className="bg-surface-container border border-outline-variant p-card-padding rounded-xl hover:shadow-lg transition-all group">
<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
<span className="material-symbols-outlined text-3xl">precision_manufacturing</span>
</div>
<h3 className="font-headline-md text-headline-md mb-3">{t.mfgTitle}</h3>
<p className="text-on-surface-variant">{t.mfgDesc}</p>
</div>
{/*  Fast Delivery  */}
<div className="bg-surface-container border border-outline-variant p-card-padding rounded-xl hover:shadow-lg transition-all group">
<div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6 text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-all">
<span className="material-symbols-outlined text-3xl">local_shipping</span>
</div>
<h3 className="font-headline-md text-headline-md mb-3">{t.deliveryTitle}</h3>
<p className="text-on-surface-variant">{t.deliveryDesc}</p>
</div>
{/*  Quality Materials  */}
<div className="bg-surface-container border border-outline-variant p-card-padding rounded-xl hover:shadow-lg transition-all group">
<div className="w-12 h-12 bg-tertiary/10 rounded-lg flex items-center justify-center mb-6 text-tertiary group-hover:bg-tertiary group-hover:text-on-tertiary transition-all">
<span className="material-symbols-outlined text-3xl">verified</span>
</div>
<h3 className="font-headline-md text-headline-md mb-3">{t.materialsTitle}</h3>
<p className="text-on-surface-variant">{t.materialsDesc}</p>
</div>
{/*  Custom Orders  */}
<div className="bg-surface-container border border-outline-variant p-card-padding rounded-xl hover:shadow-lg transition-all group">
<div className="w-12 h-12 bg-primary-fixed-dim/20 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:bg-primary-fixed-dim group-hover:text-on-surface transition-all">
<span className="material-symbols-outlined text-3xl">dashboard_customize</span>
</div>
<h3 className="font-headline-md text-headline-md mb-3">{t.customTitle}</h3>
<p className="text-on-surface-variant">{t.customDesc}</p>
</div>
</div>
</section>
{/*  Categories Preview  */}
<section className="bg-surface-container-high py-16 md:py-24 px-gutter overflow-hidden">
<div className="max-w-container-max mx-auto">
<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6">
<div className="max-w-xl">
<span className="inline-block px-4 py-1 bg-[#E8650A]/10 text-[#E8650A] font-label-sm text-label-sm font-bold rounded-full mb-4">Product Categories</span>
<h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface mb-4">{t.prodCat}</h2>
<p className="text-on-surface-variant font-body-lg text-body-lg mb-6">{t.prodCatDesc}</p>
<div className="flex flex-wrap gap-2">
  {['Interlocking', 'Cement', 'Sand', 'Pipes', 'Shuttering', 'RCC Projects'].map(tag => (
    <span key={tag} className="px-3 py-1.5 bg-surface border border-outline/20 rounded-full text-xs font-semibold text-on-surface hover:border-[#E8650A] hover:text-[#E8650A] transition-colors cursor-pointer shadow-sm">
      {tag}
    </span>
  ))}
</div>
</div>
<Link to="/products" className="bg-primary text-on-primary px-6 py-3 font-bold rounded-lg hover:bg-primary-container hover:-translate-y-1 active:scale-95 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md inline-block">{t.viewCatalog}</Link>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {/*  Heavy Duty  */}
        <div className="group relative overflow-hidden rounded-xl bg-surface h-[350px] md:h-[450px]">
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{backgroundImage:"url('/interlocking-street-image-3x.jpg')"}}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 p-6 md:p-8 w-full">
            <span className="inline-block px-3 py-1 bg-secondary text-on-secondary font-label-sm text-label-sm rounded-full mb-4">{t.heavyDuty}</span>
            <h3 className="text-white font-headline-md text-headline-md mb-4">{t.indPaver}</h3>
            <p className="text-surface-variant mb-6 line-clamp-2">{t.indPaverDesc}</p>
            <Link to="/products" className="text-primary-fixed font-bold flex items-center gap-2 hover:text-white hover:translate-x-2 transition-all duration-300 active:scale-95">{t.viewProducts || 'View Products'} <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">chevron_right</span></Link>
          </div>
        </div>
        {/*  Landscape  */}
        <div className="group relative overflow-hidden rounded-xl bg-surface h-[350px] md:h-[450px]">
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{backgroundImage:"url('/pipe-with-different-size.jpg')"}}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 p-6 md:p-8 w-full">
            <span className="inline-block px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm rounded-full mb-4">{t.landscape}</span>
            <h3 className="text-white font-headline-md text-headline-md mb-4">{t.resPaver}</h3>
            <p className="text-surface-variant mb-6 line-clamp-2">{t.resPaverDesc}</p>
            <Link to="/products" className="text-primary-fixed font-bold flex items-center gap-2 hover:text-white hover:translate-x-2 transition-all duration-300 active:scale-95">{t.viewProducts || 'View Products'} <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">chevron_right</span></Link>
          </div>
        </div>
        {/*  Curbing  */}
        <div className="group relative overflow-hidden rounded-xl bg-surface h-[350px] md:h-[450px]">
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{backgroundImage:"url('/swastika-interlocking-pertol-bricks-3x.jpg')"}}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 p-6 md:p-8 w-full">
            <span className="inline-block px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm rounded-full mb-4">{t.infrastructure}</span>
            <h3 className="text-white font-headline-md text-headline-md mb-4">{t.curbTitle}</h3>
            <p className="text-surface-variant mb-6 line-clamp-2">{t.curbDesc}</p>
            <Link to="/products" className="text-primary-fixed font-bold flex items-center gap-2 hover:text-white hover:translate-x-2 transition-all duration-300 active:scale-95">{t.viewProducts || 'View Products'} <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">chevron_right</span></Link>
          </div>
        </div>
</div>
</div>
</section>
{/*  Testimonials & Contact Strip  */}
<AuthGate language={language}>
<section className="py-16 md:py-24 px-gutter max-w-container-max mx-auto">
<div className="max-w-3xl mx-auto">
<div className="bg-inverse-surface text-inverse-on-surface p-6 sm:p-10 rounded-2xl shadow-2xl">
<h3 className="font-headline-md text-headline-md mb-2 text-center">{t.customQuote}</h3>
<p className="text-surface-variant mb-8 text-center">{t.quoteFormDesc}</p>
<form className="space-y-6" onSubmit={handleSubmit}>
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
