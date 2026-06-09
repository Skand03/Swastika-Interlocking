import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/admin-dashboard' },
  { name: 'Products', path: '/admin-dashboard/products' },
  { name: 'RCC Projects', path: '/admin-dashboard/rcc-projects' },
  { name: 'Inventory', path: '/admin-dashboard/inventory' },
  { name: 'Sales Reports', path: '/admin-dashboard/sales' },
  { name: 'Orders', path: '/admin-dashboard/orders' },
  { name: 'Customers', path: '/admin-dashboard/customers' },
  { name: 'Inquiries', path: '/admin-dashboard/inquiries' },
  { name: 'Settings', path: '/admin-dashboard/settings' },
];

export default function Sidebar({ setIsSidebarOpen }) {
  return (
    <aside className="bg-gray-800 text-gray-100 w-full h-full min-h-screen overflow-y-auto flex flex-col shadow-xl md:shadow-none">
      <div className="p-4 text-xl font-bold border-b border-gray-700 flex items-center justify-between">
        <span>Admin Panel</span>
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white p-1">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <nav className="mt-4 flex-1">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-3 hover:bg-gray-700 transition ${isActive ? 'bg-gray-700 text-white font-medium border-l-4 border-orange-500' : 'text-gray-300'}`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
