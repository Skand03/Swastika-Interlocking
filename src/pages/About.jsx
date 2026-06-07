import React from 'react';
import { Link } from 'react-router-dom';

const TRANSLATIONS = {
  hi: {
    title: 'हमारे बारे में',
    subtitle: 'Deesa, Gujarat का विश्वसनीय निर्माण साथी',
    ourStory: 'हमारी कहानी',
    ourStoryTitle: 'हमारी कहानी',
    storyText1: 'स्वस्तिका इंटरलॉकिंग डीसा, गुजरात के केंद्र में स्थित एक गर्वित पारिवारिक व्यवसाय है। एक दशक से अधिक समय से, हम अपने समुदाय की नींव को अटूट ईमानदारी के साथ बनाने के लिए प्रतिबद्ध हैं।',
    storyText2: 'हम भारी भार और समय की कसौटी पर खरा उतरने के लिए डिज़ाइन किए गए इंटरलॉकिंग पेवर ब्लॉकों के सटीक विनिर्माण में विशेषज्ञता रखते हैं। पेवर्स के अलावा, हम प्रीमियम रेत, बजरी, उच्च ग्रेड सीमेंट और औद्योगिक क्षमता वाले जल निकासी पाइपों सहित निर्माण आवश्यक वस्तुओं का एक पूरा सूट प्रदान करते हैं।',
    processTitle: 'निर्माण प्रक्रिया',
    processSubtitle: 'हम इसे कैसे बनाते हैं',
    steps: [
      { num: '1', title: 'कच्चा माल / Raw Materials', desc: 'हम एक मजबूत नींव के लिए उच्चतम गुणवत्ता वाली रेत, बजरी और सीमेंट का स्रोत बनाते हैं।' },
      { num: '2', title: 'मिश्रण / Mixing', desc: 'कम्प्यूटरीकृत मिश्रण अधिकतम स्थायित्व और मजबूती के लिए सही अनुपात सुनिश्चित करता है।' },
      { num: '3', title: 'ढलाई / Moulding', desc: 'उच्च दबाव कंपन मोल्डिंग सटीक, इंटरलॉकिंग आकृतियों का निर्माण करता है।' },
      { num: '4', title: 'क्योरिंग और डिलीवरी / Curing', desc: 'आपके स्थान पर सीधे वितरित होने से पहले 14 दिनों तक पानी की क्योरिंग की जाती है।' }
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
    subtitle: 'Trusted construction partner of Deesa, Gujarat',
    ourStory: 'Our Story',
    ourStoryTitle: 'Our Story',
    storyText1: 'Swastika Interlocking is a proud family-run business based in the heart of Deesa, Gujarat. For over a decade, we have been at the forefront of the local construction industry, committed to building the foundations of our community with unshakeable integrity.',
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
      {/* Hero Banner */}
      <section className="w-full bg-[#1C2B1A] py-20 md:py-28 relative overflow-hidden select-none">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 h-full w-full">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="col-span-1 border-r border-surface/20"></div>
            ))}
          </div>
        </div>
        <div className="max-w-container-max mx-auto px-gutter text-center relative z-10">
          <nav className="flex justify-center gap-2 mb-4 text-surface/60 text-sm font-semibold">
            <Link to="/" className="hover:text-surface">Home</Link>
            <span>&gt;</span>
            <span className="text-primary-fixed">About</span>
          </nav>
          <h1 className="font-display-lg text-4xl md:text-5xl text-surface mb-4 leading-tight">
            {language === 'hi' ? 'हमारे बारे में' : 'About Us'}
          </h1>
          <p className="font-body-lg text-lg text-[#FAF7F2] opacity-90 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-container-max mx-auto px-gutter py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-block px-4 py-1 bg-primary-fixed text-on-primary-fixed font-semibold text-xs rounded-full">EST. 2014</span>
            <h2 className="font-display-lg text-3xl md:text-4xl text-primary leading-tight">
              {t.ourStoryTitle}
            </h2>
            <div className="space-y-4 font-body-lg text-on-surface-variant leading-relaxed">
              <p>{t.storyText1}</p>
              <p>{t.storyText2}</p>
            </div>
          </div>
          <div className="relative group">
            <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-primary flex flex-col items-center justify-center p-8 bg-surface-container-low transition-transform duration-500 group-hover:scale-[1.02] overflow-hidden">
              <img 
                alt="Manufacturing facility" 
                className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBsvfbx_m77sFmh9wPs3K7wde8H4FKd6iSmi0GkpWukfU7WO1-5K1m-FOWM0Y3MkjXolxIVdOF1YhT6kNaXJVdefCae8klVGAhwGKxgE5UgUSPmLN6sT3A-gFWuoy-whc8Jmz4upqV6B_DORSaOuC4W92g17wxO3_E-fPpETFHNSPRm9652h-IKNXkF5iXccYK4oMbz7JSpoTwGENMUqN9OPCUc5XDa11psJ2Nu1YeXIc0Y5krNe2RoiL701WGJtNxphap12uVuTQ" 
              />
              <div className="relative z-10 text-center text-white bg-black/40 p-4 rounded-lg backdrop-blur-sm">
                <span className="material-symbols-outlined text-5xl text-primary mb-2">factory</span>
                <p className="font-headline-md text-lg">{language === 'hi' ? 'हमारी फैक्ट्री / Factory Photo' : 'Factory Photo / हमारी फैक्ट्री'}</p>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary rounded-full -z-10 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
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

      {/* Stats Bar */}
      <section className="w-full bg-primary py-12">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {t.stats.map((stat, idx) => (
              <div key={idx} className="text-white">
                <div className="font-display-lg text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="w-full bg-[#1C2B1A] py-16">
        <div className="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="font-display-lg text-2xl md:text-3xl text-white mb-2">{t.ctaTitle}</h2>
            <p className="text-surface/75 text-sm md:text-base">{t.ctaSub}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link 
              to="/order" 
              className="bg-primary text-white px-8 py-4 rounded font-bold text-center hover:bg-primary-container transition-colors flex items-center justify-center gap-2"
            >
              {t.ctaBtn} <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <a 
              href="https://wa.me/919876543210" 
              target="_blank" 
              rel="noreferrer"
              className="bg-[#25D366] text-white px-8 py-4 rounded font-bold text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span> {t.whatsappBtn}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
