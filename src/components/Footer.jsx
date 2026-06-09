import React from 'react';
import { Link } from 'react-router-dom';

const TRANSLATIONS = {
  hi: {
    desc: 'प्रीमियम निर्माण परियोजनाओं के लिए उच्च-शक्ति इंटरलॉकिंग पेवर ब्लॉक और कंक्रीट समाधानों के निर्माता।',
    quickLinks: 'त्वरित लिंक',
    ourProducts: 'हमारे उत्पाद',
    contactUs: 'संपर्क सूत्र',
    addressVal: 'Girdharpur uncher, Kauriram, Uttar Pradesh' ,
    hoursVal: 'सोम - शनि: सुबह 9:00 बजे - शाम 7:00 बजे',
    sunday: 'रविवार: बंद',
    home: 'मुख्य पृष्ठ',
    products: 'उत्पाद',
    bookOrder: 'ऑर्डर बुक करें',
    contact: 'संपर्क'
  },
  en: {
    desc: 'Leading manufacturers of high-strength interlocking pavers and concrete solutions for premium construction projects.',
    quickLinks: 'Quick Links',
    ourProducts: 'Our Products',
    contactUs: 'Contact Us',
    addressVal: 'Girdharpur uncher, Kauriram, Uttar Pradesh',
    hoursVal: 'Mon - Sat: 9:00 AM - 7:00 PM',
    sunday: 'Sunday: Closed',
    home: 'Home',
    products: 'Products',
    bookOrder: 'Book Order',
    contact: 'Contact Us'
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
            <span className="font-headline-md text-headline-md font-bold text-primary dark:text-inverse-primary leading-tight">
              Swastika<br/><span className="text-on-surface">Interlocking</span>
            </span>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md mb-6 leading-relaxed">
            {t.desc}
          </p>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="font-bold text-on-surface mb-6 font-body-md text-body-md border-b border-on-surface/5 pb-2">
            {t.quickLinks}
          </h4>
          <ul className="space-y-4">
            <li>
              <Link to="/" onClick={handleScrollToTop} className="text-on-surface-variant hover:text-primary transition-all font-body-md text-body-md hover:underline decoration-primary">
                {t.home}
              </Link>
            </li>
            <li>
              <Link to="/products" onClick={handleScrollToTop} className="text-on-surface-variant hover:text-primary transition-all font-body-md text-body-md hover:underline decoration-primary">
                {t.products}
              </Link>
            </li>
            <li>
              <Link to="/order" onClick={handleScrollToTop} className="text-on-surface-variant hover:text-primary transition-all font-body-md text-body-md hover:underline decoration-primary">
                {t.bookOrder}
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={handleScrollToTop} className="text-on-surface-variant hover:text-primary transition-all font-body-md text-body-md hover:underline decoration-primary">
                {t.contact}
              </Link>
            </li>
          </ul>
        </div>

        {/* Products Column */}
        <div>
          <h4 className="font-bold text-on-surface mb-6 font-body-md text-body-md border-b border-on-surface/5 pb-2">
            {t.ourProducts}
          </h4>
          <ul className="space-y-4">
            <li>
              <Link to="/products" onClick={handleScrollToTop} className="text-on-surface-variant hover:text-primary transition-all font-body-md text-body-md">
                Zig-Zag Pavers
              </Link>
            </li>
            <li>
              <Link to="/products" onClick={handleScrollToTop} className="text-on-surface-variant hover:text-primary transition-all font-body-md text-body-md">
                I-Shape Blocks
              </Link>
            </li>
            <li>
              <Link to="/products" onClick={handleScrollToTop} className="text-on-surface-variant hover:text-primary transition-all font-body-md text-body-md">
                Grass Pavers
              </Link>
            </li>
            <li>
              <Link to="/products" onClick={handleScrollToTop} className="text-on-surface-variant hover:text-primary transition-all font-body-md text-body-md">
                Hollow Blocks & Pipes
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h4 className="font-bold text-on-surface mb-6 font-body-md text-body-md border-b border-on-surface/5 pb-2">
            {t.contactUs}
          </h4>
          <p className="text-on-surface-variant font-body-md text-body-md mb-4 flex items-start gap-2 leading-relaxed">
            <span className="material-symbols-outlined text-primary shrink-0 mt-1">location_on</span>
            <a 
              href="https://www.google.com/maps/place/26%C2%B029'55.8%22N+83%C2%B027'07.6%22E/@26.4988289,83.4495354,17z/data=!3m1!4b1!4m4!3m3!8m2!3d26.4988289!4d83.4521103?hl=en&entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors hover:underline"
            >
              {t.addressVal}
            </a>
          </p>
          <div className="text-on-surface-variant font-body-md text-body-md mb-4 flex items-start gap-2 leading-relaxed">
            <span className="material-symbols-outlined text-primary shrink-0 mt-1">call</span>
            <div className="flex flex-col gap-1">
              <a href="tel:+918400936290" className="hover:text-primary transition-colors hover:underline">+91 8400936290</a>
              <a href="tel:+917905887340" className="hover:text-primary transition-colors hover:underline">+91 79058 87340</a>
            </div>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md flex items-start gap-2 leading-relaxed">
            <span className="material-symbols-outlined text-primary shrink-0 mt-1">mail</span>
            <a href="mailto:skandchaueby03@gmail.com" className="hover:text-primary transition-colors hover:underline">
              skandchaueby03@gmail.com
            </a>
          </p>
        </div>
      </div>

      <div className="max-w-container-max mx-auto mt-12 pt-8 border-t border-on-surface/10 text-center text-on-surface-variant font-body-md text-body-md">
        © {new Date().getFullYear()} Swastika Interlocking. All Rights Reserved.
      </div>
    </footer>
  );
}
