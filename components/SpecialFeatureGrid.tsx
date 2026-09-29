'use client';

import { PLACEHOLDER_IMAGE } from '@/lib/public-data';
import { retryAlternateMediaHost } from '@/lib/urls';

import React, { useState } from 'react';
import Link from 'next/link';

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImg?: string | null;
  image?: string;
  imageUrl?: string;
  category?: {
    name: string;
    slug: string;
  };
}

interface SpecialFeatureConfig {
  isSectionActive?: boolean;
  sectionTitle?: string;
  layoutStyle?: string;
  showBanner?: boolean;
  bannerImage?: string;
  bannerTargetLink?: string;
  showScoreWidget?: boolean;
  postRoles?: Record<string, 'main_lead' | 'sub_lead' | 'queued'>;
}

interface SpecialFeatureGridProps {
  news?: NewsArticle[];
  config?: SpecialFeatureConfig;
}

export default function SpecialFeatureGrid({ news = [], config }: SpecialFeatureGridProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  
  // 1. MASTER SWITCH: Hide section completely if disabled
  if (config && config.isSectionActive === false) {
    return null;
  }

  const sectionTitle = config?.sectionTitle || "বিশ্বকাপ ২০২৬";
  const layoutStyle = config?.layoutStyle || "classic_split";
  const shouldShowBanner = config?.showBanner ?? true;
  const bannerImageSrc = config?.bannerImage || '';
  const bannerLinkUrl = config?.bannerTargetLink || "#";
  const shouldShowScoreWidget = config?.showScoreWidget ?? true;
  const roles = config?.postRoles || {};

  // Resolve Main Lead and Sub Leads
  let mainLeadArticle = news.find((item) => roles[item.id] === 'main_lead');
  let subLeadArticles = news.filter((item) => roles[item.id] === 'sub_lead');
  const hasExplicitRoles = news.some((item) => roles[item.id] !== undefined);

  if (!mainLeadArticle && news.length > 0 && !hasExplicitRoles) {
    mainLeadArticle = news[0];
  }
  if (subLeadArticles.length === 0 && news.length > 1 && !hasExplicitRoles) {
    subLeadArticles = news.filter((item) => item.id !== mainLeadArticle?.id).slice(0, 3);
  }

  const bottomArticles = news
    .filter((item) => item.id !== mainLeadArticle?.id && !subLeadArticles.some((sub) => sub.id === item.id))
    .slice(0, 3);
  const featuredArticles: NewsArticle[] = [mainLeadArticle, ...subLeadArticles]
    .filter((item): item is NewsArticle => Boolean(item));
  const currentSlide = featuredArticles[activeSlide % Math.max(1, featuredArticles.length)];

  const getImageUrl = (item?: NewsArticle) =>
    item?.featuredImg || item?.imageUrl || item?.image || PLACEHOLDER_IMAGE;

  const scoreMatches = [
    { 
      isLive: true, 
      status: "লাইভ • দ্বিতীয়ার্ধ (৭৮ মি.)", 
      team1: "আর্জেন্টিনা", flag1: "🇦🇷", score1: "২", 
      team2: "ব্রাজিল", flag2: "🇧🇷", score2: "১" 
    },
    { 
      isLive: false, 
      status: "খেলা শেষ", 
      team1: "ফ্রান্স", flag1: "🇫🇷", score1: "৩", 
      team2: "জার্মানি", flag2: "🇩🇪", score2: "০" 
    },
    { 
      isLive: false, 
      status: "আজ - রাত ১:০০ টা", 
      team1: "স্পেন", flag1: "🇪🇸", pts1: "পয়েন্ট: ৬", 
      team2: "মরক্কো", flag2: "🇲🇦", pts2: "পয়েন্ট: ৪", 
      group: "গ্রুপ 'ই'",
      isRoutine: true 
    },
    { 
      isLive: false, 
      status: "আগামীকাল - রাত ১০:৩০ টা", 
      team1: "পর্তুগাল", flag1: "🇵🇹", pts1: "পয়েন্ট: ৩", 
      team2: "ইংল্যান্ড", flag2: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", pts2: "পয়েন্ট: ৭", 
      group: "গ্রুপ 'বি'",
      isRoutine: true
    },
  ];

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 font-kalpurush mt-8 select-none">
      
      {/* PART 1: HEADER */}
      <div className="w-full flex items-center gap-3 pt-5 pb-4 mb-2">
        <h2 className="text-[32px] font-black text-neutral-700 tracking-tight leading-none">
          {sectionTitle}
        </h2>
        <span className="text-red-600 font-black text-[22px] select-none -translate-y-[10px]">
          ❯
        </span>
      </div>

      {/* PART 2: TOP BANNER */}
      {shouldShowBanner && bannerImageSrc && (
        <div className="w-full bg-neutral-100 rounded overflow-hidden mb-6 aspect-[21/9] sm:aspect-[16/5] md:max-h-[220px] border border-neutral-200">
          <Link href={bannerLinkUrl}>
            <img 
              src={bannerImageSrc} 
              alt={sectionTitle}
              className="w-full h-full object-cover"
              onError={(e) => {
                retryAlternateMediaHost(e.currentTarget);
              }}
            />
          </Link>
        </div>
      )}

      {/* PART 3: SCORE & ROUTINE PANEL */}
      {shouldShowScoreWidget && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 border-b-2 border-neutral-200 pb-6 mb-6">
          {scoreMatches.map((match, idx) => {
            if (match.isRoutine) {
              return (
                <div key={idx} className="lg:col-span-3 bg-neutral-50 border border-neutral-200 rounded p-3.5 flex flex-col justify-between h-[125px] hover:border-neutral-300 transition-colors shadow-sm">
                  <div className="w-full flex justify-between items-center mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-neutral-200 text-neutral-700 tracking-wide">
                      {match.status}
                    </span>
                    <span className="text-neutral-400 font-bold text-xs tracking-wide font-sans">{match.group}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[16px] sm:text-lg font-bold text-neutral-700">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl font-sans shrink-0">{match.flag1}</span>
                        <span className="truncate max-w-[120px]">{match.team1}</span>
                      </div>
                      <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded font-sans">{match.pts1}</span>
                    </div>
                    <div className="flex items-center justify-between text-[16px] sm:text-lg font-bold text-neutral-700">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl font-sans shrink-0">{match.flag2}</span>
                        <span className="truncate max-w-[120px]">{match.team2}</span>
                      </div>
                      <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded font-sans">{match.pts2}</span>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={idx} 
                className={`lg:col-span-3 border rounded p-3.5 flex flex-col justify-between h-[125px] transition-colors shadow-sm ${
                  match.isLive 
                    ? 'bg-red-50/40 border-red-200 hover:border-red-300' 
                    : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="w-full flex justify-between items-center mb-1">
                  <span className={`text-xs font-black px-2 py-0.5 rounded tracking-wide ${
                    match.isLive ? 'bg-red-600 text-white animate-pulse' : 'bg-neutral-200 text-neutral-700'
                  }`}>
                    {match.status}
                  </span>
                  {match.isLive && (
                    <span className="text-red-600 font-bold text-xs tracking-wider animate-pulse">● LIVE</span>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[16px] sm:text-lg font-black text-neutral-700">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl font-sans shrink-0">{match.flag1}</span>
                      <span className="truncate max-w-[120px]">{match.team1}</span>
                    </div>
                    <span className={`font-sans text-[22px] font-black pl-2 ${match.isLive ? 'text-red-600' : 'text-neutral-700'}`}>
                      {match.score1}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[16px] sm:text-lg font-black text-neutral-700">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl font-sans shrink-0">{match.flag2}</span>
                      <span className="truncate max-w-[120px]">{match.team2}</span>
                    </div>
                    <span className={`font-sans text-[22px] font-black pl-2 ${match.isLive ? 'text-red-600' : 'text-neutral-700'}`}>
                      {match.score2}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PART 4: DYNAMIC LAYOUT ENGINE */}
      
      {/* LAYOUT 1: Classic Split (1 Lead + 3 Stacked) */}
      {layoutStyle === 'classic_split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b-2 border-neutral-200 pb-6 mb-6">
          {mainLeadArticle && (
            <div className="lg:col-span-6 flex flex-col justify-between lg:border-r lg:border-neutral-200 lg:pr-8">
              <Link href={`/news/${mainLeadArticle.slug}`} className="group block space-y-3.5 w-full text-left">
                <div className="w-full aspect-[16/10] overflow-hidden rounded bg-neutral-100 border border-neutral-200">
                  <img src={getImageUrl(mainLeadArticle)} alt={mainLeadArticle.title} onError={(event) => retryAlternateMediaHost(event.currentTarget)} className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-neutral-700 leading-snug group-hover:text-red-600 transition-colors">
                  {mainLeadArticle.title}
                </h3>
                {mainLeadArticle.excerpt && (
                  <p className="text-[16px] text-neutral-500 font-medium leading-relaxed line-clamp-3">
                    {mainLeadArticle.excerpt}
                  </p>
                )}
                <span className="inline-block text-neutral-700 font-bold text-[15px] hover:text-red-600 transition-colors mt-1">
                  বিস্তারিত পড়ুন...
                </span>
              </Link>
            </div>
          )}

          <div className="lg:col-span-6 flex flex-col justify-between gap-5">
            {subLeadArticles.map((item, idx, arr) => (
              <div key={item.id || idx} className={`w-full ${idx !== arr.length - 1 ? 'border-b border-neutral-200 pb-5' : ''}`}>
                <Link href={`/news/${item.slug}`} className="group grid grid-cols-12 gap-4 items-center bg-white text-left">
                  <div className="col-span-5 aspect-[4/3] w-full overflow-hidden rounded bg-neutral-100 border border-neutral-200 shrink-0">
                    <img src={getImageUrl(item)} alt={item.title} onError={(event) => retryAlternateMediaHost(event.currentTarget)} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                  </div>
                  <div className="col-span-7 flex flex-col justify-between h-full py-1">
                    <h4 className="text-base lg:text-[22px] font-bold text-neutral-700 leading-snug line-clamp-3 group-hover:text-red-600 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-neutral-700 font-bold text-[13px] hover:text-red-600 transition-colors mt-2 block">
                      বিস্তারিত পড়ুন...
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LAYOUT 2: Hero Top Stack */}
      {layoutStyle === 'hero_top' && (
        <div className="space-y-6 border-b-2 border-neutral-200 pb-6 mb-6">
          {mainLeadArticle && (
            <Link href={`/news/${mainLeadArticle.slug}`} className="group relative block w-full aspect-[21/9] rounded overflow-hidden border border-neutral-200">
              <img src={getImageUrl(mainLeadArticle)} alt={mainLeadArticle.title} onError={(event) => retryAlternateMediaHost(event.currentTarget)} className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 flex flex-col justify-end">
                <h3 className="text-white font-black text-2xl sm:text-4xl leading-snug line-clamp-2 group-hover:text-red-400 transition-colors">
                  {mainLeadArticle.title}
                </h3>
              </div>
            </Link>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {subLeadArticles.slice(0, 3).map((item) => (
              <Link key={item.id} href={`/news/${item.slug}`} className="group space-y-2">
                <div className="w-full aspect-[16/10] overflow-hidden rounded border border-neutral-200">
                  <img src={getImageUrl(item)} alt={item.title} onError={(event) => retryAlternateMediaHost(event.currentTarget)} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                </div>
                <h4 className="font-bold text-lg text-neutral-700 line-clamp-2 group-hover:text-red-600 transition-colors">
                  {item.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* LAYOUT 3: Equal 4-Card Grid */}
      {layoutStyle === 'grid_4' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-b-2 border-neutral-200 pb-6 mb-6">
          {[mainLeadArticle, ...subLeadArticles].filter(Boolean).slice(0, 4).map((item) => (
            <Link key={item?.id} href={`/news/${item?.slug}`} className="group space-y-3 bg-neutral-50 p-3 rounded border border-neutral-200">
              <div className="w-full aspect-[16/10] overflow-hidden rounded border">
                <img src={getImageUrl(item!)} alt={item?.title} onError={(event) => retryAlternateMediaHost(event.currentTarget)} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
              </div>
              <h4 className="font-bold text-lg text-neutral-800 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                {item?.title}
              </h4>
            </Link>
          ))}
        </div>
      )}

      {/* LAYOUT 4: Magazine Horizontal Feed */}
      {layoutStyle === 'magazine_stack' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-b-2 border-neutral-200 pb-6 mb-6">
          {[mainLeadArticle, ...subLeadArticles].filter(Boolean).slice(0, 4).map((item) => (
            <Link key={item?.id} href={`/news/${item?.slug}`} className="group flex gap-4 p-3 rounded border border-neutral-200 bg-white items-center">
              <div className="w-1/3 aspect-[4/3] overflow-hidden rounded shrink-0 border">
                <img src={getImageUrl(item!)} alt={item?.title} onError={(event) => retryAlternateMediaHost(event.currentTarget)} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
              </div>
              <div className="w-2/3 space-y-1">
                <h4 className="font-bold text-lg text-neutral-800 line-clamp-2 group-hover:text-red-600 transition-colors">
                  {item?.title}
                </h4>
                {item?.excerpt && <p className="text-xs text-neutral-500 line-clamp-2">{item.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}

      {layoutStyle === 'featured_slider' && currentSlide && (
        <div className="relative mb-6 overflow-hidden rounded border border-neutral-200 bg-neutral-900">
          <Link href={`/news/${currentSlide.slug}`} className="group block">
            <div className="relative aspect-[16/8] sm:aspect-[21/8]">
              <img src={getImageUrl(currentSlide)} alt={currentSlide.title} onError={(event) => retryAlternateMediaHost(event.currentTarget)} className="h-full w-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/15 to-transparent p-5 sm:p-8">
                <span className="mb-2 w-fit rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
                  {activeSlide + 1} / {featuredArticles.length}
                </span>
                <h3 className="max-w-3xl text-xl font-bold leading-snug text-white sm:text-3xl">{currentSlide.title}</h3>
                {currentSlide.excerpt && <p className="mt-2 max-w-2xl line-clamp-2 text-sm text-white/80">{currentSlide.excerpt}</p>}
              </div>
            </div>
          </Link>
          {featuredArticles.length > 1 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 sm:bottom-6 sm:right-6">
              <button type="button" aria-label="Previous featured story" onClick={() => setActiveSlide((index) => (index - 1 + featuredArticles.length) % featuredArticles.length)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg font-bold text-gray-900 hover:bg-white">‹</button>
              <button type="button" aria-label="Next featured story" onClick={() => setActiveSlide((index) => (index + 1) % featuredArticles.length)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg font-bold text-gray-900 hover:bg-white">›</button>
            </div>
          )}
        </div>
      )}

      {layoutStyle === 'editorial_column' && (
        <div className="mb-6 grid grid-cols-1 gap-0 border-y border-neutral-200 md:grid-cols-3">
          {[mainLeadArticle, ...subLeadArticles, ...bottomArticles].filter((item): item is NewsArticle => Boolean(item)).slice(0, 6).map((item, index) => (
            <Link key={item.id} href={`/news/${item.slug}`} className={`group flex gap-3 border-neutral-200 py-4 md:flex-col md:px-4 ${index % 3 !== 2 ? 'md:border-r' : ''} ${index >= 3 ? 'md:border-t' : ''}`}>
              <div className="aspect-[4/3] w-28 shrink-0 overflow-hidden rounded bg-neutral-100 md:aspect-[16/10] md:w-full">
                <img src={getImageUrl(item)} alt={item.title} onError={(event) => retryAlternateMediaHost(event.currentTarget)} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
              </div>
              <div>
                {item.category?.name && <p className="mb-1 text-xs font-semibold text-red-600">{item.category.name}</p>}
                <h4 className="font-bold leading-snug text-neutral-800 group-hover:text-red-600 md:text-lg">{item.title}</h4>
                {item.excerpt && <p className="mt-2 line-clamp-3 text-sm text-neutral-500">{item.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* PART 5: BOTTOM TRI-CARD ROW */}
      {bottomArticles.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch w-full gap-0">
          {bottomArticles.map((card, idx, arr) => (
            <React.Fragment key={card.id || idx}>
              <div className="flex-1 px-4 first:pl-0 last:pr-0 flex flex-col justify-between py-2">
                <Link href={`/news/${card.slug}`} className="group block space-y-3.5 w-full text-left">
                  <div className="w-full aspect-[16/10] overflow-hidden rounded bg-neutral-100 border border-neutral-200">
                    <img src={getImageUrl(card)} alt={card.title} onError={(event) => retryAlternateMediaHost(event.currentTarget)} className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300" />
                  </div>
                  <h3 className="text-lg lg:text-[22px] font-bold text-neutral-700 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                    {card.title}
                  </h3>
                  {card.excerpt && (
                    <p className="text-[16px] text-neutral-500 font-medium leading-relaxed line-clamp-3">
                      {card.excerpt}
                    </p>
                  )}
                  <span className="inline-block text-neutral-700 font-bold text-[14px] hover:text-red-600 transition-colors mt-1">
                    বিস্তারিত পড়ুন...
                  </span>
                </Link>
              </div>
              {idx !== arr.length - 1 && (
                <div className="hidden lg:block w-px bg-neutral-200 my-4 shrink-0"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="border-b-4 border-neutral-300 w-full pt-8 mt-6"></div>

    </section>
  );
}