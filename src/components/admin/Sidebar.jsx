import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/admin-dashboard', icon: 'dashboard' },
  { name: 'Products', path: '/admin-dashboard/products', icon: 'inventory_2' },
  { name: 'RCC Projects', path: '/admin-dashboard/rcc-projects', icon: 'construction' },
  { name: 'Inventory', path: '/admin-dashboard/inventory', icon: 'warehouse' },
  { name: 'Sales Reports', path: '/admin-dashboard/sales', icon: 'analytics' },
  { name: 'Orders', path: '/admin-dashboard/orders', icon: 'shopping_cart' },
  { name: 'Customers', path: '/admin-dashboard/customers', icon: 'people' },
  { name: 'Inquiries', path: '/admin-dashboard/inquiries', icon: 'contact_support' },
  { name: 'Settings', path: '/admin-dashboard/settings', icon: 'settings' },
];

export default function Sidebar({ setIsSidebarOpen }) {
  return (
    <aside className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 w-full h-full min-h-screen overflow-y-auto flex flex-col shadow-2xl">
      <div className="p-5 text-xl font-bold border-b border-gray-700 flex items-center justify-between bg-gray-900/50">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-orange-500 text-3xl">shield_person</span>
          <span>Admin Panel</span>
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-colors">
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>
      <nav className="mt-4 flex-1 px-2">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-4 rounded-xl my-1 mx-1 transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold shadow-lg shadow-orange-900/30' 
                  : 'text-gray-300 hover:bg-gray-700/60 hover:text-white'
              }`
            }
          >
            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
