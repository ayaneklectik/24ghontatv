'use client';

import React from 'react';
import Link from 'next/link';
import type { NewsItem } from '@/types/public';

export default function SectionThreeGrid({ title, news }: { title: string; news: NewsItem[] }) {
  if (!news.length) return null;
  const items = news.slice(0, 3);
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 font-kalpurush mt-8 select-none">
      <div className="w-full flex items-center gap-3 pt-5 pb-4 mb-4">
        <h2 className="text-[32px] font-black text-neutral-700 tracking-tight leading-none">{title}</h2>
        <span className="text-red-600 font-black text-[22px] select-none -translate-y-[10px]">❯</span>
      </div>
      <div className="flex flex-col lg:flex-row items-stretch w-full gap-0 pb-4">
        {items.map((item, idx) => (
          <React.Fragment key={item.id}>
            <div className="w-full lg:flex-1 px-5 first:pl-0 last:pr-0 flex flex-col justify-between py-2 text-left">
              <Link href={`/news/${item.id}`} className="group block space-y-4">
                <div className="w-full aspect-[16/10] overflow-hidden rounded bg-neutral-100 border border-neutral-200">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300" />
                </div>
                <h3 className="text-[20px] lg:text-[22px] font-black text-neutral-700 leading-[1.3] group-hover:text-red-600 transition-colors line-clamp-3">{item.title}</h3>
                {item.excerpt && <p className="text-[15px] text-neutral-500 font-medium leading-relaxed line-clamp-3">{item.excerpt}</p>}
                <span className="inline-block text-neutral-700 font-bold text-[15px] hover:text-red-600 transition-colors">বিস্তারিত পড়ুন</span>
              </Link>
            </div>
            {idx !== items.length - 1 && <div className="hidden lg:block w-px bg-neutral-200 my-4 shrink-0" />}
          </React.Fragment>
        ))}
      </div>
      <div className="border-b-4 border-neutral-300 w-full pt-8 mt-6" />
    </section>
  );
}
