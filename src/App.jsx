import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Products from './pages/Products';
import Order from './pages/Order';
import OrderDetails from './pages/OrderDetails';
import Contact from './pages/Contact';
import About from './pages/About';
import ProductDetail from './pages/ProductDetail';
import Auth from './pages/Auth';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminShell from './components/admin/AdminShell';
import AdminRoutes from './routes/adminRoutes';
import Shuttering from './pages/Shuttering';
import ShutteringDetail from './pages/ShutteringDetail';
import ShutteringEnquiry from './pages/ShutteringEnquiry';
import RCCRoads from './pages/RCCRoads';
import RCCEnquiry from './pages/RCCEnquiry';
import NotFound from './pages/NotFound';
import ProtectedRoute from './auth/ProtectedRoute';
import AdminRoute from './auth/AdminRoute';
import AuthGate from './components/AuthGate';
import CompleteProfileModal from './components/CompleteProfileModal';
import { useNewOrders, useNewInquiries, useLowStock, useRentalsDueToday } from './hooks/useRealtime';

// Scroll restoration and section anchor scroll helper
function SEOUpdater({ language }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const metaDescriptions = {
      hi: {
        '/': 'स्वस्तिका इंटरलॉकिंग - उच्च गुणवत्ता वाले पेवर ब्लॉक्स और आरसीसी सड़कों के अग्रणी निर्माता।',
        '/products': 'ड्राइववे, रास्ते और औद्योगिक उपयोग के लिए हमारे प्रीमियम इंटरलॉकिंग पेवर ब्लॉक्स का अन्वेषण करें।',
        '/rcc-roads': 'भारी-भरकम आरसीसी सड़क निर्माण सेवाएं, मजबूती और दीर्घायु के लिए।',
        '/contact': 'अपनी सभी कंक्रीट पेविंग और शटरिंग जरूरतों के लिए स्वस्तिका इंटरलॉकिंग से संपर्क करें।',
        '/shuttering': 'उच्च भार वहन क्षमता वाली शीर्ष श्रेणी की स्टील शटरिंग सामग्री और मचान।'
      },
      en: {
        '/': 'Swastika Interlocking - Leading manufacturer of high-quality paver blocks and RCC roads.',
        '/products': 'Explore our premium interlocking paver blocks for driveways, pathways, and industrial use.',
        '/rcc-roads': 'Heavy-duty RCC road construction services tailored for strength and longevity.',
        '/contact': 'Contact Swastika Interlocking for all your concrete paving and shuttering needs.',
        '/shuttering': 'Top-grade steel shuttering materials and scaffolding with high load-bearing capacity.'
      }
    };

    const titles = {
      hi: {
        '/': 'होम | स्वस्तिका इंटरलॉकिंग',
        '/products': 'उत्पाद | स्वस्तिका इंटरलॉकिंग',
        '/rcc-roads': 'आरसीसी सड़कें | स्वस्तिका',
        '/contact': 'संपर्क करें | स्वस्तिका',
        '/shuttering': 'शटरिंग सामग्री | स्वस्तिका'
      },
      en: {
        '/': 'Home | Swastika Interlocking',
        '/products': 'Products | Swastika Interlocking',
        '/rcc-roads': 'RCC Roads | Swastika',
        '/contact': 'Contact Us | Swastika',
        '/shuttering': 'Shuttering Materials | Swastika'
      }
    };

    const tMap = titles[language] || titles.en;
    const dMap = metaDescriptions[language] || metaDescriptions.en;
    
    document.title = tMap[pathname] || 'Swastika Interlocking | निर्माण में विश्वास';
    
    let metaTag = document.querySelector('meta[name="description"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = "description";
      document.head.appendChild(metaTag);
    }
    metaTag.content = dMap[pathname] || dMap['/'];
  }, [pathname, language]);

  return null;
}

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

function RealtimeManager() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  
  useNewOrders(isAdmin);
  useNewInquiries(isAdmin);
  useLowStock(isAdmin);
  useRentalsDueToday(isAdmin);
  
  return null;
}

