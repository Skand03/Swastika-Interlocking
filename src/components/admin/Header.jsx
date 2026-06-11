import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { getAllInquiries } from '../../services/inquiryService';

export default function Header({ toggleSidebar, language, handleLanguageChange }) {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [readInquiryIds, setReadInquiryIds] = useState(() => {
    try {
      const saved = localStorage.getItem('readInquiryIds');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const notificationsRef = useRef(null);

  const isHindi = language === 'hi';

  // Fetch inquiries
  useEffect(() => {
    const fetch = async () => {
      const data = await getAllInquiries();
      setInquiries(data);
    };
    fetch();
  }, []);

  // Save read ids to localStorage
  useEffect(() => {
    localStorage.setItem('readInquiryIds', JSON.stringify(readInquiryIds));
  }, [readInquiryIds]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadInquiries = inquiries.filter(inq => !readInquiryIds.includes(inq.id));

  const markAsRead = (id) => {
    if (!readInquiryIds.includes(id)) {
      setReadInquiryIds(prev => [...prev, id]);
    }
  };

  const markAllAsRead = () => {
    const allIds = inquiries.map(inq => inq.id);
    setReadInquiryIds(allIds);
  };

  const formatNotificationDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `${diffMins} ${isHindi ? 'मिनट' : 'min'} ${isHindi ? 'पहले' : 'ago'}`;
    if (diffHours < 24) return `${diffHours} ${isHindi ? 'घंटे' : 'h'} ${isHindi ? 'पहले' : 'ago'}`;
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-4 md:px-6 py-3 shadow-sm relative">
      <div className="flex items-center gap-2 md:gap-3">
        <button onClick={toggleSidebar} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg -ml-2">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <img src="/logo.svg" alt="Swastika" className="h-8 w-8 hidden sm:block" />
        <h1 className="text-lg md:text-xl font-bold text-gray-800">Swastika Admin</h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center bg-gray-100 border border-gray-200 p-0.5 rounded-full text-xs font-bold">
          <button 
            onClick={() => handleLanguageChange('hi')} 
            className={`px-3 py-1.5 rounded-full transition ${language === 'hi' ? 'bg-orange-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
          >
            हिन्दी
          </button>
          <button 
            onClick={() => handleLanguageChange('en')} 
            className={`px-3 py-1.5 rounded-full transition ${language === 'en' ? 'bg-orange-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
          >
            EN
          </button>
        </div>
        
        {/* Notifications Bell */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)} 
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 relative"
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadInquiries.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadInquiries.length > 9 ? '9+' : unreadInquiries.length}
              </span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">{isHindi ? 'सूचनाएँ' : 'Notifications'}</h3>
                {unreadInquiries.length > 0 && (
                  <button 
                    onClick={markAllAsRead} 
                    className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    {isHindi ? 'सभी पढ़ें' : 'Mark all read'}
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {inquiries.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    {isHindi ? 'कोई सूचना नहीं है।' : 'No notifications yet.'}
                  </div>
                ) : (
                  inquiries.slice(0, 10).map(inq => (
                    <div 
                      key={inq.id} 
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!readInquiryIds.includes(inq.id) ? 'bg-orange-50' : ''}`}
                      onClick={() => markAsRead(inq.id)}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                            {inq.customer_name || inq.name}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {inq.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatNotificationDate(inq.created_at)}
                          </p>
                        </div>
                        {!readInquiryIds.includes(inq.id) && (
                          <span className="w-2 h-2 bg-orange-600 rounded-full flex-shrink-0 mt-1"></span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 border-t border-gray-100 text-center">
                <button 
                  onClick={() => { setShowNotifications(false); navigate('/admin-dashboard/inquiries'); }} 
                  className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
                >
                  {isHindi ? 'सभी पूछताछ देखें' : 'View all inquiries'}
                </button>
              </div>
            </div>
          )}
        </div>

        <span className="text-xs md:text-sm text-gray-600 hidden sm:block">{profile?.full_name || 'Admin'}</span>
        <button
          onClick={handleLogout}
          className="px-3 md:px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
