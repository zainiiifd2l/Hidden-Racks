import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/axiosClient';

export default function AccountDashboard({ onNavigate, initialTab }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab || "orders");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    apiRequest('/orders')
      .then(data => {
        setOrders(data.filter(o => o.customerEmail?.toLowerCase() === user?.email?.toLowerCase() || o.customerId === user?.id));
      })
      .catch(() => {});
  }, [user]);

  if (!user) {
    return (
      <div class="py-24 text-center">
        <p class="mb-4">Please log in to view your account dashboard.</p>
        <button onClick={() => onNavigate('login')} class="btn-solid-dark">LOGIN NOW</button>
      </div>
    );
  }

  return (
    <div>
      <div class="bg-[#F9F8F6] py-10 border-b border-[#E8E5E0]">
        <div class="max-w-[1380px] mx-auto px-6">
          <h1 class="font-['Syne'] font-extrabold text-3xl uppercase">MY ACCOUNT DASHBOARD</h1>
        </div>
      </div>

      <div class="max-w-[1380px] mx-auto px-6 py-16">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          
          {/* Sidebar */}
          <aside class="bg-white border border-[#E8E5E0] p-6 text-center">
            <div class="w-16 h-16 bg-[#111111] text-white font-['Syne'] font-bold text-xl rounded-full mx-auto flex items-center justify-center mb-3">
              {user.name.split(" ").map(n => n[0]).join("")}
            </div>
            <h3 class="font-['Syne'] font-bold text-base">{user.name}</h3>
            <span class="text-xs text-[#666] block mb-6">{user.email}</span>

            <nav class="flex flex-col gap-2 text-left font-['Syne'] font-bold text-xs">
              <button
                onClick={() => setActiveTab('orders')}
                class={`p-3 border-l-4 ${activeTab === 'orders' ? 'border-[#C4A47C] bg-[#F9F8F6] text-[#111111]' : 'border-transparent text-[#666]'}`}
              >
                ORDER HISTORY
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                class={`p-3 border-l-4 ${activeTab === 'profile' ? 'border-[#C4A47C] bg-[#F9F8F6] text-[#111111]' : 'border-transparent text-[#666]'}`}
              >
                PROFILE & ADDRESSES
              </button>
              <button
                onClick={() => { logout(); onNavigate('home'); }}
                class="p-3 text-red-600 border-l-4 border-transparent hover:bg-red-50 text-left mt-4"
              >
                LOGOUT
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div class="lg:col-span-3 bg-white border border-[#E8E5E0] p-8">
            {activeTab === 'orders' && (
              <div>
                <h2 class="font-['Syne'] font-extrabold text-lg uppercase pb-4 border-b border-[#E8E5E0] mb-6">
                  YOUR THRIFT ORDERS
                </h2>

                {orders.length === 0 ? (
                  <p class="text-xs text-[#666]">No orders placed yet.</p>
                ) : (
                  <div class="space-y-6">
                    {orders.map((o, idx) => (
                      <div key={idx} class="border border-[#E8E5E0] p-6 bg-white">
                        <div class="flex items-center justify-between mb-3 text-sm">
                          <div>
                            <strong class="font-['Syne'] font-bold">ORDER ID: {o.id}</strong>
                            <span class="text-xs text-[#666] ml-3">Date: {o.orderDate}</span>
                          </div>
                          <span class="bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold px-3 py-1 uppercase">
                            {o.status}
                          </span>
                        </div>

                        <div class="text-xs text-[#666] mb-4">
                          <strong>Items:</strong> {o.items.map(i => `${i.quantity}x ${i.name} (${i.selectedSize})`).join(", ")}
                          <br />
                          <strong>Total PKR:</strong> PKR {o.total.toLocaleString('en-PK')} | <strong>Payment:</strong> {o.paymentMethod}
                        </div>

                        {/* Order Timeline Stepper */}
                        <div class="bg-[#F9F8F6] border border-[#E8E5E0] p-4">
                          <span class="text-[10px] font-bold text-[#666] block mb-3">STATUS TRACKER:</span>
                          <div class="flex justify-between items-center text-xs font-bold">
                            {['Pending', 'Confirmed', 'Shipped', 'Delivered'].map((st, i) => (
                              <div key={i} class="flex flex-col items-center">
                                <div class={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] mb-1 ${o.status === st ? 'bg-[#111111] text-white' : 'bg-[#E8E5E0] text-[#666]'}`}>
                                  {i + 1}
                                </div>
                                <span class="text-[10px] uppercase">{st}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 class="font-['Syne'] font-extrabold text-lg uppercase pb-4 border-b border-[#E8E5E0] mb-6">
                  PROFILE DETAILS
                </h2>
                <div class="space-y-4 max-w-md text-sm">
                  <div><strong>Name:</strong> {user.name}</div>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Phone:</strong> {user.phone || '0300-1234567'}</div>
                  <div><strong>Role:</strong> {user.role.toUpperCase()}</div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
