'use client';

import { PLACEHOLDER_IMAGE } from '@/lib/public-data';

import React from 'react';
import Link from 'next/link';

export default function PhotoGallerySectionGrid() {
  const centerStack = [1, 2];
  const rightStack = [3, 4];

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 font-kalpurush mt-8 select-none">
      
      {/* =========================================================================
          PART 1: STATIC SECTION TITLE HEADER (NO HOVER EFFECTS / COLOR SHIFTS)
          ========================================================================= */}
      <div className="w-full flex items-center gap-3 pt-5 pb-4 mb-4">
        {/* Title remains standard static dark neutral gray */}
        <h2 className="text-[32px] font-black text-neutral-700 tracking-tight leading-none">
          ছবি
        </h2>
        {/* Chevron icon sits anchored in solid permanent red with no animation displacements */}
        <span className="text-red-600 font-black text-[22px] select-none -translate-y-[10px]">
          ❯
        </span>
      </div>

      {/* =========================================================================
          PART 2: CONTENT OVERLAY MASONRY GRID (6 Columns vs 3 Columns vs 3 Columns)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* LEFT FEATURE IMAGE CONTAINER - SPANS 6 COLUMNS */}
        <div className="w-full lg:col-span-6">
          <Link href="/gallery/photo-1" className="group relative block w-full h-full aspect-[16/10] lg:aspect-auto overflow-hidden rounded border border-neutral-200 shadow-sm bg-neutral-900">
            <img 
              src={PLACEHOLDER_IMAGE} 
              alt="ফিচার ছবি" 
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            {/* Absolute Bottom Translucent Content Shield */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/50 to-transparent backdrop-blur-[1px] p-4 lg:p-6 text-left">
              <h3 className="text-[18px] lg:text-[22px] font-normal text-white leading-snug line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
                জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা
              </h3>
            </div>
          </Link>
        </div>

        {/* CENTER IMAGE STACK COLUMN - SPANS 3 COLUMNS */}
        <div className="w-full lg:col-span-3 flex flex-col justify-between gap-4">
          {centerStack.map((item) => (
            <Link 
              key={item}
              href={`/gallery/photo-center-${item}`} 
              className="group relative block w-full aspect-[16/10] overflow-hidden rounded border border-neutral-200 shadow-sm bg-neutral-900 flex-1"
            >
              <img 
                src={`https://picsum.photos/id/${item + 42}/500/312`} 
                alt="গ্যালারি চিত্র" 
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 text-left">
                <h3 className="text-[14px] lg:text-[15px] font-normal text-white leading-snug line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
                  জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* RIGHT IMAGE STACK COLUMN - SPANS 3 COLUMNS */}
        <div className="w-full lg:col-span-3 flex flex-col justify-between gap-4">
          {rightStack.map((item) => (
            <Link 
              key={item}
              href={`/gallery/photo-right-${item}`} 
              className="group relative block w-full aspect-[16/10] overflow-hidden rounded border border-neutral-200 shadow-sm bg-neutral-900 flex-1"
            >
              <img 
                src={`https://picsum.photos/id/${item + 48}/500/312`} 
                alt="গ্যালারি চিত্র" 
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 text-left">
                <h3 className="text-[14px] lg:text-[15px] font-normal text-white leading-snug line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
                  জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা
                </h3>
              </div>
            </Link>
          ))}
        </div>

      </div>

    </section>
  );
}