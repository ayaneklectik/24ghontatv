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
import type { CategoryItem, NewsItem, PublicSiteData } from "@/types/public";

function toBengaliDigits(value: number | string) {
  return String(value).replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);
}

function getOfficialBengaliDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const banglaMonths = [
    "বৈশাখ",
    "জ্যৈষ্ঠ",
    "আষাঢ়",
    "শ্রাবণ",
    "ভাদ্র",
    "আশ্বিন",
    "কার্তিক",
    "অগ্রহায়ণ",
    "পৌষ",
    "মাঘ",
    "ফাল্গুন",
    "চৈত্র",
  ];
  let bgYear = year - 593;
  if (month < 3 || (month === 3 && day < 14)) bgYear -= 1;

  const monthStarts = [
    [3, 14, 0],
    [4, 15, 1],
    [5, 15, 2],
    [6, 16, 3],
    [7, 16, 4],
    [8, 16, 5],
    [9, 16, 6],
    [10, 15, 7],
    [11, 15, 8],
    [0, 15, 9],
    [1, 14, 10],
    [2, 15, 11],
  ] as const;

  let monthIndex = 0;
  let bgDay = 1;
  for (let index = monthStarts.length - 1; index >= 0; index -= 1) {
    const [gregorianMonth, startDay, banglaIndex] = monthStarts[index];
    if (month > gregorianMonth || (month === gregorianMonth && day >= startDay)) {
      monthIndex = banglaIndex;
      bgDay = day - startDay + 1;
      break;
    }
  }

  if (bgDay <= 0) {
    monthIndex = (monthIndex + 11) % 12;
    bgDay += 30;
  }

  return `${toBengaliDigits(bgDay)} ${banglaMonths[monthIndex]} ${toBengaliDigits(bgYear)}`;
}

function normalizeWhatsApp(contact?: string | null) {
  const digits = String(contact ?? "").replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

export default function Header({
  site,
  categories,
  breakingNews = [],
  justNow = [],
}: {
  site: PublicSiteData;
  categories: CategoryItem[];
  breakingNews?: NewsItem[];
  justNow?: Array<{ id: string; title: string; url: string }>;
}) {
  const pathname = usePathname();
  const [dateStr, setDateStr] = useState({ engDate: "", bgDate: "" });
  const [readingMode, setReadingMode] = useState(false);

  useEffect(() => {
    const today = new Date();
    setDateStr({
      engDate: today.toLocaleDateString("bn-BD", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      bgDate: getOfficialBengaliDate(today),
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
  const logo = site.app?.logo_url || "/logo.png";
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

  return (
    <header className="relative w-full bg-white font-kalpurush text-neutral-800 select-none">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-5 px-4 py-5 sm:px-6 md:flex-row">
        <div className="flex w-full flex-col items-center gap-5 sm:flex-row sm:justify-start md:w-auto md:gap-8">
          <Link href="/" className="flex shrink-0 items-center" aria-label={title}>
            <img
              src={logo}
              alt={title}
              className="h-20 w-auto object-contain sm:h-[84px]"
              suppressHydrationWarning
              onError={(event) => {
                event.currentTarget.src = "/logo.png";
              }}
            />
          </Link>

          <a
            href="https://calendar.google.com/calendar/u/0/r"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-center text-neutral-600 transition-colors hover:text-red-600 sm:text-left"
            title="গুগল ক্যালেন্ডার"
          >
            <p className="text-sm font-bold text-neutral-800">{dateStr.engDate || "লোড হচ্ছে..."}</p>
            <p className="mt-0.5 text-xs font-semibold text-neutral-500">{dateStr.bgDate}</p>
          </a>
        </div>

        <div className="flex items-center gap-2.5 pr-1">
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

      <div className="w-full border-y-2 border-red-600 bg-white">
        <div className="mx-auto max-w-[1440px] px-2 sm:px-4">
          <nav className="flex items-center overflow-x-auto whitespace-nowrap scrollbar-none" aria-label="প্রধান নেভিগেশন">
            <Link
              href="/"
              className={`flex shrink-0 items-center px-3 py-3 transition-colors sm:px-4 ${
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
                  className={`shrink-0 px-3 py-3 text-[16px] font-bold transition-colors sm:px-4 sm:text-[17px] ${
                    pathname === href ? "text-red-600" : "text-neutral-700 hover:text-red-600"
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}

            <Link
              href="/search"
              className={`ml-2 flex shrink-0 items-center gap-2 border-l border-neutral-200 px-4 py-3 text-[16px] font-bold transition-colors sm:text-[17px] ${
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
          <div className="mx-auto flex h-12 max-w-[1440px] items-center overflow-hidden px-4">
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
    </header>
  );
}
