import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEO/SEOHead';
import { getBreadcrumbSchema } from '../components/SEO/schemas';

const TRANSLATIONS = {
  hi: {
    title: 'हमारे बारे में',
    heroSub: 'एक परिवार, एक विश्वास',
    storyTitle: 'हमारी कहानी',
    storyText: 'स्वस्तिका इंटरलॉकिंग एक पारिवारिक व्यवसाय है जिसे भाइयों दिलीप चौबे और आलोक चौबे ने देसा, बनासकांठा, गुजरात में स्थापित किया। एक छोटी पेवर ब्लॉक निर्माण इकाई से शुरू होकर यह एक पूर्ण निर्माण समाधान प्रदाता बन गया है।',
    storyTextEn: 'Swastika Interlocking is a family-owned business founded by brothers Dilip Chaubey and Alok Chaubey in Deesa, Banaskantha, Gujarat. What started as a small paver block manufacturing unit has grown into a complete construction solutions provider serving Deesa and surrounding districts of Gujarat.',
    meetTeam: 'हमारी टीम से मिलें',
    dilipName: 'Dilip Chaubey / दिलीप चौबे',
    dilipTitle: 'Proprietor & Founder / संस्थापक',
    dilipDivision: 'Building Materials • Shuttering • RCC Roads',
    dilipBio: 'Dilip bhai leads our manufacturing and construction division with 10+ years of expertise in paver block production and RCC road construction across Banaskantha district.',
    dilipBioHi: 'दिलीप भाई हमारे निर्माण विभाग का नेतृत्व करते हैं। पेवर ब्लॉक उत्पादन और RCC सड़क निर्माण में 10+ वर्षों का अनुभव।',
    alokName: 'Alok Chaubey / आलोक चौबे',
    alokTitle: 'Co-Owner, Pipes Division / सह-मालिक, पाइप विभाग',
    alokDivision: 'Drainage Pipes • Water Supply • Pool Pipes',
    alokBio: 'Alok bhai heads our pipes and drainage division, providing complete piping solutions for drainage systems, water supply, swimming pools, and industrial applications across Gujarat.',
    alokBioHi: 'आलोक भाई हमारे पाइप और ड्रेनेज विभाग के प्रमुख हैं। ड्रेनेज, जल आपूर्ति और स्विमिंग पूल पाइपिंग में विशेषज्ञता।',
    callNow: 'कॉल करें',
    whatsapp: 'व्हाट्सएप',
    valuesTitle: 'हमारे मूल्य',
    quality: 'गुणवत्ता / Quality',
    honesty: 'ईमानदारी / Honesty',
    onTime: 'समय पर / On Time',
    ctaTitle: 'किसी भी विभाग से संपर्क करें',
    dilipBtn: 'Dilip bhai - 84009 36290',
    alokBtn: 'Alok bhai - 97228 32661',
    waBtn: 'WhatsApp करें'
  },
  en: {
    title: 'About Us',
    heroSub: 'One Family, One Trust',
    storyTitle: 'Our Story',
    storyText: 'स्वस्तिका इंटरलॉकिंग एक पारिवारिक व्यवसाय है जिसे भाइयों दिलीप चौबे और आलोक चौबे ने देसा, बनासकांठा, गुजरात में स्थापित किया। एक छोटी पेवर ब्लॉक निर्माण इकाई से शुरू होकर यह एक पूर्ण निर्माण समाधान प्रदाता बन गया है।',
    storyTextEn: 'Swastika Interlocking is a family-owned business founded by brothers Dilip Chaubey and Alok Chaubey in Deesa, Banaskantha, Gujarat. What started as a small paver block manufacturing unit has grown into a complete construction solutions provider serving Deesa and surrounding districts of Gujarat.',
    meetTeam: 'Meet Our Team',
    dilipName: 'Dilip Chaubey / दिलीप चौबे',
    dilipTitle: 'Proprietor & Founder / संस्थापक',
    dilipDivision: 'Building Materials • Shuttering • RCC Roads',
    dilipBio: 'Dilip bhai leads our manufacturing and construction division with 10+ years of expertise in paver block production and RCC road construction across Banaskantha district.',
    dilipBioHi: 'दिलीप भाई हमारे निर्माण विभाग का नेतृत्व करते हैं। पेवर ब्लॉक उत्पादन और RCC सड़क निर्माण में 10+ वर्षों का अनुभव।',
    alokName: 'Alok Chaubey / आलोक चौबे',
    alokTitle: 'Co-Owner, Pipes Division / सह-मालिक, पाइप विभाग',
    alokDivision: 'Drainage Pipes • Water Supply • Pool Pipes',
    alokBio: 'Alok bhai heads our pipes and drainage division, providing complete piping solutions for drainage systems, water supply, swimming pools, and industrial applications across Gujarat.',
    alokBioHi: 'आलोक भाई हमारे पाइप और ड्रेनेज विभाग के प्रमुख हैं। ड्रेनेज, जल आपूर्ति और स्विमिंग पूल पाइपिंग में विशेषज्ञता।',
    callNow: 'Call Now',
    whatsapp: 'WhatsApp',
    valuesTitle: 'Our Values',
    quality: 'गुणवत्ता / Quality',
    honesty: 'ईमानदारी / Honesty',
    onTime: 'समय पर / On Time',
    ctaTitle: 'Contact Any Division',
    dilipBtn: 'Dilip bhai - 84009 36290',
    alokBtn: 'Alok bhai - 97228 32661',
    waBtn: 'WhatsApp Us'
  }
};

