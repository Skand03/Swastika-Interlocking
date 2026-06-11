import React from 'react';
import { Link } from 'react-router-dom';

const TRANSLATIONS = {
  hi: {
    desc: 'प्रीमियम निर्माण परियोजनाओं के लिए उच्च-शक्ति इंटरलॉकिंग पेवर ब्लॉक और कंक्रीट समाधानों के निर्माता।',
    buildingDiv: 'बिल्डिंग मैटेरियल्स',
    quickLinks: 'त्वरित लिंक',
    addressVal: 'गिरधारपुर उंचेर कौरीराम, उत्तर प्रदेश - 273413',
    hoursVal: 'सोम - शनि: सुबह 9:00 बजे - शाम 7:00 बजे',
    sunday: 'रविवार: अपॉइंटमेंट पर',
    home: 'मुख्य पृष्ठ',
    products: 'निर्माण सामग्री',
    order: 'ऑर्डर बुक करें',
    shuttering: 'शटरिंग',
    rccRoads: 'RCC सड़कें',
    about: 'हमारे बारे में',
    contact: 'संपर्क'
  },
  en: {
    desc: 'Leading manufacturers of high-strength interlocking pavers and concrete solutions for premium construction projects.',
    buildingDiv: 'Building Materials',
    quickLinks: 'Quick Links',
    addressVal: 'Girdharpur Uncher Kauriram, Uttar Pradesh - 273413',
    hoursVal: 'Mon - Sat: 9:00 AM - 7:00 PM',
    sunday: 'Sunday: By Appointment',
    home: 'Home',
    products: 'Building Materials',
    order: 'Book Order',
    shuttering: 'Shuttering',
    rccRoads: 'RCC Roads',
    about: 'About',
    contact: 'Contact'
  }
};

export default function Footer({ language }) {
  const t = TRANSLATIONS[language];

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-16 px-gutter border-t select-none" style={{ background: '#1a1a3e' }}>
      <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-6 select-none">
            <img alt="Swastika Interlocking Logo" className="h-10 w-10 object-contain" src="/logo.svg" />
            <span className="font-headline-md text-headline-md font-bold leading-tight" style={{ color: '#E8650A' }}>
              Swastika<br/><span style={{ color: 'rgba(255,255,255,0.8)' }}>Interlocking</span>
            </span>
          </div>
          <p className="font-body-md text-body-md mb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {t.desc}
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-6 font-body-md text-body-md border-b pb-2" style={{ color: '#E8650A', borderColor: 'rgba(232,101,10,0.3)' }}>
            {t.quickLinks}
          </h4>
          <ul className="space-y-3">
            <li>
              <Link to="/products" onClick={handleScrollToTop} className="transition-all" style={{ color: 'rgba(255,255,255,0.8)' }} onMouseOver={(e) => e.target.style.color = '#E8650A'} onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>
                {t.products}
              </Link>
            </li>
            <li>
              <Link to="/shuttering" onClick={handleScrollToTop} className="transition-all" style={{ color: 'rgba(255,255,255,0.8)' }} onMouseOver={(e) => e.target.style.color = '#E8650A'} onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>
                {t.shuttering}
              </Link>
            </li>
            <li>
              <Link to="/rcc-roads" onClick={handleScrollToTop} className="transition-all" style={{ color: 'rgba(255,255,255,0.8)' }} onMouseOver={(e) => e.target.style.color = '#E8650A'} onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>
                {t.rccRoads}
              </Link>
            </li>
            <li>
              <Link to="/order" onClick={handleScrollToTop} className="transition-all" style={{ color: 'rgba(255,255,255,0.8)' }} onMouseOver={(e) => e.target.style.color = '#E8650A'} onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>
                {t.order}
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={handleScrollToTop} className="transition-all" style={{ color: 'rgba(255,255,255,0.8)' }} onMouseOver={(e) => e.target.style.color = '#E8650A'} onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>
                {t.contact}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 font-body-md text-body-md border-b pb-2" style={{ color: '#E8650A', borderColor: 'rgba(255,255,255,0.1)' }}>
            {language === 'hi' ? 'संपर्क सूत्र' : 'Contact Us'}
          </h4>
          <p className="font-body-md text-body-md mb-4 flex items-start gap-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
            <span className="material-symbols-outlined shrink-0 mt-1" style={{ color: '#E8650A' }}>location_on</span>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="transition-colors hover:underline"
              style={{ color: 'rgba(255,255,255,0.8)' }} 
              onMouseOver={(e) => e.target.style.color = '#E8650A'} 
              onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}
            >
              {t.addressVal}
            </a>
          </p>
          <div className="font-body-md text-body-md mb-4 flex items-start gap-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
            <span className="material-symbols-outlined shrink-0 mt-1" style={{ color: '#E8650A' }}>schedule</span>
            <div>
              <p>{t.hoursVal}</p>
              <p className="text-sm">{t.sunday}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-container-max mx-auto mt-12 pt-8 border-t text-center font-body-md text-body-md" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>
        © {new Date().getFullYear()} Swastika Interlocking
      </div>
    </footer>
  );
}
