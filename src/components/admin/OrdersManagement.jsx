import React, { useState } from 'react';

export default function OrdersManagement({ language, orders, handleStatusChange }) {
  const isHindi = language === 'hi';
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate order metrics
  const newOrders = orders.filter(o => o.status === 'Pending').length;
  const processingOrders = orders.filter(o => o.status === 'Processing').length;
  const dispatchedOrders = orders.filter(o => o.status === 'Shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

  // Filter & Search Orders
  const filteredOrders = orders.filter(ord => {
    const statusMatch = filter === 'All' || ord.status === filter;
    const searchMatch = 
      ord.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      ord.id?.toString().includes(search) ||
      ord.phone?.includes(search) ||
      ord.city?.toLowerCase().includes(search.toLowerCase()) ||
      ord.product_type?.toLowerCase().includes(search.toLowerCase());
    return statusMatch && searchMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper to calculate total price
  const calculateBilling = (order) => {
    const qty = parseInt(order.quantity) || 0;
    const baseRate = order.product_type?.toLowerCase().includes('sand') ? 45 : 60;
    const subtotal = qty * baseRate;
    const shipping = 2500;
    const total = subtotal + shipping;
    return { subtotal, shipping, total, baseRate };
  };

  return (
    <>
      <section className="space-y-8 animate-fade-in print:hidden" id="orders-management">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-background text-xl font-bold">
            {isHindi ? 'ऑर्डर प्रबंधन / Orders' : 'Orders Management / ऑर्डर प्रबंधन'}
          </h3>
          <p className="text-on-surface-variant text-sm mt-1">
            {isHindi ? 'ग्राहक आदेश, डिलीवरी की स्थिति और रसीद विवरण ट्रैक करें।' : 'Track customer orders, delivery status, and billing details.'}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <input 
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className="bg-white border-outline-variant/30 rounded-xl pl-10 pr-4 py-2 w-full md:w-64 focus:ring-2 focus:ring-[#E8650A] outline-none text-sm shadow-sm"
              placeholder={isHindi ? "आदेश खोजें..." : "Search orders..."}
              type="text"
            />
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">search</span>
          </div>
          <select 
            value={filter}
            onChange={e => { setFilter(e.target.value); setCurrentPage(1); }}
            className="bg-white border border-outline-variant/30 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#E8650A] outline-none shadow-sm cursor-pointer"
          >
            <option value="All">{isHindi ? 'सभी स्थितियाँ' : 'All Status'}</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-[#E8650A]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-on-surface-variant text-xs font-bold uppercase">{isHindi ? 'नये ऑर्डर' : 'New Orders'}</p>
              <h3 className="text-2xl font-bold mt-2">{newOrders}</h3>
            </div>
            <div className="p-3 bg-[#E8650A]/10 rounded-lg">
              <span className="material-symbols-outlined text-[#E8650A]">inbox</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-on-surface-variant text-xs font-bold uppercase">{isHindi ? 'प्रगति पर' : 'Processing'}</p>
              <h3 className="text-2xl font-bold mt-2">{processingOrders}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <span className="material-symbols-outlined text-blue-500">sync</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-on-surface-variant text-xs font-bold uppercase">{isHindi ? 'भेज दिए गए' : 'Dispatched'}</p>
              <h3 className="text-2xl font-bold mt-2">{dispatchedOrders}</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <span className="material-symbols-outlined text-purple-500">local_shipping</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-secondary">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-on-surface-variant text-xs font-bold uppercase">{isHindi ? 'पहुंचा दिए गए' : 'Delivered'}</p>
              <h3 className="text-2xl font-bold mt-2">{deliveredOrders}</h3>
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg">
              <span className="material-symbols-outlined text-secondary">check_circle</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant/20">
              <tr className="text-on-surface-variant uppercase text-xs font-bold tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">{isHindi ? 'दिनांक / Date' : 'Date / दिनांक'}</th>
                <th className="px-6 py-4">{isHindi ? 'ग्राहक / Customer' : 'Customer / ग्राहक'}</th>
                <th className="px-6 py-4">{isHindi ? 'उत्पाद / Product' : 'Product / उत्पाद'}</th>
                <th className="px-6 py-4">{isHindi ? 'मात्रा / Qty' : 'Quantity / मात्रा'}</th>
                <th className="px-6 py-4">{isHindi ? 'चित्र / Image' : 'Image'}</th>
                <th className="px-6 py-4">{isHindi ? 'स्थिति / Status' : 'Status / स्थिति'}</th>
                <th className="px-6 py-4 text-right">{isHindi ? 'कार्रवाई' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-sm">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-on-surface-variant font-bold">
                    {isHindi ? 'कोई ऑर्डर नहीं मिला।' : 'No orders found.'}
                  </td>
                </tr>
              ) : (
                currentItems.map((ord) => (
                  <tr key={ord.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-4 font-bold text-[#1a1a3e]">#SW-{ord.id}</td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant font-medium">
                      {ord.created_at ? ord.created_at.split(' ')[0] : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold">{ord.customer_name}</div>
                      <div className="text-xs text-on-surface-variant font-medium">{ord.phone} • {ord.city}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-[200px] truncate" title={ord.product_type}>
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
                      </div>
                      {ord.sub_type && <span className="text-[10px] text-on-surface-variant uppercase block font-semibold">{ord.sub_type}</span>}
                    </td>
                    <td className="px-6 py-4 font-bold">{ord.quantity} sq.ft</td>
                    {ord.image_path && (
                      <td className="px-6 py-4">
                        <img
                          src={ord.image_path ? (ord.image_path.startsWith('http') ? ord.image_path : `./${ord.image_path}`) : ''}
                          alt="Order"
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>
                    )}
                    {!ord.image_path && <td className="px-6 py-4 text-gray-400 text-xs italic">N/A</td>}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClass(ord.status)}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedOrder(ord)}
                        className="p-2 bg-surface-container-low hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer text-[#1a1a3e] font-bold text-xs flex items-center gap-1"
                        title="View Details"
                      >
                        <span className="material-symbols-outlined text-base">visibility</span>
                        {isHindi ? 'देखें' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-6 bg-surface-container-low border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-on-surface-variant">
            {isHindi 
              ? `कुल ${filteredOrders.length} में से ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredOrders.length)} दिखाई जा रहे हैं`
              : `Showing ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredOrders.length)} of ${filteredOrders.length} entries`}
          </p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-white border border-surface-container-highest rounded-lg text-xs font-bold hover:bg-surface-container disabled:opacity-50 transition-all cursor-pointer"
            >
              {isHindi ? 'पिछला' : 'Previous'}
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 bg-white border border-surface-container-highest rounded-lg text-xs font-bold hover:bg-surface-container disabled:opacity-50 transition-all cursor-pointer"
            >
              {isHindi ? 'अगला' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      {/* Order Detail Side Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex justify-end transition-opacity duration-300">
          <div className="w-full max-w-[500px] bg-white h-screen shadow-2xl flex flex-col border-l border-outline-variant/20 animate-slide-in-right">
            {/* Drawer Header */}
            <div className="p-6 bg-[#1a1a3e] text-white flex justify-between items-center">
              <div>
                <p className="text-xs opacity-75">{isHindi ? 'विवरण / Order Details' : 'Order Details / विवरण'}</p>
                <div className="flex items-center gap-3">
                  <h4 className="font-headline-md text-xl font-bold">#SW-{selectedOrder.id}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-white text-xl">close</span>
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-grow overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Customer Info */}
              <div>
                <h5 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">
                  {isHindi ? 'ग्राहक की जानकारी' : 'Customer Info'}
                </h5>
                <div className="flex items-start gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
                  <div className="w-12 h-12 bg-[#E8650A] text-white rounded-full flex items-center justify-center font-bold text-xl select-none flex-shrink-0">
                    {selectedOrder.customer_name?.substring(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-base text-on-surface">{selectedOrder.customer_name}</p>
                    <p className="text-sm text-on-surface-variant font-medium">+91 {selectedOrder.phone}</p>
                    <p className="text-xs text-on-surface-variant font-medium mt-1">
                      <strong>{isHindi ? 'शहर / गाँव:' : 'City/Village:'}</strong> {selectedOrder.city}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-2 font-medium leading-relaxed">
                      <strong>{isHindi ? 'वितरण का पता:' : 'Delivery Address:'}</strong> {selectedOrder.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div>
                <h5 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">
                  {isHindi ? 'ऑर्डर किए गए आइटम' : 'Order Items'}
                </h5>
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-surface-container rounded-lg overflow-hidden flex-shrink-0 border border-outline-variant/20">
                    {(() => {
                      let imageUrl = '/images/interlocking-street-image-grey.jpg';
                      try {
                        const items = JSON.parse(selectedOrder.product_type);
                        if (Array.isArray(items) && items.length > 0 && items[0].image_url) {
                          imageUrl = items[0].image_url;
                        }
                      } catch(e) {
                        if (selectedOrder.product_type?.toLowerCase().includes('shuttering') || selectedOrder.product_type?.toLowerCase().includes('plate') || selectedOrder.product_type?.toLowerCase().includes('rent')) {
                          imageUrl = '/images/satering-steal-plates.jpg';
                        }
                      }
                      return (
                        <img 
                          className="w-full h-full object-cover" 
                          alt="Product Image" 
                          src={imageUrl}
                          onError={(e) => { e.target.src = '/images/interlocking-street-image-grey.jpg'; }}
                        />
                      );
                    })()}
                  </div>
                  <div className="flex-1">
                      {(() => {
                        let items = [];
                        try {
                          items = JSON.parse(selectedOrder.product_type);
                          if (!Array.isArray(items)) {
                            items = [{ product_name: selectedOrder.product_type, quantity: selectedOrder.quantity, sub_type: selectedOrder.sub_type }];
                          }
                        } catch(e) {
                          items = [{ product_name: selectedOrder.product_type, quantity: selectedOrder.quantity, sub_type: selectedOrder.sub_type }];
                        }
                        return (
                          <div className="space-y-2">
                            {items.map((item, idx) => (
                              <div key={idx} className="bg-surface-container-low p-2 rounded border border-outline/10">
                                <p className="font-bold text-sm text-on-surface">{item.product_name}</p>
                                <div className="flex gap-2 text-[10px] mt-1 font-semibold items-center">
                                  {item.sub_type && <span className="bg-surface-variant text-on-surface-variant px-1.5 py-0.5 rounded">{item.sub_type}</span>}
                                  <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">Qty: {item.quantity || selectedOrder.quantity}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                  </div>
                  <div className="font-bold text-[#1a1a3e]">
                    ₹{calculateBilling(selectedOrder).subtotal.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/20">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between font-medium">
                    <span className="text-on-surface-variant">{isHindi ? 'उपयोग मूल्य (Subtotal)' : 'Subtotal'}</span>
                    <span className="text-on-surface">₹{calculateBilling(selectedOrder).subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-on-surface-variant">{isHindi ? 'लॉरी लोड भाड़ा (Shipping)' : 'Shipping (Lorry Load)'}</span>
                    <span className="text-on-surface">₹{calculateBilling(selectedOrder).shipping.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedOrder.special_req && (
                    <div className="pt-2 border-t border-outline-variant/10 text-xs">
                      <p className="font-bold text-on-surface-variant uppercase mb-1">{isHindi ? 'विशेष आवश्यकताएं:' : 'Special Requirements:'}</p>
                      <p className="text-on-surface-variant leading-relaxed">{selectedOrder.special_req}</p>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-outline-variant/10 pt-3 mt-2 font-bold text-base text-[#E8650A]">
                    <span>{isHindi ? 'कुल देय राशि' : 'Total Payable'}</span>
                    <span>₹{calculateBilling(selectedOrder).total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Real Feature: Communication & Docs */}
              <div className="space-y-4 pt-4 border-t border-outline-variant/20">
                <h5 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  {isHindi ? 'ग्राहक संचार / Communication' : 'Communication & Docs'}
                </h5>
                <div className="flex gap-4">
                  <a 
                    href={`https://wa.me/91${selectedOrder.phone}?text=Hello%20${encodeURIComponent(selectedOrder.customer_name)},%0A%0AYour%20order%20%23SW-${selectedOrder.id}%20is%20currently:%20*${selectedOrder.status}*.%0A%0AThank%20you%20for%20choosing%20Swastika%20Interlocking!`}
                    target="_blank" rel="noreferrer"
                    className="flex-1 py-3 px-4 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 shadow-sm active:scale-95 transition-all cursor-pointer text-xs"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span>
                    WhatsApp
                  </a>
                  <button 
                    onClick={() => {
                      const printContent = document.getElementById('orders-management').innerHTML;
                      window.print();
                    }}
                    className="flex-1 py-3 px-4 bg-surface-variant text-on-surface rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-surface-variant/80 shadow-sm active:scale-95 transition-all cursor-pointer text-xs border border-outline-variant/30"
                  >
                    <span className="material-symbols-outlined text-sm">print</span>
                    Print Invoice
                  </button>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-4 pt-4 border-t border-outline-variant/20">
                <h5 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  {isHindi ? 'स्थिति अपडेट करें / Update Status' : 'Update Status / स्थिति अपडेट करें'}
                </h5>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    disabled={selectedOrder.status === 'Processing'}
                    onClick={() => { handleStatusChange(selectedOrder.id, 'Processing'); setSelectedOrder(prev => ({ ...prev, status: 'Processing' })); }}
                    className="py-3 px-4 bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-sm active:scale-95 transition-all cursor-pointer text-xs"
                  >
                    <span className="material-symbols-outlined text-sm">sync</span>
                    {selectedOrder.status === 'Processing' ? 'Currently Processing' : 'Process'}
                  </button>
                  <button 
                    disabled={selectedOrder.status === 'Delivered'}
                    onClick={() => { handleStatusChange(selectedOrder.id, 'Delivered'); setSelectedOrder(prev => ({ ...prev, status: 'Delivered' })); }}
                    className="py-3 px-4 bg-secondary disabled:bg-secondary/50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 shadow-sm active:scale-95 transition-all cursor-pointer text-xs"
                  >
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    {selectedOrder.status === 'Delivered' ? 'Already Delivered' : 'Deliver'}
                  </button>
                </div>
                <button 
                  disabled={selectedOrder.status === 'Cancelled'}
                  onClick={() => { handleStatusChange(selectedOrder.id, 'Cancelled'); setSelectedOrder(prev => ({ ...prev, status: 'Cancelled' })); }}
                  className="w-full py-3 border border-error text-error disabled:text-error/50 disabled:border-error/50 disabled:cursor-not-allowed rounded-xl font-bold hover:bg-error/5 transition-colors cursor-pointer text-xs"
                >
                  {selectedOrder.status === 'Cancelled' ? 'Order is Cancelled' : (isHindi ? 'ऑर्डर रद्द करें / Cancel Order' : 'Cancel Order / ऑर्डर रद्द करें')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>

    {/* Print Invoice Template */}
    {selectedOrder && (
      <div className="hidden print:block p-8 bg-white text-black font-sans w-full max-w-4xl mx-auto absolute top-0 left-0">
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">INVOICE</h1>
            <p className="text-gray-500 mt-1 font-medium">Order #SW-{selectedOrder.id}</p>
            <p className="text-gray-500 font-medium">Date: {new Date().toLocaleDateString('en-IN')}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-[#E8650A]">Swastika Interlocking</h2>
            <p className="text-sm text-gray-600 mt-1">123 Industrial Area, Jaipur, Rajasthan</p>
            <p className="text-sm text-gray-600">Phone: +91 8400936290</p>
            <p className="text-sm text-gray-600">Email: sales@swastikashuttering.com</p>
            <p className="text-sm font-bold text-gray-800 mt-2">GSTIN: 08AABCS1429B1Z</p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="flex justify-between mb-8">
          <div className="w-1/2">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Billed To</h3>
            <p className="font-bold text-lg text-gray-900">{selectedOrder.customer_name}</p>
            <p className="text-gray-700">+91 {selectedOrder.phone}</p>
            <p className="text-gray-700 mt-1 max-w-xs">{selectedOrder.address}</p>
            <p className="text-gray-700">{selectedOrder.city}</p>
          </div>
          <div className="w-1/3 text-right">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Order Status</h3>
            <p className="font-bold text-xl text-gray-900">{selectedOrder.status}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8 text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-800 border-y-2 border-gray-300">
              <th className="py-3 px-4 font-bold uppercase text-sm">Item Description</th>
              <th className="py-3 px-4 font-bold uppercase text-sm">Qty</th>
              <th className="py-3 px-4 font-bold uppercase text-sm text-right">Rate</th>
              <th className="py-3 px-4 font-bold uppercase text-sm text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {(() => {
              let items = [];
              try {
                items = JSON.parse(selectedOrder.product_type);
                if (!Array.isArray(items)) {
                  items = [{ product_name: selectedOrder.product_type, quantity: selectedOrder.quantity, sub_type: selectedOrder.sub_type }];
                }
              } catch(e) {
                items = [{ product_name: selectedOrder.product_type, quantity: selectedOrder.quantity, sub_type: selectedOrder.sub_type }];
              }
              return items.map((item, idx) => {
                const qty = parseInt(item.quantity || selectedOrder.quantity) || 0;
                const rate = calculateBilling(selectedOrder).baseRate;
                return (
                  <tr key={idx}>
                    <td className="py-4 px-4">
                      <p className="font-bold text-gray-900">{item.product_name}</p>
                      {item.sub_type && <p className="text-xs text-gray-500 mt-1">Variant: {item.sub_type}</p>}
                    </td>
                    <td className="py-4 px-4 text-gray-800 font-medium">{qty}</td>
                    <td className="py-4 px-4 text-right text-gray-800 font-medium">₹{rate.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-4 text-right font-bold text-gray-900">₹{(qty * rate).toLocaleString('en-IN')}</td>
                  </tr>
                );
              });
            })()}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-1/2 md:w-1/3">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600 font-bold">Subtotal</span>
              <span className="font-bold text-gray-900">₹{calculateBilling(selectedOrder).subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600 font-bold">Shipping & Transport</span>
              <span className="font-bold text-gray-900">₹{calculateBilling(selectedOrder).shipping.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-3 border-b-2 border-gray-800 mt-1">
              <span className="text-gray-900 font-black text-xl">Total Payable</span>
              <span className="font-black text-[#E8650A] text-xl">₹{calculateBilling(selectedOrder).total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Footer / Terms */}
        <div className="border-t border-gray-300 pt-8 flex justify-between items-end">
          <div className="w-2/3 pr-8">
            <h4 className="font-bold text-gray-800 mb-2">Terms & Conditions</h4>
            <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
              <li>Payment is due within 15 days of the invoice date.</li>
              <li>Goods once sold will not be taken back unless defective.</li>
              <li>Subject to Jaipur jurisdiction only.</li>
              {selectedOrder.special_req && <li className="font-bold text-gray-800">Note: {selectedOrder.special_req}</li>}
            </ul>
          </div>
          <div className="w-1/3 text-center">
            <div className="h-16 border-b border-gray-400 mb-2"></div>
            <p className="text-sm font-bold text-gray-800">Authorized Signature</p>
            <p className="text-xs text-gray-500">Swastika Interlocking</p>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
