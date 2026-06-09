import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE } from "../config";

const TRANSLATIONS = {
  hi: {
    heroTitle: 'शटरिंग सामग्री',
    heroSub: 'स्लैब, बीम और कॉलम के लिए उच्च गुणवत्ता वाली स्टील शटरिंग',
    requestQuote: 'कोटेशन प्राप्त करें',
    contactSales: 'बिक्री से संपर्क करें',
    steelPlates: 'शटरिंग प्लेट्स',
    steelPlatesDesc: 'भारी-शुल्क वाले स्टील और उच्च गुणवत्ता वाली लकड़ी से निर्मित, आवासीय और वाणिज्यिक स्लैब कास्टिंग के लिए आदर्श।',
    props: 'डोर फ्रेम (Door Frame)',
    propsDesc: 'विभिन्न डिजाइनों में उपलब्ध उच्च गुणवत्ता वाले स्टील और लकड़ी के डोर फ्रेम।',
    scaffolding: 'एच-फ्रेम मचान (Scaffolding)',
    scaffoldingDesc: 'विभिन्न ऊंचाइयों पर बाहरी और आंतरिक कार्यों के लिए उपयोग में आसान मचान प्रणाली।',
    clamps: 'शटरिंग क्लैंप और सहायक उपकरण',
    clampsDesc: 'लीक-प्रूफ और मजबूत कास्टिंग सुनिश्चित करने के लिए सभी आवश्यक फिटिंग।',
    whyUs: 'स्वस्तिका शटरिंग क्यों चुनें?',
    whyUs1: 'टिकाऊ और मजबूत स्टील सामग्री',
    whyUs2: 'सटीक आयाम और आसान फिटिंग',
    whyUs3: 'सुरक्षित और स्थिर सपोर्ट सिस्टम',
    whyUs4: 'प्रतिस्पर्धी मूल्य और समय पर डिलीवरी',
    catalogTitle: 'संपूर्ण कैटलॉग',
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
  }
};

export default function Shuttering({ language }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/get_products.php`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          const mapped = data.products
            .filter(p => p.category === 'Shuttering')
            .map(p => ({
              id: p.product_key,
              name: language === 'hi' ? p.name_hi : p.name_en,
              desc: language === 'hi' ? p.desc_hi : p.desc_en,
              price: p.price,
              tag: parseInt(p.stock) > 0 ? (language === 'hi' ? 'उपलब्ध' : 'Available') : (language === 'hi' ? 'स्टॉक से बाहर' : 'Out of Stock'),
              image: p.image_url,
              value: p.name_en,
              variants: p.variants || [],
              db: true
            }));
          setProducts(mapped);
        }
      })
      .catch(err => console.error("Error fetching shuttering products:", err));
  }, [language]);

  return (
    <div className="pt-16">
      {/*  */}
<header className="relative h-[480px] w-full flex items-center overflow-hidden"><img alt="Construction Scaffolding" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiH_XHsGY_rQbd3r8j5olaPCuTrIGHdamNPOwE4KBnygkdzyBGotAvOkA4Ft_fJ8JO6ZfpvqeKJ39IsyOUVZQs8610kRiKPFmpf2FPrn0RJKj1fQ15AKSs1CeFfdD5HggLDNbBe3TMXcUlZVkz8gpNLnauYQAPP4dzA6-UlQR-TzVfIqrWVgmEPkHYlPDY8RdCPEh0VqY_-Kf8xVvQ8h-kdGla0i1UMqcQof3nbN9n1qLQmclVNzRtUhZwefTime9Ha25rvEiCCZ0"/><div className="absolute inset-0 shuttering-overlay"></div><div className="relative max-w-container-max mx-auto px-gutter w-full pt-20"><h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-2">{t.heroTitle}</h1><p className="font-body-lg text-body-lg text-surface-variant/80 max-w-xl mb-8">{t.heroSub}</p><div className="flex flex-wrap gap-4 mb-8"><Link to="/shuttering-enquiry" className="bg-[#8B1A00] text-white px-8 py-4 font-bold rounded-lg flex items-center gap-2 hover:brightness-110 transition-all">{t.requestQuote} <span className="material-symbols-outlined">arrow_forward</span></Link></div></div></header>
{/*  */}
<section className="sticky top-20 bg-[#FAF0E6] z-40 border-b border-outline/10 shadow-sm"><div className="max-w-container-max mx-auto px-gutter py-4 flex flex-col md:flex-row md:items-center justify-between gap-6"><div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
  <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="bg-[#1565C0] text-white px-5 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all">{language === "hi" ? "सभी" : "All"}</button>
  {products.map(p => (
    <a key={p.id} href={`#${p.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(p.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="bg-white border border-outline/20 px-5 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap hover:bg-primary-fixed transition-all block">
      {p.name}
    </a>
  ))}
