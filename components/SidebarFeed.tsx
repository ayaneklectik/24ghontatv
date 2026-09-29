'use client';

import { useState } from 'react';
import Link from 'next/link';

const recentNews = [
  { id: 1, title: "মেট্রোরেলের নতুন রুটের কাজ দ্রুত গতিতে এগিয়ে চলছে; যানজট নিরসনে বড় ভূমিকা রাখবে বলে আশা" },
  { id: 2, title: "বিশ্বকাপ ২০২৬ সামনে রেখে নতুন স্টেডিয়ামের প্রস্তুতি সম্পন্ন করেছে আয়োজক কমিটি" },
  { id: 3, title: "রাজধানীর আবহাওয়া নিয়ে জরুরি সর্তকতা জারি করল আবহাওয়া অধিদপ্তর" },
  { id: 4, title: "প্রযুক্তি খাতে বড় পরিবর্তন, নতুন কৃত্রিম বুদ্ধিমত্তা চিপসেট উন্মোচন করল শীর্ষ প্রতিষ্ঠান" },
  { id: 5, title: "বিনোদন অঙ্গনে নতুন নক্ষত্র, প্রথম মূলধারার সিনেমাতেই বাজিমাত করলেন তরুনী" },
  { id: 6, title: "অর্থনৈতিক প্রবৃদ্ধি অর্জনে নতুন রফতানি নীতিমালার খসড়া অনুমোদন করেছে মন্ত্রিসভা" },
];

const popularNews = [
  { id: 1, title: "আলোচিত খবরের তালিকা: গত ২৪ ঘণ্টায় পাঠকদের মাঝে সবচেয়ে বেশি পঠিত সংবাদসমূহ" },
  { id: 2, title: "জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা" },
  { id: 3, title: "খেলাধুলার দুনিয়ায় আলোড়ন সৃষ্টি করল নতুন অলিম্পিক রেকর্ড" },
  { id: 4, title: "নতুন কর নীতিমালায় সাধারণ মানুষের স্বস্তি, বাজারে কমছে নিত্যপণ্যের দাম" },
  { id: 5, title: "স্মার্টফোন বাজারে নতুন ধামাকা, মাত্র ১০ মিনিটে ফুল চার্জ হওয়ার প্রযুক্তি" },
];

const toBengaliNumber = (num: number) => {
  const digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().split('').map(d => digits[parseInt(d)] || d).join('');
};

export default function SidebarFeed() {
  const [activeTab, setActiveTab] = useState<'popular' | 'recent'>('popular'); // Defaults to 'আলোচিত'
  const currentData = activeTab === 'recent' ? recentNews : popularNews;

  return (
    <div className="w-full max-w-[400px] border border-gray-200 rounded p-5 bg-white shadow-sm font-kalpurush">
      {/* Navigation Row with Interactive Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-5">
        <button
          onClick={() => setActiveTab('recent')}
          className={`relative font-bold text-xl pb-2 focus:outline-none transition-all duration-150 flex items-center gap-1 ${
            activeTab === 'recent' 
              ? 'text-red-600 border-b-2 border-red-600' 
              : 'text-gray-400 hover:text-black border-b-2 border-transparent'
          }`}
        >
          সাম্প্রতিক 
          <span className="text-red-600 text-xs font-black select-none translate-y-[1px]">❯</span>
        </button>
        <button
          onClick={() => setActiveTab('popular')}
          className={`relative font-bold text-xl pb-2 focus:outline-none transition-all duration-150 flex items-center gap-1 ${
            activeTab === 'popular' 
              ? 'text-red-600 border-b-2 border-red-600' 
              : 'text-gray-400 hover:text-black border-b-2 border-transparent'
          }`}
        >
          আলোচিত 
          <span className="text-red-600 text-xs font-black select-none translate-y-[1px]">❯</span>
        </button>
      </div>

      {/* Fixed Height Custom Scroll Container */}
      <div className="h-[460px] overflow-y-auto pr-2 space-y-5 custom-sidebar-scroll">
        {currentData.map((item, index) => (
          <div key={item.id} className="flex flex-col border-b border-gray-100 pb-4 last:border-0 last:pb-0 group items-start text-left">
            {/* Numbers are positioned directly ON TOP of the text, matching your UI */}
            <span className="text-3xl font-black text-red-600 leading-none mb-1 select-none">
              {toBengaliNumber(index + 1)}
            </span>
            <Link 
              href={`/news/${item.id}`} 
              className="text-[16px] font-medium text-neutral-800 leading-snug group-hover:text-red-600 transition-colors duration-200"
            >
              {item.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}