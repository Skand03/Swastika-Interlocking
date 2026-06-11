import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAllProducts } from '../services/productService';

const DURATION_OPTIONS = [
  { label: '1 Day', days: 1 },
  { label: '3 Days', days: 3 },
  { label: '7 Days', days: 7 },
  { label: '14 Days', days: 14 },
  { label: '30 Days', days: 30 },
];

export default function ShutteringDetail({ language }) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isHi = language === 'hi';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get all shuttering products from database
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllProducts();
        const shutteringProducts = data.filter(p => p.division === 'shuttering');
        setProducts(shutteringProducts);
      } catch (err) {
        console.error('Error fetching shuttering products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Find current product
  const product = products.find(p => p.id === productId);

  // State
  const [quantity, setQuantity] = useState(10);
  const [selectedDuration, setSelectedDuration] = useState(0); // index into DURATION_OPTIONS
  const [customDays, setCustomDays] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [mainImage, setMainImage] = useState(null);

  // Derived values - adjust based on product structure
  const productPrice = product?.price_min || 0;
  const days = isCustom ? (parseInt(customDays, 10) || 1) : DURATION_OPTIONS[selectedDuration].days;
  const rentTotal = useMemo(() => quantity * days * productPrice, [quantity, days, productPrice]);
  const saleTotal = useMemo(() => quantity * productPrice, [quantity, productPrice]);

  // Related products (all except current)
  const relatedProducts = products.filter(p => p.id !== productId).slice(0, 4);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-6xl text-primary animate-spin">autorenew</span>
        <h1 className="font-headline-md text-headline-md">{isHi ? 'लोड हो रहा है...' : 'Loading...'}</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-16 min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-6xl text-error">error</span>
        <h1 className="font-headline-md text-headline-md">{isHi ? 'उत्पाद नहीं मिला' : 'Product Not Found'}</h1>
        <Link to="/shuttering" className="text-primary font-bold hover:underline">{isHi ? 'वापस जाएं' : 'Go Back'}</Link>
      </div>
    );
  }

  const productName = isHi ? (product.name_hi || product.name_en) : product.name_en;
  const productDesc = isHi ? (product.description_hi || product.description_en) : product.description_en;
  const displayImage = mainImage || (product.images && product.images[0]);
  const isAvailable = (product.stock_quantity || 0) > 0;
  const stockTag = isAvailable ? (isHi ? 'उपलब्ध' : 'Available') : (isHi ? 'स्टॉक से बाहर' : 'Out of Stock');

  const handleRentEnquiry = () => {
    navigate('/shuttering-enquiry', {
      state: {
        productName,
        productId: product.id,
        quantity,
        duration: days,
        totalCost: rentTotal,
        type: 'Rent'
      }
    });
  };

  const handleBuyEnquiry = () => {
    navigate('/shuttering-enquiry', {
      state: {
        productName,
        productId: product.id,
        quantity,
        totalCost: saleTotal,
        type: 'Buy'
      }
    });
  };

  return (
    <div className="pt-16">
      <main className="max-w-container-max mx-auto px-gutter py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm flex-wrap">
          <Link to="/" className="hover:text-primary">{isHi ? 'होम' : 'Home'}</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <Link to="/shuttering" className="hover:text-primary">{isHi ? 'शटरिंग सामग्री' : 'Shuttering Materials'}</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-primary font-bold">{productName}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 items-start">
          {/* Left Column: Media */}
          <div className="space-y-6">
            <div className="relative aspect-square bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant shadow-sm group">
              {displayImage ? (
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt={productName}
                  src={displayImage}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-container">
                  <span className="material-symbols-outlined text-6xl text-outline-variant">image_not_supported</span>
                </div>
              )}
              <div className={`absolute top-4 left-4 ${isAvailable ? 'bg-secondary text-on-secondary' : 'bg-error text-on-error'} px-4 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-2`}>
                <span className="material-symbols-outlined text-[18px]">{isAvailable ? 'check_circle' : 'cancel'}</span>
                {stockTag}
              </div>
            </div>
            {/* Variant images if available */}
            {product.specifications?.variants && product.specifications.variants.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                <div
                  className={`w-20 h-20 rounded-lg border cursor-pointer shadow-sm hover:scale-105 transition-transform flex items-center justify-center overflow-hidden bg-surface-container ${!mainImage || mainImage === displayImage ? 'border-primary border-2' : 'border-outline-variant/30'}`}
                  onClick={() => setMainImage(null)}
                >
                  {displayImage ? <img src={displayImage} alt="default" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined">image</span>}
                </div>
                {product.specifications.variants.map((variant, idx) => (
                  variant.image_url && (
                    <div
                      key={idx}
                      className={`w-20 h-20 rounded-lg border cursor-pointer shadow-sm hover:scale-105 transition-transform flex items-center justify-center overflow-hidden bg-surface-container ${mainImage === variant.image_url ? 'border-primary border-2' : 'border-outline-variant/30'}`}
                      onClick={() => setMainImage(variant.image_url)}
                    >
                      <img src={variant.image_url} alt={variant.name} className="w-full h-full object-cover" />
                    </div>
                  )
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="space-y-8">
            <div>
              <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-2">{productName}</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">{productDesc}</p>
              <div className="w-32 h-[3px] bg-primary mt-4"></div>
            </div>

            {/* Pricing */}
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant flex flex-col sm:flex-row gap-8 items-center">
              <div className="text-center sm:text-left">
                <p className="text-on-surface-variant font-label-sm uppercase tracking-wider mb-1">{isHi ? 'किराया' : 'Rent'} / {isHi ? 'Rent' : 'किराया'}</p>
                <p className="text-primary font-bold text-headline-md">₹{product.price_min} <span className="text-body-md font-normal">/ {product.price_unit || 'item'} / day</span></p>
              </div>
              <div className="hidden sm:block w-[1px] h-12 bg-outline-variant"></div>
              <div className="text-center sm:text-left">
                <p className="text-on-surface-variant font-label-sm uppercase tracking-wider mb-1">{isHi ? 'बिक्री' : 'Sale'} / {isHi ? 'Sale' : 'बिक्री'}</p>
                <p className="text-secondary font-bold text-headline-md">₹{(product.price_max || product.price_min).toLocaleString('en-IN')} <span className="text-body-md font-normal">/ {product.price_unit || 'item'}</span></p>
              </div>
            </div>

            {/* Configurator */}
            <div className="space-y-6">
              {/* Quantity */}
              <div>
                <label className="block text-on-surface-variant font-label-sm mb-2">{isHi ? 'मात्रा / Quantity' : 'Quantity / मात्रा'}</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center text-xl font-bold hover:bg-primary/10 transition-colors cursor-pointer active:scale-90"
                  >−</button>
                  <input
                    className="w-24 bg-surface-container-high border-outline-variant focus:border-saffron-orange rounded-lg px-4 py-3 text-body-lg text-center font-bold"
                    min="1"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center text-xl font-bold hover:bg-primary/10 transition-colors cursor-pointer active:scale-90"
                  >+</button>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-on-surface-variant font-label-sm mb-3">{isHi ? 'अवधि / Duration' : 'Duration / अवधि'}</label>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map((opt, idx) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => { setSelectedDuration(idx); setIsCustom(false); }}
                      className={`px-4 py-2 rounded-full border font-label-sm transition-all cursor-pointer active:scale-95 ${
                        !isCustom && selectedDuration === idx
                          ? 'border-rental-blue bg-rental-blue text-white shadow-md'
                          : 'border-outline-variant hover:border-rental-blue'
                      }`}
                    >{opt.label}</button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsCustom(true)}
                    className={`px-4 py-2 rounded-full border font-label-sm transition-all cursor-pointer active:scale-95 ${
                      isCustom
                        ? 'border-rental-blue bg-rental-blue text-white shadow-md'
                        : 'border-outline-variant hover:border-rental-blue'
                    }`}
                  >{isHi ? 'कस्टम' : 'Custom'}</button>
                </div>
                {isCustom && (
                  <input
                    type="number"
                    min="1"
                    placeholder={isHi ? 'दिनों की संख्या लिखें' : 'Enter number of days'}
                    value={customDays}
                    onChange={(e) => setCustomDays(e.target.value)}
                    className="mt-3 w-full bg-surface-container-high border-outline-variant focus:border-saffron-orange rounded-lg px-4 py-3 text-body-lg"
                  />
                )}
              </div>

              {/* Rent Calculator */}
              <div className="bg-surface-dim p-4 rounded-xl space-y-2 border border-outline">
                <div className="flex justify-between text-on-surface-variant font-label-sm">
                  <span>{isHi ? 'किराया गणना:' : 'Rent Calculation:'}</span>
                  <span>{quantity} Qty × {days} {days === 1 ? 'Day' : 'Days'} × ₹{product.rentPriceRaw} Rate</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-outline-variant">
                  <span className="font-bold text-on-surface">{isHi ? 'अनुमानित किराया:' : 'Est. Rent Cost:'}</span>
                  <span className="text-rental-blue font-bold text-headline-md">₹{rentTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Sale Calculator */}
              <div className="bg-surface-dim p-4 rounded-xl space-y-2 border border-outline">
                <div className="flex justify-between text-on-surface-variant font-label-sm">
                  <span>{isHi ? 'खरीद गणना:' : 'Sale Calculation:'}</span>
                  <span>{quantity} Qty × ₹{product.salePriceRaw.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-outline-variant">
                  <span className="font-bold text-on-surface">{isHi ? 'अनुमानित खरीद मूल्य:' : 'Est. Sale Cost:'}</span>
                  <span className="text-saffron-orange font-bold text-headline-md">₹{saleTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleRentEnquiry}
                className="w-full bg-rental-blue text-white py-4 rounded-xl font-bold text-body-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isHi ? 'किराया पूछताछ' : 'Rent Enquiry'} / {isHi ? 'Rent Enquiry' : 'किराया पूछें'}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button
                type="button"
                onClick={handleBuyEnquiry}
                className="w-full bg-dark-brown text-white py-4 rounded-xl font-bold text-body-lg hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
              >
                {isHi ? 'खरीद पूछताछ' : 'Buy Enquiry'} / {isHi ? 'Buy Enquiry' : 'खरीदें'}
              </button>
            </div>

            {/* Delivery Note */}
            <div className="flex gap-3 items-start p-4 bg-surface-container-highest rounded-lg border border-outline-variant">
              <span className="material-symbols-outlined text-primary">local_shipping</span>
              <p className="text-on-surface-variant text-body-md">
                {isHi
                  ? 'स्थानीय क्षेत्र में 24 घंटे में शीघ्र डिलीवरी। लोडिंग और अनलोडिंग शुल्क साइट की स्थिति के अनुसार अतिरिक्त।'
                  : 'Prompt delivery within 24 hours in local area. Loading and unloading charges extra as per site conditions.'}
              </p>
            </div>
          </div>
        </div>

        {/* Related Items */}
        <section className="mt-20 mb-20">
          <div className="flex justify-between items-end mb-8">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              {isHi ? 'संबंधित सामग्री / Related Items' : 'Related Items / संबंधित सामग्री'}
            </h2>
            <Link to="/shuttering" className="text-primary font-bold hover:underline flex items-center gap-1">
              {isHi ? 'सभी देखें' : 'View All'} <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(rp => {
              const rpName = isHi ? (rp.name_hi || rp.name_en) : rp.name_en;
              const rpImage = rp.images && rp.images[0];
              return (
                <Link key={rp.id} to={`/shuttering/${rp.id}`} className="bg-surface-container-low rounded-xl border border-outline-variant overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-[4/3] overflow-hidden">
                    {rpImage ? (
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={rpName} src={rpImage} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface-container">
                        <span className="material-symbols-outlined text-4xl text-outline-variant">image_not_supported</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="font-bold text-on-surface">{rpName}</p>
                    <p className="text-primary font-bold">₹{rp.price_min} / {rp.price_unit || 'item'}</p>
                    <div className="w-full mt-2 border border-primary text-primary py-2 rounded-lg font-bold text-label-sm uppercase text-center hover:bg-primary hover:text-white transition-colors">
                      {isHi ? 'विवरण' : 'Details'}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
