import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TRANSLATIONS = {
  hi: {
    home: 'Home',
    about: 'About',
    products: 'Products',
    rccRoads: 'RCC Roads',
    projects: 'Projects',
    contact: 'Contact',
    order: 'Order',
    portal: 'Portal Login',
    buildingMaterials: 'Building Materials',
    shutteringMaterials: 'Shuttering Materials'
  },
  en: {
    home: 'Home',
    about: 'About',
    products: 'Products',
    rccRoads: 'RCC Roads',
    projects: 'Projects',
    contact: 'Contact',
    order: 'Order',
    portal: 'Portal Login',
    buildingMaterials: 'Building Materials',
    shutteringMaterials: 'Shuttering Materials'
  }
};

export default function Navbar({ language, setLanguage }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { dbUser, logout } = useAuth();
  
  // Use English text by default for the navbar to match the screenshot exactly
  const t = TRANSLATIONS['en'];

  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  const linkClass = (path) => {
    const isActive = isLinkActive(path);
    return `pb-1 text-sm font-medium transition-colors ${isActive ? 'text-white border-b-2 border-white/60' : 'text-white/80 hover:text-white'}`;
  };

  const loggedInUser = dbUser;

  const handleLogout = async () => {
    await logout();
    window.location.href = '#/';
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      <nav className="flex justify-between items-center px-6 md:px-12 py-3 bg-[#0E0E55] border-b border-white/10 shadow-xl select-none">
        
        {/* Brand Logo inside a glass pill */}
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2 hover:bg-white/20 transition-all flex-shrink-0">
          <div className="bg-white p-1 rounded-md flex items-center justify-center">
            <img alt="Swastika Interlocking Logo" className="h-6 w-6 object-contain" src="/logo.svg" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[13px] font-bold text-[#E8650A] leading-tight tracking-wide">Swastika</span>
            <span className="text-[15px] font-bold text-white leading-tight">Interlocking</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <Link className={linkClass('/')} to="/">Home</Link>
          
          <div className="group relative">
            <Link to="/products" className={`flex items-center gap-1 ${linkClass('/products')}`}>
              Products <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </Link>
            <div className="absolute top-full left-0 mt-4 w-56 bg-black/80 backdrop-blur-xl shadow-xl rounded-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
              <Link to="/products" className="flex items-center gap-3 p-4 hover:bg-white/10 text-white/90 hover:text-white transition-colors">
                <span className="text-sm font-medium">Building Materials</span>
              </Link>
              <Link to="/shuttering" className="flex items-center gap-3 p-4 hover:bg-white/10 text-white/90 hover:text-white transition-colors">
                <span className="text-sm font-medium">Shuttering Materials</span>
              </Link>
            </div>
          </div>
          
          <Link className={linkClass('/rcc-roads')} to="/rcc-roads">RCC Roads</Link>
          <Link className={linkClass('/about')} to="/about">About</Link>
          <Link className={linkClass('/order')} to="/order">Order</Link>
          <Link className={linkClass('/contact')} to="/contact">Contact</Link>
        </div>
        
        {/* Actions & Mobile Toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center bg-black/40 border border-white/10 p-0.5 sm:p-1 rounded-full select-none text-[10px] sm:text-xs font-bold shadow-inner">
            <button 
              onClick={() => setLanguage('hi')} 
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all cursor-pointer ${
                language === 'hi' ? 'bg-white/20 text-white shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button 
              onClick={() => setLanguage('en')} 
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all cursor-pointer ${
                language === 'en' ? 'bg-white/20 text-white shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          <div className="group relative hidden lg:block">
            <button className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/10">
              {loggedInUser ? (
                <span className="material-symbols-outlined text-white text-[20px]">person</span>
              ) : (
                <span className="material-symbols-outlined text-white/80 text-[20px]">account_circle</span>
              )}
            </button>
            <div className="absolute top-full right-0 mt-4 w-48 bg-[#0E0E55] shadow-xl rounded-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
              {loggedInUser ? (
                <>
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white text-sm font-bold truncate">{loggedInUser.full_name || 'User'}</p>
                    <p className="text-white/60 text-xs truncate">{loggedInUser.email || loggedInUser.phone}</p>
                  </div>
                  <Link to={loggedInUser.role === 'admin' ? '/admin-dashboard' : '/customer-dashboard'} className="flex items-center gap-3 p-3 hover:bg-white/10 text-white/90 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px]">dashboard</span>
                    <span className="text-sm font-medium">Dashboard</span>
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 hover:bg-white/10 text-red-400 hover:text-red-300 transition-colors text-left">
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth" className="flex items-center gap-3 p-3 hover:bg-white/10 text-white/90 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px]">login</span>
                    <span className="text-sm font-medium">Login</span>
                  </Link>
                  <Link to="/auth" className="flex items-center gap-3 p-3 hover:bg-white/10 text-white/90 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                    <span className="text-sm font-medium">Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white p-2 hover:bg-white/10 rounded-full focus:outline-none transition-colors">
            <span className="material-symbols-outlined text-2xl">{isOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 mt-2 w-full bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-4 px-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          {loggedInUser ? (
            <div className="flex flex-col gap-3 mb-2 pb-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex flex-col overflow-hidden">
                  <p className="text-white text-sm font-bold truncate">{loggedInUser.full_name || 'User'}</p>
                  <p className="text-white/60 text-xs truncate">{loggedInUser.email || loggedInUser.phone}</p>
                </div>
                <button onClick={() => { setIsOpen(false); handleLogout(); }} className="w-10 h-10 flex-shrink-0 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </button>
              </div>
              <Link to={loggedInUser.role === 'admin' ? '/admin-dashboard' : '/customer-dashboard'} onClick={() => setIsOpen(false)} className="w-full py-2.5 bg-white/10 rounded-full font-medium text-white text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                <span className="material-symbols-outlined text-[18px]">dashboard</span> Dashboard
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-white/10">
              <Link to="/auth" onClick={() => setIsOpen(false)} className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 rounded-full font-medium text-white text-sm flex items-center justify-center gap-2 transition-colors">
                <span className="material-symbols-outlined text-[18px]">login</span> Login
              </Link>
              <Link to="/auth" onClick={() => setIsOpen(false)} className="flex-1 py-2.5 bg-[#E8650A] hover:opacity-90 rounded-full font-medium text-white text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#E8650A]/20">
                <span className="material-symbols-outlined text-[18px]">person_add</span> Sign Up
              </Link>
            </div>
          )}

          <Link to="/" onClick={() => setIsOpen(false)} className={`py-2 font-medium ${isLinkActive('/') ? 'text-white' : 'text-white/70'}`}>Home</Link>
          
          <div className="flex flex-col gap-2">
            <div className={`py-2 font-medium ${isLinkActive('/products') || isLinkActive('/shuttering') ? 'text-white' : 'text-white/70'}`}>Products</div>
            <div className="flex flex-col pl-4 border-l-2 border-white/10 ml-2 gap-3">
              <Link to="/products" onClick={() => setIsOpen(false)} className={`text-sm font-medium ${isLinkActive('/products') ? 'text-white' : 'text-white/60'}`}>Building Materials</Link>
              <Link to="/shuttering" onClick={() => setIsOpen(false)} className={`text-sm font-medium ${isLinkActive('/shuttering') ? 'text-white' : 'text-white/60'}`}>Shuttering Materials</Link>
            </div>
          </div>
          <Link to="/rcc-roads" onClick={() => setIsOpen(false)} className={`py-2 font-medium ${isLinkActive('/rcc-roads') ? 'text-white' : 'text-white/70'}`}>RCC Roads</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className={`py-2 font-medium ${isLinkActive('/about') ? 'text-white' : 'text-white/70'}`}>About</Link>
          <Link to="/order" onClick={() => setIsOpen(false)} className={`py-2 font-medium ${isLinkActive('/order') ? 'text-white' : 'text-white/70'}`}>Order</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className={`py-2 font-medium ${isLinkActive('/contact') ? 'text-white' : 'text-white/70'}`}>Contact</Link>
        </div>
      )}
    </header>
  );
}
