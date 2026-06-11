import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../../auth/AuthContext';

export default function AdminShell({ children, language, handleLanguageChange }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If no authenticated user or not admin, redirect to auth page
    if (!profile || profile.role !== 'admin') {
      navigate('/auth');
    }
  }, [profile, navigate]);

  // Close sidebar when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 print:bg-white relative">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`print:hidden fixed inset-y-0 left-0 z-30 w-72 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl`}
      >
        <Sidebar setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-72 print:ml-0 w-full min-w-0">
        <div className="print:hidden sticky top-0 z-10">
          <Header 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            language={language}
            handleLanguageChange={handleLanguageChange}
          />
        </div>
        <main className="flex-1 p-4 sm:p-5 md:p-6 lg:p-8 print:p-0 overflow-y-auto print:overflow-visible">
          {children}
        </main>
        <div className="print:hidden"><Footer /></div>
      </div>
    </div>
  );
}
