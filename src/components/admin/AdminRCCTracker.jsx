import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TRANSLATIONS = {
  hi: {
    dashboard: 'डैशबोर्ड', support: 'सहायता', tracker: 'आरसीसी प्रोजेक्ट ट्रैकर',
    all: 'सभी', planning: 'प्लानिंग', ongoing: 'प्रगति पर', completed: 'पूरा',
    totalProjects: 'कुल प्रोजेक्ट्स', activeSites: 'सक्रिय साइटें', monthlyRevenue: 'मासिक राजस्व', teamsDeployed: 'तैनात टीमें',
    project: 'प्रोजेक्ट', location: 'स्थान', status: 'स्थिति', completion: 'समापन',
    viewAll: 'सभी रिकॉर्ड देखें', addNew: 'नया रिकॉर्ड जोड़ें', export: 'निर्यात करें'
  },
  en: {
    dashboard: 'Dashboard', support: 'Support', tracker: 'RCC Project Tracker',
    all: 'All', planning: 'Planning', ongoing: 'Ongoing', completed: 'Completed',
    totalProjects: 'Total Projects', activeSites: 'Active Sites', monthlyRevenue: 'Monthly Revenue', teamsDeployed: 'Teams Deployed',
    project: 'Project', location: 'Location', status: 'Status', completion: 'Completion',
    viewAll: 'View All Records', addNew: 'Add New Record', export: 'Export'
  }
};

