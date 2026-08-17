import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/axiosClient';

export default function AdminProducts({ onNavigate }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    apiRequest('/products').then(setProducts).catch(() => {});
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product listing?")) {
      await apiRequest(`/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div class="bg-white border border-[#E8E5E0] p-6 space-y-6">
      <div class="flex justify-between items-center pb-4 border-b border-[#E8E5E0]">
        <h2 class="font-['Syne'] font-extrabold text-lg uppercase">THRIFT FOOTWEAR CATALOG</h2>
        <button onClick={() => onNavigate('admin-add-product')} class="btn-solid-dark py-2 px-4 text-xs">
          + ADD NEW PRODUCT
        </button>
      </div>

      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="bg-[#F9F8F6] font-['Syne'] uppercase border-b border-[#E8E5E0]">
            <th class="p-3">IMAGE</th>
            <th class="p-3">PRODUCT</th>
            <th class="p-3">BRAND</th>
            <th class="p-3">PRICE</th>
            <th class="p-3">CONDITION</th>
            <th class="p-3">ACTION</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E8E5E0]">
          {products.map(p => (
            <tr key={p.id}>
              <td class="p-3">
                <img src={p.images[0]} alt="" class="w-12 h-12 object-cover border border-[#E8E5E0]" />
              </td>
              <td class="p-3">
                <strong class="block">{p.name}</strong>
                <span class="text-[10px] text-[#666]">SKU: {p.sku}</span>
              </td>
              <td class="p-3 font-bold">{p.brand}</td>
              <td class="p-3 font-bold">PKR {p.price.toLocaleString('en-PK')}</td>
              <td class="p-3">
                <span class="condition-tag">{p.condition?.split('-')[0]}</span>
              </td>
              <td class="p-3">
                <button onClick={() => handleDelete(p.id)} class="bg-red-600 text-white px-3 py-1 font-bold text-[10px]">
                  DELETE
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
