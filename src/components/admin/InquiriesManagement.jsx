import React, { useState } from 'react';

export default function InquiriesManagement({ language, inquiries }) {
  const isHindi = language === 'hi';
  const [search, setSearch] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const filteredInquiries = inquiries.filter(inq => 
    inq.name?.toLowerCase().includes(search.toLowerCase()) ||
    inq.phone?.includes(search) ||
    inq.requirements?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-background text-xl font-bold">
            {isHindi ? 'पूछताछ प्रबंधन / Inquiries' : 'Inquiries Management / पूछताछ प्रबंधन'}
          </h3>
          <p className="text-on-surface-variant text-sm mt-1">
            {isHindi ? 'ग्राहक पूछताछ और संदेश देखें।' : 'View customer inquiries and contact messages.'}
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-white border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2 w-full focus:ring-2 focus:ring-primary outline-none text-sm shadow-sm"
            placeholder={isHindi ? "संदेश खोजें..." : "Search messages..."}
            type="text"
          />
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">search</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant/20">
              <tr className="text-on-surface-variant uppercase text-xs font-bold tracking-wider">
                <th className="px-6 py-4">{isHindi ? 'दिनांक / Date' : 'Date'}</th>
                <th className="px-6 py-4">{isHindi ? 'नाम / Name' : 'Name'}</th>
                <th className="px-6 py-4">{isHindi ? 'संपर्क / Contact' : 'Contact'}</th>
                <th className="px-6 py-4">{isHindi ? 'चित्र / Image' : 'Image'}</th>
                <th className="px-6 py-4 w-1/2">{isHindi ? 'संदेश / Message' : 'Message'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-sm">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-on-surface-variant font-bold">
                    {isHindi ? 'कोई संदेश नहीं मिला।' : 'No inquiries found.'}
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-4 text-xs text-on-surface-variant font-medium whitespace-nowrap">
                      {inq.created_at ? inq.created_at.split(' ')[0] : 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#1a1a3e] whitespace-nowrap">
                      {inq.name}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="font-semibold">{inq.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      {inq.image_path && (
                        <img
                          src={inq.image_path ? (inq.image_path.startsWith('http') ? inq.image_path : `./${inq.image_path}`) : ''}
                          alt="Inquiry"
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="line-clamp-2 text-on-surface-variant text-sm" title={inq.requirements}>
                        {inq.requirements}
                      </p>
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
