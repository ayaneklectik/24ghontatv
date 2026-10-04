'use client';

import { PLACEHOLDER_IMAGE } from '@/lib/public-data';

import React from 'react';
import Link from 'next/link';

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImg?: string | null;
  image?: string;
  category?: {
    name: string;
    slug: string;
  };
  categoryName?: string;
  categorySlug?: string;
}

interface ComponentProps {
  news?: NewsArticle[];
}

export default function NationalSectionGrid({ news = [] }: ComponentProps) {
  // 1. Filter articles that belong to the National / জাতীয় category
  const nationalNews = news.filter((item) => {
    const slug = item.category?.slug || item.categorySlug;
    const name = item.category?.name || item.categoryName;
    return slug === 'national' || name === 'জাতীয়';
  });

  // 2. Fallback to all news if no specific national news is found yet
  const displayArticles = nationalNews.length > 0 ? nationalNews : news;

  // If there are no articles at all, don't break the layout
  if (!displayArticles || displayArticles.length === 0) {
    return null;
  }

  // Slice articles for layout partitions
  const mainStory = displayArticles[0];
  const sideStories = displayArticles.slice(1, 4);
  const bottomStories = displayArticles.slice(4, 8);

  // Helper for images
  const getImageUrl = (item?: NewsArticle) =>
    item?.featuredImg || item?.image || PLACEHOLDER_IMAGE;

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 font-kalpurush mt-8 select-none">
      
      {/* SECTION TITLE HEADER */}
      <div className="w-full flex items-center gap-3 pt-5 pb-4 mb-4">
        <h2 className="text-[32px] font-black text-neutral-700 tracking-tight leading-none">
          জাতীয়
        </h2>
        <span className="text-red-600 font-black text-[22px] select-none -translate-y-[10px]">
          ❯
        </span>
      </div>

      {/* THE 6 VS 6 SPLIT LAYER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border-b border-neutral-200 pb-8 mb-8">
        
        {/* LEFT MAIN SIDE: 6-Columns Main Featured Story */}
        {mainStory && (
          <div className="w-full lg:col-span-6 lg:border-r lg:border-neutral-200 lg:pr-8 flex flex-col justify-between text-left">
            <Link href={`/news/${mainStory.slug}`} className="group block space-y-4 w-full">
              <div className="w-full aspect-[16/9] overflow-hidden rounded bg-neutral-100 border border-neutral-200">
                <img 
                  src={getImageUrl(mainStory)} 
                  alt={mainStory.title} 
                  className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                />
              </div>
              <h3 className="text-2xl lg:text-[32px] font-black text-neutral-700 leading-[1.2] group-hover:text-red-600 transition-colors pt-2">
                {mainStory.title}
              </h3>
              {mainStory.excerpt && (
                <p className="text-[16px] text-neutral-500 font-medium leading-relaxed line-clamp-3">
                  {mainStory.excerpt}
                </p>
              )}
            </Link>
            <Link 
              href={`/news/${mainStory.slug}`} 
              className="inline-block text-neutral-700 font-bold text-[15px] hover:text-red-600 transition-colors pt-2"
            >
              বিস্তারিত পড়ুন...
            </Link>
          </div>
        )}

        {/* RIGHT MAIN SIDE: Side Stories */}
        <div className="w-full lg:col-span-6 lg:pl-4 flex flex-col justify-between text-left h-full">
          {sideStories.map((item, idx, arr) => (
            <div 
              key={item.id || idx} 
              className={`w-full flex flex-col justify-center flex-1 ${
                idx !== arr.length - 1 ? 'border-b border-neutral-200 pb-5 mb-5' : ''
              }`}
            >
              <Link href={`/news/${item.slug}`} className="group grid grid-cols-12 gap-5 items-center bg-white">
                <div className="col-span-6 aspect-[16/10] w-full overflow-hidden rounded bg-neutral-100 border border-neutral-200 shrink-0">
                  <img 
                    src={getImageUrl(item)} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>

                <div className="col-span-6 flex flex-col justify-between h-full py-0.5">
                  <h4 className="text-[17px] lg:text-[19px] font-bold text-neutral-700 leading-snug line-clamp-3 group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-neutral-500 font-bold text-[13px] group-hover:text-red-600 transition-colors mt-2 block">
                    বিস্তারিত পড়ুন
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>

      </div>

      {/* LOWER QUAD FLOOR ROW */}
      {bottomStories.length > 0 && (
        <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-stretch w-full gap-0 pb-4">
          {bottomStories.map((item, idx, arr) => (
            <React.Fragment key={item.id || idx}>
              <div className="w-full sm:w-1/2 lg:flex-1 px-4 first:pl-0 last:pr-0 flex flex-col justify-between py-2">
                <Link href={`/news/${item.slug}`} className="group block space-y-3 w-full text-left">
                  <div className="w-full aspect-[16/10] overflow-hidden rounded bg-neutral-100 border border-neutral-200">
                    <img 
                      src={getImageUrl(item)} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-base font-bold text-neutral-700 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h3>
                </Link>
              </div>
              
              {idx !== arr.length - 1 && (
                <div className={`hidden bg-neutral-200 my-4 shrink-0 ${
                  idx === 1 ? 'sm:hidden lg:block w-px' : 'sm:block w-px'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* MASTER UNIFORM BOUNDARY SOLID SECTION FLOOR */}
      <div className="border-b-4 border-neutral-300 w-full pt-8 mt-6"></div>

    </section>
  );
}