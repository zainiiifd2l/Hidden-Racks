import React from 'react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div class="fixed bottom-6 right-6 z-50 animate-bounce">
      <div class="bg-[#121212] text-white border border-[#C4A47C] px-5 py-3.5 shadow-2xl flex items-center gap-3 text-xs font-semibold">
        <span class="text-[#C4A47C] font-bold">
          {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
        </span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
