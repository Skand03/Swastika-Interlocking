import React from 'react';
import { Link } from 'react-router-dom';

const TRANSLATIONS = {
  hi: {
    desc: 'प्रीमियम निर्माण परियोजनाओं के लिए उच्च-शक्ति इंटरलॉकिंग पेवर ब्लॉक और कंक्रीट समाधानों के निर्माता। एक परिवारिक व्यवसाय, चौबे ब्रदर्स द्वारा संचालित।',
    buildingDiv: 'बिल्डिंग मैटेरियल्स डिविजन',
    pipesDiv: 'पाइप्स डिविजन',
    quickLinks: 'त्वरित लिंक',
    addressVal: 'Deesa, Banaskantha, Gujarat - 385535',
    hoursVal: 'सोम - शनि: सुबह 9:00 बजे - शाम 7:00 बजे',
    sunday: 'रविवार: अपॉइंटमेंट पर',
    home: 'मुख्य पृष्ठ',
    products: 'उत्पाद',
    order: 'ऑर्डर बुक करें',
    shuttering: 'शटरिंग',
    rccRoads: 'RCC सड़कें',
    pipes: 'पाइप्स',
    about: 'हमारे बारे में',
    contact: 'संपर्क'
  },
  en: {
    desc: 'Leading manufacturers of high-strength interlocking pavers and concrete solutions for premium construction projects. A family business, operated by Chaubey Brothers.',
    buildingDiv: 'Building Materials Division',
    pipesDiv: 'Pipes Division',
    quickLinks: 'Quick Links',
    addressVal: 'Deesa, Banaskantha, Gujarat - 385535',
    hoursVal: 'Mon - Sat: 9:00 AM - 7:00 PM',
    sunday: 'Sunday: By Appointment',
    home: 'Home',
    products: 'Products',
    order: 'Book Order',
    shuttering: 'Shuttering',
    rccRoads: 'RCC Roads',
    pipes: 'Pipes',
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
    <footer className="bg-surface-container py-16 px-gutter border-t border-surface-variant/30 select-none">
      <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-6 select-none">
            <img alt="Swastika Interlocking Logo" className="h-10 w-10 object-contain" src="/logo.svg" />
            <span className="font-headline-md text-headline-md font-bold text-primary leading-tight">
              Swastika<br/><span className="text-on-surface">Interlocking</span>
            </span>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md mb-6 leading-relaxed">
            {t.desc}
          </p>
          <p className="text-on-surface-variant font-body-md text-body-md">
            {language === 'hi' ? 'एक चौबे परिवार का व्यवसाय' : 'A Chaubey Family Business'}
          </p>
        </div>

        {/* Dilip's Division Column */}
        <div>
          <h4 className="font-bold text-on-surface mb-6 font-body-md text-body-md border-b border-primary/30 pb-2 text-primary">
            {t.buildingDiv}
          </h4>
          <p className="text-on-surface font-semibold mb-2">Dilip Chaubey</p>
          <a href="tel:+918400936290" className="text-on-surface-variant hover:text-primary transition-colors mb-1 block">
            84009 36290
          </a>
          <ul className="space-y-3 mt-6">
            <li>
              <Link to="/products" onClick={handleScrollToTop} className="text-on-surface-variant hover:text-primary transition-all">
                {t.products}
              </Link>
            </li>
            <li>
              <Link to="/shuttering" onClick={handleScrollToTop} className="text-on-surface-variant hover:text-primary transition-all">
                {t.shuttering}
              </Link>
            </li>
            <li>
              <Link to="/rcc-roads" onClick={handleScrollToTop} className="text-on-surface-variant hover:text-primary transition-all">
                {t.rccRoads}
              </Link>
            </li>
            <li>
              <Link to="/order" onClick={handleScrollToTop} className="text-on-surface-variant hover:text-primary transition-all">
                {t.order}
              </Link>
            </li>
          </ul>
        </div>

        {/* Alok's Division Column */}
        <div>
          <h4 className="font-bold text-on-surface mb-6 font-body-md text-body-md border-b border-[#1565C0]/30 pb-2 text-[#1565C0]">
            {t.pipesDiv}
          </h4>
          <p className="text-on-surface font-semibold mb-2">Alok Chaubey</p>
          <a href="tel:+919722832661" className="text-on-surface-variant hover:text-[#1565C0] transition-colors mb-1 block">
            97228 32661
          </a>
          <ul className="space-y-3 mt-6">
            <li>
              <Link to="/pipes" onClick={handleScrollToTop} className="text-on-surface-variant hover:text-[#1565C0] transition-all">
                {t.pipes}
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={handleScrollToTop} className="text-on-surface-variant hover:text-primary transition-all">
                {t.about}
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={handleScrollToTop} className="text-on-surface-variant hover:text-primary transition-all">
                {t.contact}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h4 className="font-bold text-on-surface mb-6 font-body-md text-body-md border-b border-on-surface/5 pb-2">
            {language === 'hi' ? 'संपर्क सूत्र' : 'Contact Us'}
          </h4>
          <p className="text-on-surface-variant font-body-md text-body-md mb-4 flex items-start gap-2 leading-relaxed">
            <span className="material-symbols-outlined text-primary shrink-0 mt-1">location_on</span>
            <a 
              href="https://www.google.com/maps/place/Deesa,+Gujarat" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors hover:underline"
            >
              {t.addressVal}
            </a>
          </p>
          <div className="text-on-surface-variant font-body-md text-body-md mb-4 flex items-start gap-2 leading-relaxed">
            <span className="material-symbols-outlined text-primary shrink-0 mt-1">schedule</span>
            <div>
              <p>{t.hoursVal}</p>
              <p className="text-sm">{t.sunday}</p>
            </div>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md flex items-start gap-2 leading-relaxed">
            <span className="material-symbols-outlined text-primary shrink-0 mt-1">mail</span>
            <a href="mailto:info@swastikainterlocking.live" className="hover:text-primary transition-colors hover:underline">
              info@swastikainterlocking.live
            </a>
          </p>
        </div>
      </div>

      <div className="max-w-container-max mx-auto mt-12 pt-8 border-t border-on-surface/10 text-center text-on-surface-variant font-body-md text-body-md">
        © {new Date().getFullYear()} Swastika Interlocking | Dilip Chaubey & Alok Chaubey | Deesa, Gujarat
      </div>
    </footer>
  );
}
