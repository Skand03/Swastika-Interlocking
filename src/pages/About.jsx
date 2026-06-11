import React from 'react';
import { Link } from 'react-router-dom';
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
    title: 'हमारे बारे में',
    heroSub: 'एक परिवार, एक विश्वास',
    storyTitle: 'हमारी कहानी',
    storyText: 'स्वस्तिका इंटरलॉकिंग एक पारिवारिक व्यवसाय है जो गिरधारपुर उंचेर कौरीराम, उत्तर प्रदेश में स्थापित किया गया है। एक छोटी पेवर ब्लॉक निर्माण इकाई से शुरू होकर यह एक पूर्ण निर्माण समाधान प्रदाता बन गया है।',
    storyTextEn: 'Swastika Interlocking is a family-owned business established in Girdharpur Uncher Kauriram, Uttar Pradesh. What started as a small paver block manufacturing unit has grown into a complete construction solutions provider.',
    meetTeam: 'हमारी टीम से मिलें',
    valuesTitle: 'हमारे मूल्य',
    quality: 'गुणवत्ता / Quality',
    honesty: 'ईमानदारी / Honesty',
    onTime: 'समय पर / On Time'
  },
  en: {
    title: 'About Us',
    heroSub: 'One Family, One Trust',
    storyTitle: 'Our Story',
    storyText: 'स्वस्तिका इंटरलॉकिंग एक पारिवारिक व्यवसाय है जो गिरधारपुर उंचेर कौरीराम, उत्तर प्रदेश में स्थापित किया गया है। एक छोटी पेवर ब्लॉक निर्माण इकाई से शुरू होकर यह एक पूर्ण निर्माण समाधान प्रदाता बन गया है।',
    storyTextEn: 'Swastika Interlocking is a family-owned business established in Girdharpur Uncher Kauriram, Uttar Pradesh. What started as a small paver block manufacturing unit has grown into a complete construction solutions provider.',
    meetTeam: 'Meet Our Team',
    valuesTitle: 'Our Values',
    quality: 'गुणवत्ता / Quality',
    honesty: 'ईमानदारी / Honesty',
    onTime: 'समय पर / On Time'
  }
};

const STATS = [
  { value: '25+', label: 'Roads Built', labelHi: 'सड़कें बनाईं' },
  { value: '500+', label: 'Customers', labelHi: 'ग्राहक' },
  { value: '10+', label: 'Years', labelHi: 'वर्ष' },
  { value: '3', label: 'Expert Divisions', labelHi: 'विशेषज्ञ विभाग' }
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
        title="About Swastika Interlocking - Paver Block Manufacturer Girdharpur UP"
        description="Learn about Swastika Interlocking, trusted manufacturer of paver blocks and construction materials in Girdharpur Uncher Kauriram, Uttar Pradesh."
        keywords="Swastika Interlocking Girdharpur, paver block manufacturer Uttar Pradesh"
        url="/about"
        breadcrumb={getBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])}
        language={language}
      />

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 to-primary/85"></div>
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

      {/* Marquee Section */}
      <section className="bg-[#1a1a3e] py-4 overflow-hidden">
        <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((text, i) => (
            <div key={i} className="flex items-center gap-3 text-white text-sm font-semibold">
              {text}
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-container-max mx-auto px-gutter py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-block px-4 py-1 bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm rounded-full mb-4">
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

      <section className="max-w-container-max mx-auto px-gutter py-20 bg-[#F0EBE0]">
        <h2 className="font-display-lg text-3xl md:text-4xl text-center text-primary mb-16">
          {t.valuesTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VALUES.map((value, idx) => (
            <div key={idx} className="bg-white p-8 rounded-xl border border-primary/10 shadow-sm text-center group">
              <div className="w-16 h-16 bg-[#FFF5EB] rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl text-[#E8650A]">{value.icon}</span>
              </div>
              <h3 className="font-headline-md text-lg mb-2 font-bold text-on-surface">
                {language === 'hi' ? value.titleHi : value.title}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
