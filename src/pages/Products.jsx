import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProductsByDivision } from '../services/productService';
import SEOHead from '../components/SEO/SEOHead';
import { getBreadcrumbSchema } from '../components/SEO/schemas';

const TRANSLATIONS = {
  hi: {
    heroTitle: 'हमारे निर्माण समाधान',
    heroDesc: 'इंटरलॉकिंग ब्लॉक्स और RCC पाइप्स से लेकर शटरिंग मैटेरियल्स और कच्चे निर्माण सामग्री तक — आपके प्रोजेक्ट की हर आवश्यकता एक भरोसेमंद भागीदार के तहत।',
    sectionCategories: 'हमारे उत्पाद श्रेणियाँ',
    category1Name: 'इंटरलॉकिंग और पेवर ब्लॉक्स',
    category1Desc: 'सड़कों, पथों और व्यावसायिक परियोजनाओं के लिए टिकाऊ फर्श समाधान।',
    category2Name: 'RCC पाइप्स और ड्रेनेज',
    category2Desc: 'पानी के प्रवाह और बुनियादी ढांचे की परियोजनाओं के लिए भारी-दर्जा पाइप समाधान।',
    category3Name: 'शटरिंग सामग्री',
    category3Desc: 'निर्माण और RCC संरचनाओं के लिए भरोसेमंद फॉर्मवर्क सिस्टम।',
    category4Name: 'रेत, एग्रीगेट और कच्चा माल',
    category4Desc: 'परियोजना के हर चरण के लिए गुणवत्तापूर्ण निर्माण सामग्री।',
    exploreCategory: 'श्रेणी एक्सप्लोर करें →',
    sectionTrust: 'निर्माता हमें क्यों चुनते हैं',
    trust1Title: 'गुणवत्ता परीक्षणित',
    trust1Desc: 'डिलीवरी से पहले हर उत्पाद की जाँच की जाती है।',
    trust2Title: 'सीधा आपूर्तिकर्ता',
    trust2Desc: 'कोई अनावश्यक बिचौलिया नहीं।',
    trust3Title: 'तेजी से डिलीवरी',
    trust3Desc: 'गोरखपुर क्षेत्र में तेजी से प्रसारण।',
    trust4Title: 'प्रतिस्पर्धी कीमतें',
    trust4Desc: 'ठेकेदारों और गृह मालिकों के लिए सर्वोत्तम मूल्य।',
    sectionProducts: 'प्रीमियम निर्माण सामग्री',
    bestSeller: 'सबसे ज़्यादा बिकने वाला',
    popular: 'लोकप्रिय',
    contractorChoice: 'ठेकेदार की पसंद',
    priceRange: 'कीमत की सीमा',
    getQuote: 'कोटेशन पाएँ',
    orderNow: 'अभी ऑर्डर करें',
    sectionApplications: 'हमारी सामग्री कहाँ उपयोग होती है',
    app1Title: 'सड़क निर्माण',
    app2Title: 'आवासीय परियोजनाएँ',
    app3Title: 'वाणिज्यिक भवन',
    app4Title: 'ड्रेनेज सिस्टम',
    sectionLocalTrust: 'स्थानीय विश्वास और विश्वसनीयता',
    trustBadge1: 'कौरीराम, गोरखपुर',
    trustBadge2: 'डिलीवरी उपलब्ध',
    trustBadge3: 'निर्माण सामग्री आपूर्तिकर्ता',
    trustBadge4: 'सीधा मालिक समर्थन',
    trustBadge5: 'इंटरलॉकिंग समाधान',
    trustBadge6: 'RCC सड़क सामग्री',
    sectionOwners: 'हजारों भरोसा करते हैं',
    ownersTitle: 'दिलीप चौबे और आलोक चौबे',
    ownersDesc: 'हमारी प्रतिष्ठा गुणवत्तापूर्ण सामग्री और ग्राहक के विश्वास पर निर्मित है।',
    ownersTag: 'आपके स्थानीय निर्माण भागीदार',
    sectionCTA: 'अपनी निर्माण परियोजना शुरू करने के लिए तैयार हैं?',
    ctaDesc: 'विशेषज्ञ मार्गदर्शन, गुणवत्तापूर्ण सामग्री और भरोसेमंद डिलीवरी पाएँ।',
    ctaQuote: 'कोटेशन पाएँ',
    ctaCall: 'अभी कॉल करें',
    ctaWhatsapp: 'हमसे WhatsApp करें',
    loading: 'उत्पाद लोड हो रहे हैं...',
    noProducts: 'फिलहाल कोई उत्पाद उपलब्ध नहीं है।',
  },
  en: {
    heroTitle: 'Our Construction Solutions',
    heroDesc: 'From Interlocking Blocks and RCC Pipes to Shuttering Materials and Raw Construction Supplies — everything your project needs under one trusted partner.',
    sectionCategories: 'Our Product Categories',
    category1Name: 'Interlocking & Paver Blocks',
    category1Desc: 'Durable paving solutions for roads, pathways and commercial projects.',
    category2Name: 'RCC Pipes & Drainage',
    category2Desc: 'Heavy-duty pipe solutions for water flow and infrastructure projects.',
    category3Name: 'Shuttering Materials',
    category3Desc: 'Reliable formwork systems for construction and RCC structures.',
    category4Name: 'Sand, Aggregate & Raw Materials',
    category4Desc: 'Quality construction materials for every project stage.',
    exploreCategory: 'Explore Category →',
    sectionTrust: 'Why Builders Choose Us',
    trust1Title: 'Quality Tested',
    trust1Desc: 'Every product checked before delivery.',
    trust2Title: 'Direct Supplier',
    trust2Desc: 'No unnecessary middlemen.',
    trust3Title: 'Fast Delivery',
    trust3Desc: 'Quick dispatch across Gorakhpur region.',
    trust4Title: 'Competitive Pricing',
    trust4Desc: 'Best value for contractors and homeowners.',
    sectionProducts: 'Premium Construction Materials',
    bestSeller: 'Best Seller',
    popular: 'Popular',
    contractorChoice: 'Contractor Choice',
    priceRange: 'Price Range',
    getQuote: 'Get Quote',
    orderNow: 'Order Now',
    sectionApplications: 'Where Our Materials Are Used',
    app1Title: 'Road Construction',
    app2Title: 'Residential Projects',
    app3Title: 'Commercial Buildings',
    app4Title: 'Drainage Systems',
    sectionLocalTrust: 'Local Trust & Credibility',
    trustBadge1: 'Kauriram, Gorakhpur',
    trustBadge2: 'Delivery Available',
    trustBadge3: 'Construction Material Supplier',
    trustBadge4: 'Direct Owner Support',
    trustBadge5: 'Interlocking Solutions',
    trustBadge6: 'RCC Road Materials',
    sectionOwners: 'Trusted by Thousands',
    ownersTitle: 'Dilip Chaubey & Alok Chaubey',
    ownersDesc: 'Our reputation is built on quality materials and customer trust.',
    ownersTag: 'Your Local Construction Partners',
    sectionCTA: 'Ready to Start Your Construction Project?',
    ctaDesc: 'Get expert guidance, quality materials, and reliable delivery.',
    ctaQuote: 'Get Quote',
    ctaCall: 'Call Now',
    ctaWhatsapp: 'WhatsApp Us',
    loading: 'Loading products...',
    noProducts: 'No products available right now.',
  },
};

