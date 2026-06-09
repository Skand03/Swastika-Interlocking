import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CATALOG = {
  zigzag: {
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDA-SM7Qe-nP_Tkzlsjs6Sp4wXka5GxYLj2Znx1fbMS8bzC36BXGiV0ez7X-CR0hX3UlQ7We4WZERCP00VlPnmqpEhy58pLMJ2DBrlPb9JJqOrEbmKDcLWv30QhAzBiBHjuGzNEguwp5c3L7rdkOmbwS3sKn_B0MxuLRevVACZyj53PcMMn1AjVx80_O2gi9Q5qMOO1k_yAM2lUNf3rcgBKF2qtpOMkacX-jD0WSE9EbxhxqfVNSXJ6SM5LtDqBtjA3REeL62JvKck']
  },
  'i-shape': {
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDV8Oh3FHQu_59sQPs19BgEkuFdqsh6T7mWg9sygIZ2QOPwffQWIXL2XPPfexCcrOo6V7q1eS6Aiuf7r4qBN7HUcdAlHJARgBln1f8zZ3sHINZY_VDJqMX9uNtEic9qURhzQkH5a1W1THZu6qkfi7Su_MNSzmjGnO1ids1w_Esw-I4Ghk7lyfaKc1ZPYtWbC1R8rUJXjAkmgV2GIZdVrkeFRrKBaypKyHNpPVQX-_nlyoLeBfuy0i_ZGHLa8Cu3VhjSwIJR_p_YJtU']
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
    return '/images/steal-constrcution-rod.jpg';
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

export default function CustomerDashboard({ language }) {
  const navigate = useNavigate();
  const { dbUser, syncDbUser, loading: authLoading, authFetch } = useAuth();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'profile', 'orders', 'inquiries', 'details', 'notifications', 'reviews'
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chartData, setChartData] = useState([]);

  // Profile Form fields
  const [profileName, setProfileName] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profilePincode, setProfilePincode] = useState('');
  const [profileAddress, setProfileAddress] = useState('');

  // Filter for orders
  const [statusFilter, setStatusFilter] = useState('All');

  // Review Form state
  const [rating, setRating] = useState(4);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const [statusMsg, setStatusMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const fetchDashboardData = useCallback(async (phone, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const response = await authFetch(`./api/get_portal_data.php?phone=${phone}&role=customer`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders || []);
        setInquiries(data.inquiries || []);
        setNotifications(data.notifications || []);
        if (!isRefresh && data.orders && data.orders.length > 0) {
          setSelectedOrder(data.orders[0]); // default detail
        }
        setNotifications(data.notifications || []);
        
        // Process chart data (Last 6 Months Spend)
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlySpend = {};
        const now = new Date();
        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          monthlySpend[`${monthNames[d.getMonth()]} ${d.getFullYear()}`] = 0;
        }

        (data.orders || []).forEach(ord => {
          if (ord.status !== 'Cancelled') {
            const d = new Date(ord.created_at);
            const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            if (monthlySpend[key] !== undefined) {
               let val = 0;
               try {
                 const items = JSON.parse(ord.product_type);
                 if (Array.isArray(items)) {
                    val = items.reduce((sum, item) => sum + ((parseFloat(item.price) || getProductPricePerUnit(item.product_name)) * (parseInt(item.quantity)||1)), 0);
                 } else {
                    val = getProductPricePerUnit(ord.product_type) * ord.quantity;
                 }
               } catch(e) {
                 val = getProductPricePerUnit(ord.product_type) * ord.quantity;
               }
               monthlySpend[key] += val;
            }
          }
        });
        
        const cData = Object.keys(monthlySpend).map(k => ({ name: k, spend: monthlySpend[k] }));
        setChartData(cData);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);


  // Check login and fetch data
  useEffect(() => {
    if (authLoading) return;
    
    if (!dbUser) {
      navigate('/auth');
      return;
    }
    
    setUser(dbUser);
    setProfileName(dbUser.full_name);
    setProfileCity(dbUser.city);
    setProfilePincode(dbUser.pincode || '');
    setProfileAddress(dbUser.address || '');

    fetchDashboardData(dbUser.phone);
  }, [navigate, fetchDashboardData, dbUser, authLoading]);

  const handleRefresh = () => {
    if (user) {
      fetchDashboardData(user.phone, true);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    
    try {
      const response = await authFetch('./api/update_profile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: user.phone,
          full_name: profileName,
          city: profileCity,
          pincode: profilePincode,
          address: profileAddress
        })
      });
      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        setStatusMsg(language === 'hi' ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!' : 'Profile updated successfully!');
        
        // Update local user details
        const updatedUser = { ...user, full_name: profileName, city: profileCity };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        setIsSuccess(false);
        setStatusMsg(result.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setStatusMsg(language === 'hi' ? 'सर्वर से कनेक्ट करने में विफल।' : 'Failed to connect to server.');
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
          <p className="font-semibold text-on-surface-variant mt-2">{language === 'hi' ? 'पोर्टल लोड हो रहा है...' : 'Loading portal...'}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const filteredOrders = statusFilter === 'All' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  // Helper mapping status to timeline steps
  const getTimelineStep = (status) => {
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    return steps.indexOf(status) !== -1 ? steps.indexOf(status) : 0;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-on-surface font-body-md pt-16 flex flex-col md:flex-row select-none">
      
      {/* Sidebar Navigation */}
      <aside className="bg-[#1C2B1A] text-white w-full md:w-72 flex-shrink-0 flex flex-col shadow-xl z-20 sticky top-16 md:h-[calc(100vh-64px)] overflow-y-auto">
        {/* Brand Header */}
        <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between md:block bg-[#162214]">
          <div>
            <h1 className="font-display-lg text-xl md:text-2xl text-primary font-bold">Construx Pro</h1>
            <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-widest mt-1">Customer Portal</p>
          </div>
          <button 
            onClick={handleRefresh}
            className={`md:hidden p-2 rounded-full bg-white/10 text-white ${refreshing ? 'animate-spin' : ''}`}
          >
            <span className="material-symbols-outlined text-sm">sync</span>
          </button>
        </div>
        
        {/* User Card */}
        <div className="p-6 hidden md:block">
          <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-4 border border-white/10 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-lg">
              {user.full_name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-sm text-white leading-tight">{user.full_name}</p>
              <p className="text-[10px] text-white/50 mt-0.5">Member since 2024</p>
            </div>
          </div>
        </div>

        {/* Links - Horizontal on mobile, vertical on desktop */}
        <nav className="flex-grow p-4 md:px-6 space-x-2 md:space-x-0 md:space-y-2 flex flex-row md:flex-col overflow-x-auto no-scrollbar">
          
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex-shrink-0 md:w-full flex flex-col md:flex-row items-center md:justify-start gap-1 md:gap-3 px-4 py-3 md:py-3.5 rounded-xl text-[10px] md:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-primary text-white shadow-md' : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-xl md:text-xl">dashboard</span>
            <span>{language === 'hi' ? 'अवलोकन' : 'Overview'}</span>
          </button>

          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex-shrink-0 md:w-full flex flex-col md:flex-row items-center md:justify-between gap-1 md:gap-3 px-4 py-3 md:py-3.5 rounded-xl text-[10px] md:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'orders' ? 'bg-primary text-white shadow-md' : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
              <span className="material-symbols-outlined text-xl md:text-xl">local_shipping</span>
              <span>{language === 'hi' ? 'मेरे ऑर्डर' : 'My Orders'}</span>
            </span>
            <span className="hidden md:flex bg-white/20 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">{orders.length}</span>
          </button>

          <button 
            onClick={() => setActiveTab('inquiries')}
            className={`flex-shrink-0 md:w-full flex flex-col md:flex-row items-center md:justify-between gap-1 md:gap-3 px-4 py-3 md:py-3.5 rounded-xl text-[10px] md:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'inquiries' ? 'bg-primary text-white shadow-md' : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
              <span className="material-symbols-outlined text-xl md:text-xl">support_agent</span>
              <span>{language === 'hi' ? 'मेरे अनुरोध' : 'My Requests'}</span>
            </span>
            {inquiries.length > 0 && (
              <span className="hidden md:flex bg-white/20 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">{inquiries.length}</span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-shrink-0 md:w-full flex flex-col md:flex-row items-center md:justify-start gap-1 md:gap-3 px-4 py-3 md:py-3.5 rounded-xl text-[10px] md:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'profile' ? 'bg-primary text-white shadow-md' : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-xl md:text-xl">account_circle</span>
            <span>{language === 'hi' ? 'प्रोफ़ाइल' : 'Profile'}</span>
          </button>

          <button 
            onClick={() => setActiveTab('details')}
            disabled={!selectedOrder}
            className={`flex-shrink-0 md:w-full flex flex-col md:flex-row items-center md:justify-start gap-1 md:gap-3 px-4 py-3 md:py-3.5 rounded-xl text-[10px] md:text-sm font-semibold transition-all cursor-pointer ${
              !selectedOrder ? 'opacity-30 cursor-not-allowed hidden md:flex' : ''
            } ${
              activeTab === 'details' ? 'bg-primary text-white shadow-md' : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-xl md:text-xl">receipt_long</span>
            <span>{language === 'hi' ? 'विवरण' : 'Details'}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`flex-shrink-0 md:w-full flex flex-col md:flex-row items-center md:justify-between gap-1 md:gap-3 px-4 py-3 md:py-3.5 rounded-xl text-[10px] md:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'notifications' ? 'bg-primary text-white shadow-md' : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
              <span className="material-symbols-outlined text-xl md:text-xl relative">
                notifications
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full animate-pulse"></span>
                )}
              </span>
              <span>{language === 'hi' ? 'सूचनाएं' : 'Alerts'}</span>
            </span>
            <span className="hidden md:flex bg-white/20 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">
              {notifications.filter(n => n.unread).length}
            </span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-8 max-w-screen-xl mx-auto space-y-8 w-full md:h-[calc(100vh-64px)] md:overflow-y-auto">
        
        {/* Header Actions (Desktop) */}
        <div className="hidden md:flex justify-end mb-4">
          <button 
            onClick={handleRefresh}
            className={`flex items-center gap-2 px-4 py-2 bg-white border border-outline/10 shadow-sm rounded-lg text-sm font-bold text-primary hover:bg-surface-variant transition-colors ${refreshing ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <span className={`material-symbols-outlined text-lg ${refreshing ? 'animate-spin' : ''}`}>sync</span>
            {refreshing ? 'Syncing...' : 'Live Sync'}
          </button>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <section className="space-y-6 md:space-y-8 animate-fade-in">
            <div>
              <h3 className="font-display-lg text-2xl md:text-3xl text-on-surface font-bold tracking-tight">
                {language === 'hi' ? 'डैशबोर्ड में आपका स्वागत है' : `Welcome back, ${user.full_name.split(' ')[0]}`}
              </h3>
              <p className="text-on-surface-variant text-sm mt-1">Here's an overview of your recent activity and spending.</p>
            </div>

            {/* Quick Stats Grid */}
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
                  <p className="text-lg md:text-xl font-bold leading-tight mb-4">Start a new project with Construx Pro.</p>
                  <button onClick={() => navigate('/products')} className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:brightness-110 transition-all flex items-center gap-2 w-fit">
                    Order Now <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Spending Chart */}
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
        
        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <section className="space-y-6">
            <div>
              <h3 className="font-display-lg text-2xl text-primary font-bold">{language === 'hi' ? 'मेरी प्रोफाइल' : 'My Profile'}</h3>
              <p className="text-on-surface-variant text-sm mt-1">
                {language === 'hi' ? 'अपनी व्यक्तिगत जानकारी और वरीयताएँ प्रबंधित करें।' : 'Manage your personal information and preferences.'}
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
                  <label className="text-xs font-bold text-on-surface-variant">{language === 'hi' ? 'पूरा नाम' : 'Full Name'}</label>
                  <input 
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-surface-container border border-outline/10 rounded-lg p-3 outline-none text-sm font-semibold focus:ring-1 focus:ring-primary focus:border-primary" 
                    type="text" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant">{language === 'hi' ? 'फ़ोन नंबर (अपरिवर्तनीय)' : 'Phone Number (Read-only)'}</label>
                  <input 
                    value={user.phone}
                    className="w-full bg-surface-dim/30 border border-outline/10 rounded-lg p-3 text-on-surface-variant cursor-not-allowed text-sm font-semibold outline-none" 
                    readOnly
                    type="text" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant">{language === 'hi' ? 'शहर' : 'City'}</label>
                  <input 
                    value={profileCity}
                    onChange={(e) => setProfileCity(e.target.value)}
                    className="w-full bg-surface-container border border-outline/10 rounded-lg p-3 outline-none text-sm font-semibold focus:ring-1 focus:ring-primary focus:border-primary" 
                    type="text" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant">{language === 'hi' ? 'पिनकोड' : 'Pincode'}</label>
                  <input 
                    value={profilePincode}
                    onChange={(e) => setProfilePincode(e.target.value)}
                    className="w-full bg-surface-container border border-outline/10 rounded-lg p-3 outline-none text-sm font-semibold focus:ring-1 focus:ring-primary focus:border-primary" 
                    type="text" 
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant">{language === 'hi' ? 'पूरा पता' : 'Full Address'}</label>
                  <textarea 
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="w-full bg-surface-container border border-outline/10 rounded-lg p-3 outline-none text-sm font-semibold focus:ring-1 focus:ring-primary focus:border-primary" 
                    rows="3"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="px-6 py-3 bg-[#E8650A] text-white font-bold text-sm rounded-lg hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2 shadow-md cursor-pointer"
                >
                  <span>{language === 'hi' ? 'बदलाव सुरक्षित करें' : 'Save Changes'}</span>
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                </button>
              </div>
            </form>
          </section>
        )}

        {/* INQUIRIES LIST TAB */}
        {activeTab === 'inquiries' && (
          <section className="space-y-6 md:space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h3 className="font-display-lg text-2xl md:text-3xl text-on-surface font-bold tracking-tight">{language === 'hi' ? 'मेरे अनुरोध' : 'My Requests & Inquiries'}</h3>
                <p className="text-on-surface-variant text-sm mt-1">Track your support tickets and general requests.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {inquiries.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-outline/10 shadow-sm">
                  <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-5xl text-outline/50">support_agent</span>
                  </div>
                  <p className="text-on-surface-variant font-bold text-base">No inquiries found.</p>
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
                          {inq.created_at.split(' ')[0]}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-on-surface mb-2">General Enquiry</h4>
                      <div className="bg-surface-container-low p-3 rounded-lg text-sm text-on-surface-variant">
                        <p className="whitespace-pre-wrap">{inq.requirements}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* ORDERS LIST TAB */}
        {activeTab === 'orders' && (
          <section className="space-y-6 md:space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h3 className="font-display-lg text-2xl md:text-3xl text-on-surface font-bold tracking-tight">{language === 'hi' ? 'मेरे ऑर्डर' : 'My Orders'}</h3>
                <p className="text-on-surface-variant text-sm mt-1">Track and manage your order list histories.</p>
              </div>
              {/* Filters */}
              <div className="flex bg-surface-container p-1 rounded-xl w-fit">
                {['All', 'Pending', 'Processing', 'Delivered'].map((filter) => (
                  <button 
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      statusFilter === filter ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Order cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {filteredOrders.length === 0 ? (
                <div className="col-span-2 text-center py-20 bg-white rounded-3xl border border-outline/10 shadow-sm">
                  <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-5xl text-outline/50">inventory_2</span>
                  </div>
                  <p className="text-on-surface-variant font-bold text-base">No orders found in this category.</p>
                  <button onClick={() => navigate('/products')} className="mt-4 text-primary font-bold hover:underline">Start shopping</button>
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div 
                    key={ord.id}
                    className="bg-white p-5 md:p-6 rounded-2xl border border-outline/10 hover:shadow-md transition-all flex flex-col h-full relative overflow-hidden group"
                  >
                    {/* Status accent border top */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${
                      ord.status === 'Delivered' ? 'bg-secondary' : ord.status === 'Pending' ? 'bg-error' : 'bg-primary'
                    }`}></div>
                    
                    <div className="flex items-start space-x-4 flex-grow">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-surface-container-low flex-shrink-0 border border-outline/10 p-1">
                        {(() => {
                          let imageUrl = getProductThumbnail(ord.product_type);
                          try {
                            const items = JSON.parse(ord.product_type);
                            if (Array.isArray(items) && items.length > 0 && items[0].image_url) {
                              imageUrl = items[0].image_url;
                            }
                          } catch(e) {}
                          if (ord.product_type.includes('Shuttering Enquiry')) {
                            imageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuADotX2EZyVU5xYwFJDhQqAptmw2WS4jmoX4ijBRFndcUDTKI3vvpnW7pXd5-KxhyHuqXonTofXZ0Mwe2RAU_dAznVQXaorYYa3mSJrlYpQcZEA2WMzkh5bvkHkju3YrGQAm5oegzJHqp0bcbIupUDRD0_fynU8JtRpjf3JRSkwSp1UEIdjLNWjkMLIAG0SFXLsK--oaQkt3g_0NPVgowmVE5TehbU0abKXkOsne2wc5eQklFZkytOm910XW0k85jRN2-g3YStGtx4';
                          }
                          return (
                            <img 
                              alt="Product visual" 
                              className="w-full h-full object-cover rounded-lg" 
                              src={imageUrl}
                            />
                          );
                        })()}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            ord.status === 'Delivered' ? 'bg-[#E8F5E9] text-[#2E7D32]' : ord.status === 'Pending' ? 'bg-error-container text-on-error-container' : 'bg-[#E3F2FD] text-[#0D47A1]'
                          }`}>
                            {ord.status}
                          </span>
                          <span className="text-[10px] text-on-surface-variant font-bold">#SW-{ord.id}</span>
                        </div>
                        
                        <h4 className="font-bold text-sm md:text-base text-on-surface leading-tight line-clamp-2 mb-1">
                          {(() => {
                            let items = [];
                            try {
                              items = JSON.parse(ord.product_type);
                            } catch(e) {
                              items = [{ product_name: ord.product_type }];
                            }
                            return Array.isArray(items) && items.length > 0 ? items.map(i => i.product_name).join(', ') : ord.product_type;
                          })()}
                        </h4>
                        <p className="text-[11px] text-on-surface-variant font-semibold">Ordered: {ord.created_at.split(' ')[0]}</p>
                        
                        {ord.product_type.includes('Shuttering Enquiry') && ord.special_req && (
                          <div className="mt-2 bg-[#FFF8F2] p-2 rounded text-xs text-[#E8650A] font-medium leading-relaxed border border-[#E8650A]/10">
                            {ord.special_req.split(' | ').map((req, i) => (
                              <div key={i} className="flex items-start gap-1">
                                <span className="material-symbols-outlined text-[14px]">done</span>
                                <span>{req}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-outline/10">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-on-surface-variant uppercase font-bold">Total Items</span>
                        <span className="font-black text-on-surface text-sm">{ord.quantity} units</span>
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

        {/* ORDER DETAIL TAB */}
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
                  {language === 'hi' ? 'ऑर्डर विवरण' : 'Order Details'} - #SW-{selectedOrder.id}
                </h3>
                <p className="text-on-surface-variant text-xs font-semibold mt-1">Created on {selectedOrder.created_at}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 border border-outline/10 shadow-sm space-y-8 max-w-4xl">
              {/* Timeline */}
              <div className="relative flex justify-between select-none max-w-xl mx-auto pt-4 pb-2">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-outline-variant/30 -translate-y-1/2 -z-0"></div>
                {['Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                  const currentIdx = getTimelineStep(selectedOrder.status);
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;
                  
                  return (
                    <div key={idx} className="relative z-10 flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white ${
                        isDone 
                          ? 'bg-secondary text-white' 
                          : 'bg-surface-container text-outline border border-outline/20'
                      }`}>
                        <span className="material-symbols-outlined text-sm">
                          {idx === 0 ? 'check' : idx === 1 ? 'cyclone' : idx === 2 ? 'local_shipping' : 'inventory_2'}
                        </span>
                      </div>
                      <p className={`mt-2 text-[10px] ${isCurrent ? 'font-bold text-primary' : 'text-on-surface-variant'}`}>{step}</p>
                    </div>
                  );
                })}
              </div>

              {/* Detail specs & Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="font-bold text-sm border-b border-outline/10 pb-2">Items Summary</h4>
                  <table className="w-full text-left text-xs font-semibold">
                    <tbody>
                      {(() => {
                        let items = [];
                        try {
                          items = JSON.parse(selectedOrder.product_type);
                          if (!Array.isArray(items)) {
                            items = [{ product_name: selectedOrder.product_type, quantity: selectedOrder.quantity, price: getProductPricePerUnit(selectedOrder.product_type) }];
                          }
                        } catch(e) {
                          items = [{ product_name: selectedOrder.product_type, quantity: selectedOrder.quantity, price: getProductPricePerUnit(selectedOrder.product_type) }];
                        }

                        let totalValue = 0;

                        return (
                          <>
                            {items.map((item, idx) => {
                              // If it has price, calculate itemTotal
                              const price = parseFloat(item.price) || getProductPricePerUnit(item.product_name);
                              const qty = parseInt(item.quantity) || 1;
                              const itemTotal = price * qty;
                              totalValue += itemTotal;
                              return (
                                <tr key={idx}>
                                  <td className="py-3 font-bold text-on-surface">
                                    {item.product_name} 
                                    {item.sub_type && <span className="block text-[10px] text-on-surface-variant font-normal">{item.sub_type}</span>}
                                  </td>
                                  <td className="py-3 text-center">{qty} {getProductUnitName(item.product_name)}</td>
                                  <td className="py-3 text-right">₹{itemTotal}</td>
                                </tr>
                              );
                            })}
                            <tr className="border-t border-outline/5">
                              <td className="py-3 text-on-surface-variant">Standard Logistics Charges</td>
                              <td className="py-3 text-center">--</td>
                              <td className="py-3 text-right">₹2,500</td>
                            </tr>
                            <tr className="border-t-2 border-primary/20 font-bold text-sm">
                              <td className="py-4 text-on-surface" colSpan={2}>Total Estimated Value</td>
                              <td className="py-4 text-right text-primary text-base">₹{totalValue + 2500}</td>
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
                      <p className="text-xs text-on-surface-variant font-medium mt-1">+91 {selectedOrder.phone}</p>
                      <p className="text-xs text-on-surface-variant font-medium mt-0.5">{selectedOrder.city}</p>
                    </div>
                    
                    <div className="border-t border-outline/10 pt-4">
                      <h4 className="text-xs font-bold text-outline uppercase mb-2">Delivery Address</h4>
                      <p className="text-xs leading-relaxed font-bold">{selectedOrder.address}</p>
                    </div>

                    {selectedOrder.special_req && (
                      <div className="border-t border-outline/10 pt-4">
                        <p className="text-[10px] uppercase font-bold text-[#E8650A] mb-1">Special Instructions</p>
                        <p className="text-[11px] text-on-surface-variant italic leading-relaxed">{selectedOrder.special_req}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => {
                        const doc = new jsPDF();
                        const pageWidth = doc.internal.pageSize.getWidth();
                        
                        doc.setFontSize(22);
                        doc.setTextColor(232, 101, 10);
                        doc.text('Swastika Interlocking', pageWidth / 2, 20, { align: 'center' });
                        
                        doc.setFontSize(10);
                        doc.setTextColor(100, 100, 100);
                        doc.text('Tax Invoice / Bill of Supply', pageWidth / 2, 28, { align: 'center' });

                        doc.setDrawColor(200, 200, 200);
                        doc.line(14, 35, pageWidth - 14, 35);

                        doc.setFontSize(10);
                        doc.setTextColor(0, 0, 0);
                        doc.text(`Order ID: #SW-${selectedOrder.id}`, 14, 45);
                        doc.text(`Date: ${selectedOrder.created_at.split(' ')[0]}`, 14, 52);
                        doc.text(`Status: ${selectedOrder.status}`, 14, 59);

                        doc.setFontSize(12);
                        doc.setFont(undefined, 'bold');
                        doc.text('Billed To:', pageWidth - 80, 45);
                        doc.setFontSize(10);
                        doc.setFont(undefined, 'normal');
                        doc.text(selectedOrder.customer_name, pageWidth - 80, 52);
                        doc.text(`+91 ${selectedOrder.phone}`, pageWidth - 80, 57);
                        const splitAddress = doc.splitTextToSize(`${selectedOrder.city}\n${selectedOrder.address}`, 60);
                        doc.text(splitAddress, pageWidth - 80, 62);

                        let items = [];
                        try {
                          items = JSON.parse(selectedOrder.product_type);
                          if (!Array.isArray(items)) {
                            items = [{ product_name: selectedOrder.product_type, sub_type: '', quantity: selectedOrder.quantity, price: getProductPricePerUnit(selectedOrder.product_type) }];
                          }
                        } catch(e) {
                          items = [{ product_name: selectedOrder.product_type, sub_type: '', quantity: selectedOrder.quantity, price: getProductPricePerUnit(selectedOrder.product_type) }];
                        }

                        let totalValue = 0;
                        const tableData = items.map((item, index) => {
                          const price = parseFloat(item.price) || getProductPricePerUnit(item.product_name);
                          const qty = parseInt(item.quantity) || 1;
                          const itemTotal = price * qty;
                          totalValue += itemTotal;
                          const itemName = item.sub_type ? `${item.product_name} (${item.sub_type})` : item.product_name;
                          const unit = getProductUnitName(item.product_name);
                          return [index + 1, itemName, `Rs. ${price}`, `${qty} ${unit}`, `Rs. ${itemTotal.toFixed(2)}`];
                        });

                        tableData.push(['', 'Standard Logistics Charges', '-', '-', 'Rs. 2500.00']);
                        const grandTotal = totalValue + 2500;

                        import('jspdf-autotable').then(({ default: autoTable }) => {
                          autoTable(doc, {
                            startY: 85,
                            head: [['S.No', 'Description of Goods', 'Rate', 'Quantity', 'Amount']],
                            body: tableData,
                            theme: 'grid',
                            headStyles: { fillColor: [232, 101, 10] },
                            styles: { fontSize: 9 },
                            columnStyles: {
                              0: { cellWidth: 15 },
                              2: { cellWidth: 30, halign: 'right' },
                              3: { cellWidth: 30, halign: 'center' },
                              4: { cellWidth: 30, halign: 'right' }
                            }
                          });

                          const finalY = doc.lastAutoTable.finalY + 10;
                          
                          doc.setFontSize(12);
                          doc.setFont(undefined, 'bold');
                          doc.text('Total Amount:', pageWidth - 80, finalY);
                          doc.text(`Rs. ${grandTotal.toFixed(2)}`, pageWidth - 14, finalY, { align: 'right' });

                          doc.setFontSize(12);
                          doc.setFont(undefined, 'italic');
                          doc.setTextColor(0, 0, 0);
                          doc.text('Swastika Interlocking', pageWidth - 14, finalY + 40, { align: 'right' });
                          doc.setFontSize(9);
                          doc.setFont(undefined, 'normal');
                          doc.setTextColor(100, 100, 100);
                          doc.text('Authorized Signatory', pageWidth - 14, finalY + 45, { align: 'right' });

                          doc.save(`Invoice_SW_${selectedOrder.id}.pdf`);
                        });
                      }}
                      className="w-full py-2.5 bg-surface-container-highest text-on-surface rounded-lg font-bold text-xs hover:bg-surface-variant flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">download</span>
                      <span>Download Invoice</span>
                    </button>
                    <a 
                      href={`https://wa.me/917905978260?text=I%20have%20a%20question%20regarding%20my%20order%20%23SW-${selectedOrder.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 bg-[#25D366] text-white rounded-lg font-bold text-xs hover:opacity-95 flex items-center justify-center space-x-1.5 text-center"
                    >
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                      <span>WhatsApp Support</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <section className="space-y-6">
            <div>
              <h3 className="font-display-lg text-2xl text-primary font-bold">{language === 'hi' ? 'सूचनाएं' : 'Notifications'}</h3>
              <p className="text-on-surface-variant text-sm mt-1">Stay updated with order progress updates.</p>
            </div>
            
            <div className="space-y-4 max-w-2xl">
              {notifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-5 rounded-xl border flex items-start space-x-4 shadow-sm transition-all ${
                    notif.unread ? 'bg-[#FFF8F2] border-primary/20 border-l-4 border-l-primary' : 'bg-white border-outline/10 opacity-75'
                  }`}
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
            </div>
          </section>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <section className="space-y-6 max-w-2xl">
            <div>
              <h3 className="font-display-lg text-2xl text-primary font-bold">{language === 'hi' ? 'समीक्षाएं' : 'My Reviews'}</h3>
              <p className="text-on-surface-variant text-sm mt-1">Share your experience with our construction blocks.</p>
            </div>

            {reviewSubmitted ? (
              <div className="p-4 bg-[#E8F5E9] text-[#2E7D32] rounded-xl border border-secondary/30 font-bold text-sm text-center">
                Review submitted successfully! Thank you for your feedback.
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-outline/10 shadow-sm space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container-low">
                    {(() => {
                      let imageUrl = orders.length > 0 ? getProductThumbnail(orders[0].product_type) : CATALOG.zigzag.images[0];
                      let title = orders.length > 0 ? orders[0].product_type : 'Zigzag Interlocking Paver Block';
                      try {
                        if (orders.length > 0) {
                          const items = JSON.parse(orders[0].product_type);
                          if (Array.isArray(items) && items.length > 0) {
                            if (items[0].image_url) imageUrl = items[0].image_url;
                            title = items.map(i => i.product_name).join(', ');
                          }
                        }
                      } catch(e) {}
                      return (
                        <>
                          <img 
                            className="w-full h-full object-cover" 
                            src={imageUrl} 
                            alt="Product thumbnail" 
                          />
                        </>
                      );
                    })()}
                  </div>
                  <div>
                    {(() => {
                      let title = orders.length > 0 ? orders[0].product_type : 'Zigzag Interlocking Paver Block';
                      try {
                        if (orders.length > 0) {
                          const items = JSON.parse(orders[0].product_type);
                          if (Array.isArray(items) && items.length > 0) {
                            title = items.map(i => i.product_name).join(', ');
                          }
                        }
                      } catch(e) {}
                      return <h4 className="font-bold text-sm line-clamp-1">{title}</h4>;
                    })()}
                    <p className="text-xs text-on-surface-variant">Provide feedback for your last order</p>
                  </div>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant block">Your Rating / आपकी रेटिंग</label>
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
                    <label className="text-xs font-bold text-on-surface-variant block">Comment / टिप्पणी</label>
                    <textarea 
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-surface-container border border-outline/10 rounded-xl p-4 outline-none text-sm font-semibold focus:ring-1 focus:ring-primary focus:border-primary" 
                      placeholder="Share your experience with the durability, color retention or finish..." 
                      rows="4"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="px-6 py-3 bg-[#E8650A] text-white font-bold text-xs rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    Submit Review / समीक्षा भेजें
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
