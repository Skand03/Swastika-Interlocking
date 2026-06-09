import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TRANSLATIONS = {
  hi: {
    dashboard: 'डैशबोर्ड', support: 'सहायता', tracker: 'शटरिंग ट्रैकर',
    all: 'सभी', sales: 'बिक्री', rentals: 'किराये',
    totalEquip: 'कुल उपकरण', activeRentals: 'सक्रिय किराये', monthlyRevenue: 'मासिक राजस्व', availableStock: 'उपलब्ध स्टॉक',
    item: 'आइटम', client: 'ग्राहक', status: 'स्थिति', dueDate: 'देय तिथि',
    viewAll: 'सभी रिकॉर्ड देखें', addNew: 'नया रिकॉर्ड जोड़ें', export: 'निर्यात करें'
  },
  en: {
    dashboard: 'Dashboard', support: 'Support', tracker: 'Shuttering Tracker',
    all: 'All', sales: 'Sales', rentals: 'Rentals',
    totalEquip: 'Total Equipment', activeRentals: 'Active Rentals', monthlyRevenue: 'Monthly Revenue', availableStock: 'Available Stock',
    item: 'Item', client: 'Client', status: 'Status', dueDate: 'Due Date',
    viewAll: 'View All Records', addNew: 'Add New Record', export: 'Export'
  }
};

