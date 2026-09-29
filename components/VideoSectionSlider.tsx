'use client';

import { PLACEHOLDER_IMAGE } from '@/lib/public-data';

import React, { useRef } from 'react';
import Link from 'next/link';

export default function VideoSectionSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSide = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const offset = direction === 'left' ? -clientWidth * 0.5 : clientWidth * 0.5;
      sliderRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' });
    }
  };

  // 5 unique imagery endpoints assigned to guarantee thumbnail population
  const videos = [
    { 
      id: 1, 
      title: "জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা", 
      img: PLACEHOLDER_IMAGE 
    },
    { 
      id: 2, 
      title: "জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা", 
      img: PLACEHOLDER_IMAGE 
    },
    { 
      id: 3, 
      title: "জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা", 
      img: PLACEHOLDER_IMAGE 
    },
    { 
      id: 4, 
      title: "জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা", 
      img: PLACEHOLDER_IMAGE 
    },
    { 
      id: 5, 
      title: "অতিরিক্ত ৫ নম্বর ভিডিও যা স্ক্রোল করার পর প্রদর্শিত হবে", 
      img: PLACEHOLDER_IMAGE 
    },
  ];

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 font-kalpurush mt-8 select-none">
      
      {/* =========================================================================
          PART 1: COMPONENT TITLE HEADER
          ========================================================================= */}
      <div className="w-full flex items-center gap-3 pt-5 pb-4 mb-4">
        <h2 className="text-[32px] font-black text-neutral-700 tracking-tight leading-none">
          ভিডিও
        </h2>
        <span className="text-red-600 font-black text-[22px] select-none -translate-y-[10px]">
          ❯
        </span>
      </div>

      {/* =========================================================================
          PART 2: IMMERSIVE HORIZONTAL SLIDER BOX ASSEMBLY (With Centered Baseline View More)
          ========================================================================= */}
      <div className="relative w-full bg-[#E51A24] pt-8 pb-16 px-12 overflow-hidden group/container">
        
        {/* Left Navigation Chevron Control */}
        <button 
          onClick={() => scrollSide('left')}
          className="absolute left-2 top-[40%] -translate-y-1/2 z-20 text-white text-[56px] font-light opacity-80 hover:opacity-100 transition-opacity bg-black/10 hover:bg-black/20 px-2 rounded h-24 flex items-center justify-center focus:outline-none"
        >
          ‹
        </button>

        {/* Right Navigation Chevron Control */}
        <button 
          onClick={() => scrollSide('right')}
          className="absolute right-2 top-[40%] -translate-y-1/2 z-20 text-white text-[56px] font-light opacity-80 hover:opacity-100 transition-opacity bg-black/10 hover:bg-black/20 px-2 rounded h-24 flex items-center justify-center focus:outline-none"
        >
          ›
        </button>

        {/* Core Horizontal Scrolling Track Viewport */}
        <div 
          ref={sliderRef}
          className="w-full flex flex-row gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none custom-video-scroller"
          style={{ scrollbarWidth: 'none' }}
        >
          {videos.map((video) => (
            <div 
              key={video.id}
              className="w-full min-w-full sm:min-w-[calc(50%-12px)] lg:min-w-[calc(25%-18px)] snap-start flex flex-col justify-between text-left relative"
            >
              <Link href={`/video/${video.id}`} className="group block space-y-3.5 w-full relative">
                
                {/* Widescreen Media Thumbnail Shell */}
                <div className="w-full aspect-[16/10] overflow-hidden rounded bg-neutral-900 border border-white/10 relative">
                  <img 
                    src={video.img} 
                    alt="ভিডিও থাম্বনেইল" 
                    className="w-full h-full object-cover group-hover:scale-[1.02] opacity-90 group-hover:opacity-100 transition-all duration-300"
                  />
                  
                  {/* YouTube Brand Play Icon Overlayed Top-Left */}
                  <div className="absolute top-3 left-3 bg-[#E51A24] text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md z-10">
                    <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Card Title Content rendering out in Clean Regular White font weight configuration */}
                <h3 className="text-[15px] lg:text-[16px] font-normal text-neutral-100 leading-snug line-clamp-2 group-hover:text-white transition-colors">
                  {video.title}
                </h3>

              </Link>
            </div>
          ))}
        </div>

        {/* =========================================================================
            CENTERED BASELINE OVERLAY LINK FIELD CONTROL ("আরো দেখুন")
            ========================================================================= */}
        <div className="absolute inset-x-0 bottom-4 flex justify-center z-10 select-none">
          <Link 
            href="/video/archive" 
            className="bg-transparent hover:bg-white text-white hover:text-[#E51A24] border border-white px-8 py-1 rounded text-sm font-normal transition-all tracking-wide"
          >
            আরো দেখুন
          </Link>
        </div>

      </div>

      {/* =========================================================================
          PART 3: MASTER SOLID FULL-WIDTH SECTION BOUNDARY FOOTER LINE
          ========================================================================= */}
      <div className="border-b-4 border-neutral-300 w-full pt-8 mt-6"></div>

      <style jsx global>{`
        .custom-video-scroller::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}