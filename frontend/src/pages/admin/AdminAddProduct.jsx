import React, { useState } from 'react';
import { apiRequest } from '../../api/axiosClient';
import { useCart } from '../../context/CartContext';

export default function AdminAddProduct({ onNavigate }) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("Adidas");
  const [category, setCategory] = useState("Sneakers");
  const [price, setPrice] = useState("");
  const [origPrice, setOrigPrice] = useState("");
  const [condition, setCondition] = useState("9.0/10 - Excellent Condition");
  const [rating, setRating] = useState(9.0);
  const [sizes, setSizes] = useState("EU 41, EU 42, EU 43");
  const [stockQty, setStockQty] = useState(1);
  const [img1, setImg1] = useState("https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80");
  const [desc, setDesc] = useState("Authentic pre-loved sneaker pair in mint condition.");

  const { showToast } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name, brand, category,
        price: Number(price),
        originalPrice: origPrice ? Number(origPrice) : null,
        condition,
        conditionRating: Number(rating),
        sizes: sizes.split(",").map(s => s.trim()),
        stockQty: Number(stockQty),
        featured: true,
        newArrival: true,
        description: desc,
        authenticity: "100% Verified Authentic Import.",
        images: [img1].filter(Boolean)
      };

      await apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      showToast("Product created successfully in SQLite database!", "success");
      onNavigate('admin-products');
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div class="bg-white border border-[#E8E5E0] p-8 max-w-2xl">
      <h2 class="font-['Syne'] font-extrabold text-xl uppercase mb-6 pb-3 border-b border-[#E8E5E0]">
        ADD NEW THRIFT PRODUCT
      </h2>

      <form onSubmit={handleSubmit} class="space-y-4 text-xs">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="font-bold uppercase block mb-1">NAME *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required class="w-full px-3 py-2 border border-[#E8E5E0]" placeholder="Nike Dunk Panda" />
          </div>
          <div>
            <label class="font-bold uppercase block mb-1">BRAND *</label>
            <select value={brand} onChange={e => setBrand(e.target.value)} class="w-full px-3 py-2 border border-[#E8E5E0] bg-white">
              <option value="Adidas">Adidas</option>
              <option value="Nike">Nike</option>
              <option value="Jordan">Jordan</option>
              <option value="New Balance">New Balance</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="font-bold uppercase block mb-1">CATEGORY *</label>
            <select value={category} onChange={e => setCategory(e.target.value)} class="w-full px-3 py-2 border border-[#E8E5E0] bg-white">
              <option value="Sneakers">Sneakers</option>
              <option value="Running Shoes">Running Shoes</option>
              <option value="Casual Shoes">Casual Shoes</option>
            </select>
          </div>
          <div>
            <label class="font-bold uppercase block mb-1">PRICE IN PKR *</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} required class="w-full px-3 py-2 border border-[#E8E5E0]" placeholder="8500" />
          </div>
        </div>

        <div>
          <label class="font-bold uppercase block mb-1">IMAGE URL *</label>
          <input type="url" value={img1} onChange={e => setImg1(e.target.value)} required class="w-full px-3 py-2 border border-[#E8E5E0]" />
        </div>

        <div>
          <label class="font-bold uppercase block mb-1">DESCRIPTION *</label>
          <textarea rows="3" value={desc} onChange={e => setDesc(e.target.value)} required class="w-full px-3 py-2 border border-[#E8E5E0]"></textarea>
        </div>

        <div class="flex gap-3 pt-4">
          <button type="submit" class="btn-solid-dark py-3 text-xs">SAVE PRODUCT TO DB</button>
          <button type="button" onClick={() => onNavigate('admin-products')} class="btn-solid-outline py-3 text-xs">CANCEL</button>
        </div>
      </form>
    </div>
  );
}
