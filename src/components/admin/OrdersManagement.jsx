import React, { useState } from 'react';

const STATUS_BADGE = {
  Delivered:  'bg-green-100 text-green-800 border-green-200',
  Pending:    'bg-amber-100 text-amber-800 border-amber-200',
  Processing: 'bg-blue-100 text-blue-800 border-blue-200',
  Shipped:    'bg-purple-100 text-purple-800 border-purple-200',
  Cancelled:  'bg-red-100 text-red-800 border-red-200',
};

// Render items array from the jsonb `items` column
const getItemNames = (items) => {
  if (!Array.isArray(items) || items.length === 0) return '—';
  return items.map(i => i.product_name || '').filter(Boolean).join(', ');
};

const getTotalQty = (items) => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, i) => sum + (parseInt(i.quantity) || 0), 0);
};

export default function OrdersManagement({ language, orders, handleStatusChange }) {
  const isHindi = language === 'hi';
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const newOrders       = orders.filter(o => o.status === 'Pending').length;
  const processingOrders = orders.filter(o => o.status === 'Processing').length;
  const shippedOrders   = orders.filter(o => o.status === 'Shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

  const filteredOrders = orders.filter(ord => {
    const statusMatch = filter === 'All' || ord.status === filter;
    const q = search.toLowerCase();
    const searchMatch = !q ||
      ord.customer_name?.toLowerCase().includes(q) ||
      ord.order_number?.toLowerCase().includes(q) ||
      ord.customer_phone?.includes(q) ||
      ord.delivery_city?.toLowerCase().includes(q) ||
      getItemNames(ord.items).toLowerCase().includes(q);
    return statusMatch && searchMatch;
  });

  const totalPages      = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const indexOfLast     = currentPage * itemsPerPage;
  const indexOfFirst    = indexOfLast - itemsPerPage;
  const currentItems    = filteredOrders.slice(indexOfFirst, indexOfLast);

  return (
    <>
      <section className="space-y-6 md:space-y-8 print:hidden" id="orders-management">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold">
              {isHindi ? 'ऑर्डर प्रबंधन' : 'Orders Management'}
            </h3>
            <p className="text-on-surface-variant text-sm mt-1">
              {isHindi ? 'ग्राहक आदेश और डिलीवरी स्थिति ट्रैक करें।' : 'Track customer orders and delivery status.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow w-full sm:flex-grow-0">
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                className="bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 w-full sm:w-64 focus:ring-2 focus:ring-[#E8650A] outline-none text-sm shadow-sm"
                placeholder={isHindi ? 'ऑर्डर खोजें...' : 'Search orders...'}
                type="text"
              />
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-sm">search</span>
            </div>
            <select
              value={filter}
              onChange={e => { setFilter(e.target.value); setCurrentPage(1); }}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none shadow-sm cursor-pointer w-full sm:w-auto"
            >
              <option value="All">{isHindi ? 'सभी' : 'All Status'}</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {[
            { label: isHindi ? 'नए ऑर्डर' : 'New Orders',  count: newOrders,        color: '#E8650A', icon: 'inbox'          },
            { label: isHindi ? 'प्रोसेसिंग' : 'Processing',  count: processingOrders, color: '#1565C0', icon: 'sync'           },
            { label: isHindi ? 'भेजे गए' : 'Dispatched',   count: shippedOrders,    color: '#7B1FA2', icon: 'local_shipping' },
            { label: isHindi ? 'डिलीवर्ड' : 'Delivered',     count: deliveredOrders,  color: '#2E7D32', icon: 'check_circle'   },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border-l-4" style={{ borderColor: s.color }}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase">{s.label}</p>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1">{s.count}</h3>
                </div>
                <div className="p-2 sm:p-2.5 rounded-lg" style={{ background: s.color + '18' }}>
                  <span className="material-symbols-outlined text-xl sm:text-2xl" style={{ color: s.color }}>{s.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-gray-400 uppercase text-[10px] sm:text-xs font-bold tracking-wider">
                  <th className="px-4 sm:px-5 py-3 sm:py-4">Order No.</th>
                  <th className="px-4 sm:px-5 py-3 sm:py-4">Date</th>
                  <th className="px-4 sm:px-5 py-3 sm:py-4">Customer</th>
                  <th className="px-4 sm:px-5 py-3 sm:py-4">Products</th>
                  <th className="px-4 sm:px-5 py-3 sm:py-4">Total</th>
                  <th className="px-4 sm:px-5 py-3 sm:py-4">Status</th>
                  <th className="px-4 sm:px-5 py-3 sm:py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 sm:py-12 text-gray-400 font-bold text-sm">
                    {isHindi ? 'कोई ऑर्डर नहीं' : 'No orders found.'}
                  </td>
                  </tr>
                ) : currentItems.map(ord => (
                  <tr key={ord.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-5 py-3 sm:py-4 font-bold text-[#E8650A]">{ord.order_number || '—'}</td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4 text-[10px] sm:text-xs text-gray-400">
                      {ord.created_at ? new Date(ord.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4">
                      <p className="font-bold text-sm sm:text-base text-gray-800">{ord.customer_name}</p>
                      <p className="text-[10px] sm:text-xs text-gray-400">{ord.customer_phone} · {ord.delivery_city}</p>
                    </td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4 max-w-[150px] sm:max-w-[200px] truncate text-gray-600 text-sm" title={getItemNames(ord.items)}>
                      {getItemNames(ord.items)}
                    </td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4 font-bold text-sm">
                      {ord.total_amount ? `₹${parseFloat(ord.total_amount).toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4">
                      <span className={`px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold border ${STATUS_BADGE[ord.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-2.5 sm:px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-[10px] sm:text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        {isHindi ? 'देखें' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[10px] sm:text-xs text-gray-400">
              Showing {indexOfFirst + 1}–{Math.min(indexOfLast, filteredOrders.length)} of {filteredOrders.length}
            </p>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
                className="px-3 sm:px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] sm:text-xs font-bold disabled:opacity-40 cursor-pointer hover:bg-gray-50">
                {isHindi ? 'पिछला' : 'Prev'}
              </button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}
                className="px-3 sm:px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] sm:text-xs font-bold disabled:opacity-40 cursor-pointer hover:bg-gray-50">
                {isHindi ? 'अगला' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex justify-end">
          <div className="w-full max-w-[480px] bg-white h-screen shadow-2xl flex flex-col">
            {/* Drawer header */}
            <div className="p-6 bg-[#1a1a3e] text-white flex justify-between items-center shrink-0">
              <div>
                <p className="text-xs opacity-60 mb-1">Order Details</p>
                <p className="font-bold text-lg">{selectedOrder.order_number || '—'}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white`}>
                  {selectedOrder.status}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-white">close</span>
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">

              {/* Customer */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Customer Info</p>
                <div className="bg-gray-50 p-4 rounded-xl space-y-1.5">
                  <p className="font-bold text-gray-900">{selectedOrder.customer_name}</p>
                  <p className="text-sm text-gray-500">+91 {selectedOrder.customer_phone}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.delivery_city}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{selectedOrder.delivery_address}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Order Items</p>
                <div className="space-y-2">
                  {(Array.isArray(selectedOrder.items) ? selectedOrder.items : []).map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
                      {item.image_url && (
                        <img src={item.image_url} alt={item.product_name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-900 truncate">{item.product_name}</p>
                        {item.sub_type && <p className="text-xs text-gray-400">{item.sub_type}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-400">Qty {item.quantity}</p>
                        {item.price > 0 && (
                          <p className="text-sm font-bold text-[#E8650A]">₹{(parseFloat(item.price) * parseInt(item.quantity)).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm">
                {selectedOrder.subtotal && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold">₹{parseFloat(selectedOrder.subtotal).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-base">
                  <span>Total</span>
                  <span className="text-[#E8650A]">₹{parseFloat(selectedOrder.total_amount || 0).toLocaleString()}</span>
                </div>
              </div>

              {selectedOrder.admin_notes && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-sm text-amber-800">
                  <span className="font-bold">Note: </span>{selectedOrder.admin_notes}
                </div>
              )}

              {/* Communication */}
              <div className="flex gap-3">
                <a
                  href={`https://wa.me/91${selectedOrder.customer_phone}?text=Hello%20${encodeURIComponent(selectedOrder.customer_name)},%20your%20order%20${selectedOrder.order_number}%20is%20${selectedOrder.status}.`}
                  target="_blank" rel="noreferrer"
                  className="flex-1 py-2.5 bg-[#25D366] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">chat</span> WhatsApp
                </a>
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-200 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">print</span> Print
                </button>
              </div>

              {/* Status update */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Update Status</p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    disabled={selectedOrder.status === 'Processing'}
                    onClick={() => { handleStatusChange(selectedOrder.id, 'Processing'); setSelectedOrder(p => ({ ...p, status: 'Processing' })); }}
                    className="py-2.5 bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-blue-700 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">sync</span>
                    {selectedOrder.status === 'Processing' ? 'Processing...' : 'Mark Processing'}
                  </button>
                  <button
                    disabled={selectedOrder.status === 'Delivered'}
                    onClick={() => { handleStatusChange(selectedOrder.id, 'Delivered'); setSelectedOrder(p => ({ ...p, status: 'Delivered' })); }}
                    className="py-2.5 bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-green-700 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    {selectedOrder.status === 'Delivered' ? 'Delivered' : 'Mark Delivered'}
                  </button>
                </div>
                <button
                  disabled={selectedOrder.status === 'Cancelled'}
                  onClick={() => { handleStatusChange(selectedOrder.id, 'Cancelled'); setSelectedOrder(p => ({ ...p, status: 'Cancelled' })); }}
                  className="w-full py-2.5 border border-red-300 text-red-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold text-xs hover:bg-red-50 transition-colors cursor-pointer"
                >
                  {selectedOrder.status === 'Cancelled' ? 'Order Cancelled' : 'Cancel Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