export default function AdminShutteringTracker({ language }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const navigate = useNavigate();

  return (
    <div className="pt-16">
      
{/*  SideNavBar (Execution from JSON)  */}
<aside className="bg-[#1C2B1A] h-full w-64 fixed left-0 top-0 flex flex-col py-8 px-4 shadow-lg z-20 sidebar-scrollbar overflow-y-auto">
<div className="mb-10 px-2">
<h1 className="font-display-lg text-[24px] text-primary-fixed-dim leading-tight">Construx Pro</h1>
<p className="text-tertiary-fixed-dim/60 text-label-sm mt-1">Customer Dashboard</p>
</div>
<nav className="flex-grow space-y-2">
{/*  Profile  */}
<Link to="/admin-dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-tertiary-fixed-dim/70 font-medium hover:text-tertiary-fixed hover:bg-white/5 transition-colors duration-200 cursor-pointer active:scale-95">
<span className="material-symbols-outlined">person</span>
<span>Profile / प्रोफाइल</span>
</Link>
{/*  Orders  */}
<Link to="/admin-dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-tertiary-fixed-dim/70 font-medium hover:text-tertiary-fixed hover:bg-white/5 transition-colors duration-200 cursor-pointer active:scale-95">
<span className="material-symbols-outlined">shopping_cart</span>
<span>Orders / आदेश</span>
</Link>
{/*  Order Details (Selected for this management context)  */}
<Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-fixed font-bold border-l-4 border-primary-fixed bg-surface-variant/10 transition-colors duration-200 cursor-pointer active:scale-95" to="#">
<span className="material-symbols-outlined">receipt_long</span>
<span>Order Details / विवरण</span>
</Link>
{/*  Notifications  */}
<Link to="/admin-dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-tertiary-fixed-dim/70 font-medium hover:text-tertiary-fixed hover:bg-white/5 transition-colors duration-200 cursor-pointer active:scale-95">
<span className="material-symbols-outlined">notifications</span>
<span>Notifications / सूचनाएं</span>
</Link>
{/*  Reviews  */}
<Link to="/admin-dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-tertiary-fixed-dim/70 font-medium hover:text-tertiary-fixed hover:bg-white/5 transition-colors duration-200 cursor-pointer active:scale-95">
<span className="material-symbols-outlined">rate_review</span>
<span>Reviews / समीक्षाएं</span>
</Link>
</nav>
<div className="mt-auto pt-8 border-t border-white/10">
<button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 transition-all active:scale-95">
<span className="material-symbols-outlined">support_agent</span>
<span>Support / सहायता</span>
</button>
</div>
</aside>
{/*  Main Content Area  */}
<main className="ml-64 min-h-screen">
{/*  TopAppBar (Execution from JSON)  */}
<header className="w-full h-16 sticky top-0 z-10 bg-surface-container-low flex items-center justify-between px-gutter shadow-sm transition-all duration-300">
<div className="flex items-center gap-4">
<h2 className="font-headline-md text-headline-md text-primary">Dashboard / डैशबोर्ड</h2>
<div className="hidden md:flex items-center gap-6 ml-8">
<Link to="/admin-dashboard" className="text-on-surface-variant hover:text-on-surface text-label-sm">{t.dashboard}</Link>
<Link to="/contact" className="text-on-surface-variant hover:text-on-surface text-label-sm">{t.support}</Link>
</div>
</div>
<div className="flex items-center gap-4">
<div className="relative group">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
<input className="bg-surface border-none rounded-full pl-10 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-primary w-64 transition-all" placeholder="Search orders..." type="text"/>
</div>
<div className="flex items-center gap-2">
<button className="hover:bg-surface-variant/50 rounded-full p-2 transition-all">
<span className="material-symbols-outlined">language</span>
</button>
<button className="hover:bg-surface-variant/50 rounded-full p-2 transition-all">
<span className="material-symbols-outlined">settings</span>
</button>
<div className="w-8 h-8 rounded-full overflow-hidden ml-2 border border-outline-variant">
<img alt="User Avatar" className="w-full h-full object-cover" data-alt="A professional headshot of a construction site manager wearing a white polo shirt, clean-cut with a friendly expression. The background is a blurred office environment with blueprint-style sketches on the wall, lit with bright, neutral daylight-balanced lighting for a corporate light-mode aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAO5SePUmmuJz9zHwVOaZROQF11SVNW1pGqAEvMs1trJDfIEB1g4Pw5esZnwBe-sumKh95vZBlJO0rrgVViUGmd4r0qh8ivbXs2cO2eQygBZvTKFGQ4inMVzTQBbc95ZmotP9EaloaAUsQZbpPcxgBs63QeLp9RQd_V6NbsttRTkP2cq18wfwjTMaM1zUOvUCUhxqEmAl9-yjlCuhVa-6KF-Wd1pw54rfU0fwhztYGWPLbE9c1sCLUmNhvdZLRtAkHCv-iUNuvsGk0"/>
</div>
</div>
</div>
</header>
{/*  Page Header & Actions  */}
<div className="p-8">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
<div>
<h1 className="font-display-lg text-3xl text-on-background">शटरिंग प्रबंधन / Shuttering Management</h1>
<p className="text-on-surface-variant mt-1">Track inventory, active rentals, and historical logs of shuttering materials.</p>
</div>
<button className="bg-[#E8650A] text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 shadow-md transition-all active:scale-95">
<span className="material-symbols-outlined">add</span>
<span>Add Item</span>
</button>
</div>
{/*  Stats Row  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-8">
<div className="bg-surface-container-low p-card-padding rounded-xl shadow-sm border border-outline-variant/30">
<div className="flex justify-between items-start">
<div>
<p className="text-label-sm text-on-surface-variant">Total Types</p>
<h3 className="font-display-lg text-2xl mt-1">12</h3>
</div>
<span className="material-symbols-outlined text-primary bg-primary-fixed p-2 rounded-lg">category</span>
</div>
</div>
<div className="bg-surface-container-low p-card-padding rounded-xl shadow-sm border border-outline-variant/30">
<div className="flex justify-between items-start">
<div>
<p className="text-label-sm text-on-surface-variant">On Rent</p>
<h3 className="font-display-lg text-2xl mt-1">450pcs</h3>
</div>
<span className="material-symbols-outlined text-secondary bg-secondary-container p-2 rounded-lg">outbound</span>
</div>
</div>
<div className="bg-surface-container-low p-card-padding rounded-xl shadow-sm border border-outline-variant/30">
<div className="flex justify-between items-start">
<div>
<p className="text-label-sm text-on-surface-variant">Available</p>
<h3 className="font-display-lg text-2xl mt-1">320pcs</h3>
</div>
<span className="material-symbols-outlined text-tertiary bg-tertiary-fixed p-2 rounded-lg">inventory_2</span>
</div>
</div>
<div className="bg-surface-container-low p-card-padding rounded-xl shadow-sm border border-outline-variant/30">
<div className="flex justify-between items-start">
<div>
<p className="text-label-sm text-on-surface-variant">Revenue</p>
<h3 className="font-display-lg text-2xl mt-1 text-secondary">₹28,500</h3>
</div>
<span className="material-symbols-outlined text-secondary bg-secondary-container p-2 rounded-lg">payments</span>
</div>
</div>
</div>
{/*  Alert Strip  */}
<div className="bg-[#FDE8D6] border-l-4 border-[#E8650A] p-4 mb-8 flex items-center justify-between rounded-r-lg">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-[#E8650A]">warning</span>
<span className="text-on-surface font-medium">3 rentals due for return today!</span>
</div>
<Link className="text-[#E8650A] font-bold hover:underline flex items-center gap-1" to="#">
                    View <span className="material-symbols-outlined text-sm">arrow_forward</span>
</Link>
</div>
{/*  Content Tabs  */}
<div className="border-b border-outline-variant mb-8">
<div className="flex gap-8 overflow-x-auto whitespace-nowrap">
<button className="pb-4 text-on-surface-variant font-medium hover:text-brand-orange transition-colors">Inventory</button>
<button className="pb-4 active-tab">Active Rentals</button>
<button className="pb-4 text-on-surface-variant font-medium hover:text-brand-orange transition-colors">Rental History</button>
<button className="pb-4 text-on-surface-variant font-medium hover:text-brand-orange transition-colors">Sales</button>
</div>
</div>
{/*  Active Rentals Table  */}
<div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden mb-12">
<div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
<h4 className="font-headline-md text-lg">Active Rentals Overview</h4>
<div className="flex gap-2">
<button className="border border-outline-variant rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 hover:bg-surface-variant/20">
<span className="material-symbols-outlined text-sm">filter_list</span> Filter
                        </button>
<button className="border border-outline-variant rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 hover:bg-surface-variant/20">
<span className="material-symbols-outlined text-sm">download</span> Export
                        </button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container text-label-sm text-on-surface-variant">
<tr>
<th className="p-4 font-semibold">Rental ID</th>
<th className="p-4 font-semibold">Customer Details</th>
<th className="p-4 font-semibold">Items Rented</th>
<th className="p-4 font-semibold text-center">Qty</th>
<th className="p-4 font-semibold">Start Date</th>
<th className="p-4 font-semibold">Due Return</th>
<th className="p-4 font-semibold">Amount ₹</th>
<th className="p-4 font-semibold">Status</th>
<th className="p-4 font-semibold text-right">Actions</th>
</tr>
</thead>
<tbody className="text-body-md">
{/*  Overdue Row  */}
<tr className="bg-[#FCEBEB] border-l-4 border-error hover:bg-[#f8d7d7] transition-colors">
<td className="p-4 font-bold text-primary">#R-8821</td>
<td className="p-4">
<div className="font-semibold text-on-surface">Rajesh Kumar</div>
<div className="text-sm text-on-surface-variant">+91 98765 43210</div>
</td>
<td className="p-4">Steel Plates (9x3), Clamps</td>
<td className="p-4 text-center">120</td>
<td className="p-4 text-sm text-on-surface-variant">12 Oct 2023</td>
<td className="p-4 text-sm font-bold text-error">26 Oct 2023</td>
<td className="p-4 font-bold">12,400</td>
<td className="p-4">
<span className="bg-error-container text-on-error-container px-3 py-1 rounded-full text-xs font-bold">OVERDUE</span>
</td>
<td className="p-4 text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
{/*  Due Today Row  */}
<tr className="bg-[#FDE8D6] border-l-4 border-[#E8650A] hover:bg-[#fbdcb8] transition-colors">
<td className="p-4 font-bold text-primary">#R-8845</td>
<td className="p-4">
<div className="font-semibold text-on-surface">Modern Infra Pvt Ltd</div>
<div className="text-sm text-on-surface-variant">+91 91234 56789</div>
</td>
<td className="p-4">Adjustable Props, Beams</td>
<td className="p-4 text-center">85</td>
<td className="p-4 text-sm text-on-surface-variant">20 Oct 2023</td>
<td className="p-4 text-sm font-bold text-[#E8650A]">30 Oct 2023</td>
<td className="p-4 font-bold">8,250</td>
<td className="p-4">
<span className="bg-[#FDE8D6] text-[#E8650A] border border-[#E8650A] px-3 py-1 rounded-full text-xs font-bold">DUE TODAY</span>
</td>
<td className="p-4 text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
{/*  Normal Row  */}
<tr className="border-b border-outline-variant/20 hover:bg-surface-variant/10 transition-colors">
<td className="p-4 font-bold text-primary">#R-8856</td>
<td className="p-4">
<div className="font-semibold text-on-surface">Amit Sharma</div>
<div className="text-sm text-on-surface-variant">+91 94567 12345</div>
</td>
<td className="p-4">Scaffolding Frames</td>
<td className="p-4 text-center">245</td>
<td className="p-4 text-sm text-on-surface-variant">25 Oct 2023</td>
<td className="p-4 text-sm text-on-surface-variant">15 Nov 2023</td>
<td className="p-4 font-bold">15,900</td>
<td className="p-4">
<span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">ON RENT</span>
</td>
<td className="p-4 text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
{/*  Inventory Table  */}
<div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
<div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
<h4 className="font-headline-md text-lg">Inventory Tracking / इन्वेंटरी ट्रैकिंग</h4>
<div className="relative group">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
<input className="bg-surface border border-outline-variant/50 rounded-lg pl-9 pr-4 py-1.5 text-xs focus:ring-1 focus:ring-primary w-48" placeholder="Quick find item..." type="text"/>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container text-label-sm text-on-surface-variant">
<tr>
<th className="p-4 font-semibold">Item Name (English / हिंदी)</th>
<th className="p-4 font-semibold text-center">Total Stock</th>
<th className="p-4 font-semibold text-center">On Rent</th>
<th className="p-4 font-semibold text-center">Available</th>
<th className="p-4 font-semibold">Rate ₹/day</th>
<th className="p-4 font-semibold">Sale Price</th>
<th className="p-4 font-semibold">Status</th>
<th className="p-4 font-semibold text-right">Edit</th>
</tr>
</thead>
<tbody className="text-body-md">
<tr className="border-b border-outline-variant/20 hover:bg-surface-variant/10 transition-colors">
<td className="p-4">
<div className="font-semibold text-on-surface">Steel Plate (9x3)</div>
<div className="text-sm text-on-surface-variant">स्टील प्लेट</div>
</td>
<td className="p-4 text-center font-medium">500</td>
<td className="p-4 text-center text-primary font-bold">320</td>
<td className="p-4 text-center text-secondary font-bold">180</td>
<td className="p-4">₹12.00</td>
<td className="p-4 text-on-surface-variant">₹850.00</td>
<td className="p-4">
<span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[11px] font-bold">STOCKED</span>
</td>
<td className="p-4 text-right">
<button className="text-outline hover:text-primary transition-all">
<span className="material-symbols-outlined">edit_square</span>
</button>
</td>
</tr>
<tr className="border-b border-outline-variant/20 hover:bg-surface-variant/10 transition-colors">
<td className="p-4">
<div className="font-semibold text-on-surface">Adjustable Jack</div>
<div className="text-sm text-on-surface-variant">एडजस्टेबल जैक</div>
</td>
<td className="p-4 text-center font-medium">200</td>
<td className="p-4 text-center text-primary font-bold">195</td>
<td className="p-4 text-center text-error font-bold">5</td>
<td className="p-4">₹8.50</td>
<td className="p-4 text-on-surface-variant">₹420.00</td>
<td className="p-4">
<span className="bg-error-container text-on-error-container px-2 py-0.5 rounded text-[11px] font-bold uppercase">Critical Low</span>
</td>
<td className="p-4 text-right">
<button className="text-outline hover:text-primary transition-all">
<span className="material-symbols-outlined">edit_square</span>
</button>
</td>
</tr>
<tr className="border-b border-outline-variant/20 hover:bg-surface-variant/10 transition-colors">
<td className="p-4">
<div className="font-semibold text-on-surface">Scaffolding Frame</div>
<div className="text-sm text-on-surface-variant">स्कैफोल्डिंग फ्रेम</div>
</td>
<td className="p-4 text-center font-medium">150</td>
<td className="p-4 text-center text-primary font-bold">45</td>
<td className="p-4 text-center text-secondary font-bold">105</td>
<td className="p-4">₹25.00</td>
<td className="p-4 text-on-surface-variant">₹2,100.00</td>
<td className="p-4">
<span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[11px] font-bold">STOCKED</span>
</td>
<td className="p-4 text-right">
<button className="text-outline hover:text-primary transition-all">
<span className="material-symbols-outlined">edit_square</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
{/*  Footer  */}
<footer className="p-8 text-center text-on-surface-variant border-t border-outline-variant/30 mt-12 bg-surface-container-low">
<p className="text-label-sm">© 2023 Construx Pro Management System. All Rights Reserved.</p>
</footer>
</main>


    </div>
  );
}