</div></div></section>
{/*  */}
<main className="max-w-container-max mx-auto px-gutter py-16">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {products.map(product => (
    <article key={product.id} id={product.id} style={{ scrollMarginTop: '160px' }} className="bg-surface-container-low rounded-2xl overflow-hidden flex flex-col shadow-md hover:shadow-2xl border border-surface-variant/20 transition-all duration-500 hover:-translate-y-2 group">
      <div className="aspect-[4/3] overflow-hidden select-none bg-surface-container flex items-center justify-center">
        {product.image ? (
          <div className="block w-full h-full">
            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} src={selectedImages[product.id] || product.image} />
          </div>
        ) : (
          <span className="material-symbols-outlined text-6xl text-outline-variant">{product.icon}</span>
        )}
      </div>
      <div className="p-card-padding flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2 select-none">
          <span className={`${(product.tag === 'Available' || product.tag === 'उपलब्ध') ? 'bg-secondary/10 text-secondary' : 'bg-[#E8650A]/10 text-[#E8650A]'} px-3 py-1 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1.5`}>
            {(product.tag === 'Available' || product.tag === 'उपलब्ध') && <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>}
            {product.tag}
          </span>
        </div>
        <h3 className="font-headline-md text-headline-md text-on-surface mb-2 font-semibold">
          <span className="text-on-surface">
            {product.name}
          </span>
        </h3>
        <p className="text-on-surface-variant text-sm mb-6 flex-grow leading-relaxed">
          {product.desc}
        </p>

{product.variants && product.variants.length > 0 && (
  <div className="flex flex-wrap gap-3 mb-4">
    <div
      className={`w-12 h-12 rounded-lg border cursor-pointer shadow-sm hover:scale-105 transition-transform flex items-center justify-center overflow-hidden bg-surface-container ${(!selectedImages[product.id] || selectedImages[product.id] === product.image) ? 'border-primary border-2' : 'border-outline-variant/30'}`}
      title="Default"
      onClick={() => setSelectedImages(prev => ({ ...prev, [product.id]: product.image }))}
    >
      <img src={product.image} alt="Default" className="w-full h-full object-cover" />
    </div>
    {product.variants.map((v, i) => (
      <div
        key={i}
        className={`w-12 h-12 rounded-lg border cursor-pointer shadow-sm hover:scale-105 transition-transform flex items-center justify-center overflow-hidden bg-surface-container ${selectedImages[product.id] === v.image_url ? 'border-primary border-2' : 'border-outline-variant/30'}`}
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
            <p className="text-on-surface-variant text-[10px] md:text-xs uppercase tracking-wider mb-0.5">
              {language === 'hi' ? 'मूल्य' : 'Price'}
            </p>
            <p className="text-primary font-bold text-sm sm:text-base md:text-lg leading-tight truncate">
              {product.price}
            </p>
          </div>
          <div className="flex gap-2">
            <Link 
              to="/shuttering-enquiry"
              className="bg-primary text-on-primary px-3 sm:px-4 md:px-5 py-2 rounded-lg font-bold flex items-center gap-1.5 hover:bg-primary-container transition-colors cursor-pointer active:scale-95 text-xs md:text-sm whitespace-nowrap shrink-0"
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
{/*  */}
    </div>
  );
}
