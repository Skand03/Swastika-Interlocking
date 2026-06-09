import React, { useState } from 'react';

export default function SalesReports({ language, orders, metrics }) {
  const isHindi = language === 'hi';
  const [timeframe, setTimeframe] = useState('Monthly');

  // Calculate order statistics dynamically or use stats fallbacks
  const orderCount = orders.length || metrics.newOrders || 1284;
  const totalSpentAll = orders.reduce((sum, o) => sum + ((parseInt(o.quantity) || 0) * 20), 0);
  
  // Format dynamic revenue or use standard fallback
  const totalRevenue = totalSpentAll > 0 
    ? `₹${(totalSpentAll / 100000).toFixed(2)}L`
    : `₹4.82 Cr`;
    
  const avgOrderVal = orderCount > 0 
    ? `₹${Math.round(totalSpentAll > 0 ? (totalSpentAll / orders.length) : 37538).toLocaleString('en-IN')}` 
    : `₹37,538`;

  // Download CSV helper
  const handleDownloadCSV = () => {
    const headers = ['Period,Revenue,Orders,Success Rate,Status'];
    let rows = [];
    if (timeframe === 'Monthly') {
      rows = [
        'March 2024,8245000,245,94.2%,On Target',
        'February 2024,7612000,212,88.5%,On Target',
        'January 2024,6430000,198,72.1%,Average',
        'December 2023,9122000,285,98.4%,Peak Performance'
      ];
    } else if (timeframe === 'Quarterly') {
      rows = [
        'Q1 2024,22287000,655,84.9%,On Target',
        'Q4 2023,26410000,810,91.2%,Peak Performance',
        'Q3 2023,19850000,540,82.1%,Average',
        'Q2 2023,18420000,502,80.5%,Average'
      ];
    } else {
      rows = [
        '2024 (YTD),22287000,655,84.9%,On Target',
        '2023,83102000,2410,88.4%,Peak Performance',
        '2022,71450000,2105,85.2%,On Target',
        '2021,58200000,1850,81.1%,Average'
      ];
    }
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales_reports_${timeframe.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTableData = () => {
    if (timeframe === 'Quarterly') {
      return [
        { period: 'Q1 2024', rev: '₹2.22 Cr', orders: 655, rate: '84.9%', status: 'On Target', color: 'green', width: '84.9%' },
        { period: 'Q4 2023', rev: '₹2.64 Cr', orders: 810, rate: '91.2%', status: 'Peak Performance', color: 'green', width: '91.2%' },
        { period: 'Q3 2023', rev: '₹1.98 Cr', orders: 540, rate: '82.1%', status: 'Average', color: 'amber', width: '82.1%' },
        { period: 'Q2 2023', rev: '₹1.84 Cr', orders: 502, rate: '80.5%', status: 'Average', color: 'amber', width: '80.5%' },
      ];
    } else if (timeframe === 'Yearly') {
      return [
        { period: '2024 (YTD)', rev: '₹2.22 Cr', orders: 655, rate: '84.9%', status: 'On Target', color: 'green', width: '84.9%' },
        { period: '2023', rev: '₹8.31 Cr', orders: 2410, rate: '88.4%', status: 'Peak Performance', color: 'green', width: '88.4%' },
        { period: '2022', rev: '₹7.14 Cr', orders: 2105, rate: '85.2%', status: 'On Target', color: 'green', width: '85.2%' },
        { period: '2021', rev: '₹5.82 Cr', orders: 1850, rate: '81.1%', status: 'Average', color: 'amber', width: '81.1%' },
      ];
    }
    return [
      { period: 'March 2024', rev: '₹82,45,000', orders: 245, rate: '94.2%', status: 'On Target', color: 'green', width: '94.2%' },
      { period: 'February 2024', rev: '₹76,12,000', orders: 212, rate: '88.5%', status: 'On Target', color: 'green', width: '88.5%' },
      { period: 'January 2024', rev: '₹64,30,000', orders: 198, rate: '72.1%', status: 'Average', color: 'amber', width: '72.1%' },
      { period: 'December 2023', rev: '₹91,22,000', orders: 285, rate: '98.4%', status: 'Peak Performance', color: 'green', width: '98.4%' },
    ];
  };

  return (
    <section className="space-y-8 animate-fade-in" id="sales-reports">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-background text-xl font-bold">
            {isHindi ? 'बिक्री रिपोर्ट और विश्लेषिकी / Sales Reports' : 'Sales Reports & Analytics / बिक्री रिपोर्ट और विश्लेषिकी'}
          </h3>
          <p className="text-on-surface-variant text-sm mt-1">
            {isHindi ? 'कंपनी की कुल बिक्री, राजस्व और मासिक प्रदर्शन मेट्रिक्स की समीक्षा करें।' : 'Analyze total sales, revenue, and monthly operational efficiency trends.'}
          </p>
        </div>
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-outline-variant/20">
          <button 
            onClick={() => setTimeframe('Monthly')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${timeframe === 'Monthly' ? 'bg-[#E8650A] text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}
          >Monthly</button>
          <button 
            onClick={() => setTimeframe('Quarterly')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${timeframe === 'Quarterly' ? 'bg-[#E8650A] text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}
          >Quarterly</button>
          <button 
            onClick={() => setTimeframe('Yearly')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${timeframe === 'Yearly' ? 'bg-[#E8650A] text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}
          >Yearly</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/30 group hover:border-[#E8650A] transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-on-surface-variant font-medium text-xs uppercase tracking-wider">{isHindi ? 'कुल राजस्व' : 'Total Revenue'}</p>
              <h3 className="text-2xl font-bold text-on-surface mt-1">{totalRevenue}</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-secondary">
              <span className="material-symbols-outlined">payments</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-secondary font-bold flex items-center">
              <span className="material-symbols-outlined text-sm">trending_up</span> 12.5%
            </span>
            <span className="text-on-surface-variant opacity-60">{isHindi ? 'पिछले अवधि से' : 'vs last period'}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/30 group hover:border-[#E8650A] transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-on-surface-variant font-medium text-xs uppercase tracking-wider">{isHindi ? 'कुल ऑर्डर' : 'Total Orders'}</p>
              <h3 className="text-2xl font-bold text-on-surface mt-1">{orderCount}</h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg text-[#E8650A]">
              <span className="material-symbols-outlined">shopping_cart</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-secondary font-bold flex items-center">
              <span className="material-symbols-outlined text-sm">trending_up</span> 8.2%
            </span>
            <span className="text-on-surface-variant opacity-60">{isHindi ? 'पिछले अवधि से' : 'vs last period'}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/30 group hover:border-[#E8650A] transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-on-surface-variant font-medium text-xs uppercase tracking-wider">{isHindi ? 'औसत ऑर्डर मूल्य' : 'Avg. Order Value'}</p>
              <h3 className="text-2xl font-bold text-on-surface mt-1">{avgOrderVal}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-700">
              <span className="material-symbols-outlined">analytics</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-error font-bold flex items-center">
              <span className="material-symbols-outlined text-sm">trending_down</span> 2.1%
            </span>
            <span className="text-on-surface-variant opacity-60">{isHindi ? 'पिछले अवधि से' : 'vs last period'}</span>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-outline-variant/30">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="font-bold text-base text-on-surface">
                {isHindi ? 'राजस्व बनाम ऑर्डर वॉल्यूम / Revenue vs Order Volume' : 'Revenue vs Order Volume / राजस्व बनाम ऑर्डर वॉल्यूम'}
              </h4>
              <p className="text-on-surface-variant text-xs">{isHindi ? 'रुझान' : `${timeframe} trend`}</p>
            </div>
            <div className="flex gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E8650A]"></span>
                <span>Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1a1a3e]"></span>
                <span>Orders</span>
              </div>
            </div>
          </div>
          <div className="h-64 w-full flex flex-col relative overflow-hidden">
            <div className="flex-1 flex items-end gap-1.5 px-4 relative">
              {/* Graphic background */}
              <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-[#E8650A]/10 to-transparent border-t-2 border-[#E8650A] rounded-t-lg" style={{ clipPath: 'polygon(0 80%, 20% 60%, 40% 75%, 60% 40%, 80% 55%, 100% 20%, 100% 100%, 0 100%)' }}></div>
              <div className="absolute inset-x-0 bottom-0 top-0 border-t-2 border-[#1a1a3e]/40" style={{ clipPath: 'polygon(0 90%, 20% 85%, 40% 88%, 60% 70%, 80% 75%, 100% 60%)' }}></div>
              <div className="w-full flex justify-between absolute bottom-1 text-[9px] font-bold text-on-surface-variant/60">
                {timeframe === 'Monthly' && (
                  <><span>OCT '23</span><span>NOV '23</span><span>DEC '23</span><span>JAN '24</span><span>FEB '24</span><span>MAR '24</span></>
                )}
                {timeframe === 'Quarterly' && (
                  <><span>Q4 '22</span><span>Q1 '23</span><span>Q2 '23</span><span>Q3 '23</span><span>Q4 '23</span><span>Q1 '24</span></>
                )}
                {timeframe === 'Yearly' && (
                  <><span>2019</span><span>2020</span><span>2021</span><span>2022</span><span>2023</span><span>2024</span></>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col">
          <h4 className="font-bold text-base text-on-surface mb-1">
            {isHindi ? 'उत्पाद मिश्रण / Product Mix' : 'Product Mix / उत्पाद मिश्रण'}
          </h4>
          <p className="text-on-surface-variant text-xs mb-8">{isHindi ? 'श्रेणी के अनुसार बिक्री' : 'Sales by category'}</p>
          <div className="flex-grow flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 rounded-full border-[15px] border-[#E8650A] flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[15px] border-[#1a1a3e]" style={{ clipPath: 'inset(0 0 50% 50%)' }}></div>
              <div className="absolute inset-0 rounded-full border-[15px] border-secondary" style={{ clipPath: 'inset(50% 50% 0 0)' }}></div>
              <div className="text-center select-none">
                <span className="block text-xl font-bold">100%</span>
                <span className="text-[9px] uppercase font-bold text-on-surface-variant">Catalog</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-8 w-full text-xs font-semibold text-on-surface-variant">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E8650A] flex-shrink-0"></span>
                <span>Pavers (45%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1a1a3e] flex-shrink-0"></span>
                <span>Pipes (30%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary flex-shrink-0"></span>
                <span>Sand (15%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-200 flex-shrink-0"></span>
                <span>Others (10%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Breakdown Table */}
      <div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-outline-variant/10 gap-4">
          <h4 className="font-bold text-base text-on-surface">
            {isHindi ? `${timeframe} प्रदर्शन विवरण` : `${timeframe} Performance Breakdown`}
          </h4>
          <button 
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-4 py-2 border border-outline rounded-lg text-xs font-bold hover:bg-surface-container transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">download</span> 
            {isHindi ? 'सीएसवी डाउनलोड करें' : 'Download CSV'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase font-bold tracking-wider">
                <th className="px-6 py-4">{timeframe === 'Monthly' ? 'महीना / Month' : timeframe === 'Quarterly' ? 'Quarter' : 'Year'}</th>
                <th className="px-6 py-4">राजस्व / Revenue</th>
                <th className="px-6 py-4">ऑर्डर / Orders</th>
                <th className="px-6 py-4">सफलता दर / Success Rate</th>
                <th className="px-6 py-4">स्थिति / Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-sm">
              {getTableData().map((row, idx) => (
                <tr key={idx} className="hover:bg-surface-container/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-on-surface">{row.period}</td>
                  <td className="px-6 py-4 font-bold text-on-surface">{row.rev}</td>
                  <td className="px-6 py-4">{row.orders}</td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-surface-container rounded-full h-1.5 mb-1">
                      <div className={`h-1.5 rounded-full ${row.color === 'green' ? 'bg-secondary' : 'bg-[#E8650A]'}`} style={{ width: row.width }}></div>
                    </div>
                    <span className="text-[10px] font-bold">{row.rate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase border ${
                      row.color === 'green' ? 'bg-green-50 text-secondary border-green-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