function AppContent({ language, handleLanguageChange }) {
  const location = useLocation();
  const { profile, updateProfile, loading: authLoading } = useAuth();
  const isAdminPath = location.pathname.startsWith('/admin-dashboard');
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);

  // Check if profile is complete (has required fields)
  const isProfileComplete = (prof) => {
    if (!prof) return false;
    return !!(
      prof.full_name &&
      prof.phone &&
      prof.city &&
      prof.address
    );
  };

  useEffect(() => {
    if (!authLoading && profile && !isProfileComplete(profile) && !isAdminPath && location.pathname !== '/auth') {
      setShowCompleteProfile(true);
    } else {
      setShowCompleteProfile(false);
    }
  }, [profile, authLoading, location.pathname, isAdminPath]);

  const handleProfileComplete = async (formData) => {
    await updateProfile(formData);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <RealtimeManager />
      {/* Navigation Bar */}
      {!isAdminPath && <Navbar language={language} setLanguage={handleLanguageChange} />}

      {/* Dynamic Route Pages */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home language={language} />} />
          <Route path="/products" element={<Products language={language} />} />
          <Route path="/products/:id" element={<ProductDetail language={language} />} />
          <Route path="/order" element={
            <AuthGate language={language}>
              <Order language={language} />
            </AuthGate>
          } />
          <Route path="/order/:id" element={
            <ProtectedRoute>
              <OrderDetails language={language} />
            </ProtectedRoute>
          } />
          <Route path="/contact" element={
            <AuthGate language={language}>
              <Contact language={language} />
            </AuthGate>
          } />
          <Route path="/about" element={<About language={language} />} />
          <Route path="/shuttering" element={<Shuttering language={language} />} />
          <Route path="/shuttering/:productId" element={<ShutteringDetail language={language} />} />
          <Route path="/shuttering-enquiry" element={
            <AuthGate language={language}>
              <ShutteringEnquiry language={language} />
            </AuthGate>
          } />
          <Route path="/rcc-roads" element={<RCCRoads language={language} />} />
          <Route path="/rcc-enquiry" element={
            <AuthGate language={language}>
              <RCCEnquiry language={language} />
            </AuthGate>
          } />
          <Route path="/auth" element={<Auth language={language} />} />
          
          <Route path="/customer-dashboard" element={
            <ProtectedRoute>
              <CustomerDashboard language={language} />
            </ProtectedRoute>
          } />
          
          <Route path="/admin-dashboard/*" element={
            <AdminRoute>
              <AdminShell>
                <AdminRoutes language={language} />
              </AdminShell>
            </AdminRoute>
          } />

          {/* Fallback route for undefined paths */}
          <Route path="*" element={<NotFound language={language} />} />
        </Routes>
      </div>

      {/* Global Floating AI Chatbot & WhatsApp support */}
      {!isAdminPath && <Chatbot language={language} />}

      {/* Footer */}
      {!isAdminPath && !location.pathname.startsWith('/customer-dashboard') && <Footer language={language} />}

      {/* Complete Profile Modal */}
      <CompleteProfileModal
        isOpen={showCompleteProfile}
        onClose={() => setShowCompleteProfile(false)}
        onComplete={handleProfileComplete}
      />
    </div>
  );
}

function OAuthRedirectHandler() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if URL has OAuth hash params
    if (window.location.hash.includes('access_token') || window.location.hash.includes('error')) {
      // Supabase's auth library will process the hash automatically, so just redirect to home
      navigate('/', { replace: true });
    }
  }, [navigate]);
  
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
    <AuthProvider>
      <Router>
        <OAuthRedirectHandler />
        <ScrollToTop />
        <SEOUpdater language={language} />
        <Toaster position="top-right" />
        <AppContent language={language} handleLanguageChange={handleLanguageChange} />
      </Router>
    </AuthProvider>
  );
}

export default App;
