import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../services/productService';
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
    heroTitle: 'शटरिंग सामग्री',
    heroSub: 'स्लैब, बीम और कॉलम के लिए उच्च गुणवत्ता वाले स्टील शटरिंग',
    requestQuote: 'कोटेशन प्राप्त करें',
    contactSales: 'बिक्री से संपर्क करें',
    steelPlates: 'शटरिंग प्लेट्स',
    steelPlatesDesc: 'भारी-शुल्क वाले स्टील और उच्च गुणवत्ता वाली लकड़ी से निर्मित, आवासीय और वाणिज्यिक स्लैब कास्टिंग के लिए आदर्श।',
    props: 'डोर फ्रेम (Door Frame)',
    propsDesc: 'विभिन्न डिजाइनों में उपलब्ध उच्च गुणवत्ता वाले स्टील और लकड़ी के डोर फ्रेम।',
    scaffolding: 'एच-फ्रेम मचान (Scaffolding)',
    scaffoldingDesc: 'विभिन्न ऊंचाइयों पर बाहरी और आंतरिक कार्यों के लिए उपयोग में आसान मचान प्रणाली।',
    clamps: 'शटरिंग क्लैम्प्स और सहायक उपकरण',
    clampsDesc: 'लीक-प्रूफ और मजबूत कास्टिंग सुनिश्चित करने के लिए सभी आवश्यक फिटिंग्स।',
    whyUs: 'स्वस्तिक शटरिंग क्यों चुनें?',
    whyUs1: 'टिकाऊ और मजबूत स्टील सामग्री',
    whyUs2: 'सटीक आयाम और आसान फिटिंग',
    whyUs3: 'सुरक्षित और स्थिर सपोर्ट सिस्टम',
    whyUs4: 'प्रतिस्पर्धी मूल्य और समय पर डिलीवरी',
    catalogTitle: 'संपूर्ण कैटलॉग',
    premiumTitle: 'प्रीमियम शटरिंग सामग्री',
  },
  en: {
    heroTitle: 'Shuttering Materials',
    heroSub: 'High-quality steel shuttering for slabs, beams, and columns',
    requestQuote: 'Request Quote',
    contactSales: 'Contact Sales',
    steelPlates: 'Shuttering Plates',
    steelPlatesDesc: 'Manufactured from heavy-duty steel and high quality wood, ideal for residential and commercial slab casting.',
    props: 'Door Frame',
    propsDesc: 'High-quality steel and wooden door frames available in various designs.',
    scaffolding: 'H-Frame Scaffolding',
    scaffoldingDesc: 'Easy-to-assemble scaffolding system for exterior and interior works at varying heights.',
    clamps: 'Shuttering Clamps & Accessories',
    clampsDesc: 'All necessary fittings to ensure leak-proof and robust casting.',
    whyUs: 'Why Choose Swastika Shuttering?',
    whyUs1: 'Durable and robust steel materials',
    whyUs2: 'Precise dimensions and easy fitting',
    whyUs3: 'Safe and stable support systems',
    whyUs4: 'Competitive pricing and timely delivery',
    catalogTitle: 'Complete Catalog',
    premiumTitle: 'Premium Shuttering Materials',
  },
};

