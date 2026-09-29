"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaFacebookF, FaYoutube, FaInstagram, FaXTwitter } from "react-icons/fa6";
import type { PublicSiteData } from "@/types/public";

function sanitizeRichHtml(value?: string | null): string {
  if (!value) return "";

  return String(value)
    .replace(/<\s*(script|iframe|object|embed|style|link|meta|form)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|iframe|object|embed|style|link|meta|form)[^>]*\/\s*>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href\s*=\s*["']?)\s*(?:javascript|vbscript|data):/gi, "$1#")
    .trim();
}

function RichText({ value, className = "" }: { value?: string | null; className?: string }) {
  const html = sanitizeRichHtml(value);
  if (!html) return null;

  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function Footer({ site }: { site: PublicSiteData }) {
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const footer = site.footer ?? {};
  const app = site.app ?? {};
  const social = site.social_media ?? {};

  useEffect(() => {
    const onScroll = () => setShowScrollBtn(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const siteTitle = app.app_title || "২৪ঘণ্টা";
  const description =
    app.app_title
      ? `${app.app_title} — সর্বশেষ সংবাদ, বিশ্লেষণ ও বিশেষ প্রতিবেদন।`
      : "সর্বশেষ সংবাদ, বিশ্লেষণ ও বিশেষ প্রতিবেদন।";
  const address = footer.address || app.address || "";
  const contact = footer.contact || app.contact || "";
  const email = footer.email || app.email || "";

  const quickLinks = [
    ["বিজ্ঞাপন", "/advertise"],
    ["গোপনীয়তার নীতি", "/privacy"],
    ["যোগাযোগ", "/contact"],
    ["আমাদের সম্পর্কে", "/about"],
  ] as const;

  return (
    <footer className="relative mt-10 w-full bg-[#E3E3E3] font-kalpurush text-neutral-800">
      {showScrollBtn && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="উপরে যান"
          title="উপরে যান"
          className="absolute -top-6 right-5 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition hover:scale-105 hover:bg-red-700"
        >
          ▲
        </button>
      )}

      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-8 px-6 py-12 text-left md:grid-cols-2 md:gap-0 lg:grid-cols-12">
        <div className="md:pr-8 lg:col-span-3 lg:border-r lg:border-neutral-300">
          <Link href="/" aria-label={siteTitle} className="inline-flex h-[76px] items-center">
            <img
              src={app.logo_url || "/logo.png"}
              alt={siteTitle}
              className="h-20 w-auto object-contain"
              onError={(event) => {
                event.currentTarget.src = "/logo.png";
              }}
            />
          </Link>
          <p className="mt-4 max-w-sm text-[14px] font-medium leading-relaxed text-neutral-600">{description}</p>
        </div>

        <div className="md:px-8 lg:col-span-3 lg:border-r lg:border-neutral-300">
          <h3 className="mb-4 text-[16px] font-black text-neutral-900">সম্পাদকীয় ও যোগাযোগ</h3>
          <div className="space-y-3 text-[14px] leading-relaxed text-neutral-600">
            {contact ? (
              <RichText value={contact} className="[&_a]:text-red-600 [&_a]:underline" />
            ) : (
              <p>সর্বশেষ সংবাদ ও আপডেটের জন্য আমাদের সঙ্গে যোগাযোগ করুন।</p>
            )}
            {email && <RichText value={email} className="[&_a]:text-red-600 [&_a]:underline" />}
          </div>
        </div>

        <div className="md:px-8 lg:col-span-3 lg:border-r lg:border-neutral-300">
          <h3 className="mb-4 text-[16px] font-black text-neutral-900">ঠিকানা</h3>
          {address ? (
            <RichText
              value={address}
              className="text-[14px] font-medium leading-relaxed text-neutral-600 [&_a]:text-red-600 [&_a]:underline [&_p]:my-2"
            />
          ) : (
            <p className="text-[14px] leading-relaxed text-neutral-600">ঠিকানা শীঘ্রই হালনাগাদ করা হবে।</p>
          )}

          <div className="mt-5 flex items-center gap-2">
            {[
              [social.facebook, "Facebook", <FaFacebookF key="f" />],
              [social.youtube, "YouTube", <FaYoutube key="y" />],
              [social.twitter, "X", <FaXTwitter key="x" />],
              [social.instagram, "Instagram", <FaInstagram key="i" />],
            ].map(([href, label, icon]) =>
              href ? (
                <a
                  key={String(label)}
                  href={String(href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={String(label)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-700 text-white transition hover:bg-red-600"
                >
                  {icon as React.ReactNode}
                </a>
              ) : null
            )}
          </div>
        </div>

        <div className="md:pl-8 lg:col-span-3">
          <h3 className="mb-4 text-[16px] font-black text-neutral-900">দ্রুত লিংক</h3>
          <div className="flex flex-col gap-2 text-[14px] font-bold text-neutral-700">
            {quickLinks.map(([label, href]) => (
              <Link key={href} href={href} className="transition-colors hover:text-red-600">
                {label}
              </Link>
            ))}
            <Link href="/search" className="transition-colors hover:text-red-600">সংবাদ খুঁজুন</Link>
            <Link href="/gallery" className="transition-colors hover:text-red-600">ফটো গ্যালারি</Link>
            <Link href="/video/archive" className="transition-colors hover:text-red-600">ভিডিও আর্কাইভ</Link>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#7A7A7A] py-4 text-center font-sans text-[13px] tracking-wide text-white/90">
        © {new Date().getFullYear()} | {siteTitle} | all rights reserved
      </div>
    </footer>
  );
}
