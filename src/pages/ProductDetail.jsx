import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAllProducts } from '../services/productService';
import { createInquiry } from '../services/inquiryService';
import SEOHead from '../components/SEO/SEOHead';
import { getBreadcrumbSchema, getProductSchema } from '../components/SEO/schemas';

const CATALOG = {
  zigzag: {
    id: 'zigzag',
    nameEn: 'Zigzag Interlocking Paver Block',
    nameHi: 'जिगजैग इंटरलॉकिंग पेवर ब्लॉक',
    price: '₹18 – ₹22',
    unit: 'piece',
    moq: 100,
    descEn: 'Engineered for high-traffic environments, our Zigzag Paver Blocks offer superior interlocking strength. Perfect for heavy-duty driveways, commercial parking lots, and industrial flooring. Available in multiple thickness variants to suit your project requirements.',
    descHi: 'उच्च-यातायात वातावरण के लिए इंजीनियर, हमारे जिगजैग पेवर ब्लॉक बेहतर इंटरलॉकिंग ताकत प्रदान करते हैं। भारी-शुल्क वाले ड्राइववे, वाणिज्यिक पार्किंग स्थल और औद्योगिक फर्श के लिए बिल्कुल सही। आपकी परियोजना की आवश्यकताओं के अनुरूप कई मोटाई वेरिएंट में उपलब्ध है।',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDA-SM7Qe-nP_Tkzlsjs6Sp4wXka5GxYLj2Znx1fbMS8bzC36BXGiV0ez7X-CR0hX3UlQ7We4WZERCP00VlPnmqpEhy58pLMJ2DBrlPb9JJqOrEbmKDcLWv30QhAzBiBHjuGzNEguwp5c3L7rdkOmbwS3sKn_B0MxuLRevVACZyj53PcMMn1AjVx80_O2gi9Q5qMOO1k_yAM2lUNf3rcgBKF2qtpOMkacX-jD0WSE9EbxhxqfVNSXJ6SM5LtDqBtjA3REeL62JvKck',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDRuyNlvtrFJ-OI3ElkV7-93gjae9EFnOiCWy0vn0PKMsVYVP9Zh2KYlylhLbhchBwFnIcOy4bjcoERvZ1qpu8eljZqE2FhuRmlA8urEuJe2BMXkteS-UJfBvm_1ePmf5G3b6p9L3iN4MLKLNVRIz3pa2xm_Mzffa3jqgKBOHWjAc6qp25c90gnq5bAOM7tZZHcZ5WgZ8pHV17v5veCi1TYSqqbWCtaWJ8MSuDS0Fyf03vNZwRf6QPRSiLgU6uLWwXwvPMcjC9YX5k',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuALpIednIInVIDNGfkt8UnvoKRQofCymxT5zePd5N9ICK9NKxuds7n95VFtsX9D7JcZlSUsFhxaCOa0Y8BxI1MHX4w5jiBdDZkauYYANRy2vCc3DEp2n1-WhZDcLxGQXGYcTbKPVBv8wNxkewz_HYQ2ONN9SK3QPdRDWggSCFmIsSDyFlgNlubfilRjphQgbmPkKYxWF0z6CrPfNeiFPhDpVkfX8GROo48g_pmad-XftZEloqPFcmhtQC7LfWvnQed9ULJmyq5JUUw'
    ],
    specs: {
      thickness: '80mm / 60mm',
      weight: '3.5kg Approx.',
      strength: 'M30 to M50 Grade',
      color: 'Grey, Red, Yellow, Lacquer Finish',
      application: 'Driveways, Petrol Pumps, Walkways, Industrial Yards',
      material: 'High-strength Concrete with Fly Ash Aggregates'
    }
  },
  'i-shape': {
    id: 'i-shape',
    nameEn: 'I-Shape Interlocking Paver',
    nameHi: 'आई-शेप पेवर ब्लॉक',
    price: '₹16 – ₹18',
    unit: 'piece',
    moq: 100,
    descEn: 'Traditional and extremely popular, our I-Shape Paver Blocks provide exceptional stability and interlocking properties for public walkways, community parks, and residential paths.',
    descHi: 'पारंपरिक और अत्यंत लोकप्रिय, हमारे आई-शेप पेवर ब्लॉक सार्वजनिक रास्तों, सामुदायिक पार्कों और आवासीय मार्गों के लिए असाधारण स्थिरता और इंटरलॉकिंग गुण प्रदान करते हैं।',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDV8Oh3FHQu_59sQPs19BgEkuFdqsh6T7mWg9sygIZ2QOPwffQWIXL2XPPfexCcrOo6V7q1eS6Aiuf7r4qBN7HUcdAlHJARgBln1f8zZ3sHINZY_VDJqMX9uNtEic9qURhzQkH5a1W1THZu6qkfi7Su_MNSzmjGnO1ids1w_Esw-I4Ghk7lyfaKc1ZPYtWbC1R8rUJXjAkmgV2GIZdVrkeFRrKBaypKyHNpPVQX-_nlyoLeBfuy0i_ZGHLa8Cu3VhjSwIJR_p_YJtU',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDRuyNlvtrFJ-OI3ElkV7-93gjae9EFnOiCWy0vn0PKMsVYVP9Zh2KYlylhLbhchBwFnIcOy4bjcoERvZ1qpu8eljZqE2FhuRmlA8urEuJe2BMXkteS-UJfBvm_1ePmf5G3b6p9L3iN4MLKLNVRIz3pa2xm_Mzffa3jqgKBOHWjAc6qp25c90gnq5bAOM7tZZHcZ5WgZ8pHV17v5veCi1TYSqqbWCtaWJ8MSuDS0Fyf03vNZwRf6QPRSiLgU6uLWwXwvPMcjC9YX5k'
    ],
    specs: {
      thickness: '60mm / 50mm',
      weight: '3.0kg Approx.',
      strength: 'M30 Grade',
      color: 'Grey, Red, Yellow',
      application: 'Pedestrian Walkways, Residential Patios, Garden Paths',
      material: 'Vibrated Concrete with Cement Aggregates'
    }
  },
  square: {
    id: 'square',
    nameEn: 'Square Concrete Paver',
    nameHi: 'स्क्वायर कंक्रीट पेवर',
    price: '₹14 – ₹16',
    unit: 'piece',
    moq: 150,
    descEn: 'Modern square concrete paver blocks with a smooth finish, ideal for creating modular and clean pathway configurations in patios, plazas, and commercial walkways.',
    descHi: 'एक चिकनी फिनिश के साथ आधुनिक वर्गाकार कंक्रीट पेवर ब्लॉक, आंगन, प्लाजा और व्यावसायिक रास्तों में मॉड्यूलर और स्वच्छ मार्ग कॉन्फ़िगरेशन बनाने के लिए आदर्श।',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBzUC1TkV1EhOuTk0f0OfpaKtQpaIKCrZEf-uvF2IgIy8yKCpv9pw1Af9lOMAvRfxgKthQ_W_pmF8LEX1mHPQfFCQT6ox_eP5lBbMCQuK7tMU2R_B-LRDnFrNlBecB_pVVtN1pUqWoBc1iofQ5FGqoQCsvJZhOI45R-FFZGP26nXu1JuLje0M5EUgJZEVSGpRxWZurfd4oOSXRko2GSOVaQFQOioPm827EQLdFht-w8GjI5fyfvj_-piESOw1T2shS4TekURwinCl8'
    ],
    specs: {
      thickness: '50mm / 40mm',
      weight: '2.5kg Approx.',
      strength: 'M25 Grade',
      color: 'Grey, Saffron Red, Lacquer Finish',
      application: 'Home Patios, Swimming Pool Decks, Courtyards',
      material: 'Standard Concrete Mix'
    }
  },
  hexagon: {
    id: 'hexagon',
    nameEn: 'Hexagon Interlocking Block',
    nameHi: 'हेक्सागन इंटरलॉकिंग',
    price: '₹22 – ₹24',
    unit: 'piece',
    moq: 100,
    descEn: 'Aesthetically striking hexagonal shape that creates strong interlocking connections. Perfect for adding a premium look to public parks, town plazas, and upscale residential entryways.',
    descHi: 'सौंदर्यपूर्ण रूप से आकर्षक षट्कोणीय आकार जो मजबूत इंटरलॉकिंग कनेक्शन बनाता है। सार्वजनिक पार्कों, टाउन प्लाजा और लक्जरी आवासीय प्रवेश द्वारों में एक प्रीमियम लुक जोड़ने के लिए बिल्कुल सही।',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAZcRcrg99DWT9x3YEMTf78exTFG6UpkQFSW7os4Uc-z3D2JtZQZl8MFK_E8NxU0nSTAATQU3NtCrs5u-iYuJu5PnOub2EeqX20zaNeysePtf1K_iqPxWaCvrmlu4EUbDMPeHBKYuGw4CUOTfnNBh9gN1e0fqkHaDcf9OaK7zy6bpMjEFZgL4kQpJsqTFjjj12Z_UF9rsm-SDH4oowVWO9J4824MbW0k7IxWo0-6S8BFJRBMejyJ1PkNzGaHA1sZ3-96hMK8J-WRwc'
    ],
    specs: {
      thickness: '80mm / 60mm',
      weight: '4.2kg Approx.',
      strength: 'M35 to M40 Grade',
      color: 'Grey, Yellow, Saffron Red, Dual-tone',
      application: 'Public Plazas, Commercial Parking, Sidewalks, Residential Entrances',
      material: 'High-density Vibrated Concrete'
    }
  },
  'grass-paver': {
    id: 'grass-paver',
    nameEn: 'Concrete Grass Paver Grid',
    nameHi: 'कंक्रीट ग्रास पेवर',
    price: '₹28 – ₹32',
    unit: 'piece',
    moq: 50,
    descEn: 'Eco-friendly paver design with a grid pattern that allows vegetation and grass to grow through. Provides heavy-duty load bearable parking space while promoting water absorption and green landscape aesthetics.',
    descHi: 'ग्रिड पैटर्न के साथ पर्यावरण-अनुकूल पेवर डिज़ाइन जो वनस्पति और घास को बढ़ने की अनुमति देता है। जल अवशोषण और हरी भूदृश्य सौंदर्य को बढ़ावा देते हुए भारी-शुल्क भार वहन करने योग्य पार्किंग स्थान प्रदान करता है।',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAukiBbEmHfz7kFRaRj8yEP9NkvVIwASnLezepdpn_6saMtSTE72NxCQpQj33ILrXdhbl9BAq8BuQ25fp7CFCVJJJUiqs5aWXQGkE0lTniD5ebuc7CkPr8Xp4GC72LWq0VY_55StIGiudyQxHk_nUb0qdIIMzpSVDknw_4WcK7742h5n2FGArsho1VIaljdtOXkGgUGwG6NRug3wmAgxEuvxsrXIeQy-Ss9xE0eaBl18NkZ4d4YJ_Th1CQWyXTN9mqBYruBDeUCI0s'
    ],
    specs: {
      thickness: '80mm / 100mm',
      weight: '8.5kg Approx.',
      strength: 'M35 Grade',
      color: 'Standard Grey',
      application: 'Permeable Parking Lots, Green Driveways, Drainage Zones',
      material: 'Reinforced Concrete Grid Matrix'
    }
  }
};

