'use client';

import React from 'react';
import Link from 'next/link';
import type { NewsItem } from '@/types/public';

export default function SectionOpinionGrid({ news }: { news: NewsItem[] }) {
  if (!news.length) return null;
  const opinions = news.slice(0, 4);
  const editorial = opinions[0];
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 font-kalpurush mt-8 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="w-full lg:col-span-8 flex flex-col text-left">
          <div className="w-full flex items-center gap-3 pb-4 mb-4 border-b border-neutral-100"><h2 className="text-[32px] font-black text-neutral-700 tracking-tight leading-none">মতামত</h2><span className="text-red-600 font-black text-[22px] select-none -translate-y-[10px]">❯</span></div>
          <div className="flex flex-col w-full divide-y divide-neutral-200">
            {opinions.map((item) => (
              <div key={item.id} className="w-full flex gap-4 py-4 first:pt-0 last:pb-0 items-start">
                <div className="w-[120px] h-[120px] shrink-0 rounded bg-neutral-900 overflow-hidden border border-neutral-200"><img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" /></div>
                <div className="flex-1 space-y-2"><Link href={`/news/${item.id}`} className="group block"><h3 className="text-[20px] lg:text-[22px] font-black text-neutral-700 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">{item.title}</h3></Link><div className="flex flex-col gap-1 pt-1"><div className="inline-block max-w-max bg-neutral-100 border border-neutral-300 text-neutral-600 text-[12px] px-2 py-0.5 rounded font-semibold">{item.author || 'লেখক'}</div><div className="inline-block max-w-max bg-neutral-50 border border-neutral-200 text-neutral-500 text-[11px] px-2 py-0.5 rounded">মতামত</div></div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:col-span-4 flex"><div className="w-full bg-red-500/50 border border-red-300 p-6 rounded text-neutral-900 flex flex-col justify-between shadow-sm text-left"><div><h2 className="text-[26px] font-black tracking-tight border-b border-red-400 pb-3 mb-4 text-red-950">সম্পাদকীয়</h2>{editorial && <><div className="w-full flex items-start gap-4 mb-4"><div className="w-[110px] h-[110px] shrink-0 bg-neutral-200 rounded overflow-hidden border border-red-400"><img src={editorial.imageUrl} alt={editorial.title} className="w-full h-full object-cover" /></div><div className="space-y-1 text-red-950 pt-1"><p className="text-[14px] font-black">{editorial.author || 'সম্পাদকীয়'}</p><p className="text-[12px] opacity-90 font-bold">প্রধান সম্পাদক</p></div></div><p className="text-[15px] font-medium leading-relaxed text-red-950 line-clamp-[12]">{editorial.excerpt || editorial.content || editorial.title}</p></>}</div>{editorial && <div className="pt-4 border-t border-red-400/60 mt-4"><Link href={`/news/${editorial.id}`} className="inline-block font-black text-[14px] text-red-950 hover:text-red-700 transition-colors">বিস্তারিত পড়ুন...</Link></div>}</div></div>
      </div>
      <div className="border-b-4 border-neutral-300 w-full pt-8 mt-6" />
    </section>
  );
}