export default function AdminRCCTracker({ language }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const navigate = useNavigate();

  return (
    <div className="pt-16">
      
{/*  Sidebar (Shared Component)  */}
<aside className="h-full w-64 fixed left-0 top-0 bg-[#1C2B1A] shadow-lg flex flex-col py-8 px-4 z-20">
<div className="mb-12 px-4">
<h1 className="font-display-lg text-headline-md text-primary-fixed-dim leading-tight">Construx Pro</h1>
<p className="font-body-md text-label-sm text-tertiary-fixed-dim/70">Customer Dashboard</p>
</div>
<nav className="flex-1 space-y-2">
<Link to="/admin-dashboard" className="flex items-center gap-3 px-4 py-3 text-tertiary-fixed-dim/70 font-medium hover:text-tertiary-fixed hover:bg-white/5 transition-colors duration-200 cursor-pointer active:scale-95">
<span className="material-symbols-outlined">person</span>
<span>Profile / प्रोफ़ाइल</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-primary-fixed font-bold border-l-4 border-primary-fixed bg-surface-variant/10 transition-colors duration-200 cursor-pointer active:scale-95" to="#">
<span className="material-symbols-outlined">shopping_cart</span>
<span>Orders / आदेश</span>
</Link>
<Link to="/admin-dashboard" className="flex items-center gap-3 px-4 py-3 text-tertiary-fixed-dim/70 font-medium hover:text-tertiary-fixed hover:bg-white/5 transition-colors duration-200 cursor-pointer active:scale-95">
<span className="material-symbols-outlined">receipt_long</span>
<span>Order Details / विवरण</span>
</Link>
<Link to="/admin-dashboard" className="flex items-center gap-3 px-4 py-3 text-tertiary-fixed-dim/70 font-medium hover:text-tertiary-fixed hover:bg-white/5 transition-colors duration-200 cursor-pointer active:scale-95">
<span className="material-symbols-outlined">notifications</span>
<span>Notifications / सूचनाएं</span>
</Link>
<Link to="/admin-dashboard" className="flex items-center gap-3 px-4 py-3 text-tertiary-fixed-dim/70 font-medium hover:text-tertiary-fixed hover:bg-white/5 transition-colors duration-200 cursor-pointer active:scale-95">
<span className="material-symbols-outlined">rate_review</span>
<span>Reviews / समीक्षाएं</span>
</Link>
</nav>
<div className="mt-auto px-4">
<button className="w-full flex items-center justify-center gap-2 py-3 border border-primary-fixed/30 text-primary-fixed font-body-md rounded hover:bg-white/5 transition-all">
<span className="material-symbols-outlined">support_agent</span>
<span>Support / सहायता</span>
</button>
</div>
</aside>
{/*  Main Content Area  */}
<main className="ml-64 min-h-screen">
{/*  TopAppBar (Shared Component)  */}
<header className="w-full h-16 sticky top-0 z-10 bg-surface-container-low shadow-sm flex items-center justify-between px-gutter">
<div className="flex items-center gap-4">
<h2 className="font-headline-md text-headline-md text-primary">Dashboard / डैशबोर्ड</h2>
</div>
<div className="flex items-center gap-6">
<div className="relative">
<input className="pl-10 pr-4 py-1.5 bg-surface-container-high rounded-full border-none focus:ring-2 focus:ring-primary text-body-md w-64" placeholder="Search projects..." type="text"/>
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
</div>
<div className="flex items-center gap-4">
<div className="flex gap-4">
<Link to="/admin-dashboard" className="text-on-surface-variant hover:text-on-surface font-label-sm">{t.dashboard}</Link>
<Link to="/contact" className="text-on-surface-variant hover:text-on-surface font-label-sm">{t.support}</Link>
</div>
<div className="h-6 w-[1px] bg-outline-variant"></div>
<button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-variant/50 rounded-full p-2 transition-all">language</button>
<button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-variant/50 rounded-full p-2 transition-all">settings</button>
<div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden">
<img alt="User Avatar" className="w-full h-full object-cover" data-alt="A professional headshot of a construction site manager wearing a white hard hat and a safety vest, with a blurred background of a modern industrial construction site during golden hour." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCitzQS4EsE79B8r9nDQhoKVq2N89DYnzJ8PthtjmpyYSR1nH4H5j-VNYDbjKykh6QbvE417i2MUvYM4VTJQGjINoWWOFaecmH8JNTYbCvgiqEySY8z1CPXH8kmY9Rr0Berr7QVxgJcpLY9a8VsvPaXlwij45GgkZxFlcIN_vLHNaveFEbJCtpvThmvPKDffcUctRZPBAbyOm2r9LZ_mr-Z0H2NYS1QiEhra0DU18xvw9PFImeJJHsGrkEeigpGY7wcV1siK2Ehrvg"/>
</div>
</div>
</div>
</header>
{/*  Canvas Content  */}
<div className="p-gutter space-y-8">
{/*  Page Header & Global Actions  */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<h3 className="font-display-lg text-display-lg text-on-surface">RCC प्रोजेक्ट / RCC Projects</h3>
<p className="text-on-surface-variant font-body-md">Manage and track interlocking concrete road developments</p>
</div>
<div className="flex items-center gap-3">
<button className="bg-surface-container-high text-on-surface-variant px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-surface-variant transition-all">
<span className="material-symbols-outlined">download</span>
                        Export
                    </button>
<button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-primary-container shadow-md transition-all">
<span className="material-symbols-outlined">add</span>
                        Add Project
                    </button>
</div>
</div>
{/*  Dashboard Controls  */}
<div className="flex flex-wrap items-center justify-between gap-6 border-b border-outline-variant pb-4">
{/*  View Toggle Tabs  */}
<div className="flex bg-surface-container p-1 rounded-xl">
<button className="px-8 py-2 rounded-lg font-bold text-on-primary bg-primary shadow-sm flex items-center gap-2 transition-all">
<span className="material-symbols-outlined text-[20px]">view_kanban</span>
                        Kanban
                    </button>
<button className="px-8 py-2 rounded-lg font-bold text-on-surface-variant hover:text-on-surface flex items-center gap-2 transition-all">
<span className="material-symbols-outlined text-[20px]">list_alt</span>
                        List
                    </button>
</div>
{/*  Stats Row  */}
<div className="flex items-center gap-8 bg-surface-container-low px-8 py-3 rounded-2xl shadow-sm border border-surface-container-high">
<div className="flex flex-col">
<span className="text-label-sm text-on-surface-variant">{t.totalProjects}</span>
<span className="font-headline-md text-on-surface">28</span>
</div>
<div className="w-[1px] h-10 bg-outline-variant"></div>
<div className="flex flex-col">
<span className="text-label-sm text-on-surface-variant">{t.ongoing}</span>
<span className="font-headline-md text-primary">3</span>
</div>
<div className="w-[1px] h-10 bg-outline-variant"></div>
<div className="flex flex-col">
<span className="text-label-sm text-on-surface-variant">{t.completed}</span>
<span className="font-headline-md text-secondary">25</span>
</div>
<div className="w-[1px] h-10 bg-outline-variant"></div>
<div className="flex flex-col">
<span className="text-label-sm text-on-surface-variant">Total Value</span>
<span className="font-headline-md text-secondary font-bold">₹42L</span>
</div>
</div>
</div>
{/*  Kanban Board  */}
<div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar">
{/*  Enquiry (Blue)  */}
<div className="kanban-column flex-shrink-0 flex flex-col gap-4">
<div className="flex items-center justify-between bg-blue-50/50 border-t-4 border-blue-500 p-4 rounded-lg">
<h4 className="font-bold text-blue-900">Enquiry</h4>
<span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">12</span>
</div>
<div className="space-y-4">
{/*  Card 1  */}
<div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-surface-container-high hover:shadow-md transition-all cursor-pointer">
<div className="flex justify-between items-start mb-2">
<h5 className="font-bold text-on-surface">Om Sairam Colony</h5>
<span className="material-symbols-outlined text-on-surface-variant text-sm">more_vert</span>
</div>
<p className="text-label-sm text-on-surface-variant mb-4">Ramesh Verma / Nagpur</p>
<div className="flex justify-between items-center text-label-sm">
<span className="text-primary font-bold">₹8.5L</span>
<span className="text-on-surface-variant">120m Length</span>
</div>
</div>
</div>
</div>
{/*  Site Visit (Orange)  */}
<div className="kanban-column flex-shrink-0 flex flex-col gap-4">
<div className="flex items-center justify-between bg-primary-fixed/20 border-t-4 border-primary p-4 rounded-lg">
<h4 className="font-bold text-primary">Site Visit</h4>
<span className="bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold px-2 py-1 rounded-full">4</span>
</div>
{/*  Card 2  */}
<div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-surface-container-high hover:shadow-md transition-all cursor-pointer">
<div className="flex justify-between items-start mb-2">
<h5 className="font-bold text-on-surface">Industrial Park Ext</h5>
<span className="material-symbols-outlined text-on-surface-variant text-sm">more_vert</span>
</div>
<p className="text-label-sm text-on-surface-variant mb-3">MIDC Industrial / Butibori</p>
<div className="flex justify-between items-center mb-3">
<span className="text-primary font-bold">₹15.2L</span>
<span className="text-on-surface-variant text-label-sm">Scheduled: Oct 24</span>
</div>
<div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
<div className="bg-secondary w-1/3 h-full"></div>
</div>
</div>
</div>
{/*  Contract Signed (Green)  */}
<div className="kanban-column flex-shrink-0 flex flex-col gap-4">
<div className="flex items-center justify-between bg-secondary-fixed/20 border-t-4 border-secondary p-4 rounded-lg">
<h4 className="font-bold text-secondary">Contract Signed</h4>
<span className="bg-secondary-fixed text-on-secondary-fixed-variant text-xs font-bold px-2 py-1 rounded-full">3</span>
</div>
{/*  Card 3  */}
<div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-surface-container-high border-l-4 border-l-secondary">
<div className="flex justify-between items-start mb-2">
<h5 className="font-bold text-on-surface">Green Valley Road</h5>
<span className="material-symbols-outlined text-on-surface-variant text-sm">more_vert</span>
</div>
<p className="text-label-sm text-on-surface-variant mb-3">Sharma Infra / Wadi</p>
<div className="flex justify-between items-center mb-3">
<span className="text-primary font-bold">₹9.8L</span>
<span className="text-on-surface-variant text-label-sm italic">Pending Advance</span>
</div>
<div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
<div className="bg-secondary w-1/2 h-full"></div>
</div>
</div>
</div>
{/*  Under Construction (Orange)  */}
<div className="kanban-column flex-shrink-0 flex flex-col gap-4">
<div className="flex items-center justify-between bg-primary-fixed/20 border-t-4 border-primary p-4 rounded-lg">
<h4 className="font-bold text-primary">Under Construction</h4>
<span className="bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold px-2 py-1 rounded-full">3</span>
</div>
{/*  Card 4 (Active for detail view)  */}
<div className="bg-white p-4 rounded-xl shadow-lg border-2 border-primary ring-4 ring-primary/5 scale-[1.02]">
<div className="flex justify-between items-start mb-2">
<h5 className="font-bold text-on-surface">Shanti Nagar Main</h5>
<span className="material-symbols-outlined text-primary text-sm">push_pin</span>
</div>
<p className="text-label-sm text-on-surface-variant mb-3">Municipal Corp / Ward 42</p>
<div className="flex justify-between items-center mb-3">
<span className="text-primary font-bold">₹22.5L</span>
<span className="text-on-surface-variant text-label-sm">Due: Nov 15</span>
</div>
<div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div className="bg-secondary w-[65%] h-full"></div>
</div>
</div>
</div>
{/*  Completed (Green)  */}
<div className="kanban-column flex-shrink-0 flex flex-col gap-4">
<div className="flex items-center justify-between bg-secondary-fixed/20 border-t-4 border-secondary p-4 rounded-lg">
<h4 className="font-bold text-secondary">Completed ✓</h4>
<span className="bg-secondary-fixed text-on-secondary-fixed-variant text-xs font-bold px-2 py-1 rounded-full">6</span>
</div>
{/*  Card 5  */}
<div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-surface-container-high opacity-80 grayscale-[0.3]">
<div className="flex justify-between items-start mb-2">
<h5 className="font-bold text-on-surface">Sonegaon Link Road</h5>
<span className="material-symbols-outlined text-secondary text-sm">verified</span>
</div>
<p className="text-label-sm text-on-surface-variant mb-3">Private Client / Sonegaon</p>
<div className="flex justify-between items-center mb-3">
<span className="text-primary font-bold">₹6.2L</span>
<span className="text-secondary text-label-sm font-bold">Paid Full</span>
</div>
<div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden"></div>
</div>
</div>
</div>
{/*  Project Detail Section (Below Kanban)  */}
<div className="bg-surface-container-low rounded-3xl p-gutter shadow-sm border border-surface-container-high overflow-hidden">
<div className="flex items-center justify-between mb-8">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
<span className="material-symbols-outlined text-on-primary">engineering</span>
</div>
<div>
<h4 className="font-headline-md text-on-surface">Shanti Nagar Main Road - Detail Overview</h4>
<p className="text-label-sm text-on-surface-variant">Project ID: RCC-2023-042 | Started: Oct 01, 2023</p>
</div>
</div>
<button className="text-primary font-bold hover:underline flex items-center gap-1">
                        View Full History <span className="material-symbols-outlined">arrow_right_alt</span>
</button>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
{/*  Left: Project Info  */}
<div className="bg-white/50 p-6 rounded-2xl border border-surface-container-high space-y-4">
<h5 className="font-bold text-on-surface border-b border-outline-variant pb-2 mb-4">Project Info</h5>
<div className="grid grid-cols-2 gap-y-4 text-body-md">
<span className="text-on-surface-variant">Client:</span>
<span className="font-bold">Municipal Corp</span>
<span className="text-on-surface-variant">Village/Loc:</span>
<span className="font-bold">Ward 42, Nagpur</span>
<span className="text-on-surface-variant">Road Length:</span>
<span className="font-bold">450 Meters</span>
<span className="text-on-surface-variant">Paver Type:</span>
<span className="font-bold">80mm Heavy Duty</span>
<span className="text-on-surface-variant">Contractor:</span>
<span className="font-bold">RCC Solutions</span>
</div>
</div>
{/*  Center: Milestone Checklist  */}
<div className="bg-white/50 p-6 rounded-2xl border border-surface-container-high">
<h5 className="font-bold text-on-surface border-b border-outline-variant pb-2 mb-4">Milestone Checklist</h5>
<div className="space-y-3">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-secondary" style={{"fontVariationSettings": "'FILL' 1", }}>check_circle</span>
<span className="text-body-md text-on-surface">Initial Survey</span>
</div>
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-secondary" style={{"fontVariationSettings": "'FILL' 1", }}>check_circle</span>
<span className="text-body-md text-on-surface">Structural Design</span>
</div>
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-secondary" style={{"fontVariationSettings": "'FILL' 1", }}>check_circle</span>
<span className="text-body-md text-on-surface">Excavation &amp; Leveling</span>
</div>
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary" style={{"fontVariationSettings": "'FILL' 1", }}>radio_button_checked</span>
<span className="text-body-md font-bold text-on-surface">Base Layer Compaction</span>
</div>
<div className="flex items-center gap-3 opacity-50">
<span className="material-symbols-outlined text-on-surface-variant">pending</span>
<span className="text-body-md">RCC Pouring / Pavers</span>
</div>
<div className="flex items-center gap-3 opacity-50">
<span className="material-symbols-outlined text-on-surface-variant">pending</span>
<span className="text-body-md">Curing Period</span>
</div>
<div className="flex items-center gap-3 opacity-50">
<span className="material-symbols-outlined text-on-surface-variant">pending</span>
<span className="text-body-md">Quality Inspection</span>
</div>
<div className="flex items-center gap-3 opacity-50">
<span className="material-symbols-outlined text-on-surface-variant">pending</span>
<span className="text-body-md">Handover</span>
</div>
</div>
</div>
{/*  Right: Billing  */}
<div className="bg-white/50 p-6 rounded-2xl border border-surface-container-high flex flex-col">
<h5 className="font-bold text-on-surface border-b border-outline-variant pb-2 mb-4">Billing &amp; Payments</h5>
<div className="flex-1 space-y-4 mb-6">
<div className="flex justify-between items-center text-body-md">
<span className="text-on-surface-variant">Advance Received</span>
<span className="font-bold text-secondary">₹5,00,000</span>
</div>
<div className="flex justify-between items-center text-body-md">
<span className="text-on-surface-variant">Milestone 1 Payment</span>
<span className="font-bold text-secondary">₹7,50,000</span>
</div>
<div className="pt-4 border-t border-outline-variant flex justify-between items-center">
<span className="text-body-md font-bold">Total Pending</span>
<span className="text-headline-md font-bold text-error">₹10,00,000</span>
</div>
</div>
<button className="w-full bg-surface-container-highest text-on-surface font-bold py-3 rounded-xl border border-outline-variant hover:bg-surface-variant transition-all flex items-center justify-center gap-2">
<span className="material-symbols-outlined">payments</span>
                            Add Payment
                        </button>
</div>
</div>
</div>
{/*  Enquiries Tab Table Section  */}
<div className="space-y-6">
<div className="flex items-center justify-between">
<h4 className="font-headline-md text-on-surface">Recent Enquiries / पूछताछ</h4>
<div className="flex gap-2">
<span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant rounded-full text-xs font-bold uppercase tracking-wider">New Leads</span>
</div>
</div>
<div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-surface-container-high">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container-high">
<tr>
<th className="px-6 py-4 font-bold text-on-surface-variant text-label-sm uppercase tracking-wider">Name</th>
<th className="px-6 py-4 font-bold text-on-surface-variant text-label-sm uppercase tracking-wider">Location</th>
<th className="px-6 py-4 font-bold text-on-surface-variant text-label-sm uppercase tracking-wider">Road Length</th>
<th className="px-6 py-4 font-bold text-on-surface-variant text-label-sm uppercase tracking-wider">Budget</th>
<th className="px-6 py-4 font-bold text-on-surface-variant text-label-sm uppercase tracking-wider">Date</th>
<th className="px-6 py-4 font-bold text-on-surface-variant text-label-sm uppercase tracking-wider">Status</th>
<th className="px-6 py-4 font-bold text-on-surface-variant text-label-sm uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container-high">
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-6 py-4">
<div className="flex flex-col">
<span className="font-bold text-on-surface">Rajesh Deshmukh</span>
<span className="text-xs text-on-surface-variant">+91 98765 43210</span>
</div>
</td>
<td className="px-6 py-4 text-body-md text-on-surface-variant">Amravati Rd, Wadi</td>
<td className="px-6 py-4 text-body-md text-on-surface">85 Meters</td>
<td className="px-6 py-4 text-body-md font-bold text-primary">₹4,20,000</td>
<td className="px-6 py-4 text-body-md text-on-surface-variant">Oct 12, 2023</td>
<td className="px-6 py-4">
<span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">New</span>
</td>
<td className="px-6 py-4 text-right">
<button className="p-2 hover:bg-surface-variant rounded-full text-primary transition-all">
<span className="material-symbols-outlined">call</span>
</button>
<button className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant transition-all">
<span className="material-symbols-outlined">edit</span>
</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-6 py-4">
<div className="flex flex-col">
<span className="font-bold text-on-surface">Sunil Kumar</span>
<span className="text-xs text-on-surface-variant">+91 91234 56789</span>
</div>
</td>
<td className="px-6 py-4 text-body-md text-on-surface-variant">Kamptee Road</td>
<td className="px-6 py-4 text-body-md text-on-surface">210 Meters</td>
<td className="px-6 py-4 text-body-md font-bold text-primary">₹12,80,000</td>
<td className="px-6 py-4 text-body-md text-on-surface-variant">Oct 10, 2023</td>
<td className="px-6 py-4">
<span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant rounded-full text-xs font-bold">Contacted</span>
</td>
<td className="px-6 py-4 text-right">
<button className="p-2 hover:bg-surface-variant rounded-full text-primary transition-all">
<span className="material-symbols-outlined">call</span>
</button>
<button className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant transition-all">
<span className="material-symbols-outlined">edit</span>
</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-6 py-4">
<div className="flex flex-col">
<span className="font-bold text-on-surface">Pooja Builders</span>
<span className="text-xs text-on-surface-variant">+91 88888 77777</span>
</div>
</td>
<td className="px-6 py-4 text-body-md text-on-surface-variant">Somatane Phata</td>
<td className="px-6 py-4 text-body-md text-on-surface">1.2 KM</td>
<td className="px-6 py-4 text-body-md font-bold text-primary">₹45,50,000</td>
<td className="px-6 py-4 text-body-md text-on-surface-variant">Oct 08, 2023</td>
<td className="px-6 py-4">
<span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-xs font-bold">Converted</span>
</td>
<td className="px-6 py-4 text-right">
<button className="p-2 hover:bg-surface-variant rounded-full text-secondary transition-all">
<span className="material-symbols-outlined">verified</span>
</button>
<button className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant transition-all">
<span className="material-symbols-outlined">edit</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
{/*  Footer Decoration  */}
<footer className="p-gutter text-center border-t border-outline-variant bg-surface-container-low mt-12">
<p className="text-on-surface-variant text-label-sm">© 2023 Construx Pro Infrastructure Management System. Built for heavy-duty reliability.</p>
</footer>
</main>
{/*  Floating Action Button (Admin Level)  */}
<button className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-30 group">
<span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">add</span>
</button>

    </div>
  );
}
