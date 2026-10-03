"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaFacebookF,
  FaYoutube,
  FaXTwitter,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa6";
import { BookOpenText, Search } from "lucide-react";
import { getHeaderBackgroundStyle } from "@/lib/site-display";
import { formatBengaliDate, formatEnglishDate } from "@/lib/bengali";
import { DEFAULT_BREAKING_TICKER, DEFAULT_HEADER_APPEARANCE, mapDisplaySettings } from "@/lib/public-data";
import type {
  BreakingTickerSettings,
  CategoryItem,
  HeaderAppearanceSettings,
  NewsItem,
  PublicSiteData,
} from "@/types/public";

function normalizeWhatsApp(contact?: string | null) {
  const digits = String(contact ?? "").replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

export default function Header({
  site,
  categories,
  breakingNews = [],
  justNow = [],
  breakingTicker,
  headerAppearance,
  showBengaliDate = true,
}: {
  site: PublicSiteData;
  categories: CategoryItem[];
  breakingNews?: NewsItem[];
  justNow?: Array<{ id: string; title: string; url: string }>;
  breakingTicker?: BreakingTickerSettings;
  headerAppearance?: HeaderAppearanceSettings;
  showBengaliDate?: boolean;
}) {
  const pathname = usePathname();
  const [dateStr, setDateStr] = useState({ engDate: "", bgDate: "" });
  const [readingMode, setReadingMode] = useState(false);
  const [liveDisplaySettings, setLiveDisplaySettings] = useState({
    breakingTicker: breakingTicker ?? DEFAULT_BREAKING_TICKER,
    headerAppearance: headerAppearance ?? DEFAULT_HEADER_APPEARANCE,
    showBengaliDate,
  });

  useEffect(() => {
    let active = true;
    let requestInProgress = false;

    const refreshDisplaySettings = async () => {
      if (requestInProgress) return;
      requestInProgress = true;
      try {
        const response = await fetch("/api/site-display-settings", {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        if (!response.ok) {
          throw new Error(`Display settings request failed with HTTP ${response.status}.`);
        }
        const contentType = response.headers.get("content-type") ?? "";
        if (!contentType.toLowerCase().includes("application/json")) {
          throw new Error("Display settings endpoint returned a non-JSON response.");
        }
        const settings = mapDisplaySettings(await response.json());
        if (active) {
          setLiveDisplaySettings((current) =>
            JSON.stringify(current) === JSON.stringify(settings) ? current : settings,
          );
        }
      } catch (error) {
        if (active) console.error("Could not refresh public display settings:", error);
      } finally {
        requestInProgress = false;
      }
    };

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void refreshDisplaySettings();
    };

    const intervalId = window.setInterval(() => {
      void refreshDisplaySettings();
    }, 10_000);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    void refreshDisplaySettings();

    return () => {
      active = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  useEffect(() => {
    const today = new Date();
    setDateStr({
      engDate: formatEnglishDate(today),
      bgDate: formatBengaliDate(today),
    });
  }, []);

  useEffect(() => {
    const enabled = window.localStorage.getItem("24ghonta-reading-mode") === "on";
    setReadingMode(enabled);
    document.documentElement.dataset.readingMode = enabled ? "on" : "off";
  }, []);

  const toggleReadingMode = () => {
    const enabled = !readingMode;
    setReadingMode(enabled);
    document.documentElement.dataset.readingMode = enabled ? "on" : "off";
    window.localStorage.setItem("24ghonta-reading-mode", enabled ? "on" : "off");
  };

  const social = site.social_media ?? {};
  const title = site.app?.app_title || "২৪ঘণ্টা";
  const logo = liveDisplaySettings.headerAppearance.logoImageUrl || site.app?.logo_url || "/logo.png";
  const whatsapp = normalizeWhatsApp(site.app?.contact);

  const socialItems = useMemo(
    () => [
      {
        href: social.facebook,
        label: "Facebook",
        icon: <FaFacebookF className="h-3.5 w-3.5" />,
        className: "bg-[#1877F2]",
      },
      {
        href: social.youtube,
        label: "YouTube",
        icon: <FaYoutube className="h-4 w-4" />,
        className: "bg-[#FF0000]",
      },
      {
        href: social.twitter,
        label: "X / Twitter",
        icon: <FaXTwitter className="h-3.5 w-3.5" />,
        className: "bg-black",
      },
      {
        href: social.instagram,
        label: "Instagram",
        icon: <FaInstagram className="h-4 w-4" />,
        className: "bg-[#E4405F]",
      },
      {
        href: whatsapp,
        label: "WhatsApp",
        icon: <FaWhatsapp className="h-4 w-4" />,
        className: "bg-[#25D366]",
      },
    ].filter((item) => Boolean(item.href)) as Array<{
      href: string;
      label: string;
      icon: React.ReactNode;
      className: string;
    }>,
    [social.facebook, social.instagram, social.twitter, social.youtube, whatsapp]
  );

  const ticker = [
    ...breakingNews.map((item) => ({ id: item.id, title: item.title, url: `/news/${encodeURIComponent(item.id)}` })),
    ...justNow.map((item) => ({ id: item.id, title: item.title, url: item.url || `/news/${encodeURIComponent(item.id)}` })),
  ].filter((item) => item.title).slice(0, 12);

  const navCategories = categories.filter((item) => item.name).slice(0, 12);
  const appearance = liveDisplaySettings.headerAppearance;
  const activeBreakingTicker = liveDisplaySettings.breakingTicker;
  const headerBackgroundStyle = getHeaderBackgroundStyle(appearance);

  return (
    <header className="relative w-full border-t border-red-600 bg-white font-kalpurush text-neutral-800 select-none">
      <div className="relative isolate w-full overflow-hidden" style={{ backgroundColor: appearance.backgroundColor }}>
      <div aria-hidden="true" className="absolute inset-0 scale-110" style={{ ...headerBackgroundStyle, filter: `blur(${appearance.backgroundBlur}px)` }} />
      <div className="relative z-10">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3 sm:px-6">
        <a
          href="https://calendar.google.com/calendar/u/0/r"
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-3 row-start-2 text-center transition-colors hover:text-red-600 sm:col-span-1 sm:col-start-1 sm:row-start-1 sm:text-left"
          title="গুগল ক্যালেন্ডার"
        >
          <p className="text-xs font-bold sm:text-sm" style={{ color: appearance.textColor }}>
            {liveDisplaySettings.showBengaliDate ? dateStr.bgDate : dateStr.engDate || "লোড হচ্ছে..."}
          </p>
        </a>

        <Link href="/" className="col-start-2 row-start-1 flex shrink-0 items-center" aria-label={title}>
          <img
            src={logo}
            alt={title}
            className="h-12 w-auto object-contain sm:h-14 md:h-[72px] lg:h-20"
            suppressHydrationWarning
            onError={(event) => {
              event.currentTarget.src = "/logo.png";
            }}
          />
        </Link>

        <div className="col-start-3 row-start-1 flex items-center justify-self-end gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={toggleReadingMode}
            aria-label="পাঠবান্ধব রং"
            aria-pressed={readingMode}
            title={readingMode ? "স্বাভাবিক রং" : "পাঠবান্ধব রং"}
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${readingMode ? "border-amber-300 bg-amber-100 text-amber-900" : "border-transparent bg-neutral-100 text-neutral-600 hover:bg-amber-50 hover:text-amber-900"}`}
          >
            <BookOpenText className="h-4 w-4" />
          </button>
          {socialItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              title={item.label}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-white shadow-sm transition-all duration-150 hover:scale-110 hover:opacity-90 ${item.className}`}
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>
      </div>
      </div>

      <div className="w-full border-b border-neutral-300 bg-white">
        <div className="w-full border-t border-red-600 px-2 sm:px-4">
          <nav className="flex w-full items-center justify-start overflow-x-auto whitespace-nowrap scrollbar-none lg:justify-center" aria-label="প্রধান নেভিগেশন">
            <Link
              href="/"
              className={`flex shrink-0 items-center px-2 py-2 transition-colors sm:px-3 ${
                pathname === "/" ? "text-red-600" : "text-neutral-700 hover:text-red-600"
              }`}
              aria-label="হোম"
            >
              <span
                className="h-5 w-5 bg-current"
                style={{
                  maskImage: "url(/icon-home.svg)",
                  WebkitMaskImage: "url(/icon-home.svg)",
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                }}
              />
            </Link>

            {navCategories.map((category) => {
              const href = `/category/${encodeURIComponent(category.slug)}`;
              return (
                <Link
                  key={category.id}
                  href={href}
                  className={`shrink-0 px-2 py-2 text-[13px] font-bold transition-colors sm:px-2.5 sm:text-[15px] md:text-[16px] xl:px-3 xl:text-[17px] ${
                    pathname === href ? "text-red-600" : "text-neutral-700 hover:text-red-600"
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}

            <Link
              href="/search"
              className={`ml-2 flex shrink-0 items-center gap-2 border-l border-neutral-200 px-3 py-2 text-[13px] font-bold transition-colors sm:px-3 sm:text-[14px] ${
                pathname === "/search" ? "text-red-600" : "text-neutral-700 hover:text-red-600"
              }`}
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span>খুঁজুন</span>
            </Link>
          </nav>
        </div>
      </div>

      {ticker.length > 0 && (
        <div className="w-full bg-[#EFEFEF]">
          <div className="mx-auto flex h-10 max-w-[1200px] items-center overflow-hidden px-4">
            <div className="z-10 flex shrink-0 items-center gap-2.5 bg-[#EFEFEF] pr-5 shadow-[6px_0_10px_#EFEFEF]">
              <span className="text-[19px] font-black leading-none text-neutral-900">আলোচিত</span>
              <span className="-translate-y-0.5 text-[14px] font-black text-red-600">❯</span>
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <div className="flex w-max animate-marquee-fast whitespace-nowrap gap-10 text-[15px] font-bold text-neutral-800">
                {ticker.concat(ticker).map((item, index) => (
                  <Link
                    key={`${item.id}-${index}`}
                    href={item.url || "/"}
                    className="transition-colors hover:text-red-600"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {activeBreakingTicker.enabled && activeBreakingTicker.text.trim() && (
        <div
          role="region"
          className="flex h-10 w-full items-center overflow-hidden"
          style={{ backgroundColor: activeBreakingTicker.backgroundColor, color: activeBreakingTicker.textColor }}
          aria-label="ব্রেকিং নিউজ"
        >
          <div className="z-10 flex h-full shrink-0 items-center px-4 text-sm font-black shadow-[6px_0_10px_rgba(0,0,0,.08)]">
            <span>ব্রেকিং নিউজ</span>
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div
              className={`animate-breaking-ticker flex w-max whitespace-nowrap text-sm ${activeBreakingTicker.bold ? "font-bold" : "font-normal"}`}
              style={{ animationDuration: `${activeBreakingTicker.speedSeconds}s` }}
            >
              <span className="pr-16">{activeBreakingTicker.text}</span>
              <span aria-hidden="true" className="pr-16">{activeBreakingTicker.text}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
