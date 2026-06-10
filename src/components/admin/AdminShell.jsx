import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../../auth/AuthContext';

export default function AdminShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If no authenticated user or not admin, redirect to auth page
    if (!profile || profile.role !== 'admin') {
      navigate('/auth');
    }
  }, [profile, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-100 print:bg-white relative">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`print:hidden fixed inset-y-0 left-0 z-30 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300`}
        >
        <Sidebar setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 print:ml-0 w-full min-w-0">
        <div className="print:hidden">
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>
        <main className="flex-1 p-4 md:p-6 print:p-0 overflow-y-auto print:overflow-visible">
          {children}
        </main>
        <div className="print:hidden"><Footer /></div>
      </div>
    </div>
  );
}
