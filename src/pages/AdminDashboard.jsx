import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard({ language }) {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'orders', 'customers', 'inventory', 'sales', 'inquiries', 'settings'
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [metrics, setMetrics] = useState({ totalSales: 0, newOrders: 0, newCustomers: 0, lowStock: 7 });
  const [loading, setLoading] = useState(true);

  // Selected entities for drawers/chats
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // In-tab search states
  const [customerSearch, setCustomerSearch] = useState('');

  // Status updating state
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Load admin details & fetch portal statistics
  useEffect(() => {
    const sessionUser = localStorage.getItem('user');
    if (!sessionUser) {
      navigate('/auth');
      return;
    }
    const parsedUser = JSON.parse(sessionUser);
    if (parsedUser.role !== 'admin') {
      navigate('/customer-dashboard');
      return;
    }
    setAdmin(parsedUser);

    fetchData(parsedUser.phone);
  }, [navigate]);

  const fetchData = (phone) => {
    fetch(`./api/get_portal_data.php?phone=${phone}&role=admin`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders || []);
          setInquiries(data.inquiries || []);
          setCustomers(data.customers || []);
          if (data.customers && data.customers.length > 0) {
            setSelectedCustomer(data.customers[0]);
          }
          if (data.inquiries && data.inquiries.length > 0) {
            setSelectedInquiry(data.inquiries[0]);
          }
          if (data.metrics) {
            setMetrics(data.metrics);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching admin stats:", err);
        setLoading(false);
      });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const response = await fetch('./api/update_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus })
      });
      const result = await response.json();
      if (result.success) {
        // Refresh orders data
        fetchData(admin.phone);
      } else {
        alert(result.message || "Failed to update order status.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error updating status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0EBE0] pt-16">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-5xl text-primary animate-spin">cyclone</span>
          <p className="font-semibold">{language === 'hi' ? 'एडमिन पोर्टल लोड हो रहा है...' : 'Loading admin portal...'}</p>
        </div>
      </div>
    );
  }

  if (!admin) return null;

  // Filter customers by search
  const filteredCustomers = customers.filter(c => 
    c.full_name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.city.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone.includes(customerSearch)
  );

  return (
    <div className="min-h-screen bg-[#F0EBE0] text-on-surface font-body-md pt-16 flex flex-col md:flex-row select-none">
      
      {/* Sidenav (Desktop) */}
      <aside className="bg-[#1C2B1A] text-primary-fixed w-full md:w-64 flex-shrink-0 flex flex-col py-8 px-4 z-20 shadow-md">
        <div className="mb-8 px-2 border-b border-white/10 pb-4">
          <h1 className="font-display-lg text-xl text-primary-fixed-dim font-bold">Construx Pro</h1>
          <p className="text-[10px] text-tertiary-fixed-dim/60 uppercase tracking-widest mt-1">Admin Panel</p>
        </div>

        {/* Admin Navigation */}
        <nav className="flex-grow space-y-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all text-left cursor-pointer ${
              activeTab === 'overview' ? 'bg-surface-variant/10 text-primary-fixed font-bold border-l-4 border-primary-fixed' : 'text-tertiary-fixed-dim/70 hover:bg-white/5 hover:text-tertiary-fixed'
            }`}
          >
            <span className="material-symbols-outlined text-xl">home</span>
            <span>{language === 'hi' ? 'अवलोकन / Overview' : 'Overview / अवलोकन'}</span>
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-all text-left cursor-pointer ${
              activeTab === 'orders' ? 'bg-surface-variant/10 text-primary-fixed font-bold border-l-4 border-primary-fixed' : 'text-tertiary-fixed-dim/70 hover:bg-white/5 hover:text-tertiary-fixed'
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="material-symbols-outlined text-xl">shopping_cart</span>
              <span>{language === 'hi' ? 'आदेश प्रबंधन / Orders' : 'Orders / हाल के आदेश'}</span>
            </span>
            <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{orders.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all text-left cursor-pointer ${
              activeTab === 'customers' ? 'bg-surface-variant/10 text-primary-fixed font-bold border-l-4 border-primary-fixed' : 'text-tertiary-fixed-dim/70 hover:bg-white/5 hover:text-tertiary-fixed'
            }`}
          >
            <span className="material-symbols-outlined text-xl">group</span>
            <span>{language === 'hi' ? 'ग्राहक सूची / Customers' : 'Customers / ग्राहक'}</span>
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all text-left cursor-pointer ${
              activeTab === 'inventory' ? 'bg-surface-variant/10 text-primary-fixed font-bold border-l-4 border-primary-fixed' : 'text-tertiary-fixed-dim/70 hover:bg-white/5 hover:text-tertiary-fixed'
            }`}
          >
            <span className="material-symbols-outlined text-xl">inventory_2</span>
            <span>{language === 'hi' ? 'स्टॉक प्रबंधन / Inventory' : 'Inventory / स्टॉक'}</span>
          </button>
          <button 
            onClick={() => setActiveTab('sales')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all text-left cursor-pointer ${
              activeTab === 'sales' ? 'bg-surface-variant/10 text-primary-fixed font-bold border-l-4 border-primary-fixed' : 'text-tertiary-fixed-dim/70 hover:bg-white/5 hover:text-tertiary-fixed'
            }`}
          >
            <span className="material-symbols-outlined text-xl">bar_chart</span>
            <span>{language === 'hi' ? 'बिक्री रिपोर्ट / Sales' : 'Sales Report / रिपोर्ट'}</span>
          </button>
          <button 
            onClick={() => setActiveTab('inquiries')}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-all text-left cursor-pointer ${
              activeTab === 'inquiries' ? 'bg-surface-variant/10 text-primary-fixed font-bold border-l-4 border-primary-fixed' : 'text-tertiary-fixed-dim/70 hover:bg-white/5 hover:text-tertiary-fixed'
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="material-symbols-outlined text-xl">mail</span>
              <span>{language === 'hi' ? 'पूछताछ / Inquiries' : 'Inquiries / चैट लॉग्स'}</span>
            </span>
            <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{inquiries.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all text-left cursor-pointer ${
              activeTab === 'settings' ? 'bg-surface-variant/10 text-primary-fixed font-bold border-l-4 border-primary-fixed' : 'text-tertiary-fixed-dim/70 hover:bg-white/5 hover:text-tertiary-fixed'
            }`}
          >
            <span className="material-symbols-outlined text-xl">settings</span>
            <span>{language === 'hi' ? 'सेटिंग्स / Settings' : 'Settings / सेटिंग्स'}</span>
          </button>
        </nav>

        {/* Admin Logout */}
        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold text-xs">AD</div>
            <div className="overflow-hidden text-xs">
              <p className="text-tertiary-fixed font-bold truncate">{admin.full_name}</p>
              <p className="text-tertiary-fixed-dim/50 text-[10px] truncate">{admin.phone}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#ba1a1a] hover:bg-[#ba1a1a]/10 transition-colors text-sm font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>{language === 'hi' ? 'लॉगआउट / Logout' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-grow p-6 md:p-8 space-y-8 overflow-y-auto max-w-screen-xl mx-auto w-full">
        
        {/* TOPBAR METRICS (Visible on all tabs except settings and chats) */}
        {activeTab !== 'settings' && activeTab !== 'inquiries' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#FAF7F2] p-6 rounded-xl shadow-sm border border-[#6B6860]/20 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-2">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary transition-colors text-primary group-hover:text-white">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <span className="text-[#2E7D32] text-xs font-bold flex items-center">+12.5% <span className="material-symbols-outlined text-[14px]">trending_up</span></span>
              </div>
              <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">Total Sales / कुल बिक्री</p>
              <h3 className="text-2xl font-bold mt-1">₹{(metrics.totalSales / 100000).toFixed(1)}L</h3>
            </div>
            
            <div className="bg-[#FAF7F2] p-6 rounded-xl shadow-sm border border-[#6B6860]/20 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-2">
                <div className="p-3 bg-secondary/10 rounded-lg group-hover:bg-secondary transition-colors text-secondary group-hover:text-white">
                  <span className="material-symbols-outlined">shopping_cart</span>
                </div>
                <span className="text-[#2E7D32] text-xs font-bold flex items-center">+5.2% <span className="material-symbols-outlined text-[14px]">trending_up</span></span>
              </div>
              <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">Total Orders / कुल आदेश</p>
              <h3 className="text-2xl font-bold mt-1">{metrics.newOrders}</h3>
            </div>

            <div className="bg-[#FAF7F2] p-6 rounded-xl shadow-sm border border-[#6B6860]/20 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-2">
                <div className="p-3 bg-tertiary/10 rounded-lg group-hover:bg-tertiary transition-colors text-tertiary group-hover:text-white">
                  <span className="material-symbols-outlined">group</span>
                </div>
                <span className="text-[#ba1a1a] text-xs font-bold flex items-center">-2.1% <span className="material-symbols-outlined text-[14px]">trending_down</span></span>
              </div>
              <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">Customers / ग्राहक</p>
              <h3 className="text-2xl font-bold mt-1">{metrics.newCustomers}</h3>
            </div>

            <div className="bg-[#FAF7F2] p-6 rounded-xl shadow-sm border border-[#6B6860]/20 hover:shadow-md transition-all group border-l-4 border-error">
              <div className="flex justify-between items-start mb-2">
                <div className="p-3 bg-error/10 rounded-lg text-error">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <span className="text-[#ba1a1a] text-xs font-bold">Action Needed</span>
              </div>
              <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">Low Stock / कम स्टॉक</p>
              <h3 className="text-2xl font-bold mt-1">{metrics.lowStock} Items</h3>
            </div>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sales performance chart representation */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-base">Sales Performance / बिक्री प्रदर्शन</h4>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                    <span>Revenue</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary inline-block"></span>
                    <span>Target</span>
                  </div>
                </div>
              </div>
              <div className="h-60 flex items-end gap-3 px-4 pb-2 border-b border-outline/10">
                <div className="w-full bg-primary/10 rounded-t h-[40%] relative group">
                  <div className="absolute inset-0 bg-primary/20 hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="w-full bg-primary/10 rounded-t h-[60%]"></div>
                <div className="w-full bg-primary/10 rounded-t h-[45%]"></div>
                <div className="w-full bg-primary rounded-t h-[85%]"></div>
                <div className="w-full bg-primary rounded-t h-[70%]"></div>
                <div className="w-full bg-primary/10 rounded-t h-[55%]"></div>
                <div className="w-full bg-primary rounded-t h-[90%]"></div>
                <div className="w-full bg-primary rounded-t h-[75%]"></div>
                <div className="w-full bg-primary/10 rounded-t h-[40%]"></div>
              </div>
              <div className="flex justify-between mt-3 text-[10px] text-on-surface-variant font-bold px-2">
                <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span><span>SEP</span>
              </div>
            </div>

            {/* Product Mix breakdown */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
              <h4 className="font-bold text-base mb-4">Product Mix</h4>
              <div className="space-y-4">
                {[
                  { name: 'Interlocking Bricks', val: 42, color: 'bg-primary' },
                  { name: 'Heavy Duty Pavers', val: 35, color: 'bg-secondary' },
                  { name: 'Garden Edging', val: 15, color: 'bg-tertiary' },
                  { name: 'Concrete Mixes', val: 8, color: 'bg-outline' }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>{item.name}</span>
                      <span className="text-on-surface-variant">{item.val}%</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setActiveTab('inventory')}
                className="w-full py-2.5 bg-surface-container rounded-lg text-xs font-bold hover:bg-surface-container-high transition-colors mt-6 cursor-pointer"
              >
                View Inventory Report
              </button>
            </div>

            {/* Distribution Network Map */}
            <div className="col-span-12 bg-white p-6 rounded-xl shadow-sm border border-outline-variant/30">
              <h4 className="font-bold text-base mb-4">Distribution Network / वितरण नेटवर्क</h4>
              <div className="relative rounded-lg overflow-hidden h-64 border bg-surface-container flex items-center justify-center">
                <img 
                  alt="Network map" 
                  className="w-full h-full object-cover grayscale opacity-40" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF1GGs9izY55gUbGZb4Sc4gQLpnjbcTC-DHYoKhtciBHfd2nLrXLp61ilWOacS14t3h2db99aTiaKGZ0Gvo2NoFBbKT1_sbyjd71JMKTGitTRhRjQ85CK8ErSAfJNfUYFCPI0Dd9Ke4Q2hZb0pppDDRmsCe-7sYQARNKHe7kQir9V0kVwHh992Pe8MTnsRFgnwM2x5p3kn5bohMZ-gxI1El172x-TImuRwACf2BiPXMIaSrVI13oTH9XMVs9-5NJbgAa8l37XP-GE" 
                />
                <div className="absolute bg-white/90 p-4 rounded-xl border border-outline/10 text-center shadow-lg backdrop-blur-sm">
                  <span className="material-symbols-outlined text-primary text-3xl mb-1">location_on</span>
                  <p className="font-bold text-sm">Central Hub: Deesa (Gujarat)</p>
                  <p className="text-[10px] text-on-surface-variant font-semibold">Active warehouses serving 14 local GIDC districts</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ORDERS MANAGER TAB */}
        {activeTab === 'orders' && (
          <section className="bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low">
              <h4 className="font-bold text-base text-primary">हाल के आदेश / Live Order Management</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/20 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Product Type</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">Delivery City</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-xs font-semibold">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-surface-container/20 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-primary">#SW-{ord.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm">{ord.customer_name}</div>
                        <div className="text-[10px] text-on-surface-variant">{ord.phone}</div>
                      </td>
                      <td className="px-6 py-4">{ord.product_type}</td>
                      <td className="px-6 py-4 font-bold text-[#E8650A]">{ord.quantity} pcs</td>
                      <td className="px-6 py-4">{ord.city}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === 'Delivered' ? 'bg-[#E8F5E9] text-[#2E7D32]' : ord.status === 'Pending' ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-[#E3F2FD] text-[#0D47A1]'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {updatingOrderId === ord.id ? (
                          <span className="text-[10px] text-on-surface-variant italic">Updating...</span>
                        ) : (
                          <select 
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                            className="bg-surface border border-outline/20 rounded px-2 py-1 text-xs font-bold text-primary focus:ring-1 focus:ring-primary cursor-pointer outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <section className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3 bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
              <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low">
                <h4 className="font-bold text-base text-primary">पंजीकृत ग्राहक / Registered Customers</h4>
                <div className="relative">
                  <input 
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="bg-white border border-outline-variant/20 rounded-lg pl-8 pr-4 py-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary w-52 outline-none font-semibold"
                    placeholder="Search by name..."
                  />
                  <span className="material-symbols-outlined text-sm absolute left-2.5 top-2.5 text-outline">search</span>
                </div>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/20 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">City</th>
                    <th className="px-6 py-4">Phone Number</th>
                    <th className="px-6 py-4">Registered Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-xs font-semibold">
                  {filteredCustomers.map((c) => (
                    <tr 
                      key={c.id} 
                      onClick={() => setSelectedCustomer(c)}
                      className={`hover:bg-primary/5 transition-colors cursor-pointer ${
                        selectedCustomer && selectedCustomer.id === c.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <td className="px-6 py-4 font-bold text-sm text-on-surface flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-on-primary-fixed text-xs">
                          {c.full_name.substring(0,2).toUpperCase()}
                        </div>
                        {c.full_name}
                      </td>
                      <td className="px-6 py-4">{c.city}</td>
                      <td className="px-6 py-4">{c.phone}</td>
                      <td className="px-6 py-4">{c.created_at.split(' ')[0]}</td>
                      <td className="px-6 py-4">
                        <span className="bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded text-[10px] font-bold uppercase">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Customer detail card/drawer */}
            {selectedCustomer && (
              <div className="bg-white rounded-xl shadow-md border border-outline-variant/20 p-6 text-center space-y-6 self-start">
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full border-4 border-primary/20 bg-primary/10 flex items-center justify-center font-bold text-2xl text-primary mx-auto">
                    {selectedCustomer.full_name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="absolute bottom-0 right-0 h-5 w-5 bg-secondary border-4 border-white rounded-full"></span>
                </div>
                <div>
                  <h4 className="font-bold text-lg">{selectedCustomer.full_name}</h4>
                  <p className="text-on-surface-variant text-xs font-semibold">City: {selectedCustomer.city}</p>
                </div>
                <div className="w-full text-left text-xs font-semibold space-y-2 border-t pt-4 border-outline/5">
                  <p><strong>Phone:</strong> +91 {selectedCustomer.phone}</p>
                  <p><strong>Registration ID:</strong> #C-{selectedCustomer.id}</p>
                </div>
                <a 
                  href={`https://wa.me/91${selectedCustomer.phone}?text=Hello%20${selectedCustomer.full_name}%2C%20this%20is%20Swastika%20Interlocking%20admin.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#25D366] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:brightness-105 active:scale-95 transition-all text-center"
                >
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                  <span>WhatsApp Message</span>
                </a>
              </div>
            )}
          </section>
        )}

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <section className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/20 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Stock Level</th>
                    <th className="px-6 py-4">Min. Threshold</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-xs font-semibold">
                  <tr className="bg-[#FFF8F2] border-l-4 border-l-primary">
                    <td className="px-6 py-4 font-bold">Zigzag Paver Blocks</td>
                    <td className="px-6 py-4">Interlocking Blocks</td>
                    <td className="px-6 py-4 font-bold text-primary">4,500 sqft</td>
                    <td className="px-6 py-4">10,000 sqft</td>
                    <td className="px-6 py-4"><span className="bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded text-[10px] font-bold">LOW STOCK</span></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-bold">Portland Cement (50kg)</td>
                    <td className="px-6 py-4">Cements</td>
                    <td className="px-6 py-4 text-on-surface-variant">240 bags</td>
                    <td className="px-6 py-4">100 bags</td>
                    <td className="px-6 py-4"><span className="bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded text-[10px] font-bold">HEALTHY</span></td>
                  </tr>
                  <tr className="bg-error-container/20 border-l-4 border-l-error">
                    <td className="px-6 py-4 font-bold">River Sand</td>
                    <td className="px-6 py-4">Bulk Raw Materials</td>
                    <td className="px-6 py-4 font-bold text-error">0 Trucks</td>
                    <td className="px-6 py-4">5 Trucks</td>
                    <td className="px-6 py-4"><span className="bg-error/10 text-error px-2 py-0.5 rounded text-[10px] font-bold">OUT OF STOCK</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* SALES REPORTS TAB */}
        {activeTab === 'sales' && (
          <section className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 space-y-6">
              <h4 className="font-bold text-base">Revenue by Category</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-primary rounded"></span> Interlocking Blocks</span>
                  <span className="text-primary">₹18,90,000 (45%)</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#E8650A] rounded"></span> Raw Construction Materials</span>
                  <span className="text-[#E8650A]">₹12,60,000 (30%)</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-secondary rounded"></span> Pipes & Infrastructure</span>
                  <span className="text-secondary">₹10,50,000 (25%)</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* INQUIRIES & CHAT TAB */}
        {activeTab === 'inquiries' && (
          <section className="h-[550px] bg-white rounded-xl border border-outline-variant/30 flex overflow-hidden">
            {/* Left inquiry listing */}
            <div className="w-1/3 border-r border-outline-variant/20 flex flex-col">
              <div className="p-4 border-b border-outline-variant/10 bg-surface-container-low font-bold text-xs">
                Inquiries Messages
              </div>
              <div className="flex-grow overflow-y-auto divide-y divide-outline-variant/10">
                {inquiries.length === 0 ? (
                  <p className="p-4 text-xs italic text-on-surface-variant">No inquiries received.</p>
                ) : (
                  inquiries.map((inq) => (
                    <div 
                      key={inq.id}
                      onClick={() => setSelectedInquiry(inq)}
                      className={`p-4 hover:bg-surface-container/20 cursor-pointer transition-colors relative text-xs ${
                        selectedInquiry && selectedInquiry.id === inq.id ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start font-bold mb-1">
                        <span className="truncate">{inq.name}</span>
                        <span className="text-[9px] text-outline">{inq.created_at.split(' ')[0]}</span>
                      </div>
                      <p className="text-on-surface-variant truncate font-medium">{inq.requirements}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right inquiry details / chatbot dialog logger */}
            <div className="flex-grow flex flex-col bg-[#FAF7F2]">
              {selectedInquiry ? (
                <>
                  <div className="p-4 bg-white border-b border-outline-variant/10 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-sm">{selectedInquiry.name}</h4>
                      <p className="text-[10px] font-semibold text-secondary">Contact: {selectedInquiry.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex-grow p-6 space-y-4 overflow-y-auto">
                    {/* Customer Message */}
                    <div className="flex justify-start">
                      <div className="max-w-[75%] bg-[#FFF8F2] p-4 rounded-xl rounded-tl-none shadow-sm text-xs font-semibold">
                        <p>{selectedInquiry.requirements}</p>
                        <span className="text-[9px] text-outline mt-1.5 block text-right font-medium">{selectedInquiry.created_at}</span>
                      </div>
                    </div>
                    
                    {/* Bot reply suggestion log */}
                    <div className="flex justify-end">
                      <div className="max-w-[75%] bg-primary-fixed p-4 rounded-xl rounded-tr-none shadow-sm text-on-primary-fixed text-xs font-semibold">
                        <p>
                          {language === 'hi' 
                            ? `नमस्ते ${selectedInquiry.name}! हमारी टीम जल्द ही आपसे +91 ${selectedInquiry.phone} पर संपर्क करेगी और आपकी कोटेशन अनुरोध पर चर्चा करेगी। धन्यवाद!`
                            : `Hello ${selectedInquiry.name}! Our sales team has received your request regarding: "${selectedInquiry.requirements}". We will contact you at +91 ${selectedInquiry.phone} shortly. Thank you!`
                          }
                        </p>
                        <span className="text-[9px] opacity-75 mt-1.5 block text-right font-medium">Auto Answer</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-grow flex items-center justify-center">
                  <p className="text-on-surface-variant text-sm italic font-semibold">Select an inquiry message to inspect details</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center gap-3 border-b pb-4 mb-4 border-outline/10">
                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">business</span>
                <h4 className="font-bold text-sm">Head Office Location</h4>
              </div>
              <div className="space-y-4 text-xs font-semibold">
                <p>Deesa-Palanpur Highway, Deesa, Banaskantha GIDC, Gujarat - 385535</p>
                <div className="h-28 bg-surface-container rounded-lg overflow-hidden relative flex items-center justify-center border">
                  <span className="material-symbols-outlined text-primary text-4xl absolute z-10 animate-bounce">location_on</span>
                  <div className="bg-neutral-800/20 absolute inset-0"></div>
                  <img className="w-full h-full object-cover opacity-50 grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNZmEiqLj3DpPFZOLKTH4cJ-kcZ9zi3lf3y2VanU0aQv6ft5HySw8biDG5AlYm4ByUQ1EAF6n-Z3QPx0M6H6E8eH-84-nssCSJ0Y6cGnfTDenuvpNjB8kWwCnMDi3sadrIaoxsjmaPZLWTXdAuw940juuKQb83FCmJS3imrYGuDnUxiY9oOxVjk9b8MRTEvM64-5b20Ic4b0g3ID4xuK6ycNzXBnDdmsByjHIE_HOGznpaWf3UPJCp-RV8sWgj1qmraqCKg7kFnHs" alt="Static Map" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center gap-3 border-b pb-4 mb-4 border-outline/10">
                <span className="material-symbols-outlined text-secondary bg-secondary/10 p-2 rounded-lg">local_shipping</span>
                <h4 className="font-bold text-sm">Freight & Delivery Pricing</h4>
              </div>
              <div className="space-y-2 text-xs font-semibold">
                <div className="flex justify-between bg-surface-container-low p-2 rounded">
                  <span>Banaskantha District (Within 25km)</span>
                  <span className="text-secondary font-bold">FREE DELIVERY</span>
                </div>
                <div className="flex justify-between bg-surface-container-low p-2 rounded">
                  <span>Palanpur GIDC Zone</span>
                  <span className="text-primary font-bold">₹1,500 / Truck</span>
                </div>
                <div className="flex justify-between bg-surface-container-low p-2 rounded">
                  <span>Ahmedabad / Gandhinagar</span>
                  <span className="text-primary font-bold">₹3,500 / Truck</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