const SOCIAL_PROOFS = [
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

export default function Products({ language }) {
  const navigate = useNavigate();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductsByDivision('building_materials');
        const mapped = (data || []).map((p, i) => ({
          id: p.id,
          name: language === 'hi' ? (p.name_hi || p.name_en) : p.name_en,
          desc: language === 'hi' ? (p.description_hi || p.description_en) : p.description_en,
          price: p.price_min && p.price_max
            ? p.price_min === p.price_max
              ? `₹${p.price_min} / ${p.price_unit || 'piece'}`
              : `₹${p.price_min} – ₹${p.price_max} / ${p.price_unit || 'piece'}`
            : p.price_min ? `₹${p.price_min}` : '—',
          image: p.images && p.images.length > 0 ? p.images[0] : null,
          badge: i % 3 === 0 ? t.bestSeller : i % 3 === 1 ? t.popular : t.contractorChoice,
        }));
        setProductList(mapped);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [language]);

  const handleBookNow = (productName) => {
    navigate('/order', { state: { selectedProduct: productName } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="pt-16 pb-12 md:pb-24 bg-[#FAF0E6] min-h-screen">
      <SEOHead
        title="Construction Materials - Swastika Interlocking Kauriram, Gorakhpur"
        description="Premium building materials supplier in Kauriram, Gorakhpur. Interlocking paver blocks, RCC pipes, shuttering materials, cement, sand and more."
        keywords="construction materials Kauriram, building materials Gorakhpur, interlocking paver blocks, RCC pipes Uttar Pradesh, shuttering materials"
        url="/products"
        breadcrumb={getBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Products', path: '/products' }])}
        language={language}
      />

      {/* Hero Header */}
      <header className="relative h-[360px] sm:h-[420px] md:h-[480px] w-full flex items-center overflow-hidden">
        <img alt="Building Materials" className="absolute inset-0 w-full h-full object-cover opacity-70" src="/building-materials-hero.png" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E55]/80 to-transparent"></div>
        <div className="relative max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16 sm:pt-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight">{language === 'hi' ? 'निर्माण सामग्री' : 'Building Materials'}</h1>
          <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-full sm:max-w-2xl mb-6 leading-relaxed">{language === 'hi' ? 'स्वास्तिक इंटरलॉकिंग से उच्च गुणवत्ता की निर्माण सामग्री - इंटरलॉकिंग ब्लॉक्स, RCC पाइप्स, सीमेंट, रेत और बहुत कुछ।' : 'High-quality construction materials from Swastika Interlocking - interlocking blocks, RCC pipes, cement, sand and more.'}</p>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Link to="/order" className="bg-[#E8650A] text-white px-6 sm:px-8 py-3 sm:py-4 font-bold rounded-lg flex items-center gap-2 hover:brightness-110 transition-all active:scale-95 shadow-lg">
              {language === 'hi' ? 'अभी ऑर्डर करें' : 'Order Now'}
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </header>

      {/* SECTION 6: Social Proof Bar (Marquee) */}
      <section className="bg-[#1a1a3e] py-3 sm:py-4 overflow-hidden">
        <div className="flex items-center gap-6 sm:gap-8 animate-marquee whitespace-nowrap">
          {[...SOCIAL_PROOFS, ...SOCIAL_PROOFS].map((text, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3 text-white text-xs sm:text-sm font-semibold">
              <span className="text-[#25D366]">✔</span>
              {text}
            </div>
          ))}
        </div>
      </section>
