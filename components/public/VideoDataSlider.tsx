'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import type { PublicHomeData } from '@/types/public';

export default function VideoDataSlider({ videos }: { videos: PublicHomeData['videos'] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  if (!videos.length) return null;
  const scrollSide = (dir: 'left' | 'right') => sliderRef.current?.scrollBy({ left: dir === 'left' ? -900 : 900, behavior: 'smooth' });
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 font-kalpurush mt-8 select-none">
      <div className="w-full flex items-center gap-3 pt-5 pb-4 mb-4"><h2 className="text-[32px] font-black text-neutral-700 tracking-tight leading-none">ভিডিও</h2><span className="text-red-600 font-black text-[22px] select-none -translate-y-[10px]">❯</span></div>
      <div className="relative w-full bg-[#E51A24] pt-8 pb-16 px-12 overflow-hidden group/container">
        <button onClick={() => scrollSide('left')} className="absolute left-2 top-[40%] -translate-y-1/2 z-20 text-white text-[56px] font-light opacity-80 hover:opacity-100 bg-black/10 px-2 rounded h-24 flex items-center justify-center">‹</button>
        <button onClick={() => scrollSide('right')} className="absolute right-2 top-[40%] -translate-y-1/2 z-20 text-white text-[56px] font-light opacity-80 hover:opacity-100 bg-black/10 px-2 rounded h-24 flex items-center justify-center">›</button>
        <div ref={sliderRef} className="w-full flex flex-row gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none">
          {videos.map((video) => <div key={video.id} className="w-full min-w-full sm:min-w-[calc(50%-12px)] lg:min-w-[calc(25%-18px)] snap-start flex flex-col justify-between"><a href={video.link} target="_blank" rel="noreferrer" className="group block space-y-3.5 w-full"><div className="w-full aspect-[16/10] overflow-hidden rounded bg-neutral-900 border border-white/10 relative"><img src="/images/placeholder-news.svg" alt={video.title} className="w-full h-full object-cover opacity-80"/><div className="absolute inset-0 flex items-center justify-center"><span className="bg-[#E51A24] text-white w-12 h-12 rounded-full flex items-center justify-center"><svg className="w-5 h-5 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span></div></div><h3 className="text-[15px] lg:text-[16px] font-normal text-neutral-100 leading-snug line-clamp-2">{video.title}</h3></a></div>)}
        </div>
        <div className="absolute inset-x-0 bottom-4 flex justify-center z-10"><Link href="/video/archive" className="bg-transparent hover:bg-white text-white hover:text-[#E51A24] border border-white px-8 py-1 rounded text-sm">আরো দেখুন</Link></div>
      </div>
      <div className="border-b-4 border-neutral-300 w-full pt-8 mt-6" />
    </section>
  );
}
