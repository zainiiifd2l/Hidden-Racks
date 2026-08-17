import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/axiosClient';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail({ productId, onNavigate }) {
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeTab, setActiveTab] = useState("desc");

  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  useEffect(() => {
    apiRequest(`/products/${productId || 'hr-001'}`)
      .then(data => {
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      })
      .catch(() => {});

    apiRequest('/products')
      .then(all => {
        setRelated(all.filter(p => p.id !== (productId || 'hr-001')).slice(0, 4));
      })
      .catch(() => {});
  }, [productId]);

  if (!product) {
    return <div class="py-24 text-center font-bold">Loading product details...</div>;
  }

  const formattedPrice = "PKR " + Number(product.price).toLocaleString("en-PK");
  const formattedOrigPrice = product.originalPrice ? "PKR " + Number(product.originalPrice).toLocaleString("en-PK") : null;

  return (
    <div class="max-w-[1380px] mx-auto px-6 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Image Gallery */}
        <div class="flex flex-col gap-4">
          <img
            src={product.images[selectedImg] || product.images[0]}
            alt={product.name}
            class="w-full h-[520px] object-cover border border-[#E8E5E0] bg-[#F9F8F6]"
          />
          <div class="flex gap-3">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImg(idx)}
                class={`w-24 h-24 border overflow-hidden bg-[#F9F8F6] ${selectedImg === idx ? 'border-2 border-[#111111]' : 'border-[#E8E5E0]'}`}
              >
                <img src={img} alt="" class="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Meta */}
        <div>
          <span class="font-['Syne'] font-extrabold text-xs tracking-widest text-[#666] uppercase block mb-2">
            {product.brand} • {product.category}
          </span>
          <h1 class="font-['Syne'] font-extrabold text-4xl mb-4">{product.name}</h1>

          <div class="flex items-center gap-3 mb-6">
            <span class="condition-tag text-xs py-1.5 px-3">CONDITION: {product.condition}</span>
            <span class="bg-[#E8F5E9] text-[#2E7D32] font-bold text-xs px-3 py-1.5 rounded-sm">
              IN STOCK ({product.stockQty} AVAILABLE)
            </span>
          </div>

          <div class="flex items-center gap-4 py-4 border-t border-b border-[#E8E5E0] mb-6">
            <span class="font-['Syne'] font-extrabold text-3xl">{formattedPrice}</span>
            {formattedOrigPrice && (
              <span class="text-base text-[#999] line-through">{formattedOrigPrice}</span>
            )}
          </div>

          {/* Size Selector */}
          <div class="mb-8">
            <label class="font-['Syne'] font-bold text-xs uppercase block mb-3">SELECT SIZE:</label>
            <div class="flex flex-wrap gap-3">
              {product.sizes.map((sz, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSize(sz)}
                  class={`px-6 py-3 border font-['Syne'] font-bold text-xs uppercase ${selectedSize === sz ? 'bg-[#111111] text-white border-[#111111]' : 'bg-[#F9F8F6] border-[#E8E5E0]'}`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div class="flex gap-4 mb-8">
            <button
              onClick={() => addToCart(product, selectedSize)}
              class="flex-1 btn-solid-dark py-4 text-xs"
            >
              ADD TO CART
            </button>
            <button
              onClick={() => { addToCart(product, selectedSize); onNavigate('checkout'); }}
              class="flex-1 btn-solid-tan py-4 text-xs"
            >
              BUY NOW
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              class={`w-14 h-14 border border-[#E8E5E0] flex items-center justify-center ${isInWishlist(product.id) ? 'bg-[#111111] text-white' : 'bg-white'}`}
            >
              ♥
            </button>
          </div>
        </div>

      </div>

      {/* Product Tabs */}
      <div class="mt-20 border-t border-[#E8E5E0] pt-10">
        <div class="flex gap-8 border-b-2 border-[#E8E5E0] mb-6">
          {[
            { id: 'desc', label: 'DESCRIPTION' },
            { id: 'condition', label: 'CONDITION & GRADING' },
            { id: 'auth', label: 'AUTHENTICITY CHECK' },
            { id: 'shipping', label: 'PAKISTAN SHIPPING' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              class={`font-['Syne'] font-extrabold text-sm pb-3 relative ${activeTab === t.id ? 'text-[#111111] border-b-4 border-[#C4A47C]' : 'text-[#666]'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div class="text-sm text-[#666] leading-relaxed">
          {activeTab === 'desc' && <p>{product.description}</p>}
          {activeTab === 'condition' && (
            <p>Every pair is scrubbed using specialized suede/leather cleaners and disinfected with anti-bacterial sprays. Transparently scored from 8.5/10 to 9.5/10.</p>
          )}
          {activeTab === 'auth' && <p>{product.authenticity || "100% Verified Authentic."}</p>}
          {activeTab === 'shipping' && (
            <p>Standard PKR 250 flat fee across Pakistan. Free delivery on orders above PKR 15,000. 2-4 days estimated delivery.</p>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div class="mt-20">
        <h2 class="font-['Syne'] font-extrabold text-2xl uppercase mb-8">YOU MAY ALSO LIKE</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {related.map(p => (
            <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
}
