import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/axiosClient';

export default function Checkout({ onNavigate }) {
  const { cart, cartSubtotal, deliveryFee, clearCart } = useCart();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.street || "");
  const [city, setCity] = useState(user?.city || "Islamabad");
  const [province, setProvince] = useState(user?.province || "Punjab");

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [mobileNumber, setMobileNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const [createdOrder, setCreatedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const total = cartSubtotal + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);

    try {
      // Process Mobile Wallet / Stripe if selected
      if (paymentMethod === "JazzCash" || paymentMethod === "Easypaisa") {
        await apiRequest("/payments/mobile-wallet", {
          method: "POST",
          body: JSON.stringify({ provider: paymentMethod, accountNumber: mobileNumber, amount: total, orderId: "PENDING" })
        });
      } else if (paymentMethod === "Credit Card") {
        await apiRequest("/payments/stripe", {
          method: "POST",
          body: JSON.stringify({ cardNumber, expMonth: "12", expYear: "2028", cvc: "123", amount: total, orderId: "PENDING" })
        });
      }

      // Create Order in SQLAlchemy DB
      const orderPayload = {
        customerId: user?.id || "guest",
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: `${address}, ${city}, ${province}`,
        items: cart,
        subtotal: cartSubtotal,
        deliveryFee,
        total,
        paymentMethod
      };

      const res = await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify(orderPayload)
      });

      if (res.success) {
        setCreatedOrder(res.order);
        clearCart();
      }
    } catch (err) {
      alert("Checkout error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div class="bg-[#F9F8F6] py-10 border-b border-[#E8E5E0]">
        <div class="max-w-[1380px] mx-auto px-6">
          <h1 class="font-['Syne'] font-extrabold text-3xl uppercase">CHECKOUT</h1>
        </div>
      </div>

      <div class="max-w-[1380px] mx-auto px-6 py-16">
        <form onSubmit={handlePlaceOrder} class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Form Left Column */}
          <div class="lg:col-span-2 flex flex-col gap-8">
            
            {/* 1. Shipping Address */}
            <div class="bg-white border border-[#E8E5E0] p-8">
              <h2 class="font-['Syne'] font-extrabold text-lg uppercase pb-3 border-b border-[#E8E5E0] mb-6">
                1. SHIPPING ADDRESS (PAKISTAN)
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="text-xs font-bold uppercase block mb-1.5">FULL NAME *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required class="w-full px-4 py-3 border border-[#E8E5E0] text-sm" placeholder="Zain Malik" />
                </div>
                <div>
                  <label class="text-xs font-bold uppercase block mb-1.5">PHONE NUMBER (WHATSAPP) *</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required class="w-full px-4 py-3 border border-[#E8E5E0] text-sm" placeholder="0300-1234567" />
                </div>
              </div>

              <div class="mb-4">
                <label class="text-xs font-bold uppercase block mb-1.5">EMAIL ADDRESS *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required class="w-full px-4 py-3 border border-[#E8E5E0] text-sm" placeholder="zain@example.com" />
              </div>

              <div class="mb-4">
                <label class="text-xs font-bold uppercase block mb-1.5">STREET ADDRESS / HOUSE # / SECTOR *</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required class="w-full px-4 py-3 border border-[#E8E5E0] text-sm" placeholder="House 45, Street 12, DHA Phase 5" />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-xs font-bold uppercase block mb-1.5">CITY *</label>
                  <select value={city} onChange={(e) => setCity(e.target.value)} class="w-full px-4 py-3 border border-[#E8E5E0] text-sm bg-white">
                    <option value="Islamabad">Islamabad</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Quetta">Quetta</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs font-bold uppercase block mb-1.5">PROVINCE *</label>
                  <select value={province} onChange={(e) => setProvince(e.target.value)} class="w-full px-4 py-3 border border-[#E8E5E0] text-sm bg-white">
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="KPK">KPK</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="Islamabad">Islamabad ICT</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Payment Options */}
            <div class="bg-white border border-[#E8E5E0] p-8">
              <h2 class="font-['Syne'] font-extrabold text-lg uppercase pb-3 border-b border-[#E8E5E0] mb-6">
                2. PAYMENT METHOD
              </h2>

              <div class="flex flex-col gap-4">
                {[
                  { id: 'Cash on Delivery', title: 'CASH ON DELIVERY (COD)', desc: 'Pay cash to the courier rider upon delivery anywhere in Pakistan.' },
                  { id: 'JazzCash', title: 'JAZZCASH MOBILE WALLET ⭐', desc: 'Instant mobile account authorization via JazzCash.' },
                  { id: 'Easypaisa', title: 'EASYPAISA WALLET ⭐', desc: 'Instant mobile account authorization via Easypaisa.' },
                  { id: 'Bank Transfer', title: 'DIRECT BANK TRANSFER', desc: 'Transfer funds directly to Bank Al Habib (IBAN: PK92 HABB 0012 3456 7890 1234).' },
                  { id: 'Credit Card', title: 'CREDIT / DEBIT CARD (STRIPE)', desc: 'Visa, MasterCard, or UnionPay standard integration.' }
                ].map(p => (
                  <label key={p.id} class={`p-4 border cursor-pointer flex items-start gap-3 transition-colors ${paymentMethod === p.id ? 'border-[#111111] bg-[#F9F8F6]' : 'border-[#E8E5E0]'}`}>
                    <input
                      type="radio"
                      name="pm"
                      checked={paymentMethod === p.id}
                      onChange={() => setPaymentMethod(p.id)}
                      class="mt-1 accent-[#111111]"
                    />
                    <div>
                      <strong class="font-['Syne'] text-sm block">{p.title}</strong>
                      <span class="text-xs text-[#666]">{p.desc}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Extra Payment Inputs */}
              {(paymentMethod === 'JazzCash' || paymentMethod === 'Easypaisa') && (
                <div class="mt-4 p-4 bg-[#F9F8F6] border border-[#E8E5E0]">
                  <label class="text-xs font-bold uppercase block mb-1">{paymentMethod} ACCOUNT NUMBER *</label>
                  <input
                    type="tel"
                    placeholder="0300-1234567"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                    class="w-full px-3 py-2 border border-[#E8E5E0] text-xs"
                  />
                </div>
              )}

              {paymentMethod === 'Credit Card' && (
                <div class="mt-4 p-4 bg-[#F9F8F6] border border-[#E8E5E0]">
                  <label class="text-xs font-bold uppercase block mb-1">CARD NUMBER *</label>
                  <input
                    type="text"
                    placeholder="4000 1234 5678 9010"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    class="w-full px-3 py-2 border border-[#E8E5E0] text-xs"
                  />
                </div>
              )}
            </div>

          </div>

          {/* Order Summary Sidebar */}
          <div class="bg-white border border-[#E8E5E0] p-8 sticky top-24">
            <h2 class="font-['Syne'] font-extrabold text-base uppercase pb-3 border-b border-[#E8E5E0] mb-6">
              YOUR ORDER SUMMARY
            </h2>

            <div class="flex justify-between text-sm py-2">
              <span>Subtotal</span>
              <span class="font-bold">PKR {cartSubtotal.toLocaleString('en-PK')}</span>
            </div>
            <div class="flex justify-between text-sm py-2">
              <span>Delivery Fee</span>
              <span class="font-bold">{deliveryFee === 0 ? 'FREE' : `PKR ${deliveryFee}`}</span>
            </div>
            <div class="flex justify-between font-['Syne'] font-extrabold text-xl py-4 border-t-2 border-[#111111] my-4">
              <span>TOTAL</span>
              <span>PKR {total.toLocaleString('en-PK')}</span>
            </div>

            <button type="submit" disabled={loading} class="w-full btn-solid-dark py-4 text-xs">
              {loading ? 'PROCESSING ORDER...' : 'PLACE ORDER NOW →'}
            </button>
          </div>

        </form>
      </div>

      {/* Confirmation Modal */}
      {createdOrder && (
        <div class="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div class="bg-white w-full max-w-lg border-2 border-[#C4A47C] p-8 text-center">
            <div class="w-16 h-16 bg-[#EFE9E1] border-2 border-[#C4A47C] mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
              ✓
            </div>
            <h2 class="font-['Syne'] font-extrabold text-2xl mb-2">ORDER CONFIRMED!</h2>
            <p class="text-xs text-[#666] mb-6">Thank you for shopping with Hidden_Rack. Your order has been recorded in our database!</p>

            <div class="bg-[#F9F8F6] border border-[#E8E5E0] p-4 text-left text-xs mb-6 space-y-1">
              <div><strong>ORDER ID:</strong> {createdOrder.id}</div>
              <div><strong>DELIVERY TO:</strong> {createdOrder.shippingAddress}</div>
              <div><strong>PAYMENT:</strong> {createdOrder.paymentMethod}</div>
              <div><strong>TOTAL:</strong> PKR {createdOrder.total.toLocaleString('en-PK')}</div>
            </div>

            <div class="flex gap-3 justify-center">
              <button onClick={() => onNavigate('account')} class="btn-solid-dark text-xs">TRACK IN DASHBOARD</button>
              <button onClick={() => onNavigate('home')} class="btn-solid-outline text-xs">BACK TO HOME</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
