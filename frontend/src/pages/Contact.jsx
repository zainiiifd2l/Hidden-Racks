import React from 'react';
import { useCart } from '../context/CartContext';

export default function Contact() {
  const { showToast } = useCart();

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("Message sent! Our team will contact you on WhatsApp/Email shortly.", "success");
  };

  return (
    <div>
      <div class="bg-[#F9F8F6] py-12 border-b border-[#E8E5E0]">
        <div class="max-w-[1380px] mx-auto px-6">
          <h1 class="font-['Syne'] font-extrabold text-3xl uppercase">CONTACT US & SUPPORT</h1>
        </div>
      </div>

      <div class="max-w-[1380px] mx-auto px-6 py-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div class="bg-white border border-[#E8E5E0] p-8">
            <h2 class="font-['Syne'] font-extrabold text-xl uppercase mb-4">SEND A MESSAGE</h2>
            <form onSubmit={handleSubmit} class="space-y-4">
              <div>
                <label class="text-xs font-bold uppercase block mb-1">FULL NAME *</label>
                <input type="text" required class="w-full px-4 py-3 border border-[#E8E5E0] text-xs" placeholder="Zain Malik" />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-xs font-bold uppercase block mb-1">EMAIL ADDRESS *</label>
                  <input type="email" required class="w-full px-4 py-3 border border-[#E8E5E0] text-xs" placeholder="zain@example.com" />
                </div>
                <div>
                  <label class="text-xs font-bold uppercase block mb-1">PHONE (WHATSAPP) *</label>
                  <input type="tel" required class="w-full px-4 py-3 border border-[#E8E5E0] text-xs" placeholder="0300-1234567" />
                </div>
              </div>
              <div>
                <label class="text-xs font-bold uppercase block mb-1">INQUIRY / MESSAGE *</label>
                <textarea rows="4" required class="w-full px-4 py-3 border border-[#E8E5E0] text-xs" placeholder="Ask about shoe sizing, condition, or orders..."></textarea>
              </div>
              <button type="submit" class="w-full btn-solid-dark py-4 text-xs">SEND MESSAGE</button>
            </form>
          </div>

          <div class="bg-[#F9F8F6] border border-[#E8E5E0] p-8 flex flex-col justify-center space-y-6">
            <h3 class="font-['Syne'] font-extrabold text-lg uppercase">DIRECT CONTACT</h3>
            <div>
              <span class="text-xs font-bold text-[#666] block">WHATSAPP SUPPORT:</span>
              <a href="https://wa.me/923001234567" target="_blank" class="font-['Syne'] font-extrabold text-xl underline">+92 300 1234567</a>
            </div>
            <div>
              <span class="text-xs font-bold text-[#666] block">EMAIL SUPPORT:</span>
              <span class="font-bold text-sm">support@hiddenrack.pk</span>
            </div>
            <div>
              <span class="text-xs font-bold text-[#666] block">INSTAGRAM:</span>
              <span class="font-bold text-sm">@HiddenRack.PK</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
