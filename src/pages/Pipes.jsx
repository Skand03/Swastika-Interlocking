import React from 'react';
import SEOHead from '../components/SEO/SEOHead';
import { getBreadcrumbSchema } from '../components/SEO/schemas';

const TRANSLATIONS = {
  hi: {
    title: 'पाइप समाधान',
    subtitle: 'आलोक चौबे द्वारा संचालित',
    subtitleEn: 'Led by Alok Chaubey',
    callBtn: '97228 32661 पर कॉल करें',
    getQuote: 'कोटेशन प्राप्त करें',
    callAlok: 'आलोक भाई से बात करें',
    productsTitle: 'हमारे पाइप उत्पाद',
    product1Title: 'ड्रेनेज पाइप 6 इंच',
    product2Title: 'ड्रेनेज पाइप 12 इंच',
    product3Title: 'जल आपूर्ति पाइप',
    product4Title: 'स्विमिंग पूल पाइप',
    product5Title: 'औद्योगिक पाइप',
    product6Title: 'सीवर पाइप',
    sizes: 'साइज़ विकल्प',
    contactTitle: 'आलोक चौबे से संपर्क करें',
    contactSubtitle: 'पाइप विशेषज्ञ, 10+ वर्षों का अनुभव'
  },
  en: {
    title: 'Pipe Solutions',
    subtitle: 'Led by Alok Chaubey',
    callBtn: 'Call 97228 32661',
    getQuote: 'Get Quote',
    callAlok: 'Call Alok',
    productsTitle: 'Our Pipe Products',
    product1Title: 'Drainage Pipe 6 inch',
    product2Title: 'Drainage Pipe 12 inch',
    product3Title: 'Water Supply Pipe',
    product4Title: 'Swimming Pool Pipe',
    product5Title: 'Industrial Pipe',
    product6Title: 'Sewer Pipe',
    sizes: 'Size Options',
    contactTitle: 'Contact Alok Chaubey',
    contactSubtitle: 'Pipe specialist with 10+ years of experience'
  }
};

const PIPES = [
  {
    id: 1,
    image: '/pipe-with-different-size.jpg',
    titleHi: 'ड्रेनेज पाइप 6 इंच',
    titleEn: 'Drainage Pipe 6 inch',
    sizes: ['4 inch', '6 inch', '8 inch']
  },
  {
    id: 2,
    image: '/pipe-with-different-size.jpg',
    titleHi: 'ड्रेनेज पाइप 12 इंच',
    titleEn: 'Drainage Pipe 12 inch',
    sizes: ['10 inch', '12 inch', '16 inch']
  },
  {
    id: 3,
    image: '/pipe-with-different-size.jpg',
    titleHi: 'जल आपूर्ति पाइप',
    titleEn: 'Water Supply Pipe',
    sizes: ['½ inch', '¾ inch', '1 inch', '2 inch']
  },
  {
    id: 4,
    image: '/pipe-with-different-size.jpg',
    titleHi: 'स्विमिंग पूल पाइप',
    titleEn: 'Swimming Pool Pipe',
    sizes: ['1.5 inch', '2 inch', '3 inch']
  },
  {
    id: 5,
    image: '/pipe-with-different-size.jpg',
    titleHi: 'औद्योगिक पाइप',
    titleEn: 'Industrial Pipe',
    sizes: ['4 inch', '6 inch', '8 inch', '10 inch']
  },
  {
    id: 6,
    image: '/pipe-with-different-size.jpg',
    titleHi: 'सीवर पाइप',
    titleEn: 'Sewer Pipe',
    sizes: ['8 inch', '10 inch', '12 inch', '16 inch']
  }
];

