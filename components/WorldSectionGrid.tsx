'use client';

import { PLACEHOLDER_IMAGE } from '@/lib/public-data';

import React from 'react';
import Link from 'next/link';

export default function WorldSectionGrid() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 font-kalpurush mt-8 select-none">
      
      {/* =========================================================================
          PART 1: SECTION TITLE HEADER
          ========================================================================= */}
      <div className="w-full flex items-center gap-3 pt-5 pb-4 mb-4">
        <h2 className="text-[32px] font-black text-neutral-700 tracking-tight leading-none">
          বিশ্ব
        </h2>
        <span className="text-red-600 font-black text-[22px] select-none -translate-y-[10px]">
          ❯
        </span>
      </div>

      {/* =========================================================================
          PART 2: TOP LEVEL HERO ROW (Symmetric 6 Columns Text vs 6 Columns Image - No Divider)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border-b border-neutral-200 pb-8 mb-8">
        
        {/* LEFT MAIN SIDE: 6-Columns Text Display with Scaled Font Properties */}
        <div className="w-full lg:col-span-6 flex flex-col justify-between text-left">
          <Link href="/news/world-main" className="group block space-y-4 w-full">
            <h3 className="text-2xl lg:text-[34px] font-black text-neutral-700 leading-[1.2] group-hover:text-red-600 transition-colors">
              জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা
            </h3>
            <p className="text-[17px] text-neutral-500 font-medium leading-relaxed line-clamp-6">
              কোরবানির ঈদ আসন্ন। আমরা শিক্ষকদের বাড়ি বাড়ি গিয়ে বলব, আপনারা এই ঈদে তো কোরবানি দিবেন না। চামড়ার টাকাটা আমাদের দান করুন। আমরা বস্তির বাচ্চাদের জন্য একটা স্কুল বানাতে যাচ্ছি। সকলেই বললেন, তোমরা খুব ভাল কাজ করছ। অবহেলিত শিশুদের মধ্যে জ্ঞানের আলো জ্বালাতে যাচ্ছি। এই প্রশংসামূলক বাক্য শুনেই আমাদের সন্তুষ্ট থাকতে হল। একজন ছাড়া কেউ কোরবানির চামড়া দিতে রাজি হলেন না। মাদ্রাসার হুজুরেরা প্রতি বছর চামড়ার টাকা নিতে আসেন, তাদের বঞ্চিত করা যাবে না।
            </p>
          </Link>
          <Link href="/news/world-main" className="inline-block text-neutral-700 font-bold text-[16px] hover:text-red-600 transition-colors pt-4">
            বিস্তারিত পড়ুন...
          </Link>
        </div>

        {/* RIGHT MAIN SIDE: 6-Columns Featured Main Cover Image (Clean Spacing - No Left Border) */}
        <div className="w-full lg:col-span-6 flex flex-col justify-center text-left h-full">
          <Link href="/news/world-main" className="group block w-full">
            <div className="w-full aspect-[16/9] overflow-hidden rounded bg-neutral-100 border border-neutral-200">
              <img 
                src={PLACEHOLDER_IMAGE} 
                alt="বিশ্ব মূল সংবাদ চিত্র" 
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
              />
            </div>
          </Link>
        </div>

      </div>

      {/* =========================================================================
          PART 3: LOWER QUAD FLOOR ROW (4 cards flex layout with expanded text headers)
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-stretch w-full gap-0 pb-4">
        {[1, 2, 3, 4].map((item, idx, arr) => (
          <React.Fragment key={item}>
            <div className="w-full sm:w-1/2 lg:flex-1 px-4 first:pl-0 last:pr-0 flex flex-col justify-between py-2">
              <Link href={`/news/world-bottom-${item}`} className="group block space-y-3 w-full text-left">
                
                {/* Image Frame Node */}
                <div className="w-full aspect-[16/10] overflow-hidden rounded bg-neutral-100 border border-neutral-200">
                  <img 
                    src={`https://picsum.photos/id/${item + 15}/400/250`} 
                    alt="বিশ্ব নিচের খবর" 
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                  />
                </div>

                {/* Headline Block Scaled up to a larger profile size layout */}
                <h3 className="text-[17px] font-bold text-neutral-700 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                  জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা
                </h3>

              </Link>
            </div>
            
            {/* Horizontal Inter-Card Divider Line Node injection */}
            {idx !== arr.length - 1 && (
              <div className={`hidden bg-neutral-200 my-4 shrink-0 ${
                idx === 1 ? 'sm:hidden lg:block w-px' : 'sm:block w-px'
              }`}></div>
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