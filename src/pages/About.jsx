import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEO/SEOHead';
import { getBreadcrumbSchema } from '../components/SEO/schemas';

const TRANSLATIONS = {
  hi: {
    title: 'हमारे बारे में',
    subtitle: 'Girdharpur Uncher, Kauriram, Uttar Pradesh का विश्वसनीय निर्माण साथी',
    ourStory: 'हमारी कहानी',
    ourStoryTitle: 'हमारी कहानी',
    storyText1: 'स्वस्तिका इंटरलॉकिंग गजपुर कौड़ीराम, उत्तर प्रदेश के केंद्र में स्थित एक गर्वित पारिवारिक व्यवसाय है। 1990 के दशक से, हम अपने समुदाय की नींव को अटूट ईमानदारी के साथ बनाने के लिए प्रतिबद्ध हैं।',
    storyText2: 'हम भारी भार और समय की कसौटी पर खरा उतरने के लिए डिज़ाइन किए गए इंटरलॉकिंग पेवर ब्लॉकों के सटीक विनिर्माण में विशेषज्ञता रखते हैं। पेवर्स के अलावा, हम प्रीमियम रेत, बजरी, उच्च ग्रेड सीमेंट और औद्योगिक क्षमता वाले जल निकासी पाइपों सहित निर्माण आवश्यक वस्तुओं का एक पूरा सूट प्रदान करते हैं।',
    processTitle: 'निर्माण प्रक्रिया',
    processSubtitle: 'हम इसे कैसे बनाते हैं',
    steps: [
      { num: '1', title: 'कच्चा माल', desc: 'हम एक मजबूत नींव के लिए उच्चतम गुणवत्ता वाली रेत, बजरी और सीमेंट का स्रोत बनाते हैं।' },
      { num: '2', title: 'मिश्रण', desc: 'कम्प्यूटरीकृत मिश्रण अधिकतम स्थायित्व और मजबूती के लिए सही अनुपात सुनिश्चित करता है।' },
      { num: '3', title: 'ढलाई', desc: 'उच्च दबाव कंपन मोल्डिंग सटीक, इंटरलॉकिंग आकृतियों का निर्माण करता है।' },
      { num: '4', title: 'क्योरिंग और डिलीवरी', desc: 'आपके स्थान पर सीधे वितरित होने से पहले 14 दिनों तक पानी की क्योरिंग की जाती है।' }
    ],
    whyChooseTitle: 'स्वस्तिका को क्यों चुनें?',
    whyChooseOptions: [
      { title: 'गुणवत्ता गारंटी', desc: 'आईएस कोड को पूरा करने के लिए प्रत्येक ब्लॉक की मजबूती और पहनने के प्रतिरोध का परीक्षण किया जाता है।' },
      { title: 'तेज डिलीवरी', desc: 'हमारा समर्पित रसद बेड़ा यह सुनिश्चित करता है कि आपकी सामग्री ठीक समय पर पहुंचे।' },
      { title: 'सर्वोत्तम मूल्य', desc: 'बिना बिचौलियों के सीधे फैक्ट्री मूल्य निर्धारण, आपके निर्माण के लिए सर्वोत्तम मूल्य सुनिश्चित करता है।' }
    ],
    stats: [
      { value: '500+', label: 'खुश ग्राहक' },
      { value: '10+', label: 'वर्षों का अनुभव' },
      { value: '50,000+', label: 'ब्लॉक निर्मित' },
      { value: '5', label: 'उपलब्ध उत्पाद' }
    ],
    ctaTitle: 'ऑर्डर करें आज',
    ctaSub: 'अपने लैंडस्केपिंग या निर्माण परियोजना के लिए व्यक्तिगत कोटेशन प्राप्त करें।',
    ctaBtn: 'ऑर्डर बुक करें',
    whatsappBtn: 'व्हाट्सएप करें'
  },
  en: {
    title: 'About Us',
    subtitle: 'Trusted construction partner of Gajpur Kauriram, Uttar Pradesh',
    ourStory: 'Our Story',
    ourStoryTitle: 'Our Story',
    storyText1: 'Swastika Interlocking is a proud family-run business based in the heart of Gajpur Kauriram, Uttar Pradesh. Since the 1990s, we have been at the forefront of the local construction industry, committed to building the foundations of our community with unshakeable integrity.',
    storyText2: 'We specialize in the high-precision manufacturing of interlocking paver blocks, designed to withstand heavy loads and the test of time. Beyond pavers, we provide a complete suite of construction essentials including premium sand, gravel, high-grade cement, and industrial-strength drainage pipes.',
    processTitle: 'Manufacturing Process',
    processSubtitle: 'How We Make It',
    steps: [
      { num: '1', title: 'Raw Materials', desc: 'We source the highest quality sand, gravel, and cement for a strong foundation.' },
      { num: '2', title: 'Mixing', desc: 'Computerized mixing ensures the perfect ratio for maximum durability and strength.' },
      { num: '3', title: 'Moulding', desc: 'High-pressure vibration moulding creates precise, interlocking shapes.' },
      { num: '4', title: 'Curing & Delivery', desc: 'Water curing for 14 days before being delivered directly to your site.' }
    ],
    whyChooseTitle: 'Why Choose Swastika?',
    whyChooseOptions: [
      { title: 'Quality Guaranteed', desc: 'Every block is tested for compressive strength and wear resistance to meet IS codes.' },
      { title: 'Fast Delivery', desc: 'Our dedicated logistics fleet ensures your materials arrive on site exactly when needed.' },
      { title: 'Best Price', desc: 'Direct factory pricing without middlemen, ensuring the best value for your construction.' }
    ],
    stats: [
      { value: '500+', label: 'Happy Customers' },
      { value: '10+', label: 'Years Experience' },
      { value: '50,000+', label: 'Blocks Made' },
      { value: '5', label: 'Products Available' }
    ],
    ctaTitle: 'Order Today',
    ctaSub: 'Get a personalized quote for your landscaping or building project.',
    ctaBtn: 'Book Your Order',
    whatsappBtn: 'WhatsApp Us'
  }
};

