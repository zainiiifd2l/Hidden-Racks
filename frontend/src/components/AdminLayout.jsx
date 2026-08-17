import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ children, currentTab, onNavigate }) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'admin-dashboard', label: 'Dashboard' },
    { id: 'admin-products', label: 'Products' },
    { id: 'admin-add-product', label: 'Add Product' },
  ];

  return (
    <div class="min-h-screen bg-[#F4F3F0] flex">
      {/* Admin Sidebar */}
      <aside class="w-64 bg-[#121212] text-white flex flex-col border-r border-[#2A2A2A]">
        <div class="p-6 border-b border-[#2A2A2A]">
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} class="font-['Syne'] font-extrabold text-lg flex items-center gap-2 text-white">
            HIDDEN_RACK <span class="bg-[#C4A47C] text-[#111111] text-[9px] font-extrabold px-1.5 py-0.5">ADMIN</span>
          </a>
        </div>

        <nav class="flex flex-col py-4 flex-1 font-['Syne'] font-bold text-xs uppercase">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              class={`px-6 py-3.5 text-left border-l-4 transition-colors ${currentTab === item.id ? 'border-[#C4A47C] bg-[#1C1C1C] text-white' : 'border-transparent text-[#AAA] hover:text-white hover:bg-[#1C1C1C]'}`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => { logout(); onNavigate('home'); }}
            class="px-6 py-3.5 text-left text-red-400 mt-auto hover:bg-[#1C1C1C]"
          >
            LOGOUT
          </button>
        </nav>
      </aside>

      {/* Main Container */}
      <div class="flex-1 flex flex-col">
        <header class="h-16 bg-white border-b border-[#E8E5E0] px-8 flex items-center justify-between">
          <h1 class="font-['Syne'] font-extrabold text-base uppercase">CONTROL PANEL</h1>
          <div class="text-xs font-bold">
            <span>{user?.name || 'Admin'}</span>
          </div>
        </header>

        <main class="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
