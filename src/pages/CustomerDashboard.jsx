import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getOrdersByCustomer } from '../services/orderService';
import { getInquiriesByCustomer } from '../services/inquiryService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CATALOG = {
  zigzag: {
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDA-SM7Qe-nP_Tkzlsjs6Sp4wXka5GxYLj2Znx1fbMS8bzC36BXGiV0ez7X-CR0hX3UlQ7We4WZERCP00VlPnmqpEhy58pLMJ2DBrlPb9JJqOrEbmKDcLWv30QhAzBiBHjuGzNEguwp5c3L7rdkOmbwS3sKn_B0MxuLRevVACZyj53PcMMn1AjVx80_O2gi9Q5qMOO1k_yAM2lUNf3rcgBKF2qtpOMkacX-jD0WSE9EbxhxqfVNSXJ6SM5LtDqBtjA3REeL62JvKck']
  },
  'i-shape': {
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDV8Oh3FHQu_59sQPs19BgEkuFdqsh6T7mWg9sygIZ2QOPwffQWIXL2XPPfexCcrOo6V7q1eS6Aiuf7r4qBN7HUcdAlHJARegBln1f8zZ3sHINZY_VDJqMX9uNtEic9qURhzQkH5a1W1THZu6qkfi7Su_MNSzmjGnOids1w_Esw-I4Ghk7lyfaKc1ZPYtWbC1R8rUJXjAkmgV2GIZdVrkeFRrKBaypKyHNpPVQX-_nlyoLeBfuyoi_ZGHLa8Cu3VhjSwIJR_p_YJtU']
  }
};

const getProductThumbnail = (productType = '') => {
  const pt = productType.toLowerCase();
  if (pt.includes('zigzag') || pt.includes('z-shape')) {
    return CATALOG.zigzag.images[0];
  }
  if (pt.includes('i-shape') || pt.includes('paver')) {
    return CATALOG['i-shape'].images[0];
  }
  if (pt.includes('shuttering') || pt.includes('plate')) {
    return '/images/satering-steal-plates.jpg';
  }
  if (pt.includes('rcc') || pt.includes('road')) {
    return '/Business-division-rcc.png';
  }
  if (pt.includes('cement')) {
    return '/images/acc-opc-cement.webp';
  }
  if (pt.includes('sand')) {
    return '/images/white-sand.jpg';
  }
  if (pt.includes('stone') || pt.includes('gitti')) {
    return '/images/large-stone-gitti.jpg';
  }
  if (pt.includes('pipe') || pt.includes('hume')) {
    return '/images/pipe-large-size.jpg';
  }
  if (pt.includes('steel') || pt.includes('tmt') || pt.includes('rod')) {
    return '/images/steal-construction-rod.jpg';
  }
  return CATALOG.zigzag.images[0];
};

const getProductPricePerUnit = (productType = '') => {
  const pt = productType.toLowerCase();
  if (pt.includes('shuttering') || pt.includes('plate')) return 45;
  if (pt.includes('prop')) return 15;
  if (pt.includes('cement')) return 400;
  if (pt.includes('sand')) return 3000;
  if (pt.includes('stone') || pt.includes('gitti')) return 1500;
  if (pt.includes('pipe') || pt.includes('hume')) return 800;
  return 20;
};

const getProductUnitName = (productType = '') => {
  const pt = productType.toLowerCase();
  if (pt.includes('zigzag') || pt.includes('paver') || pt.includes('brick')) return 'sq.ft';
  if (pt.includes('shuttering') || pt.includes('plate') || pt.includes('prop')) return 'pcs';
  if (pt.includes('cement')) return 'bags';
  if (pt.includes('sand')) return 'trucks';
  if (pt.includes('stone') || pt.includes('gitti')) return 'tons';
  if (pt.includes('pipe')) return 'pcs';
  return 'units';
};

const DIVISION_LABELS = {
  'building_materials': { hi: 'Building Materials', en: 'Building Materials' },
  'shuttering': { hi: 'Shuttering', en: 'Shuttering' },
  'rcc': { hi: 'RCC Roads', en: 'RCC Roads' },
  'general': { hi: 'General', en: 'General' },
};

