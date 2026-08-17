import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const { showToast } = useCart();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      if (res.access_token) {
        showToast("Logged in successfully! Welcome back.", "success");
        onNavigate(res.user.role === 'admin' ? 'admin' : 'account');
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const fillCustomer = () => {
    setEmail("zain@example.com");
    setPassword("user123");
  };

  const fillAdmin = () => {
    setEmail("admin@hiddenrack.pk");
    setPassword("admin123");
  };

  return (
    <div class="bg-[#F9F8F6] py-20 min-h-[70vh] flex items-center justify-center px-4">
      <div class="bg-white border border-[#E8E5E0] p-10 max-w-md w-full shadow-lg">
        <h1 class="font-['Syne'] font-extrabold text-2xl mb-2 uppercase">WELCOME BACK</h1>
        <p class="text-xs text-[#666] mb-8">Login with JWT Authentication to track your orders.</p>

        <form onSubmit={handleLoginSubmit} class="space-y-5">
          <div>
            <label class="font-['Syne'] font-bold text-xs uppercase block mb-1.5">EMAIL ADDRESS *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              class="w-full px-4 py-3 border border-[#E8E5E0] text-xs"
              placeholder="zain@example.com"
            />
          </div>

          <div>
            <label class="font-['Syne'] font-bold text-xs uppercase block mb-1.5">PASSWORD *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              class="w-full px-4 py-3 border border-[#E8E5E0] text-xs"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" class="w-full btn-solid-dark py-4 text-xs">
            LOGIN TO ACCOUNT
          </button>
        </form>

        <div class="mt-6 text-center text-xs text-[#666] pt-4 border-t border-[#E8E5E0]">
          Don't have an account?{' '}
          <button onClick={() => onNavigate('register')} class="font-bold text-[#111111] underline">
            Create Account
          </button>
        </div>

        {/* Demo Credentials Box */}
        <div class="mt-6 bg-[#EFE9E1] border border-[#C4A47C] p-4 text-xs">
          <strong>DEMO CREDENTIALS:</strong>
          <div class="mt-1">Customer: <code>zain@example.com</code> / <code>user123</code></div>
          <div>Admin: <code>admin@hiddenrack.pk</code> / <code>admin123</code></div>
          <div class="mt-3 flex gap-2">
            <button onClick={fillCustomer} class="bg-[#111111] text-white px-3 py-1 text-[10px] font-bold">Fill Customer</button>
            <button onClick={fillAdmin} class="bg-[#C4A47C] text-[#111111] px-3 py-1 text-[10px] font-bold">Fill Admin</button>
          </div>
        </div>
      </div>
    </div>
  );
}
