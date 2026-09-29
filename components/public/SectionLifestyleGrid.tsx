'use client';

import React from 'react';
import Link from 'next/link';
import type { NewsItem } from '@/types/public';

export default function SectionLifestyleGrid({ title, news }: { title: string; news: NewsItem[] }) {
  if (!news.length) return null;
  const main = news[0];
  const side = news.slice(1, 4);
  const bottom = news.slice(4, 8);
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 font-kalpurush mt-8 select-none">
      <div className="w-full flex items-center gap-3 pt-5 pb-4 mb-4">
        <h2 className="text-[32px] font-black text-neutral-700 tracking-tight leading-none">{title}</h2>
        <span className="text-red-600 font-black text-[22px] select-none -translate-y-[10px]">❯</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch border-b border-neutral-200 pb-8 mb-8">
        <div className="w-full lg:col-span-6 lg:border-r lg:border-neutral-200 lg:pr-6 flex flex-col justify-between text-left">
          <div className="group flex flex-col h-full justify-between space-y-4">
            <div className="space-y-4 w-full">
              <Link href={`/news/${main.id}`} className="block w-full">
                <div className="w-full aspect-[16/10] overflow-hidden rounded bg-neutral-900 border border-neutral-200">
                  <img src={main.imageUrl} alt={main.title} className="w-full h-full object-cover group-hover:scale-[1.01] transition-all duration-300" />
                </div>
              </Link>
              <Link href={`/news/${main.id}`} className="block">
                <h3 className="text-[22px] lg:text-[24px] font-black text-neutral-700 leading-[1.3] group-hover:text-red-600 transition-colors">{main.title}</h3>
              </Link>
              {main.excerpt && <p className="text-[15px] text-neutral-500 font-medium leading-relaxed line-clamp-2">{main.excerpt}</p>}
            </div>
            <Link href={`/news/${main.id}`} className="inline-block text-neutral-700 font-bold text-[15px] hover:text-red-600 transition-colors">বিস্তারিত পড়ুন</Link>
          </div>
        </div>
        <div className="w-full lg:col-span-6 grid grid-cols-12 gap-4">
          <div className="col-span-5 flex flex-col justify-between h-full space-y-4">
            {side.map((item) => <div key={item.id} className="w-full aspect-[16/10] overflow-hidden rounded bg-neutral-900 border border-neutral-200 flex-1"><img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" /></div>)}
          </div>
          <div className="col-span-7 flex flex-col justify-between h-full text-left">
            {side.map((item, idx) => <div key={item.id} className={`flex flex-col justify-center flex-1 ${idx !== side.length - 1 ? 'border-b border-neutral-200 pb-3 mb-3' : ''}`}><Link href={`/news/${item.id}`} className="group block space-y-1"><h4 className="text-[15px] lg:text-[16px] font-bold text-neutral-700 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">{item.title}</h4><span className="text-red-600 font-bold text-[13px] block pt-1">বিস্তারিত পড়ুন</span></Link></div>)}
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-stretch w-full gap-0 pb-4">
        {bottom.map((item, idx) => <React.Fragment key={item.id}><div className="w-full sm:w-1/2 lg:flex-1 px-4 first:pl-0 last:pr-0 py-2"><Link href={`/news/${item.id}`} className="group block space-y-3 bg-white"><div className="w-full aspect-[16/10] overflow-hidden rounded bg-neutral-100 border border-neutral-200"><img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.01] transition-all duration-300" /></div><h3 className="text-[17px] font-bold text-neutral-700 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">{item.title}</h3></Link></div>{idx !== bottom.length - 1 && <div className="hidden bg-neutral-200 my-4 shrink-0 sm:block w-px" />}</React.Fragment>)}
      </div>
      <div className="border-b-4 border-neutral-300 w-full pt-8 mt-6" />
    </section>
  );
}