const STATS = [
  { value: '25+', label: 'Roads Built', labelHi: 'सड़कें बनाईं' },
  { value: '500+', label: 'Customers', labelHi: 'ग्राहक' },
  { value: '10+', label: 'Years', labelHi: 'वर्ष' },
  { value: '2', label: 'Expert Divisions', labelHi: 'विशेषज्ञ विभाग' }
];

const VALUES = [
  { icon: 'verified', title: 'Quality', titleHi: 'गुणवत्ता', color: '#E8650A' },
  { icon: 'handshake', title: 'Honesty', titleHi: 'ईमानदारी', color: '#E8650A' },
  { icon: 'schedule', title: 'On Time', titleHi: 'समय पर', color: '#E8650A' }
];

export default function About({ language }) {
  const t = TRANSLATIONS[language];

  return (
    <div className="pt-16 bg-surface text-on-surface">
      <SEOHead
        title="About Swastika Interlocking - Paver Block Manufacturer Deesa Gujarat Since 2010"
        description="Learn about Swastika Interlocking, trusted manufacturer of paver blocks and construction materials in Deesa, Banaskantha, Gujarat. Family business with Dilip & Alok Chaubey."
        keywords="Swastika Interlocking Deesa, Dilip Chaubey, Alok Chaubey, paver block manufacturer Gujarat"
        url="/about"
        breadcrumb={getBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])}
        language={language}
      />

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/95 to-primary/85"></div>
        <img 
          src="/interlocking-street-image-3x.jpg" 
          alt="Swastika Interlocking" 
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
        <div className="max-w-container-max mx-auto px-gutter relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-display-lg text-white mb-6">
            {language === 'hi' ? 'हमारे बारे में' : 'About Us'}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium">
            {t.heroSub}
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="max-w-container-max mx-auto px-gutter py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-block px-4 py-1 bg-primary-fixed text-on-primary-fixed font-semibold text-xs rounded-full">
              {language === 'hi' ? 'EST. 2010' : 'EST. 2010'}
            </span>
            <h2 className="font-display-lg text-3xl md:text-4xl text-primary leading-tight">
              {t.storyTitle}
            </h2>
            <div className="space-y-4 font-body-lg text-on-surface-variant leading-relaxed">
              <p>{language === 'hi' ? t.storyText : t.storyTextEn}</p>
              <p>{language === 'hi' 
                ? '10+ वर्षों के अनुभव के साथ, हमने सड़कें बनाईं, सामग्री की आपूर्ति की और सैकड़ों परिवारों और ठेकेदारों को उनके सपने बनाने में मदद की।' 
                : 'With over a decade of experience, we have built roads, supplied materials, and helped hundreds of families and contractors build their dreams.'
              }</p>
            </div>
          </div>
          <div className="relative group">
            <div className="aspect-video rounded-2xl shadow-lg border border-primary/20 bg-surface-container-low overflow-hidden">
              <img 
                alt="Team at Swastika Interlocking" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src="/swastika-interlocking-pertol-bricks-3x.jpg" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="max-w-container-max mx-auto px-gutter py-20">
        <h2 className="font-display-lg text-3xl md:text-4xl text-center text-primary mb-16">
          {t.meetTeam}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dilip Card */}
          <div className="bg-surface p-8 rounded-2xl border border-primary/10 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-[#E8650A] flex items-center justify-center bg-[#FFF5EB] mb-4 overflow-hidden">
                <span className="material-symbols-outlined text-6xl text-[#E8650A]">person</span>
              </div>
              <h3 className="font-display-md text-2xl font-bold text-on-surface mb-2 text-center">
                {t.dilipName}
              </h3>
              <p className="text-primary font-semibold mb-2">{t.dilipTitle}</p>
              <div className="bg-primary/10 px-4 py-1 rounded-full text-primary text-sm font-medium">
                {t.dilipDivision}
              </div>
            </div>
            <p className="text-on-surface-variant text-center leading-relaxed mb-6">
              {language === 'hi' ? t.dilipBioHi : t.dilipBio}
            </p>
            <div className="flex gap-3 justify-center">
              <a 
                href="tel:+918400936290" 
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
              >
                <span className="material-symbols-outlined">call</span>
                {language === 'hi' ? 'कॉल करें' : 'Call Now'}
              </a>
              <a 
                href="https://wa.me/918400936290" 
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#1DA852] transition-colors"
              >
                <span className="material-symbols-outlined">chat</span>
                {t.whatsapp}
              </a>
            </div>
          </div>

          {/* Alok Card */}
          <div className="bg-surface p-8 rounded-2xl border border-[#1565C0]/10 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-[#1565C0] flex items-center justify-center bg-[#E3F2FD] mb-4 overflow-hidden">
                <span className="material-symbols-outlined text-6xl text-[#1565C0]">person</span>
              </div>
              <h3 className="font-display-md text-2xl font-bold text-on-surface mb-2 text-center">
                {t.alokName}
              </h3>
              <p className="text-[#1565C0] font-semibold mb-2">{t.alokTitle}</p>
              <div className="bg-[#1565C0]/10 px-4 py-1 rounded-full text-[#1565C0] text-sm font-medium">
                {t.alokDivision}
              </div>
            </div>
            <p className="text-on-surface-variant text-center leading-relaxed mb-6">
              {language === 'hi' ? t.alokBioHi : t.alokBio}
            </p>
            <div className="flex gap-3 justify-center">
              <a 
                href="tel:+919722832661" 
                className="flex items-center gap-2 px-6 py-3 bg-[#1565C0] text-white rounded-xl font-semibold hover:bg-[#0D47A1] transition-colors"
              >
                <span className="material-symbols-outlined">call</span>
                {language === 'hi' ? 'कॉल करें' : 'Call Now'}
              </a>
              <a 
                href="https://wa.me/919722832661" 
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#1DA852] transition-colors"
              >
                <span className="material-symbols-outlined">chat</span>
                {t.whatsapp}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="max-w-container-max mx-auto px-gutter py-20 bg-[#F0EBE0]">
        <h2 className="font-display-lg text-3xl md:text-4xl text-center text-primary mb-16">
          {t.valuesTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VALUES.map((value, idx) => (
            <div key={idx} className="bg-white p-8 rounded-xl border border-primary/10 shadow-sm text-center group">
              <div className="w-16 h-16 bg-[#FFF5EB] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-4xl text-[#E8650A]">{value.icon}</span>
              </div>
              <h3 className="font-headline-md text-lg mb-2 font-bold text-on-surface">
                {language === 'hi' ? value.titleHi : value.title}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-container-max mx-auto px-gutter grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-4xl md:text-5xl font-display-lg text-white mb-2">{stat.value}</div>
              <div className="text-white/90 font-medium">
                {language === 'hi' ? stat.labelHi : stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 max-w-container-max mx-auto px-gutter">
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-12 text-center text-white">
          <h2 className="font-display-lg text-3xl md:text-4xl mb-8">
            {language === 'hi' ? 'किसी भी विभाग से संपर्क करें' : t.ctaTitle}
          </h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <a 
              href="tel:+918400936290" 
              className="flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-bold hover:bg-opacity-90 transition-colors"
            >
              <span className="material-symbols-outlined">call</span>
              {t.dilipBtn}
            </a>
            <a 
              href="tel:+919722832661" 
              className="flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-bold hover:bg-opacity-90 transition-colors"
            >
              <span className="material-symbols-outlined">call</span>
              {t.alokBtn}
            </a>
            <a 
              href="https://wa.me/918400936290" 
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#1DA852] transition-colors"
            >
              <span className="material-symbols-outlined">chat</span>
              {t.waBtn}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
