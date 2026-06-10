import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export default function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-4 md:px-6 py-3 shadow-sm">
      <div className="flex items-center gap-2 md:gap-3">
        <button onClick={toggleSidebar} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg -ml-2">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <img src="/logo.svg" alt="Swastika" className="h-8 w-8 hidden sm:block" />
        <h1 className="text-lg md:text-xl font-bold text-gray-800">Swastika Admin</h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <span className="text-xs md:text-sm text-gray-600 hidden sm:block">{profile?.full_name || 'Admin'}</span>
        <button
          onClick={handleLogout}
          className="px-3 md:px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