export default function Pipes({ language }) {
  const t = TRANSLATIONS[language];

  return (
    <div className="pt-16 bg-surface text-on-surface">
      <SEOHead
        title="Pipe Solutions - Swastika Interlocking | Deesa Gujarat"
        description="Quality drainage, water supply, and industrial pipes in Deesa, Gujarat. Contact Alok Chaubey for all your piping needs."
        keywords="pipes Deesa, drainage pipes Gujarat, water supply pipes Banaskantha, pool pipes, industrial piping"
        url="/pipes"
        breadcrumb={getBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Pipes', path: '/pipes' }])}
        language={language}
      />
      
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1565C0]/90 to-[#0D47A1]/90"></div>
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('/pipe-with-different-size.jpg')"}}></div>
        
        <div className="max-w-container-max mx-auto px-gutter relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-display-lg text-white mb-4">{t.title}</h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            {language === 'hi' ? t.subtitle : t.subtitleEn}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="tel:+919722832661" 
              className="flex items-center gap-2 px-8 py-4 bg-white text-[#1565C0] rounded-xl font-bold hover:bg-white/90 transition-colors shadow-lg"
            >
              <span className="material-symbols-outlined">call</span>
              {t.callBtn}
            </a>
            <a 
              href="https://wa.me/919722832661" 
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#1DA852] transition-colors shadow-lg"
            >
              <span className="material-symbols-outlined">chat</span>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24 px-gutter max-w-container-max mx-auto">
        <h2 className="text-3xl md:text-4xl font-display-lg text-center mb-16">{t.productsTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PIPES.map((pipe) => (
            <div key={pipe.id} className="bg-white rounded-2xl shadow-sm border border-surface-variant/30 overflow-hidden group">
              <div className="aspect-[4/3] bg-surface-container overflow-hidden">
                <img 
                  src={pipe.image} 
                  alt={language === 'hi' ? pipe.titleHi : pipe.titleEn}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2">
                  {language === 'hi' ? pipe.titleHi : pipe.titleEn}
                </h3>
                <p className="text-sm text-on-surface-variant mb-4">{t.sizes}:</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {pipe.sizes.map((size, idx) => (
                    <span key={idx} className="px-3 py-1 bg-[#1565C0]/10 text-[#1565C0] rounded-full text-xs font-semibold">
                      {size}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <a 
                    href="https://wa.me/919722832661" 
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#1DA852] transition-colors text-sm"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                    {t.getQuote}
                  </a>
                  <a 
                    href="tel:+919722832661" 
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#1565C0] text-white rounded-xl font-semibold hover:bg-[#0D47A1] transition-colors text-sm"
                  >
                    <span className="material-symbols-outlined text-base">call</span>
                    {t.callAlok}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Alok Section */}
      <section className="py-16 md:py-24 px-gutter max-w-container-max mx-auto bg-surface-container">
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-surface-variant/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center md:items-start">
              <div className="w-32 h-32 rounded-full bg-[#1565C0]/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-6xl text-[#1565C0]">person</span>
              </div>
              <h2 className="font-display-lg text-3xl font-bold text-on-surface mb-2 text-center md:text-left">
                Alok Chaubey
              </h2>
              <p className="text-[#1565C0] font-semibold text-lg mb-6 text-center md:text-left">
                {language === 'hi' ? 'पाइप विभाग प्रमुख' : 'Pipes Division Head'}
              </p>
              <p className="text-on-surface-variant mb-8 text-center md:text-left">
                {language === 'hi' ? t.contactSubtitle : t.contactSubtitle}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-surface-container rounded-xl border border-surface-variant/30">
                <div className="w-12 h-12 bg-[#1565C0]/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#1565C0]">call</span>
                </div>
                <a href="tel:+919722832661" className="text-on-surface font-semibold text-xl">
                  +91 97228 32661
                </a>
              </div>

              <div className="flex items-center gap-4 p-4 bg-surface-container rounded-xl border border-surface-variant/30">
                <div className="w-12 h-12 bg-[#25D366]/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#25D366]">chat</span>
                </div>
                <a href="https://wa.me/919722832661" target="_blank" rel="noreferrer" className="text-on-surface font-semibold text-xl">
                  WhatsApp Alok
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
