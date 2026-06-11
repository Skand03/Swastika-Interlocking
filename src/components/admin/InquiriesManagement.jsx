import React, { useState } from 'react';

const DIVISION_LABELS = {
  'building_materials': { hi: 'Building Materials', en: 'Building Materials' },
  'shuttering': { hi: 'Shuttering', en: 'Shuttering' },
  'rcc': { hi: 'RCC Roads', en: 'RCC Roads' },
  'general': { hi: 'General', en: 'General' },
};

export default function InquiriesManagement({ language, inquiries }) {
  const isHindi = language === 'hi';
  const [search, setSearch] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const filteredInquiries = inquiries.filter(inq => 
    (inq.customer_name || inq.name)?.toLowerCase().includes(search.toLowerCase()) ||
    (inq.customer_phone || inq.phone)?.includes(search) ||
    (inq.message)?.toLowerCase().includes(search.toLowerCase())
  );

  const getDivisionLabel = (div) => {
    const labels = DIVISION_LABELS[div];
    return labels ? labels[language] : div;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateStr.split(' ')[0];
    }
  };

  return (
    <section className="space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-background text-xl font-bold">
            {isHindi ? 'Inquiries Management' : 'Inquiries Management'}
          </h3>
          <p className="text-on-surface-variant text-sm mt-1">
            {isHindi ? 'View customer inquiries and contact messages.' : 'View customer inquiries and contact messages.'}
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-white border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2 w-full focus:ring-2 focus:ring-primary outline-none text-sm shadow-sm"
            placeholder={isHindi ? "Search messages..." : "Search messages..."}
            type="text"
          />
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">search</span>
        </div>
      </div>

      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-100">
              <h3 className="text-lg sm:text-xl font-bold text-[#1a1a3e]">{isHindi ? 'Inquiry Details' : 'Inquiry Details'}</h3>
              <button onClick={() => setSelectedInquiry(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase">{isHindi ? 'Name' : 'Name'}</p>
                  <p className="font-semibold text-sm sm:text-base">{selectedInquiry.customer_name || selectedInquiry.name}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase">{isHindi ? 'Phone' : 'Phone'}</p>
                  <p className="font-semibold text-sm sm:text-base">{selectedInquiry.customer_phone || selectedInquiry.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase">{isHindi ? 'Division' : 'Division'}</p>
                  <p className="font-semibold text-sm sm:text-base">{getDivisionLabel(selectedInquiry.division)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase">{isHindi ? 'Date' : 'Date'}</p>
                  <p className="font-semibold text-sm sm:text-base">{formatDate(selectedInquiry.created_at)}</p>
                </div>
                {selectedInquiry.city && (
                  <div className="md:col-span-2">
                    <p className="text-xs font-bold text-on-surface-variant uppercase">{isHindi ? 'City' : 'City'}</p>
                    <p className="font-semibold text-sm sm:text-base">{selectedInquiry.city}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">{isHindi ? 'Message' : 'Message'}</p>
                <p className="text-on-surface text-sm sm:text-base whitespace-pre-wrap">{selectedInquiry.message}</p>
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-100 flex justify-end">
              <button onClick={() => setSelectedInquiry(null)} className="px-4 sm:px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors text-sm">
                {isHindi ? 'Close' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant/20">
              <tr className="text-on-surface-variant uppercase text-[10px] sm:text-xs font-bold tracking-wider">
                <th className="px-4 sm:px-6 py-3 sm:py-4">{isHindi ? 'Date' : 'Date'}</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4">{isHindi ? 'Name' : 'Name'}</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4">{isHindi ? 'Contact' : 'Contact'}</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4">{isHindi ? 'Division' : 'Division'}</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 w-1/3">{isHindi ? 'Message' : 'Message'}</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-xs sm:text-sm">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 sm:py-12 text-on-surface-variant font-bold text-sm">
                    {isHindi ? 'No inquiries found.' : 'No inquiries found.'}
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs text-on-surface-variant font-medium whitespace-nowrap">
                      {formatDate(inq.created_at)}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-[#1a1a3e] text-xs sm:text-sm whitespace-nowrap">
                      {inq.customer_name || inq.name}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs">
                      <div className="font-semibold">{inq.customer_phone || inq.phone}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className="px-2 sm:px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] sm:text-xs font-bold">
                        {getDivisionLabel(inq.division)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <p className="line-clamp-2 text-on-surface-variant text-xs sm:text-sm">
                        {inq.message}
                      </p>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <button 
                        onClick={() => setSelectedInquiry(inq)} 
                        className="text-secondary hover:text-secondary-dark font-semibold text-[10px] sm:text-xs flex items-center gap-1"
                      >
                        {isHindi ? 'View' : 'View'} 
                        <span className="material-symbols-outlined text-xs sm:text-sm">open_in_new</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
