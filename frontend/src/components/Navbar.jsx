import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onNavigate, currentPage }) {
  const { cartCount, wishlist } = useCart();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('shop', { search: searchQuery.trim() });
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div class="bg-[#121212] text-[#C4A47C] h-9 flex items-center justify-center text-xs font-semibold uppercase tracking-widest border-b border-[#2A2A2A]">
        <span>Premium Thrifted Sneakers • Authentic Finds • Delivery Across Pakistan</span>
      </div>

      <!-- Main Navbar -->
      <header class="sticky top-0 z-40 bg-white border-b border-[#E8E5E0]">
        <div class="max-w-[1380px] mx-auto px-6 h-20 flex items-center justify-between">
          
          <!-- Mobile Menu Button -->
          <button 
            onClick={() => setMobileMenuOpen(true)}
            class="lg:hidden p-2 flex flex-col gap-1.5 cursor-pointer" 
            aria-label="Open Menu"
          >
            <span class="w-6 h-0.5 bg-[#111111]"></span>
            <span class="w-6 h-0.5 bg-[#111111]"></span>
            <span class="w-6 h-0.5 bg-[#111111]"></span>
          </button>

          <!-- Brand Logo -->
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }} 
            class="font-['Syne'] font-extrabold text-2xl tracking-wider text-[#111111] flex items-center gap-1.5"
          >
            HIDDEN_RACK<span class="w-2 h-2 bg-[#C4A47C] inline-block"></span>
          </a>

          <!-- Desktop Navigation Links -->
          <nav class="hidden lg:flex items-center gap-8">
            {[
              { id: 'home', label: 'Home' },
              { id: 'shop', label: 'Shop' },
              { id: 'shop', label: 'Men', params: { category: 'Men' } },
              { id: 'shop', label: 'Women', params: { category: 'Women' } },
              { id: 'shop', label: 'Sneakers', params: { category: 'Sneakers' } },
              { id: 'shop', label: 'New Arrivals', params: { filter: 'new' } },
              { id: 'about', label: 'About' },
              { id: 'contact', label: 'Contact' },
            ].map((link, idx) => (
              <a
                key={idx}
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigate(link.id, link.params); }}
                class={`font-['Syne'] text-xs font-bold uppercase tracking-wider transition-colors hover:text-[#C4A47C] ${currentPage === link.id ? 'text-[#C4A47C] border-b-2 border-[#C4A47C] pb-1' : 'text-[#111111]'}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <!-- Actions -->
          <div class="flex items-center gap-5">
            <!-- Search Button -->
            <button 
              onClick={() => setSearchOpen(true)}
              class="p-2 text-[#111111] hover:text-[#C4A47C] transition-transform hover:-translate-y-0.5"
              aria-label="Search"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" strokeWidth="2"></circle><line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"></line></svg>
            </button>

            <!-- Wishlist Button -->
            <button 
              onClick={() => onNavigate('account', { tab: 'wishlist' })}
              class="relative p-2 text-[#111111] hover:text-[#C4A47C] transition-transform hover:-translate-y-0.5"
              aria-label="Wishlist"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              {wishlist.length > 0 && (
                <span class="absolute top-0 right-0 bg-[#111111] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <!-- Cart Button -->
            <button 
              onClick={() => onNavigate('cart')}
              class="relative p-2 text-[#111111] hover:text-[#C4A47C] transition-transform hover:-translate-y-0.5"
              aria-label="Cart"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6" strokeWidth="2"></line><path strokeWidth="2" d="M16 10a4 4 0 0 1-8 0"></path></svg>
              {cartCount > 0 && (
                <span class="absolute top-0 right-0 bg-[#111111] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <!-- User Account / Admin Button -->
            <button 
              onClick={() => onNavigate(user ? (user.role === 'admin' ? 'admin' : 'account') : 'login')}
              class="p-2 text-[#111111] hover:text-[#C4A47C] transition-transform hover:-translate-y-0.5"
              title={user ? `Logged in as ${user.name}` : 'Login'}
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4" strokeWidth="2"></circle></svg>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div class="fixed inset-0 z-50 flex">
          <div class="fixed inset-0 bg-black/70" onClick={() => setMobileMenuOpen(false)}></div>
          <div class="relative w-80 max-w-[85%] bg-white h-full p-6 flex flex-col z-10 border-r border-[#E8E5E0]">
            <div class="flex items-center justify-between pb-4 border-b border-[#E8E5E0] mb-6">
              <span class="font-['Syne'] font-extrabold text-xl">HIDDEN_RACK<span class="w-2 h-2 bg-[#C4A47C] inline-block ml-1"></span></span>
              <button onClick={() => setMobileMenuOpen(false)} class="text-2xl font-bold">&times;</button>
            </div>
            <nav class="flex flex-col gap-4">
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); setMobileMenuOpen(false); }} class="font-['Syne'] font-bold text-sm uppercase py-2 border-b border-[#F9F8F6]">Home</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('shop'); setMobileMenuOpen(false); }} class="font-['Syne'] font-bold text-sm uppercase py-2 border-b border-[#F9F8F6]">Shop Catalog</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('shop', { category: 'Men' }); setMobileMenuOpen(false); }} class="font-['Syne'] font-bold text-sm uppercase py-2 border-b border-[#F9F8F6]">Men's Shoes</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('shop', { category: 'Women' }); setMobileMenuOpen(false); }} class="font-['Syne'] font-bold text-sm uppercase py-2 border-b border-[#F9F8F6]">Women's Shoes</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('shop', { category: 'Sneakers' }); setMobileMenuOpen(false); }} class="font-['Syne'] font-bold text-sm uppercase py-2 border-b border-[#F9F8F6]">Sneakers</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('about'); setMobileMenuOpen(false); }} class="font-['Syne'] font-bold text-sm uppercase py-2 border-b border-[#F9F8F6]">About Us</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('contact'); setMobileMenuOpen(false); }} class="font-['Syne'] font-bold text-sm uppercase py-2 border-b border-[#F9F8F6]">Contact Us</a>
            </nav>
          </div>
        </div>
      )}

      {/* Quick Search Modal */}
      {searchOpen && (
        <div class="fixed inset-0 z-50 bg-black/80 flex items-start justify-center pt-24 px-4">
          <div class="bg-white w-full max-w-2xl border border-[#111111] p-8 shadow-2xl">
            <div class="flex items-center justify-between mb-6">
              <h3 class="font-['Syne'] font-bold text-lg uppercase tracking-wider">SEARCH HIDDEN_RACK CATALOG</h3>
              <button onClick={() => setSearchOpen(false)} class="text-2xl font-bold">&times;</button>
            </div>
            <form onSubmit={handleSearchSubmit} class="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Type sneaker name, brand (e.g. Adidas, Dunk)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                class="flex-1 px-4 py-3 border border-[#111111] text-sm focus:outline-none"
                autoFocus
              />
              <button type="submit" class="btn-solid-dark">SEARCH</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
