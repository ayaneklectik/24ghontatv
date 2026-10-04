'use client';

import { PLACEHOLDER_IMAGE } from '@/lib/public-data';

import React from 'react';
import Link from 'next/link';

export default function OpinionEditorialGrid() {
  const opinions = [1, 2, 3, 4];

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 font-kalpurush mt-8 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* =========================================================================
            LEFT COLUMN: মতামত (OPINIONS LIST - 8 COLUMNS FOOTPRINT SHARE)
            ========================================================================= */}
        <div className="w-full lg:col-span-8 flex flex-col text-left">
          {/* Header row element */}
          <div className="w-full flex items-center gap-3 pb-4 mb-4 border-b border-neutral-100">
            <h2 className="text-[32px] font-black text-neutral-700 tracking-tight leading-none">
              মতামত
            </h2>
            <span className="text-red-600 font-black text-[22px] select-none -translate-y-[10px]">
              ❯
            </span>
          </div>

          {/* Vertical Stack List */}
          <div className="flex flex-col w-full divide-y divide-neutral-200">
            {opinions.map((item) => (
              <div key={item} className="w-full flex gap-4 py-4 first:pt-0 last:pb-0 items-start">
                
                {/* Fixed Square Image Thumbnail Badge */}
                <div className="w-[120px] h-[120px] shrink-0 rounded bg-neutral-900 overflow-hidden border border-neutral-200">
                  <img 
                    src={`https://picsum.photos/id/${item + 60}/150/150`} 
                    alt="লেখকের ছবি" 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content Details Block */}
                <div className="flex-1 space-y-2">
                  <Link href={`/news/opinion-${item}`} className="group block">
                    <h3 className="text-[20px] lg:text-[22px] font-black text-neutral-700 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                      জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা
                    </h3>
                  </Link>
                  
                  {/* Metadata labels matching the blueprint specs */}
                  <div className="flex flex-col gap-1 pt-1">
                    <div className="inline-block max-w-max bg-neutral-100 border border-neutral-300 text-neutral-600 text-[12px] px-2 py-0.5 rounded font-semibold">
                      লেখকের নাম
                    </div>
                    <div className="inline-block max-w-max bg-neutral-50 border border-neutral-200 text-neutral-500 text-[11px] px-2 py-0.5 rounded">
                      লেখকের পেশা
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: সম্পাদকীয় (EDITORIAL CONTAINER BLOCK - 4 COLUMNS FOOTPRINT SHARE)
            ========================================================================= */}
        <div className="w-full lg:col-span-4 flex">
          {/* Configured with a true 50% opacity/tint red background balance (bg-red-500/50) */}
          <div className="w-full bg-red-500/50 border border-red-300 p-6 rounded text-neutral-900 flex flex-col text-left justify-between shadow-sm">
            
            <div>
              {/* Header block adjusted for 50% background layout depth */}
              <h2 className="text-[26px] font-black tracking-tight border-b border-red-400 pb-3 mb-4 text-red-950">
                সম্পাদকীয়
              </h2>

              {/* Layout split inside the editorial badge container */}
              <div className="w-full flex items-start gap-4 mb-4">
                {/* Editor Profile Image Frame */}
                <div className="w-[110px] h-[110px] shrink-0 bg-neutral-200 rounded overflow-hidden border border-red-400">
                  <img 
                    src={PLACEHOLDER_IMAGE} 
                    alt="সম্পাদকের ছবি" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Editor Sign Post Labels */}
                <div className="space-y-1 text-red-950 pt-1">
                  <p className="text-[14px] font-black">নাম: সম্পাদকের নাম</p>
                  <p className="text-[12px] opacity-90 font-bold">প্রধান সম্পাদক</p>
                </div>
              </div>

              {/* Editorial text copy configured with crisp text-red-950/90 readability over the 50% tint */}
              <p className="text-[15px] font-medium leading-relaxed text-red-950 line-clamp-[12]">
                কোরবানির ঈদ আসন্ন। আমরা শিক্ষকদের বাড়ি বাড়ি গিয়ে বলব, আপনারা এই ঈদে তো কোরবানি দিবেন না। চামড়ার টাকাটা আমাদের দান করুন। আমরা বস্তির বাচ্চাদের জন্য একটা স্কুল বানাতে যাচ্ছি। সকলেই বললেন, তোমরা খুব ভাল কাজ করছ। অবহেলিত শিশুদের মধ্যে জ্ঞানের আলো জ্বালাতে যাচ্ছি। এই প্রশংসামূলক বাক্য শুনেই আমাদের সন্তুষ্ট থাকতে হল। একজন ছাড়া কেউ কোরবানির চামড়া দিতে রাজি হলেন না। মাদ্রাসার হুজুরেরা প্রতি বছর চামড়ার টাকা নিতে আসেন, তাদের বঞ্চিত করা যাবে না। কোরবানির ঈদ আসন্ন। অবহেলিত শিশুদের মধ্যে জ্ঞানের আলো জ্বালাতে যাচ্ছি। এই প্রশংসামূলক বাক্য শুনেই আমাদের সন্তুষ্ট থাকতে হল।
              </p>
            </div>

            {/* Read more footer link wrapper */}
            <div className="pt-4 border-t border-red-400/60 mt-4">
              <Link href="/news/editorial-main" className="inline-block font-black text-[14px] text-red-950 hover:text-red-700 transition-colors">
                বিস্তারিত পড়ুন...
              </Link>
            </div>

          </div>
        </div>

      </div>

      {/* =========================================================================
          MASTER UNIFORM BOUNDARY SOLID SECTION FLOOR
          ========================================================================= */}
      <div className="border-b-4 border-neutral-300 w-full pt-8 mt-6"></div>
    </section>
  );
}