const TRANSLATIONS = {
  hi: {
    inStock: 'स्टॉक में उपलब्ध',
    minOrder: 'न्यूनतम ऑर्डर',
    qty: 'मात्रा (पीस)',
    getQuote: 'कोटेशन लें',
    whatsappOrder: 'व्हाट्सएप ऑर्डर',
    fastDelivery: 'पूरे भारत के सभी प्रमुख शहरों में तेजी से डिलीवरी उपलब्ध है।',
    specsTitle: 'विशिष्टताएं / Specifications',
    sizeLabel: 'साइज (मोटाई)',
    weightLabel: 'वजन',
    strengthLabel: 'मजबूती (कंप्रेसिव स्ट्रेंथ)',
    colorLabel: 'रंग',
    appLabel: 'उपयोग (Application)',
    matLabel: 'सामग्री (Material)',
    relatedTitle: 'संबंधित उत्पाद / Related Products',
    quickQuoteTitle: 'त्वरित कोटेशन / Quick Quote',
    quickQuoteSub: 'अपनी थोक परियोजना आवश्यकताओं के लिए एक अनुकूलित अनुमान प्राप्त करें।',
    fullName: 'पूरा नाम',
    phone: 'फोन नंबर',
    selectedProd: 'चयनित उत्पाद',
    city: 'आपका शहर',
    submitInquiry: 'पूछताछ भेजें / Submit Inquiry',
    valErr: 'कृपया नाम और फोन नंबर सही से भरें।',
    successMsg: 'पूछताछ सफलतापूर्वक भेजी गई! हम जल्द ही संपर्क करेंगे।',
    connErr: 'सर्वर त्रुटि। कृपया पुनः प्रयास करें।'
  },
  en: {
    inStock: 'In Stock',
    minOrder: 'Minimum Order',
    qty: 'Qty. (Pieces)',
    getQuote: 'Get Quote',
    whatsappOrder: 'WhatsApp Order',
    fastDelivery: 'Fast delivery available across all major cities in India.',
    specsTitle: 'Specifications',
    sizeLabel: 'Size (Thickness)',
    weightLabel: 'Weight',
    strengthLabel: 'Compressive Strength',
    colorLabel: 'Color',
    appLabel: 'Application',
    matLabel: 'Material',
    relatedTitle: 'Related Products',
    quickQuoteTitle: 'Quick Quote',
    quickQuoteSub: 'Get a customized estimate for your bulk project requirements.',
    fullName: 'Full Name',
    phone: 'Phone Number',
    selectedProd: 'Selected Product',
    city: 'Your City',
    submitInquiry: 'Submit Inquiry',
    valErr: 'Please enter a valid name and phone number.',
    successMsg: 'Inquiry submitted successfully! We will contact you soon.',
    connErr: 'Server error. Please try again.'
  }
};

