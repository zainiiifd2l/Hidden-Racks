import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer class="bg-[#121212] text-white pt-20 pb-8 border-t border-[#2A2A2A]">
      <div class="max-w-[1380px] mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          <div class="lg:col-span-1">
            <span class="font-['Syne'] font-extrabold text-xl tracking-wider text-white flex items-center gap-1.5 mb-4">
              HIDDEN_RACK<span class="w-2 h-2 bg-[#C4A47C] inline-block"></span>
            </span>
            <p class="text-xs text-[#AAAAAA] leading-relaxed">
              Carefully selected high-quality thrifted and pre-loved shoes in Pakistan. Authentic finds for people who don't follow the ordinary.
            </p>
          </div>

          <div>
            <h4 class="font-['Syne'] font-bold text-xs uppercase tracking-widest mb-6 text-white">SHOP</h4>
            <ul class="flex flex-col gap-3 text-xs text-[#BBB]">
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('shop', { category: 'Sneakers' }); }} class="hover:text-[#C4A47C]">Sneakers</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('shop', { category: 'Men' }); }} class="hover:text-[#C4A47C]">Men</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('shop', { category: 'Women' }); }} class="hover:text-[#C4A47C]">Women</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('shop', { filter: 'new' }); }} class="hover:text-[#C4A47C]">New Arrivals</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('shop'); }} class="hover:text-[#C4A47C]">All Products</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-['Syne'] font-bold text-xs uppercase tracking-widest mb-6 text-white">SUPPORT</h4>
            <ul class="flex flex-col gap-3 text-xs text-[#BBB]">
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} class="hover:text-[#C4A47C]">Contact Us</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} class="hover:text-[#C4A47C]">Shipping & Delivery</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} class="hover:text-[#C4A47C]">Returns & Exchange</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} class="hover:text-[#C4A47C]">Size Guide</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-['Syne'] font-bold text-xs uppercase tracking-widest mb-6 text-white">ACCOUNT</h4>
            <ul class="flex flex-col gap-3 text-xs text-[#BBB]">
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }} class="hover:text-[#C4A47C]">Login</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('register'); }} class="hover:text-[#C4A47C]">Register</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('account'); }} class="hover:text-[#C4A47C]">My Account</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('account'); }} class="hover:text-[#C4A47C]">Order History</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-['Syne'] font-bold text-xs uppercase tracking-widest mb-6 text-white">CONNECT</h4>
            <ul class="flex flex-col gap-3 text-xs text-[#BBB]">
              <li><a href="https://instagram.com" target="_blank" class="hover:text-[#C4A47C]">Instagram @HiddenRack.PK</a></li>
              <li><a href="https://wa.me/923001234567" target="_blank" class="hover:text-[#C4A47C]">WhatsApp +92 300 1234567</a></li>
            </ul>
          </div>
        </div>

        <div class="pt-8 border-t border-[#2A2A2A] flex flex-col md:flex-row items-center justify-between text-[11px] text-[#888] gap-4">
          <p>&copy; 2026 Hidden_Rack Pakistan. All Rights Reserved. React + FastAPI Edition.</p>
          <p>Delivery Across Karachi, Lahore, Islamabad & Nationwide Pakistan.</p>
        </div>
      </div>
    </footer>
  );
}
