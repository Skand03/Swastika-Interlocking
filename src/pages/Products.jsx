import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE } from "../config";


const TRANSLATIONS = {
  hi: {
    title: 'हमारे कंक्रीट उत्पाद',
    desc: 'आधुनिक बुनियादी ढांचे में स्थायित्व, संरचनात्मक अखंडता और सौंदर्य उत्कृष्टता के लिए इंजीनियर प्रीमियम ग्रेड सामग्री।',
    priceRange: 'मूल्य सीमा',
    getQuote: 'कोट प्राप्त करें'
  },
  en: {
    title: 'Our Construction Products',
    desc: 'Premium grade materials engineered for durability, structural integrity, and aesthetic excellence in modern infrastructure.',
    priceRange: 'Price Range',
    getQuote: 'Get Quote'
  }
};

export default function Products({ language }) {
  const navigate = useNavigate();
  const [selectedColors, setSelectedColors] = useState({});
  const t = TRANSLATIONS[language];
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    console.log("API_BASE =", API_BASE);

    fetch(`${API_BASE}/api/get_products.php`)
      .then(res => {
        console.log("RAW RESPONSE =", res);
        return res.json();
      })
      .then(data => {
        console.log("API RESPONSE =", data);

        if (data.success && data.products) {
          const mapped = data.products
            .filter(p => p.category !== 'RCC' && p.category !== 'Shuttering')
            .map(p => ({
              id: p.product_key,
              name: language === 'hi' ? p.name_hi : p.name_en,
              desc: language === 'hi' ? p.desc_hi : p.desc_en,
              price: p.price,
              tag: p.category,
              tagColor: 'bg-primary/10 text-primary',
              image: p.image_url,
              value: p.name_en,
              variants: p.variants || [],
              db: true
            }));

          setProductList(mapped);
        }
      })
      .catch(err => {
        console.error("FETCH ERROR =", err);
      });
  }, [language]);

  // useEffect(() => {
  //   fetch(`${API_BASE}/api/get_products.php`)
  //     .then(res => res.json())
  //     .then(data => {
  //       if (data.success && data.products) {
  //         const mapped = data.products
  //           .filter(p => p.category !== 'RCC' && p.category !== 'Shuttering')
  //           .map(p => ({
  //             id: p.product_key,
  //             name: language === 'hi' ? p.name_hi : p.name_en,
  //             desc: language === 'hi' ? p.desc_hi : p.desc_en,
  //             price: p.price,
  //             tag: p.category,
  //             tagColor: 'bg-primary/10 text-primary',
  //             image: p.image_url,
  //             value: p.name_en,
  //             variants: p.variants || [],
  //             db: true
  //           }));
  //         setProductList(mapped);
  //       }
  //     })
  //     .catch(err => {
  //       console.error("Error fetching products from DB:", err);
  //     });
  // }, [language]);

  const handleBookNow = (productName) => {
    navigate('/order', { state: { selectedProduct: productName } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="pt-32 pb-16 md:pt-40 md:pb-24 bg-surface min-h-screen">
      {/* Header */}
      <header className="max-w-container-max mx-auto px-gutter mb-12 md:mb-20 text-center select-none">
        <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-on-surface mb-6 leading-tight">
          {t.title}
        </h1>
        <p className="font-body-lg text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
          {t.desc}
        </p>

      </header>

      {/* Product Grid */}
      <section className="max-w-container-max mx-auto px-gutter" aria-label="Product Catalog">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {productList.map(product => (
            <article key={product.id} className="bg-surface-container-low rounded-2xl overflow-hidden flex flex-col shadow-md hover:shadow-2xl border border-surface-variant/20 transition-all duration-500 hover:-translate-y-2 group">
              <div className="aspect-[4/3] overflow-hidden select-none">
                <div className="block w-full h-full">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={product.name}
                    src={selectedColors[product.id] || product.image}
                  />
                </div>
              </div>
              <div className="p-card-padding flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-2 select-none">
                  <span className={`${product.tagColor} px-3 py-1 rounded-full text-xs font-bold`}>
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
                      className={`w-12 h-12 rounded-lg border cursor-pointer shadow-sm hover:scale-105 transition-transform flex items-center justify-center overflow-hidden bg-surface-container ${(!selectedColors[product.id] || selectedColors[product.id] === product.image) ? 'border-primary border-2' : 'border-outline-variant/30'}`}
                      title="Default"
                      onClick={() => setSelectedColors(prev => ({ ...prev, [product.id]: product.image }))}
                    >
                      <img src={product.image} alt="Default" className="w-full h-full object-cover" />
                    </div>
                    {product.variants.map((v, i) => (
                      <div
                        key={i}
                        className={`w-12 h-12 rounded-lg border cursor-pointer shadow-sm hover:scale-105 transition-transform flex items-center justify-center overflow-hidden bg-surface-container ${selectedColors[product.id] === v.image_url ? 'border-primary border-2' : 'border-outline-variant/30'}`}
                        title={v.name}
                        onClick={() => {
                          if (v.image_url) {
                            setSelectedColors(prev => ({ ...prev, [product.id]: v.image_url }));
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
                    <p className="text-on-surface-variant text-[10px] md:text-xs uppercase tracking-wider mb-0.5">{t.priceRange}</p>
                    <p className="text-primary font-bold text-sm sm:text-base md:text-lg leading-tight truncate" title={product.price}>{product.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/products/${product.id}`}
                      className="border border-primary text-primary px-3 py-2 rounded-lg font-bold hover:bg-primary/5 transition-colors text-xs md:text-sm whitespace-nowrap flex items-center justify-center cursor-pointer active:scale-95"
                    >
                      {language === 'hi' ? 'विवरण' : 'Details'}
                    </Link>
                    <button
                      onClick={() => handleBookNow(product.value)}
                      className="bg-primary text-on-primary px-3 sm:px-4 md:px-5 py-2 rounded-lg font-bold flex items-center gap-1.5 hover:bg-primary-container transition-colors cursor-pointer active:scale-95 text-xs md:text-sm whitespace-nowrap shrink-0"
                    >
                      {t.getQuote}
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>


      </section>
    </main>
  );
}
