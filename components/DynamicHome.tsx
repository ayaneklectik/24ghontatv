"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Play, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { NewsItem, PublicHomeData } from "@/types/public";
import { absoluteUrl, mapNewsItem, newsSummary } from "@/lib/public-data";
import { resolveExternalUrl, resolveVideoUrl, retryAlternateMediaHost, youtubeThumbnailUrl } from "@/lib/urls";
import { toBengaliDigits } from "@/lib/bengali";
import SpecialFeatureGrid from "@/components/SpecialFeatureGrid";

function newsHref(item: NewsItem) {
  return `/news/${encodeURIComponent(item.id)}`;
}

function imageSrc(item?: NewsItem) {
  return item?.imageUrl || "/images/placeholder-news.svg";
}

function ArticlePreview({ item, className }: { item: NewsItem; className: string }) {
  const summary = newsSummary(item);
  const [fetchedSummary, setFetchedSummary] = useState("");
  const preview = summary || fetchedSummary;

  useEffect(() => {
    setFetchedSummary("");
    if (summary || !item.id) return;

    const controller = new AbortController();
    const loadSummary = async () => {
      try {
        const response = await fetch(`/api/news/${encodeURIComponent(item.id)}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Article preview request failed: ${response.status}`);
        }

        const payload = await response.json();
        const article = mapNewsItem(
          payload?.data?.news ?? payload?.data ?? payload?.news ?? payload,
        );
        setFetchedSummary(newsSummary(article));
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Article preview API error:", error);
        }
      }
    };

    void loadSummary();
    return () => controller.abort();
  }, [item.id, summary]);

  if (!preview) return null;

  return <p className={className}>{preview}</p>;
}