const getDivisionLabel = (div, language) => {
  const labels = DIVISION_LABELS[div];
  return labels ? labels[language] : div || 'General Inquiry';
};

export default function CustomerDashboard({ language }) {
  const navigate = useNavigate();
  const { user: authUser, profile, loading: authLoading } = useAuth();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [profileName, setProfileName] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profilePincode, setProfilePincode] = useState('');
  const [profileAddress, setProfileAddress] = useState('');

  const [statusFilter, setStatusFilter] = useState('All');

  const [rating, setRating] = useState(4);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const [statusMsg, setStatusMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const fetchDashboardData = useCallback(async (customerId, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const ordersData = await getOrdersByCustomer(customerId);
      const inquiriesData = await getInquiriesByCustomer(customerId);
      
      setOrders(ordersData || []);
      setInquiries(inquiriesData || []);
      setNotifications([]);
      if (!isRefresh && ordersData && ordersData.length > 0) {
        setSelectedOrder(ordersData[0]); 
      }
      
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlySpend = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        monthlySpend[`${monthNames[d.getMonth()]} ${d.getFullYear()}`] = 0;
      }

      (ordersData || []).forEach(ord => {
        if (ord.status !== 'Cancelled') {
          const d = new Date(ord.created_at);
          const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
          if (monthlySpend[key] !== undefined) {
            const val = parseFloat(ord.total_amount) || 0;
            monthlySpend[key] += val;
          }
        }
      });
      
      const cData = Object.keys(monthlySpend).map(k => ({ name: k, spend: monthlySpend[k] }));
      setChartData(cData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    
    if (!profile) {
      navigate('/auth');
      return;
    }
    
    setUser(profile);
    setProfileName(profile.full_name || '');
    setProfileCity(profile.city || '');
    setProfilePincode(profile.pincode || '');
    setProfileAddress(profile.address || '');

    fetchDashboardData(profile.id);
  }, [navigate, fetchDashboardData, profile, authLoading]);

  const handleRefresh = () => {
    if (user) {
      fetchDashboardData(user.id, true);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    
    try {
      const { supabase } = await import('../supabase/client');
      const { error } = await supabase.from('profiles').update({
        full_name: profileName,
        city: profileCity,
        pincode: profilePincode,
        address: profileAddress
      }).eq('id', user.id);

      if (!error) {
        setIsSuccess(true);
        setStatusMsg(language === 'hi' ? 'Profile saved' : 'Profile saved successfully');
        const updatedUser = { ...user, full_name: profileName, city: profileCity, pincode: profilePincode, address: profileAddress };
        setUser(updatedUser);
      } else {
        setIsSuccess(false);
        setStatusMsg('Failed to save profile');
      }
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setStatusMsg(language === 'hi' ? 'Failed to connect' : 'Failed to connect to server');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setReviewComment('');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface pt-16">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-12 w-12 text-[#E8650A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="font-semibold text-on-surface-variant mt-2">{language === 'hi' ? 'Loading portal' : 'Loading portal'}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const filteredOrders = statusFilter === 'All' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  const getTimelineStep = (status) => {
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    return steps.indexOf(status) !== -1 ? steps.indexOf(status) : 0;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-on-surface font-body-md pt-16 flex flex-col md:flex-row select-none">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`bg-[#1C2B1A] text-white fixed md:sticky top-16 left-0 h-[calc(100vh-64px)] w-72 flex-shrink-0 flex flex-col shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} overflow-y-auto`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#162214]">
          <div>
            <h1 className="font-display-lg text-xl text-primary font-bold">Swastika Interlocking</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Customer Portal</p>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-4 border border-white/10 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-lg">
              {user.full_name ? user.full_name.substring(0, 2).toUpperCase() : 'U'}
            </div>
            <div>
              <p className="font-bold text-sm text-white leading-tight">{user.full_name || 'User'}</p>
              <p className="text-[10px] text-white/50 mt-0.5">Member since 2024</p>
            </div>
          </div>
        </div>

        <nav className="flex-grow p-4 md:px-6 space-y-2 flex flex-col">
          
          <button 
            onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-primary text-white shadow-md' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-xl">dashboard</span>
            <span>{language === 'hi' ? 'Overview' : 'Overview'}</span>
          </button>

          <button 
            onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'orders' ? 'bg-primary text-white shadow-md' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
          >
            <span className="flex items-center gap-3">
              <span className="material-symbols-outlined text-xl">local_shipping</span>
              <span>{language === 'hi' ? 'My Orders' : 'My Orders'}</span>
            </span>
            <span className="bg-white/20 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">{orders.length}</span>
          </button>

          <button 
            onClick={() => { setActiveTab('inquiries'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'inquiries' ? 'bg-primary text-white shadow-md' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
          >
            <span className="flex items-center gap-3">
              <span className="material-symbols-outlined text-xl">support_agent</span>
              <span>{language === 'hi' ? 'My Requests' : 'My Requests'}</span>
            </span>
            {inquiries.length > 0 && (
              <span className="bg-white/20 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">{inquiries.length}</span>
            )}
          </button>

          <button 
            onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'profile' ? 'bg-primary text-white shadow-md' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-xl">account_circle</span>
            <span>{language === 'hi' ? 'Profile' : 'Profile'}</span>
          </button>

          <button 
            onClick={() => { setActiveTab('details'); setIsSidebarOpen(false); }}
            disabled={!selectedOrder}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${!selectedOrder ? 'opacity-30 cursor-not-allowed hidden md:flex' : ''} ${activeTab === 'details' ? 'bg-primary text-white shadow-md' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-xl">receipt_long</span>
            <span>{language === 'hi' ? 'Details' : 'Details'}</span>
          </button>
          
          <button 
            onClick={() => { setActiveTab('notifications'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'notifications' ? 'bg-primary text-white shadow-md' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
          >
            <span className="flex items-center gap-3">
              <span className="material-symbols-outlined text-xl relative">
                notifications
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full animate-pulse"></span>
                )}
              </span>
              <span>{language === 'hi' ? 'Alerts' : 'Alerts'}</span>
            </span>
            <span className="bg-white/20 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">
              {notifications.filter(n => n.unread).length}
            </span>
          </button>
        </nav>
      </aside>

      <main className="flex-grow p-4 md:p-8 max-w-screen-xl mx-auto space-y-6 md:space-y-8 w-full md:h-[calc(100vh-64px)] md:overflow-y-auto">
        
        {/* Mobile Header with Sidebar Toggle */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg bg-white border border-outline/10 shadow-sm hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-xl text-on-surface">menu</span>
          </button>
          <button 
            onClick={handleRefresh}
            className={`flex items-center gap-2 px-4 py-2 bg-white border border-outline/10 shadow-sm rounded-lg text-sm font-bold text-primary hover:bg-surface-variant transition-colors ${refreshing ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <span className={`material-symbols-outlined text-lg ${refreshing ? 'animate-spin' : ''}`}>sync</span>
          </button>
        </div>

        {/* Desktop Header with Refresh */}
        <div className="hidden md:flex justify-end mb-4">
          <button 
            onClick={handleRefresh}
            className={`flex items-center gap-2 px-4 py-2 bg-white border border-outline/10 shadow-sm rounded-lg text-sm font-bold text-primary hover:bg-surface-variant transition-colors ${refreshing ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <span className={`material-symbols-outlined text-lg ${refreshing ? 'animate-spin' : ''}`}>sync</span>
            {refreshing ? 'Syncing...' : 'Live Sync'}
          </button>
        </div>

        {activeTab === 'overview' && (
          <section className="space-y-6 md:space-y-8 animate-fade-in">
            <div>
              <h3 className="font-display-lg text-2xl md:text-3xl text-on-surface font-bold tracking-tight">
                {language === 'hi' ? 'Welcome back' : `Welcome back, ${user.full_name ? user.full_name.split(' ')[0] : 'User'}`}
              </h3>
              <p className="text-on-surface-variant text-sm mt-1">Here's an overview of your recent activity and spending</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-outline/10 flex flex-col justify-between group hover:shadow-md transition-shadow">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">shopping_bag</span>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-on-surface-variant font-bold uppercase tracking-wider mb-1">Total Orders</p>
                  <p className="text-2xl md:text-3xl font-black text-on-surface">{orders.length}</p>
                </div>
              </div>
              
              <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-outline/10 flex flex-col justify-between group hover:shadow-md transition-shadow">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-on-surface-variant font-bold uppercase tracking-wider mb-1">In Transit</p>
                  <p className="text-2xl md:text-3xl font-black text-on-surface">{orders.filter(o => o.status === 'Shipped' || o.status === 'Processing').length}</p>
                </div>
              </div>

              <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-outline/10 flex flex-col justify-between group hover:shadow-md transition-shadow">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-on-surface-variant font-bold uppercase tracking-wider mb-1">Total Spent</p>
                  <p className="text-2xl md:text-3xl font-black text-on-surface">
                    ₹{chartData.reduce((sum, item) => sum + item.spend, 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#1C2B1A] to-[#2E422B] p-5 md:p-6 rounded-2xl shadow-md border border-white/10 flex flex-col justify-between text-white relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
                <div className="relative z-10">
                  <p className="text-xs md:text-sm text-white/70 font-bold uppercase tracking-wider mb-2">Need Materials?</p>
                  <p className="text-lg md:text-xl font-bold leading-tight mb-4">Start a new project</p>
                  <button onClick={() => navigate('/products')} className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:brightness-110 transition-all flex items-center gap-2 w-fit">
                    Order Now <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-outline/10 p-5 md:p-6">
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">monitoring</span>
                Spending Analytics (Last 6 Months)
              </h4>
              <div className="h-64 md:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E8650A" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#E8650A" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 12, fill: '#6B7280'}} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 12, fill: '#6B7280'}}
                      tickFormatter={(value) => `₹${value>=1000 ? (value/1000)+'k' : value}`}
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Spent']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="spend" 
                      stroke="#E8650A" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorSpend)" 
                      activeDot={{ r: 6, fill: '#E8650A', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        )}
        
        {activeTab === 'profile' && (
          <section className="space-y-6">
            <div>
              <h3 className="font-display-lg text-2xl text-primary font-bold">{language === 'hi' ? 'My Profile' : 'My Profile'}</h3>
              <p className="text-on-surface-variant text-sm mt-1">
                {language === 'hi' ? 'Manage your personal info' : 'Manage your personal information and preferences'}
              </p>
            </div>
            
            {statusMsg && (
              <div className={`p-4 rounded-lg text-xs font-semibold max-w-2xl ${isSuccess ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-error-container text-on-error-container'}`}>
                {statusMsg}
              </div>
            )}

            <form onSubmit={handleProfileSave} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-outline/10 max-w-2xl space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant">{language === 'hi' ? 'Full Name' : 'Full Name'}</label>
                  <input 
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-surface-container border border-outline/10 rounded-lg p-3 outline-none text-sm font-semibold focus:ring-1 focus:ring-primary focus:border-primary" 
                    type="text" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant">{language === 'hi' ? 'Phone' : 'Phone Number (Read-only)'}</label>
                  <input 
                    value={user.phone || ''}
                    className="w-full bg-surface-dim/30 border border-outline/10 rounded-lg p-3 text-on-surface-variant cursor-not-allowed text-sm font-semibold outline-none" 
                    readOnly
                    type="text" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant">{language === 'hi' ? 'City' : 'City'}</label>
                  <input 
                    value={profileCity}
                    onChange={(e) => setProfileCity(e.target.value)}
                    className="w-full bg-surface-container border border-outline/10 rounded-lg p-3 outline-none text-sm font-semibold focus:ring-1 focus:ring-primary focus:border-primary" 
                    type="text" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant">{language === 'hi' ? 'Pincode' : 'Pincode'}</label>
                  <input 
                    value={profilePincode}
                    onChange={(e) => setProfilePincode(e.target.value)}
                    className="w-full bg-surface-container border border-outline/10 rounded-lg p-3 outline-none text-sm font-semibold focus:ring-1 focus:ring-primary focus:border-primary" 
                    type="text" 
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant">{language === 'hi' ? 'Address' : 'Full Address'}</label>
                  <textarea 
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="w-full bg-surface-container border border-outline/10 rounded-lg p-3 outline-none text-sm font-semibold focus:ring-1 focus:ring-primary focus:border-primary" 
                    rows="4"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="px-6 py-3 bg-[#E8650A] text-white font-bold text-sm rounded-lg hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2 shadow-md cursor-pointer"
                >
                  <span>{language === 'hi' ? 'Save Changes' : 'Save Changes'}</span>
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                </button>
              </div>
            </form>
          </section>
        )}

        {activeTab === 'inquiries' && (
          <section className="space-y-6 md:space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h3 className="font-display-lg text-2xl md:text-3xl text-on-surface font-bold tracking-tight">{language === 'hi' ? 'My Requests' : 'My Requests & Inquiries'}</h3>
                <p className="text-on-surface-variant text-sm mt-1">Track your support tickets and general requests</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {inquiries.length === 0 ? (
                <div className="col-span-2 text-center py-20 bg-white rounded-3xl border border-outline/10 shadow-sm">
                  <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-5xl text-outline/50">support_agent</span>
                  </div>
                  <p className="text-on-surface-variant font-bold text-base">No inquiries found</p>
                  <button onClick={() => navigate('/contact')} className="mt-4 text-primary font-bold hover:underline">Contact Support</button>
                </div>
              ) : (
                inquiries.map((inq) => (
                  <div key={inq.id} className="bg-white p-5 md:p-6 rounded-2xl border border-outline/10 hover:shadow-md transition-all flex flex-col md:flex-row gap-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined">forum</span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#FFF8F2] text-[#E8650A] border border-[#E8650A]/20">
                            Ticket Open
                          </span>
                        </div>
                        <span className="text-xs text-on-surface-variant font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                          {inq.created_at ? new Date(inq.created_at).toLocaleDateString() : '—'}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-on-surface mb-2">{inq.subject || getDivisionLabel(inq.division, language)}</h4>
                      <div className="bg-surface-container-low p-3 rounded-lg text-sm text-on-surface-variant">
                        <p className="whitespace-pre-wrap">{inq.requirements || inq.message || '—'}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {activeTab === 'orders' && (
          <section className="space-y-6 md:space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h3 className="font-display-lg text-2xl md:text-3xl text-on-surface font-bold tracking-tight">{language === 'hi' ? 'My Orders' : 'My Orders'}</h3>
                <p className="text-on-surface-variant text-sm mt-1">Track and manage your order history</p>
              </div>
              <div className="flex flex-wrap bg-surface-container p-1 rounded-xl w-full sm:w-auto gap-1">
                {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((filter) => (
                  <button 
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all ${statusFilter === filter ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/50'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {filteredOrders.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-outline/10 shadow-sm">
                  <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-5xl text-outline/50">inventory_2</span>
                  </div>
                  <p className="text-on-surface-variant font-bold text-base">No orders found in this category</p>
                  <button onClick={() => navigate('/products')} className="mt-4 text-primary font-bold hover:underline">Start shopping</button>
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div 
                    key={ord.id}
                    className="bg-white p-5 md:p-6 rounded-2xl border border-outline/10 hover:shadow-md transition-all flex flex-col h-full relative overflow-hidden group"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 ${ord.status === 'Delivered' ? 'bg-secondary' : ord.status === 'Pending' ? 'bg-error' : 'bg-primary'}`}></div>
                    
                    <div className="flex items-start space-x-4 flex-grow">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-surface-container-low flex-shrink-0 border border-outline/10 p-1">
                        {(() => {
                          const items = Array.isArray(ord.items) ? ord.items : [];
                          const firstItem = items[0];
                          const imgSrc = firstItem?.image_url || '/images/interlocking-street-image-grey.jpg';
                          return <img alt="Product" className="w-full h-full object-cover rounded-lg" src={imgSrc} />;
                        })()}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${ord.status === 'Delivered' ? 'bg-[#E8F5E9] text-[#2E7D32]' : ord.status === 'Pending' ? 'bg-error-container text-on-error-container' : 'bg-[#E3F2FD] text-[#0D47A1]'}`}>
                            {ord.status}
                          </span>
                          <span className="text-[10px] text-on-surface-variant font-bold">{ord.order_number || `#SW-${ord.id ? ord.id.slice(0,8) : '0000'}`}</span>
                        </div>
                        
                        <h4 className="font-bold text-sm md:text-base text-on-surface leading-tight line-clamp-2 mb-1">
                          {(() => {
                            const items = Array.isArray(ord.items) ? ord.items : [];
                            return items.length > 0 ? items.map(i => i.product_name).join(', ') : 'Order';
                          })()}
                        </h4>
                        <p className="text-[11px] text-on-surface-variant font-semibold">
                          Ordered: {ord.created_at ? new Date(ord.created_at).toLocaleDateString() : '—'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-outline/10">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-on-surface-variant uppercase font-bold">Total Items</span>
                        <span className="font-black text-on-surface text-sm">
                          {Array.isArray(ord.items) ? ord.items.reduce((s, i) => s + (parseInt(i.quantity) || 1), 0) : '—'} units
                        </span>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedOrder(ord);
                          setActiveTab('details');
                        }}
                        className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold text-xs hover:bg-primary hover:text-white transition-colors flex items-center"
                      >
                        Track Order
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {activeTab === 'details' && selectedOrder && (
          <section className="space-y-6">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setActiveTab('orders')}
                className="w-8 h-8 rounded-full hover:bg-surface-container-high transition-all flex items-center justify-center border border-outline/20 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
              </button>
              <div>
                <h3 className="font-display-lg text-2xl text-primary font-bold">
                  {language === 'hi' ? 'Order Details' : 'Order Details'} — {selectedOrder.order_number || '—'}
                </h3>
                <p className="text-on-surface-variant text-xs font-semibold mt-1">
                  Created on {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleDateString() : '—'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 border border-outline/10 shadow-sm space-y-8 max-w-4xl">
              <div className="relative flex justify-between select-none max-w-xl mx-auto pt-4 pb-2">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-outline-variant/30 -translate-y-1/2 -z-0"></div>
                {['Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                  const currentIdx = getTimelineStep(selectedOrder.status);
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;
                  
                  return (
                    <div key={idx} className="relative z-10 flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white ${isDone ? 'bg-secondary text-white' : 'bg-surface-container text-outline border border-outline/20'}`}>
                        <span className="material-symbols-outlined text-sm">
                          {idx === 0 ? 'check' : idx === 1 ? 'cyclone' : idx === 2 ? 'local_shipping' : 'inventory_2'}
                        </span>
                      </div>
                      <p className={`mt-2 text-[10px] ${isCurrent ? 'font-bold text-primary' : 'text-on-surface-variant'}`}>{step}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="font-bold text-sm border-b border-outline/10 pb-2">Items Summary</h4>
                  <table className="w-full text-left text-xs font-semibold">
                    <tbody>
                      {(() => {
                        const items = Array.isArray(selectedOrder.items) ? selectedOrder.items : [];
                        const totalValue = items.reduce((sum, i) => sum + ((parseFloat(i.price) || 0) * (parseInt(i.quantity) || 1)), 0);
                        return (
                          <>
                            {items.map((item, idx) => {
                              const price = parseFloat(item.price) || 0;
                              const qty = parseInt(item.quantity) || 1;
                              return (
                                <tr key={idx} className="border-b border-outline/5">
                                  <td className="py-3 font-bold text-on-surface">
                                    {item.product_name}
                                    {item.sub_type && <span className="block text-[10px] text-on-surface-variant font-normal">{item.sub_type}</span>}
                                  </td>
                                  <td className="py-3 text-center">{qty} pcs</td>
                                  <td className="py-3 text-right">₹{(price * qty).toLocaleString()}</td>
                                </tr>
                              );
                            })}
                            <tr className="border-t-2 border-primary/20 font-bold text-sm">
                              <td className="py-4 text-on-surface" colSpan={2}>Total</td>
                              <td className="py-4 text-right text-primary text-base">
                                ₹{(parseFloat(selectedOrder.total_amount) || totalValue).toLocaleString()}
                              </td>
                            </tr>
                          </>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#FAF7F2] p-5 rounded-xl border border-outline-variant/30 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-outline uppercase mb-2">Customer Details</h4>
                      <p className="text-sm font-bold text-on-surface leading-tight">{selectedOrder.customer_name}</p>
                      <p className="text-xs text-on-surface-variant font-medium mt-1">+91 {selectedOrder.customer_phone}</p>
                      <p className="text-xs text-on-surface-variant font-medium mt-0.5">{selectedOrder.delivery_city}</p>
                    </div>
                    
                    <div className="border-t border-outline/10 pt-4">
                      <h4 className="text-xs font-bold text-outline uppercase mb-2">Delivery Address</h4>
                      <p className="text-xs leading-relaxed font-bold">{selectedOrder.delivery_address}</p>
                    </div>

                    {selectedOrder.admin_notes && (
                      <div className="border-t border-outline/10 pt-4">
                        <p className="text-[10px] uppercase font-bold text-[#E8650A] mb-1">Special Instructions</p>
                        <p className="text-[11px] text-on-surface-variant italic leading-relaxed">{selectedOrder.admin_notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => {
                        import('jspdf').then(({ default: jsPDF }) => {
                          import('jspdf-autotable').then(({ default: autoTable }) => {
                            const doc = new jsPDF();
                            const pageWidth = doc.internal.pageSize.getWidth();
                            
                            doc.setFontSize(20);
                            doc.setTextColor(232, 101, 10);
                            doc.text('Swastika Interlocking', pageWidth / 2, 20, { align: 'center' });
                            doc.setFontSize(10);
                            doc.setTextColor(100, 100, 100);
                            doc.text('Tax Invoice', pageWidth / 2, 28, { align: 'center' });
                            doc.setDrawColor(200, 200, 200);
                            doc.line(14, 33, pageWidth - 14, 33);

                            doc.setFontSize(10);
                            doc.setTextColor(0, 0, 0);
                            doc.text(`Order: ${selectedOrder.order_number || '—'}`, 14, 42);
                            doc.text(`Date: ${selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleDateString() : '—'}`, 14, 49);
                            doc.text(`Status: ${selectedOrder.status}`, 14, 56);

                            doc.setFont(undefined, 'bold');
                            doc.text('Billed To:', pageWidth - 80, 42);
                            doc.setFont(undefined, 'normal');
                            doc.text(selectedOrder.customer_name || '', pageWidth - 80, 49);
                            doc.text(`+91 ${selectedOrder.customer_phone || ''}`, pageWidth - 80, 55);
                            doc.text(selectedOrder.delivery_city || '', pageWidth - 80, 61);

                            const items = Array.isArray(selectedOrder.items) ? selectedOrder.items : [];
                            const tableData = items.map((item, i) => {
                              const price = parseFloat(item.price) || 0;
                              const qty = parseInt(item.quantity) || 1;
                              return [i + 1, item.product_name || '', `₹${price}`, qty, `₹${(price * qty).toLocaleString()}`];
                            });

                            autoTable(doc, {
                              startY: 72,
                              head: [['#', 'Product', 'Rate', 'Qty', 'Amount']],
                              body: tableData,
                              theme: 'grid',
                              headStyles: { fillColor: [232, 101, 10] },
                              styles: { fontSize: 9 },
                            });

                            const finalY = doc.lastAutoTable.finalY + 10;
                            doc.setFont(undefined, 'bold');
                            doc.text(`Total: ₹${parseFloat(selectedOrder.total_amount || 0).toLocaleString()}`, pageWidth - 14, finalY, { align: 'right' });
                            
                            doc.save(`Invoice_${selectedOrder.order_number || 'order'}.pdf`);
                          });
                        });
                      }}
                      className="w-full py-2.5 bg-surface-container-highest text-on-surface rounded-lg font-bold text-xs hover:bg-surface-variant flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">download</span>
                      Download Invoice
                    </button>
                    <a 
                      href={`https://wa.me/918400936290?text=I%20have%20a%20question%20regarding%20my%20order%20${selectedOrder.order_number || ''}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 bg-[#25D366] text-white rounded-lg font-bold text-xs hover:opacity-95 flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                      WhatsApp Support
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'notifications' && (
          <section className="space-y-6">
            <div>
              <h3 className="font-display-lg text-2xl text-primary font-bold">{language === 'hi' ? 'Notifications' : 'Notifications'}</h3>
              <p className="text-on-surface-variant text-sm mt-1">Stay updated with order progress updates</p>
            </div>
            
            <div className="space-y-4 max-w-2xl">
              {notifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-5 rounded-xl border flex items-start space-x-4 shadow-sm transition-all ${notif.unread ? 'bg-[#FFF8F2] border-primary/20 border-l-4 border-l-primary' : 'bg-white border-outline/10 opacity-75'}`}
                >
                  <div className={`p-2 rounded-full ${notif.unread ? 'bg-primary/10 text-primary' : 'bg-surface-variant text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-xl">
                      {notif.unread ? 'notifications_active' : 'check_circle'}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-sm">{notif.title}</h4>
                    <p className="text-xs text-on-surface-variant mt-1">{notif.body}</p>
                    <span className="text-[10px] text-outline mt-2 block font-semibold">{notif.time}</span>
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-outline/10 shadow-sm">
                  <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-4xl text-outline/50">notifications</span>
                  </div>
                  <p className="text-on-surface-variant font-semibold">No notifications yet</p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'reviews' && (
          <section className="space-y-6 max-w-2xl">
            <div>
              <h3 className="font-display-lg text-2xl text-primary font-bold">{language === 'hi' ? 'My Reviews' : 'My Reviews'}</h3>
              <p className="text-on-surface-variant text-sm mt-1">Share your experience with our products</p>
            </div>

            {reviewSubmitted ? (
              <div className="p-4 bg-[#E8F5E9] text-[#2E7D32] rounded-xl border border-secondary/30 font-bold text-sm text-center">
                Review submitted successfully! Thank you for your feedback
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-outline/10 shadow-sm space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container-low">
                    {(() => {
                      const firstOrder = orders[0];
                      const firstItem = firstOrder && Array.isArray(firstOrder.items) ? firstOrder.items[0] : null;
                      const imgSrc = firstItem?.image_url || '/images/interlocking-street-image-grey.jpg';
                      return <img className="w-full h-full object-cover" src={imgSrc} alt="Product" />;
                    })()}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm line-clamp-1">
                      {(() => {
                        const firstOrder = orders[0];
                        const items = firstOrder && Array.isArray(firstOrder.items) ? firstOrder.items : [];
                        return items.length > 0 ? items.map(i => i.product_name).join(', ') : 'Your Order';
                      })()}
                    </h4>
                    <p className="text-xs text-on-surface-variant">Provide feedback for your last order</p>
                  </div>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant block">Your Rating</label>
                    <div className="flex space-x-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-primary hover:scale-110 transition-transform cursor-pointer"
                        >
                          <span 
                            className="material-symbols-outlined text-3xl"
                            style={{ fontVariationSettings: `"FILL" ${star <= rating ? 1 : 0}` }}
                          >
                            star
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant block">Comment</label>
                    <textarea 
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-surface-container border border-outline/10 rounded-xl p-4 outline-none text-sm font-semibold focus:ring-1 focus:ring-primary focus:border-primary" 
                      placeholder="Share your experience with our products..." 
                      rows="4"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="px-6 py-3 bg-[#E8650A] text-white font-bold text-xs rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
