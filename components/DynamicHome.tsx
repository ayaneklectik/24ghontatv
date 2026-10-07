"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Play, ArrowUpRight, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import type { NewsItem, PublicHomeData } from "@/types/public";
import { absoluteUrl, newsSummary } from "@/lib/public-data";
import { resolveExternalUrl, resolveVideoUrl, retryAlternateMediaHost, youtubeThumbnailUrl } from "@/lib/urls";
import { toBengaliDigits } from "@/lib/bengali";
import SpecialFeatureGrid from "@/components/SpecialFeatureGrid";

function newsHref(item: NewsItem) {
  return `/news/${encodeURIComponent(item.id)}`;
}

function imageSrc(item?: NewsItem) {
  return item?.imageUrl || "/images/placeholder-news.svg";
}

function parsePublishedDate(value: string) {
  const match = value.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T]+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?)?$/i);
  if (match) {
    const [, year, month, day, rawHour = "0", minute = "0", second = "0", period] = match;
    let hour = Number(rawHour);
    if (period?.toUpperCase() === "PM" && hour < 12) hour += 12;
    if (period?.toUpperCase() === "AM" && hour === 12) hour = 0;

    const date = new Date(Number(year), Number(month) - 1, Number(day), hour, Number(minute), Number(second));
    if (
      date.getFullYear() === Number(year) &&
      date.getMonth() === Number(month) - 1 &&
      date.getDate() === Number(day) &&
      date.getHours() === hour &&
      date.getMinutes() === Number(minute) &&
      date.getSeconds() === Number(second)
    ) {
      return date;
    }
    return null;
  }

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? null : new Date(timestamp);
}

function topStoryPublishedAt(value: string, now: number | null) {
  if (now === null) return value;

  const published = parsePublishedDate(value);
  if (!published) return value;

  const elapsed = now - published.getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  if (elapsed < 0 || elapsed >= oneDay) return value;

  const hours = Math.max(1, Math.floor(elapsed / (60 * 60 * 1000)));
  return `${toBengaliDigits(hours)} ঘণ্টা আগে`;
}

