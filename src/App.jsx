import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Products from './pages/Products';
import Order from './pages/Order';
import Contact from './pages/Contact';
import About from './pages/About';
import ProductDetail from './pages/ProductDetail';
import Auth from './pages/Auth';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Scroll restoration and section anchor scroll helper
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const cleanId = hash.replace('#/', '').replace('#', '');
      const element = document.getElementById(cleanId);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(timer);
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}

function App() {
  // Global language state ('hi' for Hindi, 'en' for English)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('lang') || 'hi';
  });

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-surface">
        {/* Navigation Bar */}
        <Navbar language={language} setLanguage={handleLanguageChange} />

        {/* Dynamic Route Pages */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home language={language} />} />
            <Route path="/products" element={<Products language={language} />} />
            <Route path="/products/:id" element={<ProductDetail language={language} />} />
            <Route path="/order" element={<Order language={language} />} />
            <Route path="/contact" element={<Contact language={language} />} />
            <Route path="/about" element={<About language={language} />} />
            <Route path="/auth" element={<Auth language={language} />} />
            <Route path="/customer-dashboard" element={<CustomerDashboard language={language} />} />
            <Route path="/admin-dashboard" element={<AdminDashboard language={language} />} />
          <Route path="admin-dashboard" element={<AdminDashboard language={language} />} />
          </Routes>
        </div>

        {/* Global Floating AI Chatbot & WhatsApp support */}
        <Chatbot language={language} />

        {/* Footer */}
        <Footer language={language} />
      </div>
    </Router>
  );
}

export default App;
