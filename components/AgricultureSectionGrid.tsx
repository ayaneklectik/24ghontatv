'use client';

import { PLACEHOLDER_IMAGE } from '@/lib/public-data';

import React from 'react';
import Link from 'next/link';

export default function AgricultureSectionGrid() {
  // Symmetrical 3-column master structure grid layout layout array
  const articles = [1, 2, 3];

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 font-kalpurush mt-8 select-none">
      
      {/* =========================================================================
          PART 1: SECTION TITLE HEADER
          ========================================================================= */}
      <div className="w-full flex items-center gap-3 pt-5 pb-4 mb-4">
        <h2 className="text-[32px] font-black text-neutral-700 tracking-tight leading-none">
          কৃষি
        </h2>
        <span className="text-red-600 font-black text-[22px] select-none -translate-y-[10px]">
          ❯
        </span>
      </div>

      {/* =========================================================================
          PART 2: THE 3-COLUMNS x 3-PART INTERNAL CARD STRUCTURE GRID
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row items-stretch w-full gap-0 pb-4">
        {articles.map((item, idx, arr) => (
          <React.Fragment key={item}>
            {/* Each column container represents exactly 1/3 of the layout line width on desktop */}
            <div className="w-full lg:flex-1 px-5 first:pl-0 last:pr-0 flex flex-col justify-between py-2 text-left">
              <div className="group flex flex-col h-full justify-between space-y-4">
                
                {/* PART 1: Top Image Node */}
                <Link href={`/news/agriculture-${item}`} className="block w-full">
                  <div className="w-full aspect-[16/10] overflow-hidden rounded bg-neutral-900 border border-neutral-200">
                    <img 
                      src={`https://picsum.photos/id/${item + 72}/600/375`} 
                      alt="কৃষি সংবাদ চিত্র" 
                      className="w-full h-full object-cover group-hover:scale-[1.01] opacity-95 group-hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                </Link>

                {/* PART 2: The Mid Section Headline */}
                <Link href={`/news/agriculture-${item}`} className="block">
                  <h3 className="text-[20px] lg:text-[22px] font-black text-neutral-700 leading-[1.3] group-hover:text-red-600 transition-colors">
                    জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা
                  </h3>
                </Link>

                {/* PART 3: The Lower Body Stack */}
                <div className="flex flex-col justify-between flex-1 pt-1 space-y-3">
                  <p className="text-[15px] text-neutral-500 font-medium leading-relaxed line-clamp-3">
                    কোরবানির ঈদ আসন্ন। আমরা শিক্ষকদের বাড়ি বাড়ি গিয়ে বলব, আপনারা এই ঈদে তো কোরবানি দিবেন না। চামড়ার টাকাটা আমাদের দান করুন। আমরা বস্তির বাচ্চাদের জন্য একটা স্কুল বানাতে যাচ্ছি। সকলেই বললেন, তোমরা খুব ভাল কাজ করছ।
                  </p>
                  
                  <div className="pt-1">
                    <Link href={`/news/agriculture-${item}`} className="inline-block text-neutral-700 font-bold text-[15px] hover:text-red-600 transition-colors">
                      বিস্তারিত পড়ুন
                    </Link>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Vertical grid line dividers separating the 3 column fields on desktop viewports */}
            {idx !== arr.length - 1 && (
              <div className="hidden lg:block w-px bg-neutral-200 my-4 shrink-0"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* =========================================================================
          MASTER UNIFORM BOUNDARY SOLID SECTION FLOOR
          ========================================================================= */}
      <div className="border-b-4 border-neutral-300 w-full pt-8 mt-6"></div>

    </section>
  );
}