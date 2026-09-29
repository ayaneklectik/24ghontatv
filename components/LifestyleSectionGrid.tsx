'use client';

import { PLACEHOLDER_IMAGE } from '@/lib/public-data';

import React from 'react';
import Link from 'next/link';

export default function LifestyleSectionGrid() {
  const rightArticles = [1, 2, 3];
  const bottomArticles = [1, 2, 3, 4];

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 font-kalpurush mt-8 select-none">
      
      {/* =========================================================================
          PART 1: SECTION TITLE HEADER
          ========================================================================= */}
      <div className="w-full flex items-center gap-3 pt-5 pb-4 mb-4">
        <h2 className="text-[32px] font-black text-neutral-700 tracking-tight leading-none">
          জীবন শৈলী
        </h2>
        <span className="text-red-600 font-black text-[22px] select-none -translate-y-[10px]">
          ❯
        </span>
      </div>

      {/* =========================================================================
          PART 2: TOP LEVEL HYBRID ROW (6 Columns Feature vs 3 Columns Image Stack vs 3 Columns Text)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch border-b border-neutral-200 pb-8 mb-8">
        
        {/* LEFT 6-COLUMNS: Main Highlight Card */}
        <div className="w-full lg:col-span-6 lg:border-r lg:border-neutral-200 lg:pr-6 flex flex-col justify-between text-left">
          <div className="group flex flex-col h-full justify-between space-y-4">
            <div className="space-y-4 w-full">
              <Link href="/news/lifestyle-main" className="block w-full">
                <div className="w-full aspect-[16/10] overflow-hidden rounded bg-neutral-900 border border-neutral-200">
                  {/* Swapped to a verified, high-availability Picsum image asset ID */}
                  <img 
                    src={PLACEHOLDER_IMAGE} 
                    alt="জীবন শৈলী মূল সংবাদ চিত্র" 
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-all duration-300"
                  />
                </div>
              </Link>
              <Link href="/news/lifestyle-main" className="block">
                <h3 className="text-[22px] lg:text-[24px] font-black text-neutral-700 leading-[1.3] group-hover:text-red-600 transition-colors">
                  জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা
                </h3>
              </Link>
              <p className="text-[15px] text-neutral-500 font-medium leading-relaxed line-clamp-2">
                কোরবানির ঈদ আসন্ন। আমরা শিক্ষকদের বাড়ি বাড়ি গিয়ে বলব, আপনারা এই ঈদে তো কোরবানি দিবেন না। চামড়ার টাকাটা আমাদের দান করুন।
              </p>
            </div>
            <div>
              <Link href="/news/lifestyle-main" className="inline-block text-neutral-700 font-bold text-[15px] hover:text-red-600 transition-colors">
                বিস্তারিত পড়ুন
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT 6-COLUMNS: Combined 3-Col Images Stack & 3-Col Text Stack */}
        <div className="w-full lg:col-span-6 grid grid-cols-12 gap-4">
          
          {/* CENTER IMAGE COLUMN SPLIT (3 Columns Weight) */}
          <div className="col-span-5 flex flex-col justify-between h-full space-y-4">
            {rightArticles.map((item) => (
              <div key={item} className="w-full aspect-[16/10] overflow-hidden rounded bg-neutral-900 border border-neutral-200 flex-1">
                <img 
                  src={`https://picsum.photos/id/${item + 10}/300/188`} 
                  alt="সংবাদ চিত্র" 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* RIGHT TEXT COLUMN SPLIT (3 Columns Weight) */}
          <div className="col-span-7 flex flex-col justify-between h-full text-left">
            {rightArticles.map((item, idx, arr) => (
              <div 
                key={item} 
                className={`flex flex-col justify-center flex-1 ${
                  idx !== arr.length - 1 ? 'border-b border-neutral-200 pb-3 mb-3' : ''
                }`}
              >
                <Link href={`/news/lifestyle-side-${item}`} className="group block space-y-1">
                  <h4 className="text-[15px] lg:text-[16px] font-bold text-neutral-700 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                    জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা
                  </h4>
                  <span className="text-red-600 font-bold text-[13px] group-hover:text-red-700 transition-colors block pt-1">
                    বিস্তারিত পড়ুন
                  </span>
                </Link>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* =========================================================================
          PART 3: LOWER QUAD FLOOR ROW (4 Columns x 1 Row)
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-stretch w-full gap-0 pb-4">
        {bottomArticles.map((item, idx, arr) => (
          <React.Fragment key={item}>
            <div className="w-full sm:w-1/2 lg:flex-1 px-4 first:pl-0 last:pr-0 flex flex-col justify-between py-2 text-left">
              <Link href={`/news/lifestyle-bottom-${item}`} className="group block space-y-3 bg-white h-full">
                
                <div className="w-full aspect-[16/10] overflow-hidden rounded bg-neutral-100 border border-neutral-200">
                  <img 
                    src={`https://picsum.photos/id/${item + 20}/400/250`} 
                    alt="lifestyle-bottom" 
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-all duration-300"
                  />
                </div>

                <h3 className="text-[17px] font-bold text-neutral-700 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                  জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা
                </h3>

              </Link>
            </div>
            
            {/* Vertical lines separating bottom column tracks */}
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