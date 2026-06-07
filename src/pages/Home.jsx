import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TRANSLATIONS = {
  hi: {
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
    prodCat: 'Product Categories',
    prodCatDesc: 'Explore our diverse range of interlocking solutions designed for heavy-duty traffic and elegant landscapes.',
    viewCatalog: 'View Full Catalog',
    heavyDuty: 'Heavy Duty',
    indPaver: 'Industrial Pavers',
    indPaverDesc: 'Built for high-traffic environments like warehouses, fuel stations, and public plazas.',
    landscape: 'Landscape',
    resPaver: 'Residential Garden Blocks',
    resPaverDesc: 'Aesthetic designs that transform pathways, patios, and gardens into elegant spaces.',
    infrastructure: 'Infrastructure',
    curbTitle: 'Curbing & Edging',
    curbDesc: 'Precision-engineered curb stones for road projects and large-scale urban development.',
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
  const t = TRANSLATIONS[language];

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
      const response = await fetch('./api/submit_order.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: formData.name,
          phone: formData.phone,
          city: 'Custom Quote Request',
          product_type: 'Quote',
          quantity: 0,
          address: 'Main Plaza/Plaza Request',
          special_req: formData.requirements
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
        setStatusMsg(t.successMsg);
        setFormData({ name: '', phone: '', requirements: '' });
      } else {
        setIsSuccess(false);
        setStatusMsg(result.message || (language === 'hi' ? 'अनुरोध भेजने में त्रुटि हुई।' : 'Error submitting request.'));
      }
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setStatusMsg(t.connErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="pt-16">
      {/* Hero Section */}
      <section class="relative h-screen min-h-[700px] flex items-center">
        <div class="absolute inset-0 z-0 overflow-hidden">
          <div 
            class="w-full h-full bg-cover bg-center transition-transform duration-[10s] hover:scale-110" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA4UvKpZAgFtgLCB012KLeBooZrJis4RmGGwhmVzTHXve1qXgNGQe4LDjHrry12YtW8lYkzSnVz1gjKdMygq64d1DlrZYMma1KERu50rMgkhcgSddkHo2Pa0rpoICuDI4EjiOOSlRo-exXrKU1DobKGyR0B_yjvUtQ60Zrufwco7qwQE8PYhR5u1T72T7-gDA0R-b_1oVG1y9K6_hozs1DJJG0wodbAHYvv49Wjhxsc7NqOjPtROtYr-voMbtZDZKrAtJ-C-wh6dPs')" }}
          ></div>
          <div class="absolute inset-0 hero-gradient"></div>
        </div>
        <div class="relative z-10 max-w-container-max mx-auto px-gutter w-full">
          <div class="max-w-2xl text-white select-none">
            <h1 class="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg mb-4 leading-tight">
              {t.heroTitle}<br/>
              <span class="text-primary-fixed">{language === 'hi' ? 'निर्माण में विश्वास' : 'Trusted in Construction'}</span>
            </h1>
            <p class="font-headline-md text-headline-md mb-10 text-surface-variant opacity-90">
              {t.heroSub}
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/order" 
                class="flex items-center justify-center gap-2 bg-primary text-on-primary px-8 py-4 font-bold text-lg rounded-lg hover:bg-primary-container transition-all group"
              >
                {t.orderNow}
                <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <Link 
                to="/products" 
                class="flex items-center justify-center gap-2 border-2 border-white/40 text-white backdrop-blur-sm px-8 py-4 font-bold text-lg rounded-lg hover:bg-white/10 transition-all"
              >
                {t.viewProducts}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="services" class="py-24 px-gutter max-w-container-max mx-auto scroll-mt-16">
        <div class="text-center mb-16 select-none">
          <span class="inline-block px-4 py-1 bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm rounded-full mb-4">{t.whyChoose}</span>
          <h2 class="font-display-lg text-headline-md md:text-display-lg text-on-surface">{t.excellenceFeatures}</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter">
          {/* Manufacturing */}
          <div class="bg-surface-container border border-outline-variant p-card-padding rounded-xl hover:shadow-lg transition-all group">
            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
              <span class="material-symbols-outlined text-3xl">precision_manufacturing</span>
            </div>
            <h3 class="font-headline-md text-headline-md mb-3 font-semibold">{t.mfgTitle}</h3>
            <p class="text-on-surface-variant leading-relaxed">{t.mfgDesc}</p>
          </div>
          {/* Fast Delivery */}
          <div class="bg-surface-container border border-outline-variant p-card-padding rounded-xl hover:shadow-lg transition-all group">
            <div class="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6 text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-all">
              <span class="material-symbols-outlined text-3xl">local_shipping</span>
            </div>
            <h3 class="font-headline-md text-headline-md mb-3 font-semibold">{t.deliveryTitle}</h3>
            <p class="text-on-surface-variant leading-relaxed">{t.deliveryDesc}</p>
          </div>
          {/* Quality Materials */}
          <div class="bg-surface-container border border-outline-variant p-card-padding rounded-xl hover:shadow-lg transition-all group">
            <div class="w-12 h-12 bg-tertiary/10 rounded-lg flex items-center justify-center mb-6 text-tertiary group-hover:bg-tertiary group-hover:text-on-tertiary transition-all">
              <span class="material-symbols-outlined text-3xl">verified</span>
            </div>
            <h3 class="font-headline-md text-headline-md mb-3 font-semibold">{t.materialsTitle}</h3>
            <p class="text-on-surface-variant leading-relaxed">{t.materialsDesc}</p>
          </div>
          {/* Custom Orders */}
          <div class="bg-surface-container border border-outline-variant p-card-padding rounded-xl hover:shadow-lg transition-all group">
            <div class="w-12 h-12 bg-primary-fixed-dim/20 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:bg-primary-fixed-dim group-hover:text-on-surface transition-all">
              <span class="material-symbols-outlined text-3xl">dashboard_customize</span>
            </div>
            <h3 class="font-headline-md text-headline-md mb-3 font-semibold">{t.customTitle}</h3>
            <p class="text-on-surface-variant leading-relaxed">{t.customDesc}</p>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section id="about" class="bg-surface-container-high py-24 px-gutter overflow-hidden scroll-mt-16">
        <div class="max-w-container-max mx-auto">
          <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 select-none">
            <div class="max-w-xl">
              <h2 class="font-display-lg text-headline-md md:text-display-lg text-on-surface mb-4">{t.prodCat}</h2>
              <p class="text-on-surface-variant font-body-lg text-body-lg leading-relaxed">{t.prodCatDesc}</p>
            </div>
            <Link 
              to="/products"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              class="bg-primary text-white px-6 py-3 font-bold rounded-lg hover:bg-primary-container transition-all"
            >
              {t.viewCatalog}
            </Link>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Heavy Duty */}
            <div class="group relative overflow-hidden rounded-xl bg-surface h-[450px]">
              <div 
                class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 animate-fade-in" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBZmy34ZxrWxYR9KgModsTk6HDf0pQaik2FLZ1VWGUt5tVLg1CzcA-RuhQUUccK7elkToQBigm_LZtb8rMyP0nEkEh9nFv3FCYG9sWI8BjQw9LJQ2ahZ6qeNmjy7Z8n5dkKqudmN1tb26JVtQYNx8f65Iy2ZPT2NjFWiPO8ccgJfFnLXE9O1C4V1tKNQDF_87_-L-FYjybuxlgs_e7lfbCO6SJpgLDywzo475RRhFBhEnzaYe7T4aaPEemuOB-CR6rcgYioJ35CeiI')" }}
              ></div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div class="absolute bottom-0 p-8 w-full">
                <span class="inline-block px-3 py-1 bg-secondary text-on-secondary font-label-sm text-label-sm rounded-full mb-4">{t.heavyDuty}</span>
                <h3 class="text-white font-headline-md text-headline-md mb-4 font-semibold">{t.indPaver}</h3>
                <p class="text-surface-variant mb-6 line-clamp-2 leading-relaxed">{t.indPaverDesc}</p>
                <Link to="/products" class="text-primary-fixed font-bold flex items-center gap-2 hover:underline">{t.getQuote} <span class="material-symbols-outlined">chevron_right</span></Link>
              </div>
            </div>
            {/* Landscape */}
            <div class="group relative overflow-hidden rounded-xl bg-surface h-[450px]">
              <div 
                class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 animate-fade-in" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPbIV8DyGEp5i4NGEf-F0ZclgmDQ9-oXuxDYmdCVJDtlbEj_cdVF8PN4JnONxvpETJkT6wwsNq4l6QvyBKW1g8nPHwtuFj4F_opdYdKDHO6m-xd7RTozpy4KDBqtOYYQH3u3s9WOpXi6Xdrsm2ahew8X_UtFc6vxunMT6eWjvQ-Br9lj28PCNK9rO7D0QJdXbq5QMmpwj18d8c3pRb3SQ3mmh-tNTFC9WDB32PbWPQpvFxEKovdudtv_SCsspsqnurGHMu_ODqEss')" }}
              ></div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div class="absolute bottom-0 p-8 w-full">
                <span class="inline-block px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm rounded-full mb-4">{t.landscape}</span>
                <h3 class="text-white font-headline-md text-headline-md mb-4 font-semibold">{t.resPaver}</h3>
                <p class="text-surface-variant mb-6 line-clamp-2 leading-relaxed">{t.resPaverDesc}</p>
                <Link to="/products" class="text-primary-fixed font-bold flex items-center gap-2 hover:underline">{t.getQuote} <span class="material-symbols-outlined">chevron_right</span></Link>
              </div>
            </div>
            {/* Curbing */}
            <div class="group relative overflow-hidden rounded-xl bg-surface h-[450px]">
              <div 
                class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 animate-fade-in" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBm-_Dret8fLucXjLgX0mh9T0kk2Ysh4gfB2nKcPJNmuyZi14Ztz8CpVkrM9tzmkjIYWHISW87fSvTkUSmnFWUru2tOJZUmj_9VgjblawX4F9UAzDFPOh4nQ4vMAibm6JnhuQCrxmHrRP-cgyajUH8p3U3x3AUQ7M3yn2-qScLEJLPFDcYUeYy6T4DCZ8Aa-kHykJcB62Gtc0hOx_QGsT-wQGPtkhnXq0fawFtWjBw4CHZIQ79TVPDChLTjRKYwVl6VNnOAt0UuPSc')" }}
              ></div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div class="absolute bottom-0 p-8 w-full">
                <span class="inline-block px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm rounded-full mb-4">{t.infrastructure}</span>
                <h3 class="text-white font-headline-md text-headline-md mb-4 font-semibold">{t.curbTitle}</h3>
                <p class="text-surface-variant mb-6 line-clamp-2 leading-relaxed">{t.curbDesc}</p>
                <Link to="/products" class="text-primary-fixed font-bold flex items-center gap-2 hover:underline">{t.getQuote} <span class="material-symbols-outlined">chevron_right</span></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials & Custom Quote */}
      <section id="process" class="py-24 px-gutter max-w-container-max mx-auto scroll-mt-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Testimonials */}
          <div>
            <h2 class="font-display-lg text-headline-md md:text-display-lg text-on-surface mb-8 select-none">{t.testimonials}</h2>
            <div class="space-y-8">
              <div class="p-8 bg-surface-container rounded-xl relative border-l-4 border-primary shadow-sm">
                <span class="material-symbols-outlined absolute top-4 right-4 text-primary/20 text-6xl select-none">format_quote</span>
                <p class="font-body-lg text-body-lg text-on-surface mb-4 italic leading-relaxed">
                  {t.quoteText}
                </p>
                <div class="flex items-center gap-4 select-none">
                  <div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-primary">RK</div>
                  <div>
                    <p class="font-bold text-on-surface">{t.director}</p>
                    <p class="text-on-surface-variant text-sm">{t.designation}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Quote Form */}
          <div class="bg-inverse-surface text-inverse-on-surface p-10 rounded-2xl shadow-2xl border border-surface-variant/10">
            <h3 class="font-headline-md text-headline-md mb-2 font-semibold text-white">{t.customQuote}</h3>
            <p class="text-surface-variant mb-8 leading-relaxed">{t.quoteFormDesc}</p>
            
            {statusMsg && (
              <div class={`p-4 rounded-lg mb-6 text-sm font-medium ${isSuccess ? 'bg-secondary/20 text-secondary-fixed-dim border border-secondary/30' : 'bg-error-container text-on-error-container border border-error/30'}`}>
                {statusMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-2 text-surface-variant">{t.nameLabel} <span class="text-primary">*</span></label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    class="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                    type="text"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2 text-surface-variant">{t.phoneLabel} <span class="text-primary">*</span></label>
                  <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    class="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                    type="tel"
                    required
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 text-surface-variant">{t.reqLabel}</label>
                <textarea 
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  class="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                  rows="4"
                  placeholder={t.reqPlaceholder}
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={loading}
                class="w-full bg-primary text-on-primary py-4 rounded-lg font-bold hover:bg-primary-container transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                {loading ? t.submitting : (language === 'hi' ? 'अनुरोध भेजें' : 'Submit Request')}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
