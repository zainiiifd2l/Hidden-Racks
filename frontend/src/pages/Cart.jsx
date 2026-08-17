import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Cart({ onNavigate }) {
  const { cart, updateQuantity, removeFromCart, clearCart, cartSubtotal, deliveryFee, showToast } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "HIDDEN10") {
      setDiscount(Math.round(cartSubtotal * 0.10));
      showToast("Promo Code 'HIDDEN10' applied! 10% OFF", "success");
    } else {
      showToast("Invalid Promo Code. Try 'HIDDEN10'", "error");
    }
  };

  const finalTotal = cartSubtotal + deliveryFee - discount;

  if (cart.length === 0) {
    return (
      <div class="max-w-[1380px] mx-auto px-6 py-24 text-center">
        <h2 class="font-['Syne'] font-extrabold text-3xl mb-4 uppercase">YOUR CART IS CURRENTLY EMPTY</h2>
        <p class="text-sm text-[#666] mb-8">Explore our rare thrift collection and claim your pair before someone else does!</p>
        <button onClick={() => onNavigate('shop')} class="btn-solid-dark">EXPLORE THE DROP</button>
      </div>
    );
  }

  return (
    <div>
      <div class="bg-[#F9F8F6] py-10 border-b border-[#E8E5E0]">
        <div class="max-w-[1380px] mx-auto px-6">
          <h1 class="font-['Syne'] font-extrabold text-3xl uppercase">YOUR SHOPPING CART</h1>
        </div>
      </div>

      <div class="max-w-[1380px] mx-auto px-6 py-16">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Cart Items Table */}
          <div class="lg:col-span-2">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#F9F8F6] border-b-2 border-[#E8E5E0] font-['Syne'] text-[11px] uppercase tracking-wider text-[#666]">
                  <th class="p-4">PRODUCT</th>
                  <th class="p-4">SIZE</th>
                  <th class="p-4">PRICE</th>
                  <th class="p-4">QTY</th>
                  <th class="p-4">TOTAL</th>
                  <th class="p-4"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#E8E5E0]">
                {cart.map((item, idx) => (
                  <tr key={idx} class="text-sm">
                    <td class="p-4 flex items-center gap-4">
                      <img src={item.image} alt={item.name} class="w-16 h-16 object-cover border border-[#E8E5E0]" />
                      <div>
                        <span class="text-[11px] font-bold text-[#666] block uppercase">{item.brand}</span>
                        <h4 class="font-bold text-sm">{item.name}</h4>
                      </div>
                    </td>
                    <td class="p-4 font-bold">{item.selectedSize}</td>
                    <td class="p-4 font-bold">PKR {item.price.toLocaleString('en-PK')}</td>
                    <td class="p-4">
                      <div class="inline-flex items-center border border-[#E8E5E0] bg-[#F9F8F6]">
                        <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)} class="w-8 h-8 font-bold">-</button>
                        <span class="w-10 text-center font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)} class="w-8 h-8 font-bold">+</button>
                      </div>
                    </td>
                    <td class="p-4 font-bold">PKR {(item.price * item.quantity).toLocaleString('en-PK')}</td>
                    <td class="p-4">
                      <button onClick={() => removeFromCart(item.id, item.selectedSize)} class="text-red-600 font-bold text-lg">&times;</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div class="mt-6 flex justify-between">
              <button onClick={() => onNavigate('shop')} class="btn-solid-outline text-xs">← CONTINUE SHOPPING</button>
              <button onClick={clearCart} class="text-xs font-bold underline">CLEAR CART</button>
            </div>
          </div>

          {/* Order Summary Box */}
          <div class="bg-white border border-[#E8E5E0] p-8">
            <h3 class="font-['Syne'] font-extrabold text-base uppercase pb-4 border-b border-[#E8E5E0] mb-6">
              ORDER SUMMARY
            </h3>

            <div class="flex justify-between text-sm py-2 border-b border-[#F9F8F6]">
              <span>Subtotal</span>
              <span class="font-bold">PKR {cartSubtotal.toLocaleString('en-PK')}</span>
            </div>

            <div class="flex justify-between text-sm py-2 border-b border-[#F9F8F6]">
              <span>Pakistan Delivery</span>
              <span class="font-bold">{deliveryFee === 0 ? <span class="text-green-700">FREE</span> : `PKR ${deliveryFee}`}</span>
            </div>

            {discount > 0 && (
              <div class="flex justify-between text-sm py-2 text-green-700 font-bold">
                <span>Promo Discount (10%)</span>
                <span>-PKR {discount.toLocaleString('en-PK')}</span>
              </div>
            )}

            <div class="flex justify-between font-['Syne'] font-extrabold text-xl py-4 border-t-2 border-[#111111] my-4">
              <span>TOTAL</span>
              <span>PKR {finalTotal.toLocaleString('en-PK')}</span>
            </div>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} class="flex gap-2 my-6">
              <input
                type="text"
                placeholder="Promo Code (HIDDEN10)..."
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                class="flex-1 px-3 py-2 border border-[#E8E5E0] text-xs uppercase"
              />
              <button type="submit" class="btn-solid-outline text-xs px-4 py-2">APPLY</button>
            </form>

            <button onClick={() => onNavigate('checkout')} class="w-full btn-solid-dark py-4 text-xs">
              PROCEED TO CHECKOUT →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
