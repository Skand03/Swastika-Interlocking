import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProductsByDivision } from '../services/productService';

const TRANSLATIONS = {
  hi: {
    title: 'हमारे निर्माण उत्पाद',
    desc: 'आधुनिक बुनियादी ढांचे के लिए प्रीमियम ग्रेड सामग्री।',
    priceRange: 'मूल्य सीमा',
    getQuote: 'कोट प्राप्त करें',
    details: 'विवरण',
    loading: 'उत्पाद लोड हो रहे हैं...',
    noProducts: 'अभी कोई उत्पाद उपलब्ध नहीं है। एडमिन से संपर्क करें।',
  },
  en: {
    title: 'Our Construction Products',
    desc: 'Premium grade materials engineered for durability, structural integrity, and aesthetic excellence.',
    priceRange: 'Price Range',
    getQuote: 'Get Quote',
    details: 'Details',
    loading: 'Loading products...',
    noProducts: 'No products available right now. Please check back later.',
  },
};

export default function Products({ language }) {
  const navigate = useNavigate();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImages, setSelectedImages] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductsByDivision('building_materials');
        const mapped = (data || []).map(p => ({
          id: p.id,
          name: language === 'hi' ? (p.name_hi || p.name_en) : p.name_en,
          desc: language === 'hi' ? (p.description_hi || p.description_en) : p.description_en,
          price: p.price_min && p.price_max
            ? p.price_min === p.price_max
              ? `₹${p.price_min} / ${p.price_unit || 'piece'}`
              : `₹${p.price_min} – ₹${p.price_max} / ${p.price_unit || 'piece'}`
            : (p.price_min ? `₹${p.price_min}` : '—'),
          image: p.images && p.images.length > 0 ? p.images[0] : null,
          variants: p.specifications?.variants || [],
          value: p.name_en,
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
    <main className="pt-32 pb-16 md:pt-40 md:pb-24 bg-surface min-h-screen">
      {/* Header */}
      <header className="max-w-container-max mx-auto px-gutter mb-12 md:mb-20 text-center select-none">
        <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-on-surface mb-6 leading-tight">
          {t.title}
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
          {t.desc}
        </p>
      </header>

      <section className="max-w-container-max mx-auto px-gutter" aria-label="Product Catalog">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="material-symbols-outlined text-5xl text-primary animate-spin">autorenew</span>
            <p className="text-on-surface-variant font-medium">{t.loading}</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
            <span className="material-symbols-outlined text-4xl text-red-400 mb-3 block">error_outline</span>
            <p className="text-red-600 font-medium">Failed to load products. Please try again.</p>
            <p className="text-red-400 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && productList.length === 0 && (
          <div className="text-center py-24 text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl mb-4 block opacity-30">inventory_2</span>
            <p className="font-medium text-lg">{t.noProducts}</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && productList.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {productList.map(product => (
              <article
                key={product.id}
                className="bg-surface-container-low rounded-2xl overflow-hidden flex flex-col shadow-md hover:shadow-2xl border border-surface-variant/20 transition-all duration-500 hover:-translate-y-2 group"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden select-none bg-surface-container">
                  {(selectedImages[product.id] || product.image) ? (
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={product.name}
                      src={selectedImages[product.id] || product.image}
                      onError={e => { e.target.style.display = 'none'; e.target.parentNode.classList.add('flex','items-center','justify-center'); }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-outline-variant">
                      <span className="material-symbols-outlined text-6xl">image_not_supported</span>
                    </div>
                  )}
                </div>

                <div className="p-card-padding flex flex-col flex-grow">
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2 font-semibold">
                    {product.name}
                  </h3>
                  <p className="text-on-surface-variant text-sm mb-4 flex-grow leading-relaxed">
                    {product.desc}
                  </p>

                  {/* Variants */}
                  {product.variants.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div
                        className={`w-10 h-10 rounded-lg border cursor-pointer overflow-hidden ${
                          !selectedImages[product.id] ? 'border-primary border-2' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedImages(prev => ({ ...prev, [product.id]: product.image }))}
                        title="Default"
                      >
                        {product.image && <img src={product.image} alt="Default" className="w-full h-full object-cover" />}
                      </div>
                      {product.variants.map((v, i) => (
                        <div
                          key={i}
                          className={`w-10 h-10 rounded-lg border cursor-pointer overflow-hidden ${
                            selectedImages[product.id] === v.image_url ? 'border-primary border-2' : 'border-gray-200'
                          }`}
                          onClick={() => v.image_url && setSelectedImages(prev => ({ ...prev, [product.id]: v.image_url }))}
                          title={v.name}
                        >
                          {v.image_url
                            ? <img src={v.image_url} alt={v.name} className="w-full h-full object-cover" />
                            : <span className="text-[9px] font-bold text-center leading-tight p-0.5 block">{v.name}</span>
                          }
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-end justify-between mt-auto pt-3 border-t border-outline/10 gap-2">
                    <div className="min-w-0">
                      <p className="text-on-surface-variant text-[10px] uppercase tracking-wider mb-0.5">{t.priceRange}</p>
                      <p className="text-primary font-bold text-sm sm:text-base leading-tight truncate">{product.price}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link
                        to={`/products/${product.id}`}
                        className="border border-primary text-primary px-3 py-2 rounded-lg font-bold hover:bg-primary/5 transition-colors text-xs cursor-pointer active:scale-95"
                      >
                        {t.details}
                      </Link>
                      <button
                        onClick={() => handleBookNow(product.value)}
                        className="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 hover:bg-primary-container transition-colors cursor-pointer active:scale-95 text-xs"
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
        )}
      </section>
    </main>
  );
}
