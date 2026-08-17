import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { apiRequest } from '../api/axiosClient';

export default function Home({ onNavigate }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    apiRequest('/products')
      .then(data => setProducts(data.slice(0, 8)))
      .catch(() => {});

    apiRequest('/categories')
      .then(data => setCategories(data))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section class="bg-[#121212] text-white py-24 border-b border-[#2A2A2A]">
        <div class="max-w-[1380px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span class="inline-block bg-[#C4A47C] text-[#111111] font-['Syne'] font-extrabold text-xs tracking-widest px-3.5 py-1.5 mb-6 uppercase">
              AUTHENTIC THRIFT FOOTWEAR
            </span>
            <h1 class="font-['Syne'] font-extrabold text-5xl md:text-6xl leading-tight mb-6 uppercase">
              Rare Finds.<br />Real Style.
            </h1>
            <p class="text-[#CCCCCC] text-lg mb-8 leading-relaxed max-w-lg">
              Premium thrifted shoes, carefully selected for people who don't follow the ordinary. Hand-picked authentic footwear shipped straight to your doorstep across Pakistan.
            </p>
            <div class="flex flex-wrap gap-4">
              <button onClick={() => onNavigate('shop')} class="btn-solid-tan">SHOP COLLECTION</button>
              <button onClick={() => onNavigate('shop', { filter: 'new' })} class="btn-solid-outline text-white border-white hover:bg-white hover:text-[#111111]">EXPLORE NEW ARRIVALS</button>
            </div>
          </div>

          <div class="relative border border-[#2A2A2A] bg-[#1C1C1C] p-3">
            <img 
              src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80" 
              alt="Hidden_Rack Thrift Sneakers"
              class="w-full h-[460px] object-cover" 
            />
            <div class="absolute bottom-6 -left-4 bg-white text-[#111111] p-4 border border-[#111111] shadow-2xl">
              <span class="text-[10px] font-bold text-[#666] uppercase block">CONDITION GUARANTEED</span>
              <span class="font-['Syne'] font-extrabold text-lg">9.0/10 + NEAR MINT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section class="py-20 max-w-[1380px] mx-auto px-6">
        <div class="flex items-end justify-between mb-12">
          <div>
            <h2 class="font-['Syne'] font-extrabold text-3xl uppercase">FEATURED CATEGORIES</h2>
            <p class="text-sm text-[#666] mt-2">Browse curated pre-loved sneakers by category</p>
          </div>
          <button onClick={() => onNavigate('shop')} class="btn-solid-outline">VIEW ALL</button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((c, idx) => (
            <a
              key={idx}
              href="#"
              onClick={(e) => { e.preventDefault(); onNavigate('shop', { category: c.name }); }}
              class="group bg-[#F9F8F6] border border-[#E8E5E0] overflow-hidden block"
            >
              <div class="h-48 overflow-hidden">
                <img src={c.image} alt={c.name} class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" />
              </div>
              <div class="p-4 text-center bg-white border-t border-[#E8E5E0]">
                <h3 class="font-['Syne'] font-bold text-xs uppercase">{c.name}</h3>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* New Arrivals Grid */}
      <section class="py-20 bg-[#F9F8F6] border-t border-b border-[#E8E5E0]">
        <div class="max-w-[1380px] mx-auto px-6">
          <div class="flex items-end justify-between mb-12">
            <div>
              <h2 class="font-['Syne'] font-extrabold text-3xl uppercase">NEW ARRIVALS</h2>
              <p class="text-sm text-[#666] mt-2">Freshly sanitized & authenticated thrift drops in PKR</p>
            </div>
            <button onClick={() => onNavigate('shop', { filter: 'new' })} class="btn-solid-outline">EXPLORE ALL</button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {products.map(p => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Hidden_Rack */}
      <section class="py-20 bg-[#F9F8F6] border-b border-[#E8E5E0]">
        <div class="max-w-[1380px] mx-auto px-6 text-center">
          <h2 class="font-['Syne'] font-extrabold text-3xl uppercase mb-3">NOT EVERY GREAT PAIR IS BRAND NEW.</h2>
          <p class="text-sm text-[#666] mb-14">Why thousands of sneakerheads across Pakistan trust Hidden_Rack</p>

          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { title: "CAREFULLY SELECTED", desc: "Personally hand-picked rare pairs from international thrift lots." },
              { title: "QUALITY CHECKED", desc: "Deep cleaned, disinfected, sole-checked, and graded transparently." },
              { title: "AUTHENTIC FINDS", desc: "100% genuine vintage & retro shoes. Zero fakes allowed." },
              { title: "AFFORDABLE PRICES", desc: "Get grail status sneakers at 50% to 70% off retail PKR price." },
              { title: "PAKISTAN DELIVERY", desc: "Fast dispatch to Karachi, Lahore, Islamabad, & nationwide." },
            ].map((item, idx) => (
              <div key={idx} class="bg-white p-8 border border-[#E8E5E0] text-center">
                <div class="w-12 h-12 bg-[#EFE9E1] border border-[#C4A47C] mx-auto mb-5 flex items-center justify-center font-bold text-lg">
                  ✓
                </div>
                <h3 class="font-['Syne'] font-extrabold text-xs uppercase mb-2">{item.title}</h3>
                <p class="text-xs text-[#666] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Drop Banner */}
      <section class="bg-[#121212] text-white py-24 border-b border-[#2A2A2A]">
        <div class="max-w-[1380px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span class="text-[#C4A47C] font-['Syne'] font-bold text-xs tracking-widest uppercase block mb-4">
              EXCLUSIVE LIMITED CURATION
            </span>
            <h2 class="font-['Syne'] font-extrabold text-4xl lg:text-5xl uppercase mb-6">THE HIDDEN DROP</h2>
            <p class="text-[#BBB] text-base mb-8">
              Limited pairs. Unique finds. Once they're gone, they're gone. Every pair is 1-of-1 in its specific size and condition.
            </p>
            <button onClick={() => onNavigate('shop', { filter: 'drop' })} class="btn-solid-tan">VIEW THE DROP</button>
          </div>

          <div class="grid grid-cols-2 gap-5">
            <div class="h-64 border border-[#2A2A2A] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80" alt="Nike Dunk" class="w-full h-full object-cover" />
            </div>
            <div class="h-64 border border-[#2A2A2A] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80" alt="Adidas Campus" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
