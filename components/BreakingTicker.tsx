'use client';

import React from 'react';

// Mock data reflecting real-time news updates
const tickerHeadlines = [
  "ব্রেকিং নিউজ: ঘূর্ণিঝড়ের পূর্বাভাসে উপকূলীয় এলাকায় ৪ নম্বর সতর্ক সংকেত জারি",
  "খেলাধুলা: থ্রিলার ম্যাচে শেষ ওভারের বাউন্ডারিতে জয় পেল বাংলাদেশ",
  "অর্থনীতি: নিত্যপ্রয়োজনীয় পণ্যের দাম নিয়ন্ত্রণে নতুন টাস্কফোর্স গঠন",
  "আন্তর্জাতিক: বৈশ্বিক জলবায়ু সম্মেলনে নতুন তহবিল গঠনের ঘোষণা",
];

export default function BreakingTicker() {
  return (
    <div className="w-full bg-neutral-100 border-y border-neutral-200 h-10 flex items-center overflow-hidden my-2 select-none">
      {/* Fixed Accent Title Banner */}
      <div className="bg-red-600 text-white font-bold h-full px-4 flex items-center text-sm tracking-wide z-10 relative whitespace-nowrap">
        ব্রেকিং নিউজ
        <span className="absolute right-[-8px] top-0 border-y-[20px] border-y-transparent border-l-[8px] border-l-red-600"></span>
      </div>

      {/* Infinite Scrolling Content Window */}
      <div className="flex w-full overflow-hidden relative">
        <div className="animate-marquee whitespace-nowrap flex gap-16 text-sm font-medium text-neutral-800">
          {tickerHeadlines.map((text, index) => (
            <span key={index} className="hover:text-red-600 transition-colors duration-200 cursor-pointer">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Embedded CSS loop handles hardware accelerated animation cleanly */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}