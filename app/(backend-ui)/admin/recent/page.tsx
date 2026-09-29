'use client';

import { useState } from 'react';
import { 
  FaClock, FaThumbtack, FaEye, FaEyeSlash, 
  FaMagnifyingGlass, FaFloppyDisk
} from 'react-icons/fa6';

interface RecentArticle {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  views: number;
  isPinned: boolean;
  isExcluded: boolean;
  image: string;
}

const mockRecentArticles: RecentArticle[] = [
  {
    id: 'recent-1',
    title: 'পাঠকপ্রিয়তায় শীর্ষে থাকা প্রথম সংবাদ শিরোনাম এবং বিস্তারিত লিংক',
    category: 'জাতীয়',
    publishedAt: '১০ মিনিট আগে',
    views: 1240,
    isPinned: true,
    isExcluded: false,
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400',
  },
  {
    id: 'recent-2',
    title: 'সপ্তাহের সবচেয়ে বেশি পঠিত দ্বিতীয় সংবাদ বিবরণী',
    category: 'শিক্ষা',
    publishedAt: '২৫ মিনিট আগে',
    views: 890,
    isPinned: false,
    isExcluded: false,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400',
  },
  {
    id: 'recent-3',
    title: 'জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে?',
    category: 'বাণিজ্য',
    publishedAt: '৪০ মিনিট আগে',
    views: 3100,
    isPinned: false,
    isExcluded: false,
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400',
  },
  {
    id: 'recent-4',
    title: 'সামাজিক যোগাযোগ মাধ্যমে ভাইরাল হওয়া আজকের বিশেষ প্রতিবেদন',
    category: 'খেলা',
    publishedAt: '১ ঘণ্টা আগে',
    views: 4500,
    isPinned: false,
    isExcluded: false,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400',
  },
  {
    id: 'recent-5',
    title: 'আন্তর্জাতিক অঙ্গনে বাংলাদেশের নতুন মাইলফলক অর্জন',
    category: 'প্রযুক্তি',
    publishedAt: '২ ঘণ্টা আগে',
    views: 620,
    isPinned: false,
    isExcluded: false,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400',
  },
];

const toBanglaNumeral = (num: number): string => {
  const bnNums = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().split('').map(d => bnNums[parseInt(d)] || d).join('');
};

export default function RecentNewsPage() {
  const [articles, setArticles] = useState<RecentArticle[]>(mockRecentArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pinned' | 'excluded'>('all');
  const [maxFeedCount, setMaxFeedCount] = useState<number>(5);

  const togglePin = (id: string) => {
    setArticles(
      articles.map((item) =>
        item.id === id ? { ...item, isPinned: !item.isPinned } : item
      )
    );
  };

  const toggleExclude = (id: string) => {
    setArticles(
      articles.map((item) =>
        item.id === id ? { ...item, isExcluded: !item.isExcluded } : item
      )
    );
  };

  const filteredArticles = articles.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === 'pinned') return matchesSearch && item.isPinned;
    if (filter === 'excluded') return matchesSearch && item.isExcluded;
    return matchesSearch;
  });

  const activeRecentFeed = articles
    .filter((item) => !item.isExcluded)
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
    .slice(0, maxFeedCount);

  const handleSaveSettings = () => {
    console.log('Saving Recent Feed Config:', { maxFeedCount, articles });
    alert('সাম্প্রতিক সেকশনের সকল কনফিগারেশন সফলভাবে আপডেট করা হয়েছে!');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaClock className="text-red-600" /> সাম্প্রতিক সংবাদ (Recent News Manager)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            হোমপেজের 'সাম্প্রতিক' ফিড ও নোটিফিকেশন পিন সেটিংস কনফিগার করুন।
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-3 rounded-lg shadow transition flex items-center gap-2"
        >
          <FaFloppyDisk /> Save Recent Config
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Table Controls */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap justify-between items-center gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="শিরোনাম দিয়ে খুঁজুন..."
                className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-medium">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-md transition ${filter === 'all' ? 'bg-white text-gray-800 shadow' : 'text-gray-500'}`}
              >
                সব
              </button>
              <button
                onClick={() => setFilter('pinned')}
                className={`px-3 py-1.5 rounded-md transition ${filter === 'pinned' ? 'bg-white text-red-600 shadow' : 'text-gray-500'}`}
              >
                পিনকৃত
              </button>
              <button
                onClick={() => setFilter('excluded')}
                className={`px-3 py-1.5 rounded-md transition ${filter === 'excluded' ? 'bg-white text-amber-600 shadow' : 'text-gray-500'}`}
              >
                লুকানো
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase">
                  <th className="p-3.5">সংবাদ</th>
                  <th className="p-3.5">সময়</th>
                  <th className="p-3.5 text-center">পিন (Pin)</th>
                  <th className="p-3.5 text-center">হাইড (Exclude)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredArticles.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-gray-50/80 transition ${item.isPinned ? 'bg-red-50/30' : item.isExcluded ? 'opacity-50 bg-gray-50' : ''}`}
                  >
                    <td className="p-3.5 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-8 object-cover rounded border border-gray-200 shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-gray-800 line-clamp-1">{item.title}</h3>
                        <span className="text-[10px] text-gray-400">{item.category}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-gray-500 font-medium whitespace-nowrap">{item.publishedAt}</td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => togglePin(item.id)}
                        className={`p-2 rounded-lg transition ${item.isPinned ? 'bg-red-600 text-white shadow' : 'bg-gray-100 text-gray-400 hover:text-red-600 hover:bg-gray-200'}`}
                      >
                        <FaThumbtack size={11} />
                      </button>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => toggleExclude(item.id)}
                        className={`p-2 rounded-lg transition ${item.isExcluded ? 'bg-amber-500 text-white shadow' : 'bg-gray-100 text-gray-400 hover:text-amber-600 hover:bg-gray-200'}`}
                      >
                        {item.isExcluded ? <FaEyeSlash size={11} /> : <FaEye size={11} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT PANEL: 'সাম্প্রতিক' Frontend Preview with Large Numbers */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div className="flex gap-6 text-sm font-bold">
                <span className="text-gray-900 border-b-2 border-red-600 pb-2 font-bold cursor-pointer">
                  সাম্প্রতিক &gt;
                </span>
                <span className="text-gray-400 cursor-pointer">জনপ্রিয় &gt;</span>
              </div>
              <span className="text-[10px] font-semibold bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                Frontend Style
              </span>
            </div>

            <div className="bg-gray-50 p-2.5 rounded-lg flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-600">প্রদর্শন সংখ্যা:</span>
              <input
                type="number"
                value={maxFeedCount}
                onChange={(e) => setMaxFeedCount(Number(e.target.value))}
                className="w-12 p-1 border border-gray-300 rounded text-center bg-white font-bold focus:outline-none focus:ring-1 focus:ring-red-500"
                min={3}
                max={10}
              />
            </div>

            {/* Large Number List Preview matching screenshot */}
            <div className="space-y-4 pt-2">
              {activeRecentFeed.map((story, idx) => (
                <div key={story.id} className="flex gap-4 border-b border-gray-100 pb-3 last:border-b-0">
                  <span className="text-3xl font-black text-red-600 font-serif leading-none min-w-[24px]">
                    {toBanglaNumeral(idx + 1)}
                  </span>
                  <div className="space-y-1 flex-1">
                    <h4 className="text-xs font-bold text-gray-800 leading-snug hover:text-red-600 cursor-pointer transition">
                      {story.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 block">{story.publishedAt}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}