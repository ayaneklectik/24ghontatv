'use client';

import { PLACEHOLDER_IMAGE } from '@/lib/public-data';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ThreeColumnGrid() {
  const [activeTab, setActiveTab] = useState<'recent' | 'popular'>('recent');
  const bnNumbers = ['১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', '১০'];

  const recentNews = [
    { id: 101, title: "জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা" },
    { id: 102, title: "জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা" },
    { id: 103, title: "জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা" },
    { id: 104, title: "জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা" },
    { id: 105, title: "জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা" },
    { id: 106, title: "জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা" },
  ];

  const popularNews = [
    { id: 201, title: "[জনপ্রিয়] পাঠকপ্রিয়তায় শীর্ষে থাকা প্রথম সংবাদ শিরোনাম এবং বিস্তারিত লিংক" },
    { id: 202, title: "[জনপ্রিয়] সপ্তাহের সবচেয়ে বেশি পঠিত দ্বিতীয় সংবাদ বিবরণী" },
    { id: 203, title: "[জনপ্রিয়] জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে?" },
    { id: 204, title: "[জনপ্রিয়] সামাজিক যোগাযোগ মাধ্যমে ভাইরাল হওয়া আজকের বিশেষ প্রতিবেদন" },
    { id: 205, title: "[জনপ্রিয়] জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে?" },
    { id: 206, title: "[জনপ্রিয়] ব্যবসা ও বাণিজ্য খাতের শীর্ষ আলোচনা এবং বিশ্লেষণধর্মী খবর" },
  ];

  const currentList = (activeTab === 'recent' ? recentNews : popularNews).slice(0, 6);

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 font-kalpurush mt-8 select-none">
      
      {/* =========================================================================
          UNIFIED HEADER BAR: Aligns Section Title and Right Side Tabs Perfectly
          ========================================================================= */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-neutral-200/60 pt-5 pb-4 mb-6 gap-4">
        
        {/* Left Side Title Element */}
        <div className="flex items-center gap-3">
          <h2 className="text-[32px] font-black text-neutral-700 tracking-tight leading-none">
            সেরা ৫
          </h2>
          <span className="text-red-600 font-black text-[22px] select-none -translate-y-[10px]">
            ❯
          </span>
        </div>

        {/* Right Side Tab Selectors aligned perfectly with the title axis */}
        <div className="flex items-center gap-6 lg:w-[33.333%] lg:pl-4 shrink-0">
          <button 
            onClick={() => setActiveTab('recent')}
            className={`flex items-center gap-1.5 focus:outline-none pb-4 -mb-[17px] relative transition-colors ${
              activeTab === 'recent' ? 'text-neutral-700 border-b-2 border-red-600' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <span className="text-[24px] font-black tracking-tight leading-none">সাম্প্রতিক</span>
            <span className={`text-[16px] font-black -translate-y-[10px] ${activeTab === 'recent' ? 'text-red-600' : 'text-neutral-400'}`}>❯</span>
          </button>

          <button 
            onClick={() => setActiveTab('popular')}
            className={`flex items-center gap-1.5 focus:outline-none pb-4 -mb-[17px] relative transition-colors ${
              activeTab === 'popular' ? 'text-neutral-700 border-b-2 border-red-600' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <span className="text-[24px] font-black tracking-tight leading-none">জনপ্রিয়</span>
            <span className={`text-[16px] font-black -translate-y-[10px] ${activeTab === 'popular' ? 'text-red-600' : 'text-neutral-400'}`}>❯</span>
          </button>
        </div>

      </div>

      {/* =========================================================================
          CONTENT SECTION: THE 12-COLUMN STRUCTURAL DIVISION ASYMMETRIC GRID
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN SYSTEM: 8-COLUMN MAIN VIEWPORT */}
        <div className="w-full lg:col-span-8 lg:border-r lg:border-neutral-200 lg:pr-8 flex flex-col justify-between text-left">
          
          {/* TOP HALF: MAIN BIG COVER FEATURE BOX */}
          <div className="w-full border-b border-neutral-200 pb-6 mb-6">
            <Link href="/news/top5-lead" className="group block space-y-4 w-full">
              <div className="w-full aspect-[16/9] overflow-hidden rounded bg-neutral-100 border border-neutral-200">
                <img 
                  src={PLACEHOLDER_IMAGE} 
                  alt="সেরা ৫ মূল সংবাদ" 
                  className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                />
              </div>
              <h3 className="text-2xl lg:text-[32px] font-black text-neutral-700 leading-[1.2] group-hover:text-red-600 transition-colors pt-2">
                জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা
              </h3>
              <p className="text-[16px] text-neutral-500 font-medium leading-relaxed line-clamp-3">
                কোরবানির ঈদ আসন্ন। আমরা শিক্ষকদের বাড়ি বাড়ি গিয়ে বলব, আপনারা এই ঈদে তো কোরবানি দিবেন না। চামড়ার টাকাটা আমাদের দান করুন। আমরা এতিম বাচ্চাদের জন্য একটা স্কুল বানাতে যাচ্ছি। সকলেই বললেন, তোমরা খুব ভাল উদ্যোগ নিয়েছ। এই প্রশংসামূলক বাক্য শুনেই আমাদের সন্তুষ্ট থাকতে হল। একজন ছাড়া কেউ কোরবানির চামড়া দিতে রাজি হলেন না।
              </p>
            </Link>
            <Link href="/news/top5-lead" className="inline-block text-neutral-700 font-bold text-[15px] hover:text-red-600 transition-colors pt-2">
              বিস্তারিত পড়ুন...
            </Link>
          </div>

          {/* BOTTOM HALF: BALANCED PLATFORM ROW CARDS (4 Cards x 2 Column Distribution) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-4 items-stretch">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="w-full lg:col-span-2 flex flex-col justify-between text-left">
                <Link href={`/news/bottom-sub-${item}`} className="group block space-y-2.5 w-full">
                  <div className="w-full aspect-[16/10] overflow-hidden rounded bg-neutral-100 border border-neutral-200">
                    <img 
                      src={`https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=60&sig=${item}`} 
                      alt="সম্পূরক খবর" 
                      className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-base font-bold text-neutral-700 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                    জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা
                  </h3>
                </Link>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN SYSTEM: 4-COLUMN DYNAMIC SCROLLER COMPONENT */}
        <div className="w-full lg:col-span-4 lg:pl-4 flex flex-col text-left">
          {/* flex-1 and justify-between dynamically ensures equal spacing distributed nicely to the floor */}
          <div className="w-full flex-1 flex flex-col justify-between overflow-y-auto custom-section-scroller">
            {currentList.map((news, index) => (
              <div 
                key={news.id} 
                className="w-full border-b border-neutral-200 pb-4"
              >
                <Link href={`/news/list-${news.id}`} className="group block bg-white text-left">
                  
                  {/* Top-Left Serial Numeral Tag */}
                  <div className="text-[44px] font-black text-red-600 leading-none tracking-tighter mb-2 select-none">
                    {bnNumbers[index] || index + 1}
                  </div>

                  {/* Headline content configured cleanly at 19px viewport profile */}
                  <h4 className="text-[19px] font-bold text-neutral-700 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                    {news.title}
                  </h4>

                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION MASTER SOLID BOTTOM FLOOR TERMINAL */}
      <div className="border-b-4 border-neutral-300 w-full pt-8 mt-6"></div>

    </section>
  );
}