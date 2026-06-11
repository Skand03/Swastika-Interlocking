import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProductsByDivision } from '../services/productService';
import SEOHead from '../components/SEO/SEOHead';
import { getBreadcrumbSchema } from '../components/SEO/schemas';

const TRANSLATIONS = {
  hi: {
    heroTitle: 'మా నిర్మాణ పరిష్కారాలు',
    heroDesc: 'ఇంటర్‌లాకింగ్ బ్లాక్స్ మరియు RCC పైప్స్ నుండి షట్టరింగ్ పదార్థాలు మరియు ముడి నిర్మాణ సరఫరాలు వరకు — మీ ప్రాజెక్ట్ అవసరాలన్నీ ఒక విశ్వసనీయ భాగస్వామి క్రింద.',
    sectionCategories: 'మా ఉత్పత్తి రకాలు',
    category1Name: 'ఇంటర్‌లాకింగ్ & పేవర్ బ్లాక్స్',
    category1Desc: 'రోడ్లు, మార్గాలు మరియు వాణిజ్య ప్రాజెక్టుల కోసం టెక్కువైన పేవింగ్ పరిష్కారాలు.',
    category2Name: 'RCC పైప్స్ & డ్రెయినేజీ',
    category2Desc: 'నీటి ప్రవాహం మరియు మౌలిక సదుపాయాల ప్రాజెక్టుల కోసం భారీ-ద్వారా పైప్ పరిష్కారాలు.',
    category3Name: 'షట్టరింగ్ పదార్థాలు',
    category3Desc: 'నిర్మాణం మరియు RCC నిర్మాణాల కోసం నమ్మదగిన ఫార్మ్‌వర్క్ వ్యవస్థలు.',
    category4Name: 'రేతు, అగ్రిగేట్ & ముడి పదార్థాలు',
    category4Desc: 'ప్రతి ప్రాజెక్ట్ దశకు గుణమైన నిర్మాణ పదార్థాలు.',
    exploreCategory: 'వర్గాన్ని అన్వేషించండి →',
    sectionTrust: 'నిర్మాతలు ఎందుకు మాకు ఎంచుకుంటారు',
    trust1Title: 'గుణం పరీక్షించబడింది',
    trust1Desc: 'ప్రతి ఉత్పత్తి డెలివరీ ముందు తనిఖీ చేయబడుతుంది.',
    trust2Title: 'ప్రత్యక్ష సరఫరాదారు',
    trust2Desc: 'అవసరం లేని మిడిల్‌మ్యాన్‌లు లేరు.',
    trust3Title: 'వేగవంతమైన డెలివరీ',
    trust3Desc: 'గోరఖ్పుర్ ప్రాంతం అంతటా త్వరగా పంపడం.',
    trust4Title: 'పోటీతో కూడిన ధరలు',
    trust4Desc: 'కాంట్రాక్టర్లు మరియు గృహ యజమానులకు ఉత్తమ విలువ.',
    sectionProducts: 'ప్రీమియం నిర్మాణ పదార్థాలు',
    bestSeller: 'బెస్ట్ సెల్లర్',
    popular: 'పాపులర్',
    contractorChoice: 'కాంట్రాక్టర్ ఎంపిక',
    priceRange: 'ధర పరిధి',
    getQuote: 'కోట్ పొందండి',
    orderNow: 'ఇప్పుడే ఆర్డర్ చేయండి',
    sectionApplications: 'మా పదార్థాలు ఎక్కడ ఉపయోగిస్తారు',
    app1Title: 'రోడ్ నిర్మాణం',
    app2Title: 'నివాస ప్రాజెక్టులు',
    app3Title: 'వాణిజ్య భవనాలు',
    app4Title: 'డ్రెయినేజీ వ్యవస్థలు',
    sectionLocalTrust: 'స్థానిక విశ్వాసం & విశ్వసనీయత',
    trustBadge1: 'కౌరీరం, గోరఖ్పుర్',
    trustBadge2: 'డెలివరీ అందుబాటులో ఉంది',
    trustBadge3: 'నిర్మాణ పదార్థాల సరఫరాదారు',
    trustBadge4: 'ప్రత్యక్ష యజమాని మద్దతు',
    trustBadge5: 'ఇంటర్‌లాకింగ్ పరిష్కారాలు',
    trustBadge6: 'RCC రోడ్ పదార్థాలు',
    sectionOwners: 'వేల మంది విశ్వసిస్తారు',
    ownersTitle: 'దిలీప్ చౌబే & ఆలోక్ చౌబే',
    ownersDesc: 'మా పేరు గుణమైన పదార్థాలు మరియు గ్రాహక విశ్వాసంపై నిర్మించబడింది.',
    ownersTag: 'మీ స్థానిక నిర్మాణ భాగస్వాములు',
    sectionCTA: 'మీ నిర్మాణ ప్రాజెక్ట్ ప్రారంభించడానికి సిద్ధంగా ఉన్నారా?',
    ctaDesc: 'నిపుణ మార్గదర్శనం, గుణమైన పదార్థాలు మరియు నమ్మదగిన డెలివరీని పొందండి.',
    ctaQuote: 'కోట్ పొందండి',
    ctaCall: 'ఇప్పుడే కాల్ చేయండి',
    ctaWhatsapp: 'మాతో WhatsApp చేయండి',
    loading: 'ఉత్పత్తులు లోడ్ అవుతున్నాయి...',
    noProducts: 'ప్రస్తుతం ఏ ఉత్పత్తులు అందుబాటులో లేవు.',
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight">{language === 'hi' ? 'నిర్మాణ సామాగ్రి' : 'Building Materials'}</h1>
          <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-full sm:max-w-2xl mb-6 leading-relaxed">{language === 'hi' ? 'స్వస్తిక ఇంటర్‌లాకింగ్ నుండి అధిక నాణ్యతలో నిర్మాణ సామాగ్రి - ఇంటర్‌లాకింగ్ బ్లాక్స్, RCC పైప్స్, సిమెంట్, రేత్ మరియు ఎక్కువ.' : 'High-quality construction materials from Swastika Interlocking - interlocking blocks, RCC pipes, cement, sand and more.'}</p>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Link to="/order" className="bg-[#E8650A] text-white px-6 sm:px-8 py-3 sm:py-4 font-bold rounded-lg flex items-center gap-2 hover:brightness-110 transition-all active:scale-95 shadow-lg">
              {language === 'hi' ? 'ఆర్డర్ చేయండి' : 'Order Now'}
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

      {/* SECTION 4: Products Grid (Premium Construction Materials) */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-center text-[#1a1a3e] mb-8 sm:mb-12">{t.sectionProducts}</h2>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-4">
              <span className="material-symbols-outlined text-4xl sm:text-5xl text-[#E8650A] animate-spin">autorenew</span>
              <p className="text-[#1a1a3e]/70 font-medium text-sm sm:text-base">{t.loading}</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="text-center py-12 sm:py-20 mx-4 bg-red-50 rounded-2xl border border-red-100">
              <span className="material-symbols-outlined text-3xl sm:text-4xl text-red-400 mb-3 block">error_outline</span>
              <p className="text-red-600 font-medium text-sm sm:text-base">Failed to load products. Please try again.</p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && productList.length === 0 && (
            <div className="text-center py-16 sm:py-24 text-[#1a1a3e]/70">
              <span className="material-symbols-outlined text-5xl sm:text-6xl mb-4 block opacity-30">inventory_2</span>
              <p className="font-medium text-base sm:text-lg">{t.noProducts}</p>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && productList.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {productList.map(product => (
                <article
                  key={product.id}
                  className="bg-surface-container-low rounded-2xl overflow-hidden flex flex-col shadow-md hover:shadow-2xl border border-surface-variant/20 transition-all duration-500 hover:-translate-y-2 group"
                >
                  <div className="aspect-[4/3] overflow-hidden select-none bg-surface-container flex items-center justify-center">
                    {product.image ? (
                      <div className="block w-full h-full">
                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} src={product.image} />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-outline-variant">
                        <span className="material-symbols-outlined text-5xl sm:text-6xl">image_not_supported</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 sm:p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-2 select-none">
                      <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                        Available
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-[#1a1a3e] mb-2">
                      <span className="text-[#1a1a3e]">{product.name}</span>
                    </h3>
                    <p className="text-[#1a1a3e]/70 text-sm sm:text-base mb-6 flex-grow leading-relaxed">{product.desc}</p>

                    <div className="flex items-end justify-between mt-auto gap-2 pt-2 border-t border-outline/5">
                      <div className="select-none min-w-0">
                        <p className="text-[#1a1a3e]/70 text-[10px] sm:text-xs uppercase tracking-wider mb-0.5">{t.priceRange}</p>
                        <p className="text-[#E8650A] font-bold text-base sm:text-lg leading-tight truncate">{product.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to="/order"
                          state={{ selectedProduct: product.name }}
                          className="bg-[#8B1A00] text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-bold flex items-center gap-1.5 hover:brightness-110 transition-colors cursor-pointer active:scale-95 text-sm whitespace-nowrap shrink-0"
                        >
                          {language === 'hi' ? 'ప్రశ్నించండి' : 'Enquire'}
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5: Real Application Showcase */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-center text-[#1a1a3e] mb-8 sm:mb-12">{t.sectionApplications}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {[
              { title: t.app1Title, image: '/swastika-interlocking-pertol-bricks-3x.jpg' },
              { title: t.app2Title, image: '/Business-division-Bulding-Material.png' },
              { title: t.app3Title, image: '/Business-division-shuttering.png' },
              { title: t.app4Title, image: '/drainage-image.png' },
            ].map((app, i) => (
              <div key={i} className="group relative h-[180px] sm:h-[200px] md:h-[220px] rounded-2xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url("${app.image}")` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1f]/95 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <h3 className="text-white font-bold text-lg sm:text-xl">{app.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCAL TRUST SECTION */}
      <section className="py-10 sm:py-12 bg-white">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-center text-[#1a1a3e] mb-6 sm:mb-8">{t.sectionLocalTrust}</h2>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {[
              { icon: 'location_on', text: t.trustBadge1 },
              { icon: 'local_shipping', text: t.trustBadge2 },
              { icon: 'apartment', text: t.trustBadge3 },
              { icon: 'support_agent', text: t.trustBadge4 },
              { icon: 'bricks', text: t.trustBadge5 },
              { icon: 'road', text: t.trustBadge6 },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-3 bg-[#FAF0E6] px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border border-[#E8650A]/30">
                <span className="material-symbols-outlined text-xl sm:text-2xl text-[#E8650A]">{badge.icon}</span>
                <span className="font-bold text-sm sm:text-base text-[#1a1a3e]">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
