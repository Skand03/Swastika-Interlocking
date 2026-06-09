import React from 'react';

const STATUS_COLORS = {
  Delivered: { bg: '#E8F5E9', text: '#2E7D32' },
  Pending: { bg: '#FFF3E0', text: '#E65100' },
  Processing: { bg: '#E3F2FD', text: '#0D47A1' },
  Shipped: { bg: '#EDE7F6', text: '#4527A0' },
  Cancelled: { bg: '#FFEBEE', text: '#C62828' },
};

export default function DashboardOverview({ orders, customers, products, metrics, language }) {
  const recentOrders = [...orders].slice(0, 5);
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-8 flex justify-between items-center overflow-hidden relative"
        style={{
          background: 'linear-gradient(135deg, #1a2e1a 0%, #2d4a1e 50%, #1a3a2a 100%)',
          boxShadow: '0 10px 40px rgba(30,80,30,0.25)',
        }}
      >
        <div className="relative z-10">
          <p className="text-green-300/80 text-sm font-bold uppercase tracking-widest mb-2">Admin Portal</p>
          <h2 className="text-white text-3xl font-extrabold mb-1">
            {language === 'hi' ? 'स्वस्तिका एडमिन पैनल में आपका स्वागत है' : 'Welcome to Swastika Admin Panel'}
          </h2>
          <p className="text-white/60 text-sm">
            {language === 'hi' ? 'आज की स्थिति और बिक्री रिपोर्ट देखें।' : 'Monitor your business metrics and manage operations below.'}
          </p>
        </div>
        <div className="relative z-10 opacity-20 text-white" style={{fontSize: '120px', lineHeight: 1, fontFamily: 'Material Symbols Outlined', fontVariationSettings: "'FILL' 1"}}>
          bar_chart
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: language === 'hi' ? 'कुल राजस्व' : 'Total Revenue',    value: `₹${(metrics.totalSales / 100000).toFixed(2)}L`, icon: 'payments',       color: '#E8650A', bg: '#FFF3E0' },
          { label: language === 'hi' ? 'कुल ऑर्डर' : 'Total Orders',      value: orders.length,                                    icon: 'shopping_cart',  color: '#1565C0', bg: '#E3F2FD' },
          { label: language === 'hi' ? 'ग्राहक'    : 'Customers',          value: customers.length,                                 icon: 'group',          color: '#2E7D32', bg: '#E8F5E9' },
          { label: language === 'hi' ? 'कम स्टॉक'  : 'Low Stock Items',    value: products.filter(p => p.stock < 100).length,      icon: 'warning',        color: '#C62828', bg: '#FFEBEE' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: card.bg }}>
              <span className="material-symbols-outlined" style={{ color: card.color, fontSize: '24px' }}>{card.icon}</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">{card.label}</p>
              <p className="text-2xl font-extrabold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800">{language === 'hi' ? 'हाल के ऑर्डर' : 'Recent Orders'}</h3>
            <span className="text-xs text-gray-400 font-bold">Showing last {recentOrders.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-gray-50">
                <tr>
                  {['Order ID', 'Customer', 'Product', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-5 py-3 font-bold text-xs text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-10 text-gray-400 font-semibold">No orders yet.</td></tr>
                ) : recentOrders.map(ord => {
                  const sc = STATUS_COLORS[ord.status] || { bg: '#F5F5F5', text: '#616161' };
                  return (
                    <tr key={ord.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-[#E8650A]">#SW-{ord.id}</td>
                      <td className="px-5 py-3.5 font-semibold text-gray-700">{ord.customer_name}</td>
                      <td className="px-5 py-3.5 text-gray-500 truncate max-w-[200px]">
                        {(() => {
                          try {
                            let items = JSON.parse(ord.product_type);
                            if (Array.isArray(items) && items.length > 0) {
                              return items.map(i => i.product_name).join(', ');
                            }
                            return ord.product_type;
                          } catch(e) {
                            return ord.product_type;
                          }
                        })()}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: sc.bg, color: sc.text }}>{ord.status}</span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-400">{ord.created_at?.split(' ')[0]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h3 className="font-bold text-lg text-gray-800">{language === 'hi' ? 'ऑर्डर स्थिति' : 'Order Status'}</h3>
          {[
            { label: 'Pending',   count: pendingCount,                                                bg: '#FFF3E0', color: '#E65100', icon: 'schedule' },
            { label: 'Delivered', count: deliveredCount,                                              bg: '#E8F5E9', color: '#2E7D32', icon: 'check_circle' },
            { label: 'Active',    count: orders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length, bg: '#E3F2FD', color: '#1565C0', icon: 'local_shipping' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: s.bg }}>
              <span className="material-symbols-outlined" style={{ color: s.color }}>{s.icon}</span>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase" style={{ color: s.color }}>{s.label}</p>
                <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.count}</p>
              </div>
            </div>
          ))}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-semibold text-center">
              {language === 'hi' ? 'सभी प्रणालियां सामान्य रूप से चल रही हैं' : 'All systems operating normally'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-bold text-lg text-gray-800 mb-5">{language === 'hi' ? 'त्वरित कार्रवाइयां' : 'Quick Actions'}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Add Product',    icon: 'add_box',         color: '#E8650A' },
            { label: 'View Orders',    icon: 'receipt_long',    color: '#1565C0' },
            { label: 'See Customers',  icon: 'people',          color: '#2E7D32' },
            { label: 'Export Report',  icon: 'download',        color: '#6A1B9A' },
          ].map(a => (
            <div
              key={a.label}
              className="flex flex-col items-center gap-3 p-5 rounded-xl border border-gray-100 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 active:scale-95"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: a.color + '18' }}>
                <span className="material-symbols-outlined" style={{ color: a.color, fontSize: '22px' }}>{a.icon}</span>
              </div>
              <span className="text-xs font-bold text-gray-600 text-center">{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