export default function Shuttering({ language }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [selectedImages, setSelectedImages] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getAllProducts();
        const mapped = (data || [])
          .filter(p => p.division === 'shuttering')
          .map(p => ({
            id: p.id,
            name: language === 'hi' ? (p.name_hi || p.name_en) : p.name_en,
            desc: language === 'hi' ? (p.description_hi || p.description_en) : p.description_en,
            price: p.price_min && p.price_max
              ? `₹${p.price_min} – ₹${p.price_max}`
              : (p.price_min ? `₹${p.price_min}` : '—'),
            tag: (p.stock_quantity || 0) > 0
              ? (language === 'hi' ? 'उपलब्ध' : 'Available')
              : (language === 'hi' ? 'स्टॉक से बाहर' : 'Out of Stock'),
            image: p.images && p.images.length > 0 ? p.images[0] : null,
            variants: p.specifications?.variants || [],
          }));
        setProducts(mapped);
      } catch (err) {
        console.error('Error fetching shuttering products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [language]);

  return (
    <div className="pt-16">
      <SEOHead
        title="Shuttering Materials on Rent & Sale - Deesa Gujarat | Swastika Interlocking"
        description="Steel shuttering plates, adjustable props, H-frames, beam clamps on rent and sale in Deesa, Gujarat. Best rental rates starting ₹45/day. Call for availability."
        keywords="shuttering materials Deesa, steel plates on rent Gujarat, scaffolding rental Banaskantha, शटरिंग सामग्री देसा, formwork Gujarat"
        url="/shuttering"
        breadcrumb={getBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Shuttering', path: '/shuttering' }])}
        language={language}
      />
      
      {/* Hero Section */}
      <header className="relative h-[350px] sm:h-[400px] md:h-[480px] w-full flex items-center overflow-hidden">
        <img 
          alt="Construction Scaffolding" 
          className="absolute inset-0 w-full h-full object-cover opacity-70" 
          src="/shuttering-hero.png" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E55]/80 to-transparent"></div>
        <div className="relative max-w-container-max mx-auto px-4 sm:px-gutter w-full pt-16 sm:pt-20">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-2">{t.heroTitle}</h1>
          <p className="font-body-lg text-body-lg text-surface-variant/80 max-w-xl mb-6 sm:mb-8">{t.heroSub}</p>
          <div className="flex flex-wrap gap-4 mb-6 sm:mb-8">
            <Link 
              to="/shuttering-enquiry" 
              className="bg-[#8B1A00] text-white px-6 sm:px-8 py-3 sm:py-4 font-bold rounded-lg flex items-center gap-2 hover:brightness-110 transition-all"
            >
              {t.requestQuote} 
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Marquee Section */}
      <section className="bg-[#1a1a3e] py-3 sm:py-4 overflow-hidden">
        <div className="flex items-center gap-6 sm:gap-8 animate-marquee whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((text, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3 text-white text-xs sm:text-sm font-semibold">
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* Product Filter Navigation */}
      <section className="sticky top-16 sm:top-20 bg-[#FAF0E6] z-40 border-b border-outline/10 shadow-sm">
        <div className="max-w-container-max mx-auto px-4 sm:px-gutter py-3 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <button 
              onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
              className="bg-[#1565C0] text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all shrink-0"
            >
              {language === "hi" ? "सभी" : "All"}
            </button>
            {products.map(p => (
              <a 
                key={p.id} 
                href={`#${p.id}`} 
                onClick={(e) => { 
                  e.preventDefault(); 
                  document.getElementById(p.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
                }} 
                className="bg-white border border-outline/20 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap hover:bg-primary-fixed transition-all block shrink-0"
              >
                {p.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <main className="max-w-container-max mx-auto px-4 sm:px-gutter py-12 sm:py-16">
        <h2 className="font-display-lg text-2xl sm:text-3xl md:text-4xl text-center text-[#1a1a3e] mb-8 sm:mb-12">{t.premiumTitle}</h2>
        
        {loading && (
          <div className="flex justify-center items-center py-16 sm:py-20">
            <div className="flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-4xl sm:text-5xl text-primary animate-spin">autorenew</span>
              <p className="text-on-surface-variant font-medium">{language === 'hi' ? 'उत्पाद लोड हो रहे हैं...' : 'Loading products...'}</p>
            </div>
          </div>
        )}
        
        {!loading && products.length === 0 && (
          <div className="flex justify-center items-center py-16 sm:py-20 text-on-surface-variant">
            <div className="flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-4xl sm:text-6xl opacity-30">inventory_2</span>
              <p className="font-medium text-sm sm:text-base">{language === 'hi' ? 'अभी कोई शटरिंग उत्पाद उपलब्ध नहीं है।' : 'No shuttering products available right now.'}</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map(product => (
            <article 
              key={product.id} 
              id={product.id} 
              style={{ scrollMarginTop: '180px' }} 
              className="bg-surface-container-low rounded-2xl overflow-hidden flex flex-col shadow-md hover:shadow-2xl border border-surface-variant/20 transition-all duration-500 hover:-translate-y-2 group"
            >
              <div className="aspect-[4/3] overflow-hidden select-none bg-surface-container flex items-center justify-center">
                {product.image ? (
                  <div className="block w-full h-full">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      alt={product.name} 
                      src={selectedImages[product.id] || product.image} 
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-outline-variant">
                    <span className="material-symbols-outlined text-4xl sm:text-6xl">image_not_supported</span>
                  </div>
                )}
              </div>
              
              <div className="p-4 sm:p-card-padding flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-2 select-none">
                  <span className={`${(product.tag === 'Available' || product.tag === 'उपलब्ध') ? 'bg-secondary/10 text-secondary' : 'bg-[#E8650A]/10 text-[#E8650A]'} px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1.5`}>
                    {(product.tag === 'Available' || product.tag === 'उपलब्ध') && <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>}
                    {product.tag}
                  </span>
                </div>
                
                <h3 className="font-headline-md text-lg sm:text-headline-md text-on-surface mb-2 font-semibold">
                  {product.name}
                </h3>
                
                <p className="text-on-surface-variant text-sm mb-4 sm:mb-6 flex-grow leading-relaxed">
                  {product.desc}
                </p>

                {product.variants && product.variants.length > 0 && (
                  <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg border cursor-pointer shadow-sm hover:scale-105 transition-transform flex items-center justify-center overflow-hidden bg-surface-container ${(!selectedImages[product.id] || selectedImages[product.id] === product.image) ? 'border-primary border-2' : 'border-outline-variant/30'}`}
                      title="Default"
                      onClick={() => setSelectedImages(prev => ({ ...prev, [product.id]: product.image }))}
                    >
                      {product.image && <img src={product.image} alt="Default" className="w-full h-full object-cover" />}
                    </div>
                    {product.variants.map((v, i) => (
                      <div
                        key={i}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg border cursor-pointer shadow-sm hover:scale-105 transition-transform flex items-center justify-center overflow-hidden bg-surface-container ${selectedImages[product.id] === v.image_url ? 'border-primary border-2' : 'border-outline-variant/30'}`}
                        title={v.name}
                        onClick={() => {
                          if (v.image_url) {
                            setSelectedImages(prev => ({ ...prev, [product.id]: v.image_url }));
                          }
                        }}
                      >
                        {v.image_url ? (
                          <img src={v.image_url} alt={v.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-bold text-center leading-tight">{v.name}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-end justify-between mt-auto gap-2 pt-2 border-t border-outline/5">
                  <div className="select-none min-w-0">
                    <p className="text-on-surface-variant text-[10px] sm:text-xs uppercase tracking-wider mb-0.5">
                      {language === 'hi' ? 'मूल्य' : 'Price'}
                    </p>
                    <p className="text-primary font-bold text-sm sm:text-base md:text-lg leading-tight truncate">
                      {product.price}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link 
                      to="/shuttering-enquiry"
                      className="bg-primary text-on-primary px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-lg font-bold flex items-center gap-1.5 hover:bg-primary-container transition-colors cursor-pointer active:scale-95 text-xs md:text-sm whitespace-nowrap shrink-0"
                    >
                      {language === 'hi' ? 'पूछताछ करें' : 'Enquire'}
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Use Cases Section */}
      <section className="py-12 md:py-16 sm:py-20 bg-[#FAF0E6]">
        <div className="max-w-container-max mx-auto px-4 sm:px-gutter">
          <h2 className="font-display-lg text-2xl sm:text-3xl md:text-4xl text-center text-[#1a1a3e] mb-8 sm:mb-12">
            {language === 'hi' ? 'हमारी सामग्री का उपयोग कहाँ होता है' : 'Where Our Materials Are Used'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { title: language === 'hi' ? 'सड़क निर्माण' : 'Road Construction', image: '/swastika-interlocking-pertol-bricks-3x.jpg' },
              { title: language === 'hi' ? 'आवासीय परियोजनाएं' : 'Residential Projects', image: '/Business-division-Bulding-Material.png' },
              { title: language === 'hi' ? 'वाणिज्यिक इमारतें' : 'Commercial Buildings', image: '/Business-division-shuttering.png' },
              { title: language === 'hi' ? 'जल निकास प्रणाली' : 'Drainage Systems', image: '/drainage-image.png' },
            ].map((app, i) => (
              <div key={i} className="group relative h-[200px] sm:h-[220px] rounded-2xl overflow-hidden shadow-lg">
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

      {/* Trust Badges Section */}
      <section className="py-10 sm:py-12 bg-white">
        <div className="max-w-container-max mx-auto px-4 sm:px-gutter">
          <h2 className="font-display-lg text-xl sm:text-2xl md:text-3xl text-center text-[#1a1a3e] mb-6 sm:mb-8">
            {language === 'hi' ? 'स्थानीय विश्वास और विश्वसनीयता' : 'Local Trust & Credibility'}
          </h2>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {[
              { icon: 'location_on', text: language === 'hi' ? 'दीसा, गुजरात' : 'Deesa, Gujarat' },
              { icon: 'local_shipping', text: language === 'hi' ? 'डिलीवरी उपलब्ध' : 'Delivery Available' },
              { icon: 'apartment', text: language === 'hi' ? 'शटరिंग सामग्री आपूर्तिकर्ता' : 'Shuttering Material Supplier' },
              { icon: 'support_agent', text: language === 'hi' ? 'सीधा मालिक सहायता' : 'Direct Owner Support' },
              { icon: 'bricks', text: language === 'hi' ? 'इंटरलॉकिंग समाधान' : 'Interlocking Solutions' },
              { icon: 'road', text: language === 'hi' ? 'RCC सड़क सामग्री' : 'RCC Road Materials' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-3 bg-[#FAF0E6] px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-[#E8650A]/30">
                <span className="material-symbols-outlined text-[#E8650A]">{badge.icon}</span>
                <span className="font-bold text-sm sm:text-base text-[#1a1a3e]">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
