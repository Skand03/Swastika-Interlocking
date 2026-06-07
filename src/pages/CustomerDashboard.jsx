import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CustomerDashboard({ language }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'orders', 'details', 'notifications', 'reviews'
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Form fields
  const [profileName, setProfileName] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profilePincode, setProfilePincode] = useState('302001');
  const [profileAddress, setProfileAddress] = useState('123 Industrial Area, Phase II, Near City Plaza, Jaipur, Rajasthan');

  // Filter for orders
  const [statusFilter, setStatusFilter] = useState('All');

  // Review Form state
  const [rating, setRating] = useState(4);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const [statusMsg, setStatusMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Check login and fetch data
  useEffect(() => {
    const sessionUser = localStorage.getItem('user');
    if (!sessionUser) {
      navigate('/auth');
      return;
    }
    const parsedUser = JSON.parse(sessionUser);
    setUser(parsedUser);
    setProfileName(parsedUser.full_name);
    setProfileCity(parsedUser.city);

    // Fetch live dashboard data from API
    fetch(`./api/get_portal_data.php?phone=${parsedUser.phone}&role=customer`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders || []);
          if (data.orders && data.orders.length > 0) {
            setSelectedOrder(data.orders[0]); // default detail
          }
          setNotifications(data.notifications || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading dashboard data:", err);
        setLoading(false);
      });
  }, [navigate]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    setStatusMsg('');
    
    // Simulate profile save
    setIsSuccess(true);
    setStatusMsg(language === 'hi' ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!' : 'Profile updated successfully!');
    
    // Update local user details
    const updatedUser = { ...user, full_name: profileName, city: profileCity };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
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
          <span className="material-symbols-outlined text-5xl text-primary animate-spin">cyclone</span>
          <p className="font-semibold">{language === 'hi' ? 'लोड हो रहा है...' : 'Loading portal...'}</p>
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
    <div className="min-h-screen bg-[#FAF7F2] text-on-surface font-body-md pt-16 flex flex-col md:flex-row select-none">
      
      {/* Sidebar Navigation */}
      <aside className="bg-[#1C2B1A] text-primary-fixed w-full md:w-64 flex-shrink-0 flex flex-col py-8 px-4 z-20 shadow-md">
        {/* Brand Header */}
        <div className="mb-8 px-2 border-b border-white/10 pb-4">
          <h1 className="font-display-lg text-xl text-primary-fixed-dim tracking-tight font-bold">Construx Pro</h1>
          <p className="text-xs text-tertiary-fixed-dim/60 uppercase tracking-widest mt-1">Customer Dashboard</p>
        </div>
        
        {/* User Card */}
        <div className="bg-white/5 rounded-xl p-4 mb-8 flex items-center space-x-3 border border-white/5">
          <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-sm">
            {user.full_name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-sm text-white leading-tight">{user.full_name}</p>
            <p className="text-[10px] text-tertiary-fixed-dim/50">Member since 2024</p>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-grow space-y-1">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all text-left cursor-pointer ${
              activeTab === 'profile' ? 'bg-surface-variant/10 text-primary-fixed font-bold border-l-4 border-primary-fixed' : 'text-tertiary-fixed-dim/70 hover:bg-white/5 hover:text-tertiary-fixed'
            }`}
          >
            <span className="material-symbols-outlined text-xl">person</span>
            <span>{language === 'hi' ? 'प्रोफ़ाइल / Profile' : 'Profile / प्रोफाइल'}</span>
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all text-left cursor-pointer ${
              activeTab === 'orders' ? 'bg-surface-variant/10 text-primary-fixed font-bold border-l-4 border-primary-fixed' : 'text-tertiary-fixed-dim/70 hover:bg-white/5 hover:text-tertiary-fixed'
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="material-symbols-outlined text-xl">shopping_cart</span>
              <span>{language === 'hi' ? 'आदेश / Orders' : 'Orders / आदेश'}</span>
            </span>
            <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{orders.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab('details')}
            disabled={!selectedOrder}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all text-left cursor-pointer ${
              !selectedOrder ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              activeTab === 'details' ? 'bg-surface-variant/10 text-primary-fixed font-bold border-l-4 border-primary-fixed' : 'text-tertiary-fixed-dim/70 hover:bg-white/5 hover:text-tertiary-fixed'
            }`}
          >
            <span className="material-symbols-outlined text-xl">receipt_long</span>
            <span>{language === 'hi' ? 'आदेश विवरण / Details' : 'Order Details / विवरण'}</span>
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all text-left cursor-pointer ${
              activeTab === 'notifications' ? 'bg-surface-variant/10 text-primary-fixed font-bold border-l-4 border-primary-fixed' : 'text-tertiary-fixed-dim/70 hover:bg-white/5 hover:text-tertiary-fixed'
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span>{language === 'hi' ? 'सूचनाएं / Notifications' : 'Notifications / सूचनाएं'}</span>
            </span>
            <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {notifications.filter(n => n.unread).length}
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all text-left cursor-pointer ${
              activeTab === 'reviews' ? 'bg-surface-variant/10 text-primary-fixed font-bold border-l-4 border-primary-fixed' : 'text-tertiary-fixed-dim/70 hover:bg-white/5 hover:text-tertiary-fixed'
            }`}
          >
            <span className="material-symbols-outlined text-xl">rate_review</span>
            <span>{language === 'hi' ? 'समीक्षाएं / Reviews' : 'Reviews / समीक्षाएं'}</span>
          </button>
        </nav>

        {/* Customer Support */}
        <div className="mt-8 pt-4 border-t border-white/10">
          <a 
            href="tel:+919876543210"
            className="w-full flex items-center justify-center space-x-2 py-3 bg-secondary text-white rounded-lg font-bold text-xs hover:opacity-95 transition-all text-center"
          >
            <span className="material-symbols-outlined text-sm">headset_mic</span>
            <span>{language === 'hi' ? 'सहायता / Support' : 'Support / सहायता'}</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-10 max-w-screen-xl mx-auto space-y-8 w-full">
        
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

        {/* ORDERS LIST TAB */}
        {activeTab === 'orders' && (
          <section className="space-y-6">
            <div>
              <h3 className="font-display-lg text-2xl text-primary font-bold">{language === 'hi' ? 'मेरे ऑर्डर' : 'My Orders'}</h3>
              <p className="text-on-surface-variant text-sm mt-1">Track and manage your order list histories.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Pending', 'Processing', 'Delivered'].map((filter) => (
                <button 
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-6 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                    statusFilter === filter ? 'bg-primary text-white shadow-sm' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Order cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredOrders.length === 0 ? (
                <div className="col-span-2 text-center py-16 bg-white rounded-2xl border border-outline/10">
                  <span className="material-symbols-outlined text-5xl text-outline/30 mb-2">shopping_bag</span>
                  <p className="text-on-surface-variant font-bold text-sm">No orders found.</p>
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div 
                    key={ord.id}
                    className="bg-white p-6 rounded-2xl border border-outline/10 hover:shadow-sm transition-shadow flex items-start space-x-4"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container-low flex-shrink-0">
                      <img 
                        alt="Product visual" 
                        className="w-full h-full object-cover" 
                        src={
                          ord.product_type.toLowerCase().includes('zigzag')
                            ? CATALOG.zigzag.images[0]
                            : CATALOG['i-shape'].images[0]
                        }
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-sm text-on-surface leading-tight line-clamp-1">{ord.product_type}</h4>
                          <p className="text-[10px] text-on-surface-variant font-semibold mt-1">ID: #SW-{ord.id} • {ord.created_at.split(' ')[0]}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === 'Delivered' ? 'bg-[#E8F5E9] text-[#2E7D32]' : ord.status === 'Pending' ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-[#E3F2FD] text-[#0D47A1]'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-4 border-t border-outline/5 pt-3">
                        <span className="font-extrabold text-[#E8650A] text-lg">Qty: {ord.quantity} pcs</span>
                        <button 
                          onClick={() => {
                            setSelectedOrder(ord);
                            setActiveTab('details');
                          }}
                          className="text-primary font-bold text-xs hover:underline flex items-center cursor-pointer"
                        >
                          View Detail <span className="material-symbols-outlined text-sm ml-0.5">chevron_right</span>
                        </button>
                      </div>
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
                      <tr>
                        <td className="py-3 font-bold text-on-surface">{selectedOrder.product_type}</td>
                        <td className="py-3 text-center">{selectedOrder.quantity} pcs</td>
                        <td className="py-3 text-right">₹{selectedOrder.quantity * 20}</td>
                      </tr>
                      <tr className="border-t border-outline/5">
                        <td className="py-3 text-on-surface-variant">Standard Logistics Charges</td>
                        <td className="py-3 text-center">--</td>
                        <td className="py-3 text-right">₹2,500</td>
                      </tr>
                      <tr className="border-t-2 border-primary/20 font-bold text-sm">
                        <td className="py-4 text-on-surface" colSpan={2}>Total Estimated Value</td>
                        <td className="py-4 text-right text-primary text-base">₹{(selectedOrder.quantity * 20) + 2500}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#FAF7F2] p-5 rounded-xl border border-outline-variant/30 space-y-2">
                    <h4 className="text-xs font-bold text-outline uppercase">Delivery Address</h4>
                    <p className="text-xs leading-relaxed font-bold">{selectedOrder.address}</p>
                    {selectedOrder.special_req && (
                      <div className="mt-2 border-t border-outline/10 pt-2">
                        <p className="text-[10px] uppercase font-bold text-[#E8650A]">Special Instructions</p>
                        <p className="text-[11px] text-on-surface-variant italic mt-0.5">{selectedOrder.special_req}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => alert('Downloading Mock Invoice PDF...')}
                      className="w-full py-2.5 bg-surface-container-highest text-on-surface rounded-lg font-bold text-xs hover:bg-surface-variant flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">download</span>
                      <span>Download Invoice</span>
                    </button>
                    <a 
                      href={`https://wa.me/919876543210?text=I%20have%20a%20question%20regarding%20my%20order%20%23SW-${selectedOrder.id}`}
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
                    <img className="w-full h-full object-cover" src={CATALOG.zigzag.images[0]} alt="Product thumbnail" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Zigzag Interlocking Paver Block</h4>
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