function SectionTitle({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4 border-b-2 border-red-200 pb-2.5">
      <div className="flex items-center gap-2.5">
        <h2 className="text-[25px] font-black leading-none tracking-tight text-neutral-800 sm:text-[27px]">{title}</h2>
        <span className="-translate-y-0.5 text-[17px] font-black text-red-600">❯</span>
      </div>
      {href && (
        <Link href={href} className="flex items-center gap-1 text-xs font-bold text-neutral-600 transition-colors hover:text-red-600">
          আরও দেখুন <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

function ImageWithFallback({ src, alt, className, fallbackSrc = "/images/placeholder-news.svg" }: { src: string; alt: string; className: string; fallbackSrc?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(event) => {
        retryAlternateMediaHost(event.currentTarget, fallbackSrc);
      }}
    />
  );
}

function useNewsSummary(item: NewsItem | undefined, enabled: boolean) {
  const [loadedSummary, setLoadedSummary] = useState<{ id: string; text: string } | null>(null);
  const summary = (item ? newsSummary(item, 26) : "") ||
    (loadedSummary && loadedSummary.id === item?.id ? loadedSummary.text : "");

  useEffect(() => {
    if (!enabled || !item || summary) return;

    let active = true;

    const loadSummary = async () => {
      try {
        const response = await fetch(`/api/news/${encodeURIComponent(item.id)}`, {
          headers: { Accept: "application/json" },
        });
        if (!response.ok) {
          throw new Error(`News summary request failed for ${item.id} with HTTP ${response.status}.`);
        }
        const payload = await response.json();
        const news = payload?.data?.news ?? payload?.data ?? {};
        const fetchedSummary = newsSummary({
          excerpt: news.excerpt ?? news.news_sub_title ?? news.summary,
          content: news.content ?? news.dis,
        }, 26);

        if (active) setLoadedSummary({ id: item.id, text: fetchedSummary });
      } catch (error) {
        if (active) console.error(`Could not load summary for story ${item.id}:`, error);
      }
    };

    void loadSummary();
    return () => {
      active = false;
    };
  }, [enabled, item?.id, summary]);

  return summary;
}

function HeadlineCard({ item, large = false, showSummary = false, showRelativeTime = false, now = null }: { item: NewsItem; large?: boolean; showSummary?: boolean; showRelativeTime?: boolean; now?: number | null }) {
  const summary = useNewsSummary(item, showSummary);
  const publishedAt = showRelativeTime ? topStoryPublishedAt(item.publishedAt, now) : item.publishedAt;

  return (
    <Link href={newsHref(item)} className="group block text-left">
      <div className="aspect-[16/10] overflow-hidden border border-neutral-200 bg-neutral-100">
        <ImageWithFallback src={imageSrc(item)} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
      </div>
      {(item.category || item.publishedAt) && (
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {item.category && <span className="rounded-sm bg-red-600 px-2 py-0.5 text-[11px] font-black leading-tight text-white">{item.category}</span>}
          {publishedAt && <span className={`flex items-center gap-1 ${showRelativeTime ? "text-xs font-black text-neutral-900" : "text-[11px] font-bold text-neutral-600"}`}><Clock3 className={`h-3 w-3 shrink-0 ${showRelativeTime ? "text-neutral-700" : "text-neutral-500"}`} />{publishedAt}</span>}
        </div>
      )}
      <h3 className={`${large ? "text-[22px] sm:text-[28px]" : "text-[17px] sm:text-[19px]"} mt-2 font-black leading-[1.25] text-neutral-900 transition-colors group-hover:text-red-700 line-clamp-3`}>
        {item.title}
      </h3>
      {showSummary && summary && <p className="mt-2 line-clamp-4 text-[14px] font-medium leading-[1.55] text-neutral-700 sm:text-[15px]">{summary}</p>}
      <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-neutral-800 transition-colors group-hover:text-red-700">
        বিস্তারিত <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}

function TopStories({ recent, popular }: { recent: NewsItem[]; popular: NewsItem[] }) {
  const [tab, setTab] = useState<"recent" | "popular">("recent");
  const [now, setNow] = useState<number | null>(null);
  const list = tab === "recent" ? recent : popular;
  const stories = useMemo(() => list.slice(0, 8), [list]);

  useEffect(() => {
    setNow(Date.now());
    const interval = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  if (!stories.length) return null;

  return (
    <section className="mx-auto mt-7 w-full max-w-[2160px] px-4 font-kalpurush sm:px-6">
      <div className="rounded-sm border border-[#ead98f] bg-[#fff8d9] p-3 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 border-b border-[#e6d27b] pb-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[25px] font-black leading-none text-neutral-900 sm:text-[28px]"><span className="text-red-600">২৪</span>ঘণ্টার শীর্ষ সংবাদ</h2>
            <span className="-translate-y-0.5 text-[17px] font-black text-red-600">❯</span>
          </div>
          <div className="flex items-center gap-4">
            {(["recent", "popular"] as const).map((key) => {
              const active = tab === key;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setTab(key)}
                  className={`border-b-2 px-1 pb-1 text-sm font-bold transition-colors ${active ? "border-red-600 text-neutral-800" : "border-transparent text-neutral-500 hover:text-neutral-800"}`}
                >
                  {key === "recent" ? "সাম্প্রতিক" : "জনপ্রিয়"}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
          {stories.map((item, index) => (
            <article key={item.id} className={`min-w-0 ${index > 0 ? "border-t border-neutral-200 pt-4 sm:border-t-0 sm:pt-0" : ""} xl:border-r xl:pr-4 xl:last:border-r-0 xl:last:pr-0`}>
              <HeadlineCard item={item} showSummary showRelativeTime now={now} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategorySection({ title, slug, news, reverse = false }: { title: string; slug: string; news: NewsItem[]; reverse?: boolean }) {
  const items = news.slice(0, 7);
  if (!items.length) return null;
  const isSports = /খেল|ক্রীড়া|ক্রিড়া|sports/i.test(`${title} ${slug}`);

  if (isSports) {
    return (
      <section className="mx-auto mt-7 w-full max-w-[2160px] px-4 font-kalpurush sm:px-6">
        <SectionTitle title={title} href={`/category/${encodeURIComponent(slug)}`} />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {items.slice(0, 4).map((item) => (
            <HeadlineCard key={item.id} item={item} />
          ))}
        </div>
        {items.length > 4 && (
          <div className="mt-4 grid grid-cols-1 gap-3 border-t border-neutral-200 pt-4 sm:grid-cols-3">
            {items.slice(4, 7).map((item) => (
              <Link key={item.id} href={newsHref(item)} className="group grid grid-cols-[96px_minmax(0,1fr)] gap-3">
                <div className="aspect-[4/3] overflow-hidden border border-neutral-200 bg-neutral-100">
                  <ImageWithFallback src={imageSrc(item)} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                </div>
                <div className="min-w-0">
                  <h3 className="line-clamp-3 text-sm font-bold leading-snug text-neutral-700 transition-colors group-hover:text-red-600">{item.title}</h3>
                  {item.publishedAt && <p className="mt-1.5 text-[11px] text-neutral-500">{item.publishedAt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-6 border-b border-neutral-200" />
      </section>
    );
  }

  return (
    <section className="mx-auto mt-7 w-full max-w-[2160px] px-4 font-kalpurush sm:px-6">
      <SectionTitle title={title} href={`/category/${encodeURIComponent(slug)}`} />
      <div className={`grid grid-cols-1 gap-5 lg:grid-cols-12 ${reverse ? "lg:[&>.category-feature]:order-2 lg:[&>.category-side]:order-1" : ""}`}>
        <div className="category-feature lg:col-span-6">
          <HeadlineCard item={items[0]} large />
        </div>
        <div className="category-side grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-6">
          {items.slice(1, 5).map((item) => (
            <HeadlineCard key={item.id} item={item} />
          ))}
        </div>
      </div>
      {items.length > 5 && (
        <div className="mt-6 grid grid-cols-1 gap-5 border-t border-neutral-200 pt-5 sm:grid-cols-2">
          {items.slice(5, 7).map((item) => (
            <Link key={item.id} href={newsHref(item)} className="group flex gap-4">
              <div className="h-24 w-36 shrink-0 overflow-hidden rounded bg-neutral-100 sm:h-28 sm:w-44">
                <ImageWithFallback src={imageSrc(item)} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
              </div>
              <div className="py-1">
                <h3 className="line-clamp-3 text-[17px] font-bold leading-snug text-neutral-700 transition-colors group-hover:text-red-600 sm:text-[20px]">{item.title}</h3>
                {item.excerpt && <p className="mt-1 hidden line-clamp-2 text-sm text-neutral-500 sm:block">{item.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="mt-6 border-b border-neutral-200" />
    </section>
  );
}

function SpecialSection({ home }: { home: PublicHomeData }) {
  const special = home.special_section;
  if (!special) return null;

  const news = (special.posts ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    content: item.content,
    imageUrl: item.imageUrl,
  }));

  return <SpecialFeatureGrid news={news} config={special} />;
}

function VideoSection({ videos }: { videos: PublicHomeData["videos"] }) {
  const [index, setIndex] = useState(0);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const items = videos.slice(0, 8);
  if (!items.length) return null;

  const visible = 4;
  const maxIndex = Math.max(0, items.length - visible);
  const activeVideo = items.find((video) => video.id === activeVideoId) ?? items[0];

  return (
    <section className="mx-auto mt-7 w-full max-w-[2160px] px-4 font-kalpurush sm:px-6">
      <SectionTitle title="ভিডিও" href="/video/archive" />
      <div className="relative overflow-hidden bg-[#E51A24] px-10 pb-14 pt-7 sm:px-12">
        <div className="mb-6 grid overflow-hidden rounded-lg bg-neutral-950 shadow-xl lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)]">
          <div className="aspect-video bg-black">
            {activeVideo.embedUrl ? (
              <iframe
                src={activeVideo.embedUrl}
                title={activeVideo.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <a href={activeVideo.link} target="_blank" rel="noopener noreferrer" className="flex h-full items-center justify-center gap-3 text-white">
                <Play className="h-10 w-10 fill-current" />
                <span className="font-bold">ভিডিওটি ইউটিউবে দেখুন</span>
              </a>
            )}
          </div>
          <div className="flex flex-col justify-center p-5 text-white sm:p-7">
            <span className="text-xs font-bold uppercase tracking-wider text-red-300">এখন চলছে</span>
            <h3 className="mt-2 text-xl font-black leading-snug sm:text-2xl">{activeVideo.title}</h3>
            {activeVideo.publishedAt && <p className="mt-3 text-sm text-neutral-400">{activeVideo.publishedAt}</p>}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
          className="absolute left-2 top-1/2 z-10 flex h-16 w-8 -translate-y-1/2 items-center justify-center rounded bg-black/10 text-4xl text-white transition hover:bg-black/20 disabled:opacity-40"
          disabled={index === 0}
          aria-label="পেছনের ভিডিও"
        >
          <ChevronLeft />
        </button>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.slice(index, index + visible).map((video) => {
            const link = resolveVideoUrl(video.link) || `/video/${encodeURIComponent(video.id)}`;
            const thumbnail = video.thumbnailUrl || youtubeThumbnailUrl(resolveVideoUrl(video.link));
            return (
              <button
                key={video.id}
                type="button"
                onClick={() => setActiveVideoId(video.id)}
                aria-pressed={activeVideo.id === video.id}
                className={`group block w-full text-left ${activeVideo.id === video.id ? "rounded outline outline-2 outline-white" : ""}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded border border-white/10 bg-neutral-900">
                  <ImageWithFallback src={thumbnail || "/images/placeholder-news.svg"} alt={video.title} className="h-full w-full object-cover opacity-90 transition duration-300 group-hover:scale-[1.03] group-hover:opacity-100" />
                  <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#E51A24] text-white shadow-lg"><Play className="h-4 w-4 fill-current" /></span>
                </div>
                <h3 className="mt-3 line-clamp-2 text-[15px] leading-snug text-white transition-colors group-hover:text-neutral-100">{video.title}</h3>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setIndex((value) => Math.min(maxIndex, value + 1))}
          className="absolute right-2 top-1/2 z-10 flex h-16 w-8 -translate-y-1/2 items-center justify-center rounded bg-black/10 text-4xl text-white transition hover:bg-black/20 disabled:opacity-40"
          disabled={index === maxIndex}
          aria-label="পরের ভিডিও"
        >
          <ChevronRight />
        </button>
        <div className="absolute inset-x-0 bottom-3 flex justify-center">
          <Link href="/video/archive" className="border border-white px-8 py-1 text-sm text-white transition hover:bg-white hover:text-[#E51A24]">আরো দেখুন</Link>
        </div>
      </div>
      <div className="mt-6 border-b border-neutral-200" />
    </section>
  );
}

function PhotoSection({ photos }: { photos: PublicHomeData["photos"] }) {
  const items = photos.slice(0, 5);
  if (!items.length) return null;

  return (
    <section className="mx-auto mt-7 w-full max-w-[2160px] px-4 font-kalpurush sm:px-6">
      <SectionTitle title="ছবি" href="/gallery" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Link href={`/gallery/${encodeURIComponent(items[0].id)}`} className="group relative block overflow-hidden border border-neutral-200 bg-neutral-900 lg:col-span-6">
          <div className="aspect-[16/10] lg:h-full lg:aspect-auto">
            <ImageWithFallback src={items[0].imageUrl} alt={items[0].title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5">
            <h3 className="line-clamp-2 text-[19px] font-bold leading-snug text-white sm:text-[23px]">{items[0].title}</h3>
          </div>
        </Link>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-6">
          {items.slice(1, 5).map((photo) => (
            <Link key={photo.id} href={`/gallery/${encodeURIComponent(photo.id)}`} className="group relative block overflow-hidden border border-neutral-200 bg-neutral-900">
              <div className="aspect-[16/10]">
                <ImageWithFallback src={photo.thumbnailUrl || photo.imageUrl} alt={photo.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3">
                <h3 className="line-clamp-2 text-[14px] font-bold leading-snug text-white">{photo.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function DynamicHome({ home }: { home: PublicHomeData }) {
  const allNews = useMemo(
    () => {
      const seen = new Set<string>();
      return [...home.latest_news, ...home.popular_news, ...home.top_five].filter((item) => {
        if (!item.id || seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
    },
    [home.latest_news, home.popular_news, home.top_five]
  );

  const hero = home.latest_news.find((item) => item.isLead) || home.top_five[0] || home.latest_news[0];
  const heroSummary = useNewsSummary(hero, Boolean(hero));
  const heroBottom = home.latest_news.filter((item) => item.id !== hero?.id).slice(0, 4);
  const recent = home.latest_news.length ? home.latest_news : allNews;
  const popular = home.popular_news.length ? home.popular_news : home.top_five;

  return (
    <main className="w-full bg-white pb-12 font-kalpurush">
      {hero ? (
        <section className="mx-auto mt-5 w-full max-w-[2160px] px-4 font-kalpurush sm:px-6">
          <div className="grid grid-cols-1 gap-5 border-b border-neutral-300 pb-5 md:grid-cols-12 md:gap-7">
            <div className="flex min-w-0 flex-col justify-start md:col-span-5 md:border-r md:border-neutral-200 md:pr-7 md:pt-2">
              <Link href={newsHref(hero)} className="group block text-left">
                {hero.category && <span className="mb-2 block text-[12px] font-black uppercase tracking-[0.1em] text-red-600">{hero.category}</span>}
                <h1 className="text-[28px] font-black leading-[1.15] text-neutral-800 transition-colors group-hover:text-red-600 sm:text-[30px] lg:text-[34px]">{hero.title}</h1>
                {heroSummary && <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-neutral-600 sm:text-[15px]">{heroSummary}</p>}
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-neutral-700 transition-colors group-hover:text-red-600">বিস্তারিত পড়ুন <ArrowUpRight className="h-4 w-4" /></span>
              </Link>
            </div>
            <div className="min-w-0 md:col-span-7">
              <Link href={newsHref(hero)} className="group block aspect-[16/9] overflow-hidden bg-neutral-100">
                <ImageWithFallback src={imageSrc(hero)} alt={hero.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
              </Link>
            </div>
          </div>
          {heroBottom.length > 0 && (
            <div className="grid grid-cols-2 gap-4 pt-5 sm:grid-cols-4 sm:gap-5">
              {heroBottom.map((item) => (
                <div key={item.id} className="border-l border-neutral-200 pl-3 first:border-0 first:pl-0 sm:pl-4">
                  <HeadlineCard item={item} />
                </div>
              ))}
            </div>
          )}
          <div className="mt-5 border-b border-neutral-200" />
        </section>
      ) : (
        <div className="mx-auto max-w-[2160px] px-4 py-24 text-center text-neutral-500">কোনো সংবাদ পাওয়া যায়নি।</div>
      )}

      <SpecialSection home={home} />
      <TopStories recent={recent} popular={popular} />
      <VideoSection videos={home.videos} />

      {home.sections.map((section, index) => (
        <CategorySection
          key={section.category.id}
          title={section.category.name}
          slug={section.category.slug}
          news={section.news}
          reverse={index % 2 === 1}
        />
      ))}

      {(home.ads?.home?.length ?? 0) > 0 && (
        <section className="mx-auto mt-8 w-full max-w-[2160px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {home.ads?.home.slice(0, 4).map((ad) => {
              if (!ad.image_url) return null;
              const link = resolveExternalUrl(ad.company_link) || "/";
              return (
                <a key={ad.id} href={link} target={link.startsWith("http") ? "_blank" : undefined} rel={link.startsWith("http") ? "noopener noreferrer" : undefined} className="group block overflow-hidden border border-neutral-200 bg-neutral-50">
                  <ImageWithFallback src={absoluteUrl(ad.image_url)} alt="Advertisement" className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-[1.01] sm:h-52" fallbackSrc="https://24ghontatv.com/public/images/ad/for_ad_image.png" />
                </a>
              );
            })}
          </div>
        </section>
      )}

      {home.site.live_video?.status && home.site.live_video.live_video_link && (
        <section className="mx-auto mt-8 w-full max-w-[2160px] px-4 sm:px-6">
          <a href={resolveVideoUrl(home.site.live_video.live_video_link) || "/video/archive"} target="_blank" rel="noopener noreferrer" className="group block bg-neutral-950 px-6 py-7 text-white">
            <div className="mb-2 text-xs font-black tracking-[0.2em] text-red-500">● LIVE</div>
            <h2 className="text-2xl font-black transition-colors group-hover:text-red-400">{home.site.live_video.live_title || "২৪ঘণ্টা লাইভ দেখুন"}</h2>
          </a>
        </section>
      )}

      <PhotoSection photos={home.photos} />
    </main>
  );
}
