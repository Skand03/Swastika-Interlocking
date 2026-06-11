import React, { useState } from 'react';

export default function CustomersDirectory({ language, customers, orders, selectedCustomer, setSelectedCustomer, customerSearch, setCustomerSearch }) {
  const isHindi = language === 'hi';

  // Statistics
  const totalCustomers = customers.length;
  const activeJobs = orders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length;
  const totalSpentAll = orders.reduce((sum, o) => sum + ((parseInt(o.quantity) || 0) * 20), 0);
  const openInquiriesCount = orders.filter(o => o.status === 'Pending').length;

  // Filter customers based on search
  const filteredCustomers = customerSearch.trim() === ''
    ? customers
    : customers.filter(c => 
        c.full_name?.toLowerCase().includes(customerSearch.toLowerCase()) || 
        c.city?.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.phone?.includes(customerSearch)
      );

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <section className="space-y-6 animate-fade-in" id="customers-directory">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-background text-xl font-bold">
            {isHindi ? 'ग्राहक निर्देशिका' : 'Customer Directory'}
          </h3>
          <p className="text-on-surface-variant text-sm mt-1">
            {isHindi ? 'पंजीकृत ग्राहकों की सूची और उनका आदेश इतिहास।' : 'View registered clients and their order history.'}
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <input 
            value={customerSearch} 
            onChange={(e) => setCustomerSearch(e.target.value)}
            className="bg-white border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 w-full shadow-sm focus:ring-2 focus:ring-[#E8650A] outline-none text-sm" 
            placeholder={isHindi ? "नाम, फोन या शहर से खोजें..." : "Search by name, phone, or city..."} 
            type="text"
          />
          <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-sm">search</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-surface-container-highest flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#E8650A]/10 flex items-center justify-center text-[#E8650A] flex-shrink-0">
            <span className="material-symbols-outlined">person_add</span>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold">{isHindi ? 'कुल ग्राहक' : 'Total Customers'}</p>
            <h4 className="text-xl md:text-2xl font-bold">{totalCustomers}</h4>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-surface-container-highest flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#1C2B1A]/10 flex items-center justify-center text-[#1C2B1A] flex-shrink-0">
            <span className="material-symbols-outlined">pending_actions</span>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold">{isHindi ? 'लंबित पूछताछ' : 'Open Inquiries'}</p>
            <h4 className="text-xl md:text-2xl font-bold">{openInquiriesCount}</h4>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-surface-container-highest flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-700 flex-shrink-0">
            <span className="material-symbols-outlined">payments</span>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold">{isHindi ? 'कुल अनुमानित राजस्व' : 'Total Est. Revenue'}</p>
            <h4 className="text-xl md:text-2xl font-bold">₹{(totalSpentAll / 100000).toFixed(2)}L</h4>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-surface-container-highest flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
            <span className="material-symbols-outlined">local_shipping</span>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold">{isHindi ? 'सक्रिय प्रोजेक्ट्स' : 'Active Projects'}</p>
            <h4 className="text-xl md:text-2xl font-bold">{activeJobs}</h4>
          </div>
        </div>
      </div>

      {/* Main Layout: Directory Table & Side Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8 items-start">
        <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-surface-container-low border-b border-outline-variant/20">
                <tr className="text-on-surface-variant text-xs uppercase font-bold tracking-wider">
                  <th className="px-4 md:px-6 py-3 md:py-4">Sr No.</th>
                  <th className="px-4 md:px-6 py-3 md:py-4">{isHindi ? 'नाम' : 'Name'}</th>
                  <th className="px-4 md:px-6 py-3 md:py-4">{isHindi ? 'शहर' : 'City'}</th>
                  <th className="px-4 md:px-6 py-3 md:py-4">{isHindi ? 'कुल ऑर्डर' : 'Total Orders'}</th>
                  <th className="px-4 md:px-6 py-3 md:py-4">{isHindi ? 'कुल खर्च' : 'Total Spent'}</th>
                  <th className="px-4 md:px-6 py-3 md:py-4">{isHindi ? 'स्थिति' : 'Status'}</th>
                  <th className="px-4 md:px-6 py-3 md:py-4">{isHindi ? 'कार्रवाई' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-sm">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-on-surface-variant font-bold">
                      {isHindi ? 'कोई ग्राहक नहीं मिला।' : 'No customers found.'}
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust, idx) => {
                    const custOrders = orders.filter(o => o.phone === cust.phone);
                    const totalSpent = custOrders.reduce((sum, o) => sum + ((parseInt(o.quantity) || 0) * 20), 0);
                    const isSelected = selectedCustomer?.id === cust.id;
                    return (
                      <tr 
                        key={cust.id} 
                        onClick={() => setSelectedCustomer(cust)}
                        className={`hover:bg-surface-container-low cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#E8650A]/5 border-l-2 border-[#E8650A]' : ''
                        }`}
                      >
                        <td className="px-4 md:px-6 py-3 md:py-4 font-semibold">{idx + 1}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <div className="font-bold truncate max-w-[150px]">{cust.full_name}</div>
                          <div className="text-xs text-on-surface-variant font-medium truncate">{cust.phone}</div>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 font-semibold text-on-surface-variant truncate max-w-[120px]">{cust.city}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 font-bold">{custOrders.length}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 font-extrabold text-[#E8650A]">
                          ₹{totalSpent.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <span className="bg-green-100 text-green-800 border-green-200 border px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            ACTIVE
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <button className="text-[#E8650A] font-bold text-xs hover:underline cursor-pointer">
                            {isHindi ? 'देखें' : 'View'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Panel showing Detailed Profile */}
        <div className="xl:col-span-1">
          {selectedCustomer ? (
            <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-5 md:p-6 space-y-5 md:space-y-6 flex flex-col items-center text-center sticky top-20">
              <div className="relative">
                <div className="h-16 w-16 md:h-20 md:w-20 rounded-full border-4 border-[#E8650A]/10 bg-[#E8650A]/5 text-[#E8650A] flex items-center justify-center font-bold text-xl md:text-2xl select-none">
                  {selectedCustomer.full_name?.substring(0, 2).toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 h-4 w-4 md:h-5 md:w-5 bg-secondary border-3 md:border-4 border-white rounded-full"></span>
              </div>
              
              <div>
                <h4 className="font-bold text-lg md:text-lg text-on-surface truncate max-w-full">{selectedCustomer.full_name}</h4>
                <p className="text-on-surface-variant text-xs mt-0.5 truncate max-w-full">Verified Customer • {selectedCustomer.city}</p>
              </div>

              <div className="w-full grid grid-cols-2 gap-3 md:gap-4">
                <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/5">
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">{isHindi ? 'कुल खरीद' : 'Total Spent'}</p>
                  <p className="font-extrabold text-sm text-[#E8650A]">
                    ₹{orders.filter(o => o.phone === selectedCustomer.phone).reduce((sum, o) => sum + ((parseInt(o.quantity) || 0) * 20), 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/5">
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">{isHindi ? 'शामिल हुए' : 'Joined'}</p>
                  <p className="font-extrabold text-xs text-on-surface">
                    {formatDate(selectedCustomer.created_at)}
                  </p>
                </div>
              </div>

              <div className="w-full text-left space-y-2 md:space-y-3 pt-2 md:pt-3 border-t border-outline-variant/10 text-xs">
                <p className="text-on-surface truncate max-w-full"><strong className="font-bold text-on-surface-variant">Phone:</strong> +91 {selectedCustomer.phone}</p>
                <p className="text-on-surface truncate max-w-full"><strong className="font-bold text-on-surface-variant">City:</strong> {selectedCustomer.city}</p>
                <p className="text-on-surface"><strong className="font-bold text-on-surface-variant">Orders Placed:</strong> {orders.filter(o => o.phone === selectedCustomer.phone).length}</p>
              </div>

              <a 
                href={`https://wa.me/91${selectedCustomer.phone}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 md:py-3 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all text-xs md:text-sm shadow-md"
              >
                <span className="material-symbols-outlined text-base">chat</span> 
                {isHindi ? 'व्हाट्सएप संदेश भेजें' : 'WhatsApp Message'}
              </a>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-6 md:p-8 text-center text-on-surface-variant text-sm font-bold">
              {isHindi ? 'विवरण देखने के लिए किसी ग्राहक को चुनें।' : 'Select a customer to view details.'}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
