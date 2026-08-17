import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Register({ onNavigate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const { register } = useAuth();
  const { showToast } = useCart();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPass) {
      showToast("Passwords do not match!", "error");
      return;
    }

    try {
      const res = await register({ name, email, phone, password });
      if (res.access_token) {
        showToast("Account created successfully!", "success");
        onNavigate('account');
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div class="bg-[#F9F8F6] py-20 min-h-[70vh] flex items-center justify-center px-4">
      <div class="bg-white border border-[#E8E5E0] p-10 max-w-lg w-full shadow-lg">
        <h1 class="font-['Syne'] font-extrabold text-2xl mb-2 uppercase">CREATE AN ACCOUNT</h1>
        <p class="text-xs text-[#666] mb-8">Join Hidden_Rack to unlock priority access to rare thrift drops.</p>

        <form onSubmit={handleRegisterSubmit} class="space-y-4">
          <div>
            <label class="font-['Syne'] font-bold text-xs uppercase block mb-1">FULL NAME *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required class="w-full px-4 py-3 border border-[#E8E5E0] text-xs" placeholder="Ayesha Raza" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="font-['Syne'] font-bold text-xs uppercase block mb-1">EMAIL ADDRESS *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required class="w-full px-4 py-3 border border-[#E8E5E0] text-xs" placeholder="ayesha@example.com" />
            </div>
            <div>
              <label class="font-['Syne'] font-bold text-xs uppercase block mb-1">PHONE NUMBER *</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required class="w-full px-4 py-3 border border-[#E8E5E0] text-xs" placeholder="0300-9876543" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="font-['Syne'] font-bold text-xs uppercase block mb-1">PASSWORD *</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minlength="6" class="w-full px-4 py-3 border border-[#E8E5E0] text-xs" placeholder="••••••••" />
            </div>
            <div>
              <label class="font-['Syne'] font-bold text-xs uppercase block mb-1">CONFIRM PASSWORD *</label>
              <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} required minlength="6" class="w-full px-4 py-3 border border-[#E8E5E0] text-xs" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" class="w-full btn-solid-dark py-4 text-xs mt-4">
            CREATE ACCOUNT
          </button>
        </form>

        <div class="mt-6 text-center text-xs text-[#666] pt-4 border-t border-[#E8E5E0]">
          Already have an account?{' '}
          <button onClick={() => onNavigate('login')} class="font-bold text-[#111111] underline">
            Login Here
          </button>
        </div>
      </div>
    </div>
  );
}
