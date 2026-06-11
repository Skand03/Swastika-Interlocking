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

      {/* Category Quick Links */}
      <section className="bg-white border-b border-outline/10 sticky top-16 z-30 shadow-sm overflow-x-auto no-scrollbar">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4 whitespace-nowrap">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2">{t.sectionCategories}:</span>
          {[
            { name: t.category1Name, link: '/shuttering' },
            { name: t.category2Name, link: '/rcc-roads' },
            { name: t.category3Name, link: '/shuttering' },
            { name: t.category4Name, link: '/products' },
          ].map((cat, idx) => (
            <Link 
              key={idx} 
              to={cat.link}
              className="px-4 py-2 bg-[#FAF0E6] text-[#0E0E55] text-sm font-bold rounded-full border border-outline/20 hover:bg-[#E8650A] hover:text-white transition-all"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0E0E55] mb-4">{t.sectionProducts}</h2>
          <div className="w-20 h-1.5 bg-[#E8650A] mx-auto rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-[#E8650A]/20 border-t-[#E8650A] rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold">{t.loading}</p>
          </div>
        ) : productList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-outline/10">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">inventory_2</span>
            <p className="text-gray-500 font-bold">{t.noProducts}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {productList.map((product) => (
              <article key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-outline/10 group flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={product.image || '/building-materials-hero.png'} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#E8650A] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                      {product.badge}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-black text-[#0E0E55] mb-3">{product.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">{product.desc}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-outline/10">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{t.priceRange}</p>
                      <p className="text-lg font-black text-[#E8650A]">{product.price}</p>
                    </div>
                    <button 
                      onClick={() => handleBookNow(product.name)}
                      className="bg-[#0E0E55] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#E8650A] transition-colors active:scale-95 shadow-md"
                    >
                      {t.orderNow}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-[#0E0E55] py-20">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">{t.sectionTrust}</h2>
            <div className="w-20 h-1.5 bg-[#E8650A] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'verified', title: t.trust1Title, desc: t.trust1Desc },
              { icon: 'factory', title: t.trust2Title, desc: t.trust2Desc },
              { icon: 'local_shipping', title: t.trust3Title, desc: t.trust3Desc },
              { icon: 'payments', title: t.trust4Title, desc: t.trust4Desc },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center hover:bg-white/10 transition-all group">
                <div className="w-16 h-16 bg-[#E8650A]/20 text-[#E8650A] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                </div>
                <h4 className="text-white font-black text-lg mb-3">{item.title}</h4>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-20">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0E0E55] text-center mb-12">{t.sectionApplications}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { title: t.app1Title, img: '/swastika-interlocking-pertol-bricks-3x.jpg' },
              { title: t.app2Title, img: '/Business-division-Bulding-Material.png' },
              { title: t.app3Title, img: '/Business-division-shuttering.png' },
              { title: t.app4Title, img: '/drainage-image.png' },
            ].map((app, idx) => (
              <div key={idx} className="group relative h-48 sm:h-64 rounded-3xl overflow-hidden shadow-lg">
                <img src={app.img} alt={app.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white font-bold text-lg">{app.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Trust Badges */}
      <section className="py-12 bg-white border-y border-outline/10">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-4 sm:gap-8">
          {[
            { icon: 'location_on', text: t.trustBadge1 },
            { icon: 'local_shipping', text: t.trustBadge2 },
            { icon: 'engineering', text: t.trustBadge3 },
            { icon: 'support_agent', text: t.trustBadge4 },
          ].map((badge, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-[#FAF0E6] px-6 py-3 rounded-full border border-[#E8650A]/20">
              <span className="material-symbols-outlined text-[#E8650A]">{badge.icon}</span>
              <span className="font-black text-[#0E0E55] text-sm sm:text-base">{badge.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Owners Section */}
      <section className="py-20 bg-[#FAF0E6]">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-xl border border-outline/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8650A]/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-[32px] overflow-hidden shadow-2xl flex-shrink-0 border-4 border-[#E8650A]/20 relative z-10">
              <img src="/swastika-interlocking-owner.png" alt="Owner" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 text-center md:text-left">
              <span className="bg-[#E8650A]/10 text-[#E8650A] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block">
                {t.ownersTag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0E0E55] mb-4">{t.ownersTitle}</h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-2xl">{t.ownersDesc}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <a href="tel:8400936290" className="flex items-center gap-2 bg-[#0E0E55] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#E8650A] transition-colors shadow-lg">
                  <span className="material-symbols-outlined text-sm">call</span>
                  8400936290
                </a>
                <a href="https://wa.me/918400936290" className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold hover:brightness-110 transition-all shadow-lg">
                  <span className="material-symbols-outlined text-sm">chat</span>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#E8650A]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">{t.sectionCTA}</h2>
          <p className="text-white/90 text-lg sm:text-xl mb-12 max-w-3xl mx-auto">{t.ctaDesc}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/order" className="bg-white text-[#E8650A] px-10 py-4 rounded-2xl font-black text-lg hover:bg-[#0E0E55] hover:text-white transition-all shadow-2xl active:scale-95">
              {t.ctaQuote}
            </Link>
            <a href="tel:8400936290" className="bg-[#0E0E55] text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-white hover:text-[#0E0E55] transition-all shadow-2xl active:scale-95 flex items-center gap-3">
              <span className="material-symbols-outlined">call</span>
              {t.ctaCall}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

