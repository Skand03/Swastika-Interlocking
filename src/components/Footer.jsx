import React from 'react';
import { Link } from 'react-router-dom';

const TRANSLATIONS = {
  hi: {
    desc: 'प्रीमियम निर्माण परियोजनाओं के लिए उच्च-शक्ति इंटरलॉकिंग पेवर ब्लॉक और कंक्रीट समाधानों के निर्माता।',
    quickLinks: 'त्वरित लिंक',
    ourProducts: 'हमारे उत्पाद',
    contactUs: 'संपर्क सूत्र',
    addressVal: 'मुख्य औद्योगिक क्षेत्र, रोड नंबर 7, प्लॉट 42-बी, भारत',
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
    addressVal: 'Main Industrial Area, Road 7, Plot 42-B, India',
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
    <footer class="bg-surface-container py-16 px-gutter border-t border-surface-variant/30 select-none">
      <div class="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div class="flex flex-col">
          <div class="flex items-center gap-3 mb-6">
            <img alt="Swastika Interlocking Logo" class="h-10 w-10 object-contain" src="/logo.svg" />
            <span class="font-headline-md text-headline-md text-primary font-bold">Swastika</span>
          </div>
          <p class="text-on-surface-variant font-body-md text-body-md mb-6 leading-relaxed">
            {t.desc}
          </p>
          <div class="flex gap-4">
            <a class="w-10 h-10 rounded-full bg-on-surface/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer" href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <span class="material-symbols-outlined">facebook</span>
            </a>
            <a class="w-10 h-10 rounded-full bg-on-surface/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer" href="mailto:sales@swastikainterlocking.com" aria-label="Mail">
              <span class="material-symbols-outlined">alternate_email</span>
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 class="font-bold text-on-surface mb-6 font-body-md text-body-md border-b border-on-surface/5 pb-2">
            {t.quickLinks}
          </h4>
          <ul class="space-y-4">
            <li>
              <Link to="/" onClick={handleScrollToTop} class="text-on-surface-variant hover:text-primary transition-all font-body-md text-body-md hover:underline decoration-primary">
                {t.home}
              </Link>
            </li>
            <li>
              <Link to="/products" onClick={handleScrollToTop} class="text-on-surface-variant hover:text-primary transition-all font-body-md text-body-md hover:underline decoration-primary">
                {t.products}
              </Link>
            </li>
            <li>
              <Link to="/order" onClick={handleScrollToTop} class="text-on-surface-variant hover:text-primary transition-all font-body-md text-body-md hover:underline decoration-primary">
                {t.bookOrder}
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={handleScrollToTop} class="text-on-surface-variant hover:text-primary transition-all font-body-md text-body-md hover:underline decoration-primary">
                {t.contact}
              </Link>
            </li>
          </ul>
        </div>

        {/* Products Column */}
        <div>
          <h4 class="font-bold text-on-surface mb-6 font-body-md text-body-md border-b border-on-surface/5 pb-2">
            {t.ourProducts}
          </h4>
          <ul class="space-y-4">
            <li>
              <Link to="/products" onClick={handleScrollToTop} class="text-on-surface-variant hover:text-primary transition-all font-body-md text-body-md">
                Zig-Zag Pavers
              </Link>
            </li>
            <li>
              <Link to="/products" onClick={handleScrollToTop} class="text-on-surface-variant hover:text-primary transition-all font-body-md text-body-md">
                I-Shape Blocks
              </Link>
            </li>
            <li>
              <Link to="/products" onClick={handleScrollToTop} class="text-on-surface-variant hover:text-primary transition-all font-body-md text-body-md">
                Grass Pavers
              </Link>
            </li>
            <li>
              <Link to="/products" onClick={handleScrollToTop} class="text-on-surface-variant hover:text-primary transition-all font-body-md text-body-md">
                Hollow Blocks & Pipes
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h4 class="font-bold text-on-surface mb-6 font-body-md text-body-md border-b border-on-surface/5 pb-2">
            {t.contactUs}
          </h4>
          <p class="text-on-surface-variant font-body-md text-body-md mb-4 flex gap-2 leading-relaxed">
            <span class="material-symbols-outlined text-primary shrink-0">location_on</span>
            {t.addressVal}
          </p>
          <p class="text-on-surface-variant font-body-md text-body-md mb-4 flex gap-2 items-center">
            <span class="material-symbols-outlined text-primary shrink-0">call</span>
            +91 98765 43210
          </p>
          <p class="text-on-surface-variant font-body-md text-body-md flex gap-2 items-center">
            <span class="material-symbols-outlined text-primary shrink-0">mail</span>
            sales@swastikainterlocking.com
          </p>
        </div>
      </div>

      <div class="max-w-container-max mx-auto mt-12 pt-8 border-t border-on-surface/10 text-center text-on-surface-variant font-body-md text-body-md">
        © {new Date().getFullYear()} Swastika Interlocking. All Rights Reserved.
      </div>
    </footer>
  );
}