function SectionTitle({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 border-b border-neutral-200 pb-4">
      <div className="flex items-center gap-3">
        <h2 className="text-[30px] font-black leading-none tracking-tight text-neutral-700 sm:text-[32px]">{title}</h2>
        <span className="-translate-y-1 text-[20px] font-black text-red-600">❯</span>
      </div>
      {href && (
        <Link href={href} className="flex items-center gap-1 text-sm font-bold text-neutral-600 transition-colors hover:text-red-600">
          আরও দেখুন <ArrowUpRight className="h-4 w-4" />
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

function TopFiveTimestamp({ publishedAt }: { publishedAt?: string }) {
  if (!publishedAt) return null;

  const normalized = publishedAt.includes("T") ? publishedAt : publishedAt.replace(" ", "T");
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return null;

  const dateText = new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  const timeText = new Intl.DateTimeFormat("bn-BD", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  const elapsedMs = Math.max(0, Date.now() - date.getTime());
  const minutes = Math.floor(elapsedMs / 60000);
  const hours = Math.floor(elapsedMs / 3600000);
  const days = Math.floor(elapsedMs / 86400000);
  const elapsedText =
    minutes < 1 ? "এইমাত্র" :
    minutes < 60 ? `${toBengaliDigits(minutes)} মিনিট আগে` :
    hours < 24 ? `${toBengaliDigits(hours)} ঘণ্টা আগে` :
    `${toBengaliDigits(days)} দিন আগে`;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
      <span className="font-medium text-neutral-700">{dateText}</span>
      <span className="font-black text-black">{timeText}</span>
      <span aria-hidden="true" className="text-neutral-500">•</span>
      <span className="font-black text-black">{elapsedText}</span>
    </div>
  );
}

function HeadlineCard({ item, large = false, topFiveMeta = false }: { item: NewsItem; large?: boolean; topFiveMeta?: boolean }) {
  return (
    <Link href={newsHref(item)} className="group -m-2 block rounded p-2 text-left transition-colors duration-200 hover:bg-[#f5f5f5]">
      <div className={`${large ? "aspect-[16/10]" : "aspect-[16/10]"} overflow-hidden rounded bg-neutral-100 border border-neutral-200`}>
        <ImageWithFallback src={imageSrc(item)} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
      </div>
      {item.category && (
        topFiveMeta ? (
          <div className="mt-3 inline-flex rounded-sm bg-red-600 px-2 py-1 text-[12px] font-black leading-none text-white">
            {item.category}
          </div>
        ) : (
          <div className="mt-3 text-[13px] font-bold text-red-600">{item.category}</div>
        )
      )}
      <h3 className={`${large ? "text-[28px] sm:text-[34px]" : "text-[18px] sm:text-[21px]"} mt-1 font-black leading-[1.2] text-neutral-700 transition-colors group-hover:text-red-600 line-clamp-3`}>
        {item.title}
      </h3>
      {topFiveMeta && <TopFiveTimestamp publishedAt={item.publishedAt} />}
      {large && (
        <ArticlePreview
          item={item}
          className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-neutral-500 sm:text-[17px]"
        />
      )}
    </Link>
  );
}

function TopFive({ recent, popular }: { recent: NewsItem[]; popular: NewsItem[] }) {
  const [tab, setTab] = useState<"recent" | "popular">("recent");
  const list = tab === "recent" ? recent : popular;
  const lead = list[0];

  if (!lead) return null;

  return (
    <section className="mt-8 w-full bg-[#fff8d9] font-kalpurush">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6">
        <div className="flex flex-col gap-4 border-b border-neutral-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-[30px] font-black leading-none sm:text-[32px]">
              <span className="text-red-600">২৪</span>
              <span className="text-neutral-700">ঘণ্টার শীর্ষ সংবাদ</span>
            </h2>
            <span className="-translate-y-1 text-[20px] font-black text-red-600">❯</span>
          </div>
          <div className="flex items-center gap-5">
            {(["recent", "popular"] as const).map((key) => {
              const active = tab === key;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setTab(key)}
                  className={`border-b-2 pb-2 text-[19px] font-black transition-colors ${active ? "border-red-600 text-neutral-700" : "border-transparent text-neutral-400 hover:text-neutral-600"}`}
                >
                  {key === "recent" ? "সাম্প্রতিক" : "জনপ্রিয়"}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 py-6 lg:grid-cols-12">
          <div className="lg:col-span-8 lg:border-r lg:border-neutral-200 lg:pr-8">
            <HeadlineCard item={lead} large topFiveMeta />
          </div>
          <div className="divide-y divide-neutral-200 lg:col-span-4">
            {list.slice(1, 6).map((item, index) => (
              <Link key={item.id} href={newsHref(item)} className="group -mx-2 grid grid-cols-[40px_96px_1fr] gap-3 rounded px-2 py-4 transition-colors duration-200 hover:bg-[#f5f5f5] first:pt-0 last:pb-0">
                <span className="text-[30px] font-black leading-none text-neutral-300 group-hover:text-red-600">{toBengaliDigits(index + 2)}</span>
                <div className="aspect-[4/3] overflow-hidden rounded bg-neutral-100">
                  <ImageWithFallback src={imageSrc(item)} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                </div>
                <div>
                  {item.category && (
                    <span className="mb-2 inline-flex rounded-sm bg-red-600 px-2 py-1 text-[11px] font-black leading-none text-white">
                      {item.category}
                    </span>
                  )}
                  <h3 className="line-clamp-3 text-[16px] font-bold leading-snug text-neutral-700 transition-colors group-hover:text-red-600 sm:text-[18px]">{item.title}</h3>
                  <TopFiveTimestamp publishedAt={item.publishedAt} />
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="border-b-4 border-neutral-300" />
      </div>
    </section>
  );
}
function CategorySection({ title, slug, news, reverse = false }: { title: string; slug: string; news: NewsItem[]; reverse?: boolean }) {
  const items = news.slice(0, 7);
  if (!items.length) return null;

  return (
    <section className="mx-auto mt-8 w-full max-w-[1440px] px-4 font-kalpurush sm:px-6">
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
            <Link key={item.id} href={newsHref(item)} className="group -m-2 flex gap-4 rounded p-2 transition-colors duration-200 hover:bg-[#f5f5f5]">
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
      <div className="border-b-4 border-neutral-300 pb-8" />
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
    <section className="mx-auto mt-8 w-full max-w-[1440px] px-4 font-kalpurush sm:px-6">
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
      <div className="border-b-4 border-neutral-300 pb-8" />
    </section>
  );
}

function PhotoSection({ photos }: { photos: PublicHomeData["photos"] }) {
  const items = photos.slice(0, 5);
  if (!items.length) return null;

  return (
    <section className="mx-auto mt-8 w-full max-w-[1440px] px-4 font-kalpurush sm:px-6">
      <SectionTitle title="ছবি" href="/gallery" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Link href={`/gallery/${encodeURIComponent(items[0].id)}`} className="group relative block overflow-hidden rounded border border-neutral-200 bg-neutral-900 lg:col-span-6">
          <div className="aspect-[16/10] lg:h-full lg:aspect-auto">
            <ImageWithFallback src={items[0].imageUrl} alt={items[0].title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5">
            <h3 className="line-clamp-2 text-[19px] font-bold leading-snug text-white sm:text-[23px]">{items[0].title}</h3>
          </div>
        </Link>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-6">
          {items.slice(1, 5).map((photo) => (
            <Link key={photo.id} href={`/gallery/${encodeURIComponent(photo.id)}`} className="group relative block overflow-hidden rounded border border-neutral-200 bg-neutral-900">
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
  const heroBottom = home.latest_news.filter((item) => item.id !== hero?.id).slice(0, 4);
  const recent = home.latest_news.length ? home.latest_news : allNews;
  const popular = home.popular_news.length ? home.popular_news : home.top_five;

  return (
    <main className="w-full bg-white pb-12 font-kalpurush">
      {hero ? (
        <section className="mx-auto mt-5 w-full max-w-[1200px] px-4 font-kalpurush sm:px-6">
          <div className="grid grid-cols-1 gap-5 border-b border-neutral-300 pb-5 lg:grid-cols-12 lg:gap-7">
            <div className="flex flex-col justify-center lg:col-span-5 lg:border-r lg:border-neutral-200 lg:pr-7">
              <Link href={newsHref(hero)} className="group -m-2 block rounded p-2 text-left transition-colors duration-200 hover:bg-[#f5f5f5]">
                {hero.category && <span className="mb-2 block text-sm font-bold text-red-600">{hero.category}</span>}
                <h1 className="text-[25px] font-black leading-[1.2] text-neutral-800 transition-colors group-hover:text-red-600 sm:text-[30px] lg:text-[34px]">{hero.title}</h1>
                <ArticlePreview
                  item={hero}
                  className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-neutral-600 sm:text-[16px]"
                />
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-neutral-700 transition-colors group-hover:text-red-600">বিস্তারিত পড়ুন <ArrowUpRight className="h-4 w-4" /></span>
              </Link>
            </div>
            <div className="lg:col-span-7">
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
          <div className="border-b-4 border-neutral-300" />
        </section>
      ) : (
        <div className="mx-auto max-w-[1440px] px-4 py-24 text-center text-neutral-500">কোনো সংবাদ পাওয়া যায়নি।</div>
      )}

      <SpecialSection home={home} />
      <TopFive recent={recent} popular={popular} />

      {home.sections.slice(0, 10).map((section, index) => (
        <CategorySection
          key={section.category.id}
          title={section.category.name}
          slug={section.category.slug}
          news={section.news}
          reverse={index % 2 === 1}
        />
      ))}

      {(home.ads?.home?.length ?? 0) > 0 && (
        <section className="mx-auto mt-8 w-full max-w-[1440px] px-4 sm:px-6">
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
        <section className="mx-auto mt-8 w-full max-w-[1440px] px-4 sm:px-6">
          <a href={resolveVideoUrl(home.site.live_video.live_video_link) || "/video/archive"} target="_blank" rel="noopener noreferrer" className="group block bg-neutral-950 px-6 py-7 text-white">
            <div className="mb-2 text-xs font-black tracking-[0.2em] text-red-500">● LIVE</div>
            <h2 className="text-2xl font-black transition-colors group-hover:text-red-400">{home.site.live_video.live_title || "২৪ঘণ্টা লাইভ দেখুন"}</h2>
          </a>
        </section>
      )}

      <VideoSection videos={home.videos} />
      <PhotoSection photos={home.photos} />
    </main>
  );
}
