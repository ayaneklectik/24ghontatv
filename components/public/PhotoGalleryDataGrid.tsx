'use client';

import React from 'react';
import Link from 'next/link';
import type { PublicHomeData } from '@/types/public';

export default function PhotoGalleryDataGrid({ photos }: { photos: PublicHomeData['photos'] }) {
  if (!photos.length) return null;
  const main = photos[0];
  const center = photos.slice(1, 3);
  const right = photos.slice(3, 5);
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 font-kalpurush mt-8 select-none">
      <div className="w-full flex items-center gap-3 pt-5 pb-4 mb-4"><h2 className="text-[32px] font-black text-neutral-700 tracking-tight leading-none">ছবি</h2><span className="text-red-600 font-black text-[22px] select-none -translate-y-[10px]">❯</span></div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {main && <div className="w-full lg:col-span-6"><Link href={`/gallery/${main.id}`} className="group relative block w-full h-full aspect-[16/10] lg:aspect-auto overflow-hidden rounded border border-neutral-200 shadow-sm bg-neutral-900"><img src={main.imageUrl} alt={main.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"/><div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 lg:p-6 text-left"><h3 className="text-[18px] lg:text-[22px] font-normal text-white leading-snug line-clamp-2">{main.title}</h3></div></Link></div>}
        <div className="w-full lg:col-span-3 flex flex-col justify-between gap-4">{center.map((item) => <Link key={item.id} href={`/gallery/${item.id}`} className="group relative block w-full aspect-[16/10] overflow-hidden rounded border border-neutral-200 shadow-sm bg-neutral-900 flex-1"><img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"/><div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 text-left"><h3 className="text-[14px] lg:text-[15px] font-normal text-white leading-snug line-clamp-2">{item.title}</h3></div></Link>)}</div>
        <div className="w-full lg:col-span-3 flex flex-col justify-between gap-4">{right.map((item) => <Link key={item.id} href={`/gallery/${item.id}`} className="group relative block w-full aspect-[16/10] overflow-hidden rounded border border-neutral-200 shadow-sm bg-neutral-900 flex-1"><img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"/><div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 text-left"><h3 className="text-[14px] lg:text-[15px] font-normal text-white leading-snug line-clamp-2">{item.title}</h3></div></Link>)}</div>
      </div>
    </section>
  );
}
