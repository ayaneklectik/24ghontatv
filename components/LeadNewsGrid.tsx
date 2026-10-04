'use client';

import React from 'react';
import Link from 'next/link';
import { LEAD_HERO, LEAD_BOTTOM } from '@/data/mockNews';

export default function LeadNewsGrid() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 font-kalpurush mt-6 select-none">
      
      {/* PART 1: SECTION HEADER */}
      <div className="w-full flex items-center gap-3 pt-4 pb-4 mb-2">
        <h2 className="text-[32px] font-black text-neutral-700 tracking-tight leading-none">
          প্রধান সংবাদ
        </h2>
        <span className="text-red-600 font-black text-[22px] select-none -translate-y-[10px]">
          ❯
        </span>
      </div>

      {/* PART 2: HERO ARTICLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b-2 border-neutral-200 pb-6 mb-6">
        
        {/* Left Side: Text */}
        <div className="lg:col-span-6 flex flex-col justify-between lg:border-r lg:border-neutral-200 lg:pr-8 text-left">
          <Link href={`/news/${LEAD_HERO.id}`} className="group block space-y-4 w-full">
            <h3 className="text-2xl sm:text-3xl lg:text-[40px] font-black text-neutral-700 leading-[1.15] group-hover:text-red-600 transition-colors">
              {LEAD_HERO.title}
            </h3>
            <p className="text-base lg:text-[18px] text-neutral-500 font-medium leading-relaxed">
              {LEAD_HERO.excerpt}
            </p>
            <span className="inline-block text-neutral-700 font-bold text-[15px] hover:text-red-600 transition-colors pt-2">
              বিস্তারিত পড়ুন...
            </span>
          </Link>
        </div>

        {/* Right Side: Image */}
        <div className="lg:col-span-6 w-full">
          <Link href={`/news/${LEAD_HERO.id}`} className="group block w-full aspect-[16/10] overflow-hidden rounded bg-neutral-100 border border-neutral-200">
            <img 
              src={LEAD_HERO.imageUrl} 
              alt={LEAD_HERO.title} 
              className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
            />
          </Link>
        </div>

      </div>

      {/* PART 3: BOTTOM QUAD CARDS */}
      <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-stretch w-full gap-0">
        {LEAD_BOTTOM.map((card, idx, arr) => (
          <React.Fragment key={card.id}>
            <div className="w-full sm:w-1/2 lg:flex-1 px-4 first:pl-0 last:pr-0 flex flex-col justify-between py-2">
              <Link href={`/news/${card.id}`} className="group block space-y-3.5 w-full text-left">
                <div className="w-full aspect-[16/10] overflow-hidden rounded bg-neutral-100 border border-neutral-200">
                  <img 
                    src={card.imageUrl} 
                    alt={card.title} 
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg lg:text-[22px] font-bold text-neutral-700 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm lg:text-[15px] text-neutral-500 font-medium leading-relaxed line-clamp-3">
                  {card.excerpt}
                </p>
                <span className="inline-block text-neutral-700 font-bold text-xs hover:text-red-600 transition-colors mt-1">
                  বিস্তারিত পড়ুন...
                </span>
              </Link>
            </div>

            {/* Column Dividers */}
            {idx !== arr.length - 1 && (
              <div className={`hidden bg-neutral-200 my-4 shrink-0 ${
                idx === 1 ? 'sm:hidden lg:block w-px' : 'sm:block w-px'
              }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="border-b-4 border-neutral-300 w-full pt-8 mt-6"></div>

    </section>
  );
}