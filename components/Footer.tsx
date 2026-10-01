"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaFacebookF, FaYoutube, FaInstagram, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";
import type { PublicSiteData } from "@/types/public";

export default function Footer({ site }: { site: PublicSiteData }) {
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const app = site.app ?? {};
  const social = site.social_media ?? {};

  useEffect(() => {
    const onScroll = () => setShowScrollBtn(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const siteTitle = app.app_title || "২৪ঘণ্টা";
  const quickLinks = [
    ["বিজ্ঞাপন", "https://24ghontatv.com/#"],
    ["গোপনীয়তার নীতি", "https://24ghontatv.com/#"],
    ["যোগাযোগ", "https://24ghontatv.com/#"],
    ["আমাদের সম্পর্কে", "https://24ghontatv.com/#"],
  ] as const;

  return (
    <footer className="relative mt-10 w-full bg-[#dedfe1] font-kalpurush text-neutral-800">
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

      <div className="mx-auto grid w-full grid-cols-1 gap-8 px-6 py-8 text-center md:grid-cols-3 md:gap-0 md:px-8 md:py-7">
        <div className="flex flex-col items-center justify-center md:px-6 md:border-r-[5px] md:border-black">
          <Link href="/" aria-label={siteTitle} className="inline-flex h-[92px] items-center">
            <img
              src={app.logo_url || "/logo.png"}
              alt={siteTitle}
              className="h-[88px] w-auto max-w-full object-contain"
              onError={(event) => {
                event.currentTarget.src = "/logo.png";
              }}
            />
          </Link>
          <div className="mt-3 space-y-1 text-[17px] leading-snug">
            <p className="font-bold text-red-700">সম্পাদক ও প্রকাশক</p>
            <p>আরিফ সোহেল</p>
            <p className="font-bold text-red-700">নির্বাহী সম্পাদক</p>
            <p>এস এম আবুল হোসেন</p>
            <p className="font-bold text-red-700">উপ-সম্পাদক</p>
            <p>সালাউদ্দিন স্বপন</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center md:px-6 md:border-r-[5px] md:border-black">
          <h2 className="mb-4 text-[20px] font-bold leading-snug text-red-700">বার্তা বিভাগ ও বাণিজ্যিক যোগাযোগ</h2>
          <div className="space-y-2 text-[17px] leading-snug">
            <p className="font-bold text-red-700">নির্বাহী প্রধান [আইটি]</p>
            <p className="font-bold">MD AIYANUR RAHMAN</p>
            <p className="font-sans text-[14px]">Senior Developer</p>
            <a
              href="https://www.upwork.com/freelancers/~01cf0fb3dd5bb153ff?mp_source=share"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[15px] font-bold text-neutral-700 underline underline-offset-2 transition-colors hover:text-red-600"
            >
              Upwork প্রোফাইল
            </a>
            <p className="pt-2 font-bold text-red-700">আবাসিক সম্পাদক [যুক্তরাষ্ট্র]</p>
            <p className="font-semibold">দর্পণ কবীর</p>
            <p className="pt-2">২৪ঘণ্টা টিভি, মানিকগঞ্জ হাউজিং (তৃতীয় তলা)</p>
            <p>২১৬, শহীদ সৈয়দ নজরুল ইসলাম সরণি</p>
            <p>পুরানা পল্টন, ঢাকা-১০০০</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center md:pl-6">
          <nav aria-label="ফুটার লিংক" className="mb-6 flex flex-col gap-2 text-[17px] font-semibold text-neutral-700">
            {quickLinks.map(([label, href]) => (
              <a key={label} href={href} className="transition-colors hover:text-red-700">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-center gap-3">
            {[
              [social.facebook || "https://www.facebook.com/24ghontatv", "Facebook", <FaFacebookF key="f" />],
              [social.twitter || "https://x.com/24ghontatv", "X", <FaXTwitter key="x" />],
              [social.instagram || "https://www.instagram.com/24ghontatv/", "Instagram", <FaInstagram key="i" />],
              [social.youtube || "https://www.youtube.com/@24ghontatv", "YouTube", <FaYoutube key="y" />],
              ["https://www.linkedin.com/", "LinkedIn", <FaLinkedinIn key="in" />],
            ].map(([href, label, icon]) => (
              <a
                key={String(label)}
                href={String(href)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={String(label)}
                title={String(label)}
                className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-black/70 text-neutral-700 transition-colors hover:border-red-700 hover:bg-red-700 hover:text-white"
              >
                {icon as React.ReactNode}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-6 border-t border-white/70 py-4 text-center font-sans text-[15px] text-neutral-800">
        © {new Date().getFullYear()} | All rights reserved by 24Ghontatv.com
      </div>
    </footer>
  );
}
