import React from 'react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onNavigate }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const formattedPrice = "PKR " + Number(product.price).toLocaleString("en-PK");
  const formattedOrigPrice = product.originalPrice ? "PKR " + Number(product.originalPrice).toLocaleString("en-PK") : null;
  const isWishlisted = isInWishlist(product.id);

  return (
    <div class="bg-white border border-[#E8E5E0] hover:border-[#111111] transition-all duration-300 flex flex-col group hover:shadow-lg">
      <div class="relative h-80 bg-[#F9F8F6] overflow-hidden">
        {/* Badges */}
        <div class="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          <span class="condition-tag">{product.condition?.split('-')[0]}</span>
          {product.newArrival && (
            <span class="bg-[#C4A47C] text-[#111111] text-[10px] font-extrabold px-2 py-0.5 rounded-sm uppercase">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          class={`absolute top-3 right-3 z-10 w-9 h-9 border border-[#E8E5E0] flex items-center justify-center transition-colors ${isWishlisted ? 'bg-[#111111] text-white border-[#111111]' : 'bg-white text-[#111111] hover:bg-[#111111] hover:text-white'}`}
          aria-label="Wishlist"
        >
          <svg class="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        {/* Product Image */}
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('product', { id: product.id }); }}>
          <img
            src={product.images[0]}
            alt={product.name}
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </a>
      </div>

      <!-- Details -->
      <div class="p-5 flex flex-col flex-1">
        <span class="font-['Syne'] text-[11px] font-bold text-[#666666] tracking-widest uppercase mb-1">
          {product.brand}
        </span>
        
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('product', { id: product.id }); }}>
          <h3 class="font-['Syne'] font-bold text-base text-[#111111] mb-3 line-clamp-1 group-hover:text-[#C4A47C] transition-colors">
            {product.name}
          </h3>
        </a>

        <div class="flex items-center gap-3 mb-4 mt-auto">
          <span class="font-['Syne'] font-extrabold text-lg text-[#111111]">
            {formattedPrice}
          </span>
          {formattedOrigPrice && (
            <span class="text-xs text-[#999999] line-through">
              {formattedOrigPrice}
            </span>
          )}
        </div>

        <button
          onClick={() => addToCart(product, product.sizes[0] || "EU 42")}
          class="w-full py-3 bg-[#F9F8F6] text-[#111111] border border-[#E8E5E0] font-['Syne'] font-bold text-xs uppercase tracking-wider hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
}
