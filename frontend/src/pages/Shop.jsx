import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { apiRequest } from '../api/axiosClient';

export default function Shop({ onNavigate, initialCategory, initialSearch, initialFilter }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(initialSearch || "");
  const [selectedCats, setSelectedCats] = useState(initialCategory ? [initialCategory] : []);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(25000);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    setLoading(true);
    apiRequest('/products')
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleCategory = (cat) => {
    setSelectedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };

  const toggleSize = (sz) => {
    setSelectedSizes(prev => prev.includes(sz) ? prev.filter(s => s !== sz) : [...prev, sz]);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCats([]);
    setSelectedBrands([]);
    setMaxPrice(25000);
    setSelectedSizes([]);
    setSortOption("newest");
  };

  // Filter Logic
  let filtered = products.filter(p => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.brand.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCats.length > 0 && !selectedCats.includes(p.category) && !selectedCats.includes(p.gender)) {
      return false;
    }
    if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
      return false;
    }
    if (p.price > maxPrice) {
      return false;
    }
    if (selectedSizes.length > 0 && !p.sizes.some(s => selectedSizes.includes(s))) {
      return false;
    }
    return true;
  });

  // Sort Logic
  if (sortOption === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  const allBrands = [...new Set(products.map(p => p.brand))];
  const allCategories = [...new Set(products.map(p => p.category))];

  return (
    <div>
      <div class="bg-[#F9F8F6] py-12 border-b border-[#E8E5E0]">
        <div class="max-w-[1380px] mx-auto px-6">
          <h1 class="font-['Syne'] font-extrabold text-4xl uppercase">
            {initialFilter === 'new' ? 'NEW ARRIVALS DROP' : 'ALL THRIFTED PAIRS'}
          </h1>
          <p class="text-sm text-[#666] mt-2">Authenticated 1-of-1 pre-loved shoes ready for Pakistan dispatch</p>
        </div>
      </div>

      <div class="max-w-[1380px] mx-auto px-6 py-16">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          
          {/* Filters Sidebar */}
          <aside class="bg-white border border-[#E8E5E0] p-6 sticky top-24">
            <div class="flex items-center justify-between pb-4 border-b border-[#E8E5E0] mb-6">
              <h3 class="font-['Syne'] font-extrabold text-sm uppercase tracking-wider">FILTERS</h3>
              <button onClick={resetFilters} class="text-xs font-bold underline">RESET ALL</button>
            </div>

            {/* Keyword Search */}
            <div class="mb-6 pb-6 border-b border-[#E8E5E0]">
              <h4 class="font-['Syne'] font-bold text-xs uppercase mb-3">SEARCH KEYWORD</h4>
              <input
                type="text"
                placeholder="Name or Brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                class="w-full px-3 py-2 border border-[#E8E5E0] text-xs"
              />
            </div>

            {/* Categories */}
            <div class="mb-6 pb-6 border-b border-[#E8E5E0]">
              <h4 class="font-['Syne'] font-bold text-xs uppercase mb-3">CATEGORIES</h4>
              <div class="flex flex-col gap-2.5 text-xs">
                {allCategories.map((c, idx) => (
                  <label key={idx} class="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCats.includes(c)}
                      onChange={() => toggleCategory(c)}
                      class="accent-[#111111] w-4 h-4"
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div class="mb-6 pb-6 border-b border-[#E8E5E0]">
              <h4 class="font-['Syne'] font-bold text-xs uppercase mb-3">BRANDS</h4>
              <div class="flex flex-col gap-2.5 text-xs">
                {allBrands.map((b, idx) => (
                  <label key={idx} class="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b)}
                      onChange={() => toggleBrand(b)}
                      class="accent-[#111111] w-4 h-4"
                    />
                    <span>{b}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div class="mb-6 pb-6 border-b border-[#E8E5E0]">
              <h4 class="font-['Syne'] font-bold text-xs uppercase mb-3">MAX PRICE (PKR)</h4>
              <input
                type="range"
                min="5000"
                max="25000"
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                class="w-full accent-[#111111]"
              />
              <div class="flex justify-between text-xs font-bold mt-2">
                <span>PKR 5,000</span>
                <span>PKR {maxPrice.toLocaleString('en-PK')}</span>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h4 class="font-['Syne'] font-bold text-xs uppercase mb-3">AVAILABLE SIZES</h4>
              <div class="grid grid-cols-3 gap-2">
                {['EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'].map((sz, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleSize(sz)}
                    class={`py-2 text-xs font-bold border transition-colors ${selectedSizes.includes(sz) ? 'bg-[#111111] text-white border-[#111111]' : 'bg-[#F9F8F6] border-[#E8E5E0]'}`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div class="lg:col-span-3">
            <div class="flex flex-wrap items-center justify-between pb-4 border-b border-[#E8E5E0] mb-8 gap-4">
              <span class="text-xs font-bold uppercase">SHOWING {filtered.length} PAIRS</span>
              <div class="flex items-center gap-3 text-xs font-bold">
                <label>SORT BY:</label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  class="px-3 py-2 border border-[#E8E5E0] bg-white text-xs font-semibold"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div class="py-20 text-center">
                <h3 class="font-['Syne'] font-bold text-xl mb-2">No Thrift Pairs Found</h3>
                <p class="text-xs text-[#666] mb-6">Try resetting your brand, category, or price range filters.</p>
                <button onClick={resetFilters} class="btn-solid-dark">RESET FILTERS</button>
              </div>
            ) : (
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
