import React from 'react';

export default function About({ onNavigate }) {
  return (
    <div>
      <div class="bg-[#121212] text-white py-20 border-b border-[#2A2A2A]">
        <div class="max-w-[1380px] mx-auto px-6 text-center">
          <span class="bg-[#C4A47C] text-[#111111] font-['Syne'] font-extrabold text-xs tracking-widest px-3 py-1 uppercase">
            OUR MISSION & BRAND STORY
          </span>
          <h1 class="font-['Syne'] font-extrabold text-4xl mt-4 uppercase">
            CURATING THE RAREST PRE-LOVED FOOTWEAR FOR PAKISTAN
          </h1>
        </div>
      </div>

      <div class="max-w-[1380px] mx-auto px-6 py-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 class="font-['Syne'] font-extrabold text-3xl uppercase mb-6">
              NOT EVERY GREAT PAIR HAS TO BE BRAND NEW.
            </h2>
            <p class="text-sm text-[#666] leading-relaxed mb-4">
              Founded in 2024, <strong>Hidden_Rack</strong> emerged from a simple observation: Pakistani sneaker enthusiasts were forced to choose between counterfeit knockoffs or exorbitant reseller markups.
            </p>
            <p class="text-sm text-[#666] leading-relaxed mb-6">
              We scout global vintage lots to bring pristine pre-loved footwear to Pakistani enthusiasts. Every pair is scrubbed, inspected for authenticity, and given a transparent condition score.
            </p>
            <button onClick={() => onNavigate('shop')} class="btn-solid-dark">SHOP COLLECTION NOW</button>
          </div>

          <div>
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80" alt="Hidden_Rack Story" class="w-full h-[450px] object-cover border border-[#111111]" />
          </div>
        </div>
      </div>
    </div>
  );
}
