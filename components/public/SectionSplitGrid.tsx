'use client';

import React from 'react';
import Link from 'next/link';
import type { NewsItem } from '@/types/public';

export default function SectionSplitGrid({ title, news, imageLeft = false }: { title: string; news: NewsItem[]; imageLeft?: boolean }) {
  if (!news.length) return null;
  const main = news[0];
  const bottom = news.slice(1, 5);

  const imageBlock = (
    <div className="w-full lg:col-span-6 flex flex-col justify-center text-left h-full">
      <Link href={`/news/${main.id}`} className="group block w-full">
        <div className="w-full aspect-[16/9] overflow-hidden rounded bg-neutral-100 border border-neutral-200">
          <img src={main.imageUrl} alt={main.title} className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300" />
        </div>
      </Link>
    </div>
  );

  const textBlock = (
    <div className="w-full lg:col-span-6 flex flex-col justify-between text-left">
      <Link href={`/news/${main.id}`} className="group block space-y-4 w-full">
        <h3 className="text-2xl lg:text-[34px] font-black text-neutral-700 leading-[1.2] group-hover:text-red-600 transition-colors">{main.title}</h3>
        {main.excerpt && <p className="text-[17px] text-neutral-500 font-medium leading-relaxed line-clamp-6">{main.excerpt}</p>}
      </Link>
      <Link href={`/news/${main.id}`} className="inline-block text-neutral-700 font-bold text-[16px] hover:text-red-600 transition-colors pt-4">বিস্তারিত পড়ুন...</Link>
    </div>
  );

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 font-kalpurush mt-8 select-none">
      <div className="w-full flex items-center gap-3 pt-5 pb-4 mb-4">
        <h2 className="text-[32px] font-black text-neutral-700 tracking-tight leading-none">{title}</h2>
        <span className="text-red-600 font-black text-[22px] select-none -translate-y-[10px]">❯</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border-b border-neutral-200 pb-8 mb-8">
        {imageLeft ? <>{imageBlock}{textBlock}</> : <>{textBlock}{imageBlock}</>}
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-stretch w-full gap-0 pb-4">
        {bottom.map((item, idx) => (
          <React.Fragment key={item.id}>
            <div className="w-full sm:w-1/2 lg:flex-1 px-4 first:pl-0 last:pr-0 flex flex-col justify-between py-2">
              <Link href={`/news/${item.id}`} className="group block space-y-3 w-full text-left">
                <div className="w-full aspect-[16/10] overflow-hidden rounded bg-neutral-100 border border-neutral-200">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300" />
                </div>
                <h3 className="text-[17px] font-bold text-neutral-700 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">{item.title}</h3>
              </Link>
            </div>
            {idx !== bottom.length - 1 && <div className={`hidden bg-neutral-200 my-4 shrink-0 ${idx === 1 ? 'sm:hidden lg:block w-px' : 'sm:block w-px'}`} />}
          </React.Fragment>
        ))}
      </div>
      <div className="border-b-4 border-neutral-300 w-full pt-8 mt-6" />
    </section>
  );
}
