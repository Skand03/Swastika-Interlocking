import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const TRANSLATIONS = {
  hi: {
    home: 'मुख्य पृष्ठ',
    services: 'सेवाएं',
    about: 'हमारे बारे में',
    process: 'प्रक्रिया',
    products: 'उत्पाद',
    contact: 'संपर्क',
    bookOrder: 'ऑर्डर बुक करें',
    portal: 'पोर्टल लॉगिन',
    dashboard: 'डैशबोर्ड',
    logout: 'लॉगआउट'
  },
  en: {
    home: 'Home',
    services: 'Services',
    about: 'About Us',
    process: 'Process',
    products: 'Products',
    contact: 'Contact',
    bookOrder: 'Book Order',
    portal: 'Portal Login',
    dashboard: 'Dashboard',
    logout: 'Logout'
  }
};

export default function Navbar({ language, setLanguage }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const t = TRANSLATIONS[language];

  // Retrieve logged-in session user
  const sessionUser = localStorage.getItem('user');
  const loggedInUser = sessionUser ? JSON.parse(sessionUser) : null;

  const handleScrollToSection = (id) => {
    setIsOpen(false);
    if (location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.hash = `#/${id}`;
    }
  };

  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  // Shared language switcher markup
  const LanguageToggle = () => (
    <div className="flex items-center bg-surface-container border border-outline/20 p-1 rounded-full select-none text-xs font-semibold">
      <button 
        onClick={() => setLanguage('hi')} 
        className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
          language === 'hi' ? 'bg-primary text-white shadow-sm' : 'text-on-surface hover:text-primary'
        }`}
      >
        हिन्दी
      </button>
      <button 
        onClick={() => setLanguage('en')} 
        className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
          language === 'en' ? 'bg-primary text-white shadow-sm' : 'text-on-surface hover:text-primary'
        }`}
      >
        EN
      </button>
    </div>
  );

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/95 backdrop-blur-md shadow-sm border-b border-surface-variant/30 select-none">
      <nav className="flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto">
        {/* Brand Logo */}
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 select-none">
          <img alt="Swastika Interlocking Logo" className="h-12 w-12 object-contain" src="/logo.svg" />
          <div className="flex flex-col">
            <span className="font-display-lg text-lg font-bold leading-tight tracking-wider text-on-surface">स्वस्तिका</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Interlocking</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link 
            to="/" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className={`font-medium transition-colors hover:text-primary ${isLinkActive('/') ? 'text-primary' : 'text-tertiary'}`}
          >
            {t.home}
          </Link>
          <button 
            onClick={() => handleScrollToSection('services')} 
            className="text-tertiary hover:text-primary transition-colors font-medium cursor-pointer"
          >
            {t.services}
          </button>
          
          <Link 
            to="/about"
            className={`font-medium transition-colors hover:text-primary ${isLinkActive('/about') ? 'text-primary' : 'text-tertiary'}`}
          >
            {t.about}
          </Link>

          <button 
            onClick={() => handleScrollToSection('process')} 
            className="text-tertiary hover:text-primary transition-colors font-medium cursor-pointer"
          >
            {t.process}
          </button>
          <Link 
            to="/products" 
            className={`font-medium transition-colors hover:text-primary ${isLinkActive('/products') ? 'text-primary' : 'text-tertiary'}`}
          >
            {t.products}
          </Link>
          <Link 
            to="/contact" 
            className={`font-medium transition-colors hover:text-primary ${isLinkActive('/contact') ? 'text-primary' : 'text-tertiary'}`}
          >
            {t.contact}
          </Link>

          {/* Portal Authentication Links */}
          {loggedInUser ? (
            <div className="flex items-center gap-4 border-l pl-4 border-outline/10">
              <Link 
                to={loggedInUser.role === 'admin' ? '/admin-dashboard' : '/customer-dashboard'} 
                className={`font-bold transition-colors hover:text-primary ${
                  isLinkActive('/admin-dashboard') || isLinkActive('/customer-dashboard') ? 'text-primary' : 'text-tertiary'
                }`}
              >
                {t.dashboard}
              </Link>
              <button 
                onClick={() => {
                  localStorage.removeItem('user');
                  window.location.reload();
                }}
                className="text-[#ba1a1a] hover:text-red-700 transition-colors font-bold cursor-pointer text-xs uppercase"
              >
                {t.logout}
              </button>
            </div>
          ) : (
            <Link 
              to="/auth" 
              className={`font-bold transition-colors hover:text-primary ${isLinkActive('/auth') ? 'text-primary' : 'text-tertiary'}`}
            >
              {t.portal}
            </Link>
          )}
        </div>

        {/* Language Toggler & CTA Button */}
        <div className="hidden md:flex items-center gap-6">
          <LanguageToggle />
          <Link 
            to="/order" 
            className="bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-xl leading-none">shopping_cart</span>
            {t.bookOrder}
          </Link>
        </div>

        {/* Mobile Buttons */}
        <div className="flex md:hidden items-center gap-3">
          <LanguageToggle />
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="flex items-center justify-center p-2 text-on-surface hover:text-primary focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-surface border-t border-surface-variant/30 py-4 px-gutter flex flex-col gap-4 shadow-inner">
          <Link 
            to="/" 
            onClick={() => { setIsOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            className={`font-medium transition-colors hover:text-primary py-1 ${isLinkActive('/') ? 'text-primary' : 'text-tertiary'}`}
          >
            {t.home}
          </Link>
          <button 
            onClick={() => handleScrollToSection('services')} 
            className="text-left text-tertiary hover:text-primary transition-colors font-medium py-1 cursor-pointer"
          >
            {t.services}
          </button>
          
          <Link 
            to="/about" 
            onClick={() => setIsOpen(false)}
            className={`font-medium transition-colors hover:text-primary py-1 ${isLinkActive('/about') ? 'text-primary' : 'text-tertiary'}`}
          >
            {t.about}
          </Link>

          <button 
            onClick={() => handleScrollToSection('process')} 
            className="text-left text-tertiary hover:text-primary transition-colors font-medium py-1 cursor-pointer"
          >
            {t.process}
          </button>
          <Link 
            to="/products" 
            onClick={() => setIsOpen(false)} 
            className={`font-medium transition-colors hover:text-primary py-1 ${isLinkActive('/products') ? 'text-primary' : 'text-tertiary'}`}
          >
            {t.products}
          </Link>
          <Link 
            to="/contact" 
            onClick={() => setIsOpen(false)} 
            className={`font-medium transition-colors hover:text-primary py-1 ${isLinkActive('/contact') ? 'text-primary' : 'text-tertiary'}`}
          >
            {t.contact}
          </Link>

          {/* Portal Authentication Links (Mobile) */}
          {loggedInUser ? (
            <>
              <Link 
                to={loggedInUser.role === 'admin' ? '/admin-dashboard' : '/customer-dashboard'} 
                onClick={() => setIsOpen(false)}
                className={`font-bold transition-colors hover:text-primary py-1 ${
                  isLinkActive('/admin-dashboard') || isLinkActive('/customer-dashboard') ? 'text-primary' : 'text-tertiary'
                }`}
              >
                {t.dashboard}
              </Link>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  localStorage.removeItem('user');
                  window.location.reload();
                }}
                className="text-left text-[#ba1a1a] hover:text-red-700 transition-colors font-bold py-1 cursor-pointer"
              >
                {t.logout}
              </button>
            </>
          ) : (
            <Link 
              to="/auth" 
              onClick={() => setIsOpen(false)}
              className={`font-bold transition-colors hover:text-primary py-1 ${isLinkActive('/auth') ? 'text-primary' : 'text-tertiary'}`}
            >
              {t.portal}
            </Link>
          )}

          <Link 
            to="/order" 
            onClick={() => setIsOpen(false)} 
            className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-full font-medium text-center transition-all shadow-md flex items-center justify-center gap-2 mt-2"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {t.bookOrder}
          </Link>
        </div>
      )}
    </header>
  );
}
