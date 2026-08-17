import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/axiosClient';

export default function AdminDashboard({ onNavigate }) {
  const [stats, setStats] = useState({ totalProducts: 12, totalCategories: 6, totalOrders: 2, totalCustomers: 2, totalSales: 20500 });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    apiRequest('/admin/stats').then(setStats).catch(() => {});
    apiRequest('/orders').then(setOrders).catch(() => {});
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    await apiRequest(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus })
    });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <div class="space-y-8">
      {/* Stats Cards */}
      <div class="grid grid-cols-2 md:grid-cols-5 gap-5">
        {[
          { label: 'PRODUCTS', val: stats.totalProducts },
          { label: 'CATEGORIES', val: stats.totalCategories },
          { label: 'ORDERS', val: stats.totalOrders },
          { label: 'CUSTOMERS', val: stats.totalCustomers },
          { label: 'TOTAL REVENUE', val: `PKR ${stats.totalSales.toLocaleString('en-PK')}` },
        ].map((s, idx) => (
          <div key={idx} class="bg-white border border-[#E8E5E0] p-5 shadow-sm">
            <span class="text-[10px] font-bold text-[#666] uppercase block mb-1">{s.label}</span>
            <span class="font-['Syne'] font-extrabold text-2xl">{s.val}</span>
          </div>
        ))}
      </div>

      {/* Weekly Sales Chart */}
      <div class="bg-white border border-[#E8E5E0] p-6">
        <h3 class="font-['Syne'] font-extrabold text-sm uppercase mb-4">WEEKLY REVENUE OVERVIEW (PKR)</h3>
        <div class="flex items-end gap-6 h-40 pt-6 border-b border-[#E8E5E0]">
          {[
            { day: 'MON', val: '8.5k', h: 'h-20' },
            { day: 'TUE', val: '11.5k', h: 'h-28', highlight: true },
            { day: 'WED', val: '14.5k', h: 'h-32' },
            { day: 'THU', val: '6.8k', h: 'h-16' },
            { day: 'FRI', val: '18.5k', h: 'h-36', highlight: true },
            { day: 'SAT', val: '12.8k', h: 'h-28' },
            { day: 'SUN', val: '9.8k', h: 'h-24' },
          ].map((bar, i) => (
            <div key={i} class="flex-1 flex flex-col items-center gap-2">
              <span class="text-[10px] font-bold">{bar.val}</span>
              <div class={`w-full ${bar.h} ${bar.highlight ? 'bg-[#C4A47C]' : 'bg-[#111111]'}`}></div>
              <span class="text-[10px] text-[#666]">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div class="bg-white border border-[#E8E5E0] p-6">
        <h3 class="font-['Syne'] font-extrabold text-sm uppercase mb-4">RECENT ORDERS</h3>
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#F9F8F6] font-['Syne'] uppercase border-b border-[#E8E5E0]">
              <th class="p-3">ORDER ID</th>
              <th class="p-3">CUSTOMER</th>
              <th class="p-3">TOTAL</th>
              <th class="p-3">STATUS</th>
              <th class="p-3">ACTION</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E8E5E0]">
            {orders.slice(0, 5).map((o, idx) => (
              <tr key={idx}>
                <td class="p-3 font-bold">{o.id}</td>
                <td class="p-3">{o.customerName}</td>
                <td class="p-3 font-bold">PKR {o.total.toLocaleString('en-PK')}</td>
                <td class="p-3">
                  <span class="bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 font-bold uppercase text-[10px]">
                    {o.status}
                  </span>
                </td>
                <td class="p-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    class="border border-[#E8E5E0] p-1 text-[10px] font-bold bg-[#F9F8F6]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
