'use client';

import { PLACEHOLDER_IMAGE } from '@/lib/public-data';

import React from 'react';
import Link from 'next/link';

// Clean mock data structure matching standard news portals
const heroArticles = [
  {
    id: 1,
    category: "জাতীয়",
    title: "মেট্রোরেলের নতুন রুটের কাজ দ্রুত গতিতে এগিয়ে চলছে; যানজট নিরসনে বড় ভূমিকা রাখবে বলে আশা",
    image: PLACEHOLDER_IMAGE,
    time: "১০ মিনিট আগে",
    isLarge: true,
  },
  {
    id: 2,
    category: "আন্তর্জাতিক",
    title: "বৈশ্বিক জলবায়ু সম্মেলনে জরুরি তহবিল গঠনের ঘোষণা",
    image: PLACEHOLDER_IMAGE,
    time: "২৫ মিনিট আগে",
    isLarge: false,
  },
  {
    id: 3,
    category: "খেলাধুলা",
    title: "থ্রিলার ম্যাচে শেষ ওভারের বাউন্ডারিতে জয় পেল বাংলাদেশ",
    image: PLACEHOLDER_IMAGE,
    time: "৪০ মিনিট আগে",
    isLarge: false,
  },
  {
    id: 4,
    category: "অর্থনীতি",
    title: "নিত্যপ্রয়োজনীয় পণ্যের দাম নিয়ন্ত্রণে নতুন টাস্কফোর্স গঠন",
    image: PLACEHOLDER_IMAGE,
    time: "১ ঘণ্টা আগে",
    isLarge: false,
  },
  {
    id: 5,
    category: "প্রযুক্তি",
    title: "স্মার্টফোন বাজারে নতুন ধামাকা, মাত্র ১০ মিনিটে ফুল চার্জ হওয়ার প্রযুক্তি",
    image: PLACEHOLDER_IMAGE,
    time: "২ ঘণ্টা আগে",
    isLarge: false,
  },
];

export default function HeroGrid() {
  const mainPost = heroArticles.find(post => post.isLarge);
  const subPosts = heroArticles.filter(post => !post.isLarge);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 font-kalpurush">
      {/* Large Featured Article (Left Column) */}
      {mainPost && (
        <Link 
          href={`/news/${mainPost.id}`} 
          className="relative group overflow-hidden rounded aspect-[4/3] md:aspect-auto md:h-[500px] flex items-end bg-neutral-900"
        >
          <img 
            src={mainPost.image} 
            alt={mainPost.title}
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          
          <div className="relative p-6 z-10 space-y-2 text-left">
            <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded">
              {mainPost.category}
            </span>
            <h2 className="text-xl md:text-3xl font-bold text-white leading-snug group-hover:text-red-400 transition-colors duration-200">
              {mainPost.title}
            </h2>
            <p className="text-xs text-neutral-300 font-medium">{mainPost.time}</p>
          </div>
        </Link>
      )}

      {/* 2x2 Small Grid Articles (Right Column) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {subPosts.map((post) => (
          <Link 
            href={`/news/${post.id}`} 
            key={post.id} 
            className="relative group overflow-hidden rounded aspect-[16/10] flex items-end bg-neutral-900"
          >
            <img 
              src={post.image} 
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            
            <div className="relative p-4 z-10 space-y-1.5 text-left">
              <span className="bg-neutral-800/90 text-red-400 border border-neutral-700 text-[11px] font-bold px-2 py-0.5 rounded">
                {post.category}
              </span>
              <h3 className="text-sm md:text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-red-400 transition-colors duration-200">
                {post.title}
              </h3>
              <p className="text-[10px] text-neutral-400 font-medium">{post.time}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}