export default function About({ language }) {
  const t = TRANSLATIONS[language];

  return (
    <div className="pt-16 bg-surface text-on-surface">
      <SEOHead
        title="About Swastika Interlocking - Paver Block Manufacturer Deesa Gujarat Since 2010"
        description="Learn about Swastika Interlocking, trusted manufacturer of paver blocks and construction materials in Deesa, Banaskantha, Gujarat. Family business with 10+ years experience."
        keywords="Swastika Interlocking Deesa, paver block manufacturer Gujarat, construction company Banaskantha, interlocking blocks history"
        url="/about"
        breadcrumb={getBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])}
        language={language}
      />

      {/* Our Story */}
      <section className="max-w-container-max mx-auto px-gutter py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-block px-4 py-1 bg-primary-fixed text-on-primary-fixed font-semibold text-xs rounded-full">EST. 1990s</span>
            <h2 className="font-display-lg text-3xl md:text-4xl text-primary leading-tight">
              {t.ourStoryTitle}
            </h2>
            <div className="space-y-4 font-body-lg text-on-surface-variant leading-relaxed">
              <p>{t.storyText1}</p>
              <p>{t.storyText2}</p>
            </div>
          </div>
          <div className="relative group">
            <div className="aspect-video rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-2xl rounded-bl-2xl shadow-[0_20px_50px_rgba(232,101,10,0.15)] border border-primary/20 flex flex-col items-center justify-center bg-surface-container-low transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(232,101,10,0.25)] overflow-hidden z-10 relative">
              <img 
                alt="Manufacturing facility" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                src="/screen.png" 
              />
            </div>
            {/* Decorative background blurs */}
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-primary rounded-full -z-0 blur-[60px] opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
            <div className="absolute -top-8 -right-8 w-48 h-48 bg-[#1565C0] rounded-full -z-0 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
          </div>
        </div>
      </section>
      {/* Manufacturing Process */}
      <section className="w-full bg-[#F0EBE0] py-20">
        <div className="max-w-container-max mx-auto px-gutter">
          <h2 className="font-display-lg text-3xl md:text-4xl text-center text-primary mb-16">
            {t.processTitle} / <span className="text-on-surface">{t.processSubtitle}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-primary/20 -translate-y-1/2 -z-10"></div>
            {t.steps.map((step, idx) => (
              <div key={idx} className="group relative bg-surface p-6 rounded-xl border-t-4 border-primary shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary text-on-primary flex items-center justify-center rounded-full font-bold">{step.num}</div>
                <div className="mb-4 text-primary">
                  <span className="material-symbols-outlined text-4xl">
                    {idx === 0 ? 'layers' : idx === 1 ? 'cyclone' : idx === 2 ? 'view_in_ar' : 'local_shipping'}
                  </span>
                </div>
                <h3 className="font-headline-md text-base mb-2 font-bold">{step.title}</h3>
                <p className="text-on-surface-variant text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering Standards (Bento Grid) */}
      <section className="w-full bg-[#F6F2EC] py-24">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="mb-12">
            <h2 className="font-display-lg text-4xl md:text-5xl text-[#2D3748] mb-4">
              {language === 'hi' ? 'निर्माण प्रक्रिया' : 'Engineering Standards'}
            </h2>
            <p className="text-on-surface-variant font-medium">
              {language === 'hi' ? 'हर माइक्रोन पर सटीकता, हर कण में स्थायित्व।' : 'Precision at every micron, durability in every grain.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
            
            {/* Column 1 */}
            <div className="flex flex-col gap-6">
              <div className="relative rounded-2xl overflow-hidden shadow-lg group flex-1 min-h-[300px]">
                <img 
                  src="/swastika-interlocking-pertol-bricks-3x.jpg" 
                  alt="Raw Materials" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full text-white">
                  <div className="text-3xl font-bold text-[#FCD3A1] mb-2">01</div>
                  <h3 className="text-xl font-bold mb-2">{language === 'hi' ? 'कच्चा माल' : 'Raw Materials'}</h3>
                  <p className="text-sm text-white/80 leading-relaxed max-w-[90%]">
                    {language === 'hi' ? 'एक मजबूत नींव के लिए उच्चतम गुणवत्ता वाली रेत और बजरी की सोर्सिंग।' : 'Sourcing high quality sand and gravel for a strong foundation.'}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 group flex-1 min-h-[250px] flex flex-col justify-center border border-black/5">
                <div className="mb-6">
                  <span className="material-symbols-outlined text-4xl text-primary">cyclone</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-on-surface">{language === 'hi' ? 'मिश्रण' : 'Mixing'}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {language === 'hi' ? 'कम्प्यूटरीकृत मिश्रण अधिकतम स्थायित्व और मजबूती के लिए सही अनुपात सुनिश्चित करता है।' : 'Computerized mixing ensures the perfect ratio for maximum durability and strength.'}
                </p>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-6 lg:h-full">
              <div className="relative rounded-2xl overflow-hidden shadow-lg group h-full min-h-[500px]">
                <img 
                  src="/interlocking-street-image-3x.jpg" 
                  alt="Moulding" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#B04A00]/90 via-black/40 to-transparent mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full text-white">
                  <div className="text-4xl font-bold text-white mb-2">03</div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{language === 'hi' ? 'ढलाई' : 'Moulding'}</h3>
                  <p className="text-sm text-white/80 leading-relaxed font-medium">
                    {language === 'hi' ? 'उच्च दबाव कंपन मोल्डिंग सटीक, इंटरलॉकिंग आकृतियों का निर्माण करता है जो सहनशक्ति को फिर से परिभाषित करते हैं।' : 'High-pressure vibration moulding creates precise, interlocking shapes that redefine endurance.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-6">
              <div className="bg-[#38332A] rounded-2xl shadow-lg p-8 group flex-1 min-h-[300px] flex flex-col justify-center">
                <div className="text-3xl font-bold text-primary mb-4">04</div>
                <h3 className="text-xl font-bold mb-4 text-white">{language === 'hi' ? 'क्योरिंग और डिलीवरी' : 'Curing & Delivery'}</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {language === 'hi' ? 'आपके स्थान पर सीधे वितरित होने से पहले 14 दिनों तक पानी की क्योरिंग की जाती है। हमारे गुणवत्ता नियंत्रण से कोई समझौता नहीं।' : 'Water curing for 14 days before being delivered directly to your site. Our quality control is non-negotiable.'}
                </p>
              </div>

              <div className="bg-[#F8EFE4] rounded-2xl shadow-lg p-8 group flex-1 min-h-[250px] flex flex-col items-center justify-center text-center border border-[#E8DBC9]">
                <div className="mb-4">
                  <span className="material-symbols-outlined text-5xl text-[#C06014]" style={{fontVariationSettings: "'FILL' 0, 'wght' 300"}}>verified</span>
                </div>
                <h3 className="text-sm font-bold text-[#2D3748]">{language === 'hi' ? 'आईएसओ मानक प्रमाणित' : 'ISO Standards Compliant'}</h3>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-container-max mx-auto px-gutter py-20">
        <h2 className="font-display-lg text-3xl text-center mb-12 text-on-surface">{t.whyChooseTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.whyChooseOptions.map((opt, idx) => (
            <div key={idx} className="bg-white p-8 rounded-xl border border-primary/10 shadow-sm hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl font-bold">
                  {idx === 0 ? 'check_circle' : idx === 1 ? 'local_shipping' : 'currency_rupee'}
                </span>
              </div>
              <h3 className="font-headline-md text-lg mb-3 font-bold">{opt.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{opt.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
