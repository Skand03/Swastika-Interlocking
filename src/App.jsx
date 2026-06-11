import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { Toaster } from 'react-hot-toast';import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Products from './pages/Products';
import Order from './pages/Order';
import OrderDetails from './pages/OrderDetails';
import Contact from './pages/Contact';

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

// Scroll restoration helper
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
  const { profile, updateProfile, loading: authLoading, user } = useAuth();
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
    const isGoogleUser = user?.app_metadata?.provider === 'google';
    if (!authLoading && profile && isGoogleUser && !isProfileComplete(profile) && !isAdminPath && location.pathname !== '/auth') {
      setShowCompleteProfile(true);
    } else {
      setShowCompleteProfile(false);
    }
  }, [profile, authLoading, location.pathname, isAdminPath, user]);

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
              <AdminShell language={language} handleLanguageChange={handleLanguageChange}>
                <AdminRoutes language={language} />
              </AdminShell>
            </AdminRoute>
          } />

          {/* Fallback route for undefined paths */}
          <Route path="*" element={<NotFound language={language} />} />
        </Routes>
      </div>

      {/* Global Floating AI Chatbot */}
      {!isAdminPath && <Chatbot language={language} />}

      {/* WhatsApp floating button — shown on all non-admin pages */}
      {!isAdminPath && <WhatsAppButton language={language} />}

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
        <Toaster position="top-right" />
        <AppContent language={language} handleLanguageChange={handleLanguageChange} />
      </Router>
    </AuthProvider>
  );
}

export default App;