export default function ProductDetail({ language }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];

  const [liveProduct, setLiveProduct] = useState(null);

  // Sync state when URL parameter changes
  useEffect(() => {
    const fetchLiveProduct = async () => {
      try {
        const data = await getAllProducts();
        if (data) {
          const found = data.find(p => String(p.id) === id);
          if (found) {
            // Read specifications jsonb — admin saves specs inside this field
            const specs = found.specifications || {};
            setLiveProduct({
              id: found.id,
              nameEn: found.name_en,
              nameHi: found.name_hi || found.name_en,
              price: found.price_min && found.price_max
                ? found.price_min === found.price_max
                  ? `₹${found.price_min}`
                  : `₹${found.price_min} – ₹${found.price_max}`
                : found.price_min ? `₹${found.price_min}` : '—',
              unit: found.price_unit || 'piece',
              moq: 100,
              descEn: found.description_en || '',
              descHi: found.description_hi || found.description_en || '',
              // images[] array from DB
              images: found.images && found.images.length > 0
                ? found.images
                : [],
              specs: {
                thickness: specs.thickness || '—',
                weight: specs.weight || '—',
                strength: specs.strength || '—',
                color: specs.color || '—',
                application: specs.application || '—',
                material: specs.material || '—',
              }
            });
          } else {
            setLiveProduct(null);
          }
        }
      } catch (err) {
        console.error("Error fetching live product detail:", err);
        setLiveProduct(null);
      }
    };
    fetchLiveProduct();
  }, [id]);

  const productKey = id && CATALOG[id] ? id : 'zigzag';
  const product = liveProduct || CATALOG[productKey];

  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [formData, setFormData] = useState({ name: '', phone: '', city: '' });
  const [statusMsg, setStatusMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImage(product.images ? product.images[0] : '');
      setQuantity(product.moq || 100);
    }
    setStatusMsg('');
  }, [product]);

  const handleQtyChange = (val) => {
    setQuantity(prev => {
      const newQty = prev + val;
      return newQty >= product.moq ? newQty : product.moq;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setStatusMsg(t.valErr);
      setIsSuccess(false);
      return;
    }
    
    setLoading(true);
    setStatusMsg('');

    try {
      // Send inquiry
      await createInquiry({
        customer_name: formData.name,
        customer_phone: formData.phone,
        city: formData.city || 'Inquiry',
        source: 'contact_form',
        subject: `Quick quote inquiry for ${product.nameEn} (Qty: ${quantity})`,
        message: `Product: ${product.nameEn}\nQuantity: ${quantity}\nCity: ${formData.city}`
      });

      setIsSuccess(true);
      setStatusMsg(t.successMsg);
      setFormData({ name: '', phone: '', city: '' });
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setStatusMsg(t.connErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 bg-surface text-on-surface">
      <SEOHead
        title={`${language === 'hi' ? product.nameHi : product.nameEn} - Swastika Interlocking Deesa Gujarat`}
        description={`Buy ${product.nameEn} from Swastika Interlocking, Deesa, Gujarat. ${language === 'hi' ? product.descHi : product.descEn} Price: ${product.price}/${product.unit}. Min order: ${product.moq} pieces.`}
        keywords={`${product.nameEn} Deesa, ${product.nameEn} price Gujarat, buy ${product.nameEn} Banaskantha, interlocking paver blocks Gujarat`}
        url={`/products/${id}`}
        image={product.images?.[0] || ''}
        schema={[getProductSchema({ nameEn: product.nameEn, descEn: language === 'hi' ? product.descHi : product.descEn, images: product.images, priceMin: parseFloat((product.price || '0').replace(/[^0-9.]/g, '')) })]}
        breadcrumb={getBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Products', path: '/products' },
          { name: language === 'hi' ? product.nameHi : product.nameEn, path: `/products/${id}` },
        ])}
        language={language}
      />
      {/* Breadcrumb Navigation */}
      <section className="max-w-container-max mx-auto px-gutter py-6 select-none">
        <nav className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-bold">{language === 'hi' ? product.nameHi : product.nameEn}</span>
        </nav>
      </section>

      {/* Main product showcase */}
      <main className="max-w-container-max mx-auto px-gutter pb-20">
        <section className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-12 items-start mb-20">
          
          {/* Left panel: Image selector */}
          <div className="space-y-6">
            <div className="relative aspect-[4/3] w-full border border-outline/20 rounded-xl overflow-hidden bg-surface-container-low flex items-center justify-center shadow-inner">
              {activeImage ? (
                <img
                  alt={product.nameEn}
                  className="w-full h-full object-cover transition-all duration-300"
                  src={activeImage}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-gray-300">
                  <span className="material-symbols-outlined text-6xl">image_not_supported</span>
                  <span className="text-sm font-medium">No image available</span>
                </div>
              )}
            </div>
            {product.images && product.images.filter(Boolean).length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {product.images.filter(Boolean).map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-lg border overflow-hidden cursor-pointer transition-all ${
                      activeImage === img ? 'border-primary border-2 shadow-sm' : 'border-outline-variant hover:border-primary'
                    }`}
                  >
                    <img className="w-full h-full object-cover" src={img} alt={`${product.nameEn} thumbnail ${idx}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right panel: Details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold">
                <span className="material-symbols-outlined text-[16px] mr-1">check_circle</span> {t.inStock}
              </span>
              <h1 className="font-display-lg text-2xl md:text-3xl text-on-surface leading-tight font-bold">
                {language === 'hi' ? product.nameHi : product.nameEn}
              </h1>
              <p className="text-sm font-semibold text-on-surface-variant italic">
                {language === 'hi' ? product.nameEn : product.nameHi}
              </p>
            </div>
            
            <div className="p-6 bg-surface-container rounded-xl space-y-2 border border-outline/10">
              <p className="text-primary font-bold text-3xl">
                {product.price} <span className="text-sm font-normal text-on-surface-variant">/ {product.unit}</span>
              </p>
              <p className="text-xs text-outline font-semibold uppercase tracking-wider">
                {t.minOrder}: {product.moq} {product.unit}s
              </p>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed">
              {language === 'hi' ? product.descHi : product.descEn}
            </p>

            {/* Qty incrementer and CTAs */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden bg-white select-none">
                  <button 
                    onClick={() => handleQtyChange(-10)}
                    className="px-4 py-2 hover:bg-surface-container transition-colors text-primary font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-20 text-center font-bold">{quantity}</span>
                  <button 
                    onClick={() => handleQtyChange(10)}
                    className="px-4 py-2 hover:bg-surface-container transition-colors text-primary font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-on-surface-variant font-bold uppercase">{t.qty}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => document.getElementById('quick-quote-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex-1 bg-primary text-on-primary py-4 px-8 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-container shadow-md transition-all active:scale-[0.98] text-center cursor-pointer"
                >
                  {t.getQuote} <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <a 
                  href={`https://wa.me/918400936290?text=I%20am%20interested%20in%20ordering%20${quantity}%20pieces%20of%20${product.nameEn}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-[#25D366] text-white py-4 px-8 rounded-lg font-bold flex items-center justify-center gap-2 hover:brightness-105 shadow-md transition-all active:scale-[0.98] text-center"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span> {t.whatsappOrder}
                </a>
              </div>

              <div className="flex items-center gap-3 text-[#2E7D32] bg-[#E8F5E9]/50 p-3 rounded-lg border border-[#E8F5E9]/30">
                <span className="material-symbols-outlined">local_shipping</span>
                <p className="text-xs font-semibold">{t.fastDelivery}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Specifications table */}
        <section className="mb-20">
          <h2 className="font-display-lg text-xl text-primary mb-6 border-l-4 border-primary pl-4 font-bold uppercase tracking-wider">
            {t.specsTitle}
          </h2>
          <div className="overflow-hidden rounded-xl border border-surface-variant/50 shadow-sm max-w-4xl">
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="bg-[#FAF7F2]">
                  <th className="py-4 px-6 font-bold text-on-surface-variant text-sm w-1/3">{t.sizeLabel}</th>
                  <td className="py-4 px-6 text-on-surface text-sm">{product.specs.thickness}</td>
                </tr>
                <tr className="bg-[#F0EBE0]">
                  <th className="py-4 px-6 font-bold text-on-surface-variant text-sm">{t.weightLabel}</th>
                  <td className="py-4 px-6 text-on-surface text-sm">{product.specs.weight}</td>
                </tr>
                <tr className="bg-[#FAF7F2]">
                  <th className="py-4 px-6 font-bold text-on-surface-variant text-sm">{t.strengthLabel}</th>
                  <td className="py-4 px-6 text-on-surface text-sm">{product.specs.strength}</td>
                </tr>
                <tr className="bg-[#F0EBE0]">
                  <th className="py-4 px-6 font-bold text-on-surface-variant text-sm">{t.colorLabel}</th>
                  <td className="py-4 px-6 text-on-surface text-sm">{product.specs.color}</td>
                </tr>
                <tr className="bg-[#FAF7F2]">
                  <th className="py-4 px-6 font-bold text-on-surface-variant text-sm">{t.appLabel}</th>
                  <td className="py-4 px-6 text-on-surface text-sm">{product.specs.application}</td>
                </tr>
                <tr className="bg-[#F0EBE0]">
                  <th className="py-4 px-6 font-bold text-on-surface-variant text-sm">{t.matLabel}</th>
                  <td className="py-4 px-6 text-on-surface text-sm">{product.specs.material}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Related products */}
        <section className="mb-20">
          <h2 className="font-display-lg text-xl text-on-surface mb-8 font-bold">
            {t.relatedTitle}
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x scrollbar-thin">
            {Object.values(CATALOG)
              .filter(p => p.id !== productKey)
              .map((p, idx) => (
                <div 
                  key={idx}
                  className="min-w-[280px] snap-start bg-white rounded-xl shadow-md border border-surface-container-highest hover:shadow-xl transition-all group overflow-hidden"
                >
                  <div className="aspect-video bg-surface-container-low overflow-hidden">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      src={p.images[0]} 
                      alt={p.nameEn} 
                    />
                  </div>
                  <div className="p-5 space-y-3">
                    <div>
                      <p className="text-xs text-outline mb-1 font-bold uppercase">{p.id.toUpperCase()} Block</p>
                      <h3 className="font-bold text-sm text-on-surface leading-tight truncate">
                        {language === 'hi' ? p.nameHi : p.nameEn}
                      </h3>
                      <p className="text-xs text-on-surface-variant italic truncate">
                        {language === 'hi' ? p.nameEn : p.nameHi}
                      </p>
                    </div>
                    <p className="text-primary font-extrabold text-sm">{p.price} <span className="text-xs font-normal text-on-surface-variant">/ {p.unit}</span></p>
                    <button 
                      onClick={() => navigate(`/products/${p.id}`)}
                      className="w-full py-2 rounded-lg border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all text-xs cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Quick quote form */}
        <section id="quick-quote-section" className="bg-[#F0EBE0] rounded-2xl p-8 md:p-12 shadow-inner border border-outline-variant/30 scroll-mt-20">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="font-display-lg text-2xl text-on-surface mb-2 font-bold">{t.quickQuoteTitle}</h2>
              <p className="text-on-surface-variant font-medium text-sm">{t.quickQuoteSub}</p>
            </div>

            {statusMsg && (
              <div className={`p-4 rounded-lg text-sm font-medium ${isSuccess ? 'bg-secondary/20 text-[#2E7D32] border border-secondary/30' : 'bg-error-container text-on-error-container border border-error/30'}`}>
                {statusMsg}
              </div>
            )}

            <form onSubmit={handleInquirySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs text-outline font-bold ml-1">{t.fullName} *</label>
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-[#FAF7F2] border border-[#6B6860]/20 rounded-lg p-3 focus:ring-primary focus:border-primary outline-none transition-all text-sm" 
                  placeholder="Your Name" 
                  type="text"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-outline font-bold ml-1">{t.phone} *</label>
                <input 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-[#FAF7F2] border border-[#6B6860]/20 rounded-lg p-3 focus:ring-primary focus:border-primary outline-none transition-all text-sm" 
                  placeholder="+91 00000 00000" 
                  type="tel"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-outline font-bold ml-1">{t.selectedProd}</label>
                <input 
                  className="w-full bg-surface-container border border-[#6B6860]/20 rounded-lg p-3 text-on-surface-variant font-bold cursor-not-allowed text-sm outline-none" 
                  readOnly 
                  type="text" 
                  value={language === 'hi' ? product.nameHi : product.nameEn}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-outline font-bold ml-1">{t.qty}</label>
                <input 
                  className="w-full bg-surface-container border border-[#6B6860]/20 rounded-lg p-3 text-on-surface-variant font-bold cursor-not-allowed text-sm outline-none" 
                  readOnly 
                  type="number" 
                  value={quantity}
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs text-outline font-bold ml-1">{t.city}</label>
                <input 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-[#FAF7F2] border border-[#6B6860]/20 rounded-lg p-3 focus:ring-primary focus:border-primary outline-none transition-all text-sm" 
                  placeholder="Enter Delivery City" 
                  type="text"
                />
              </div>
              <div className="md:col-span-2 pt-4">
                <button 
                  disabled={loading}
                  className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-base shadow-md hover:bg-primary-container hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer" 
                  type="submit"
                >
                  {loading ? 'Submitting...' : t.submitInquiry}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
