'use client';

import { useState } from 'react';
import { 
  FaBolt, FaPowerOff, FaClock, FaEye, FaEyeSlash, 
  FaRegEye, FaMagnifyingGlass, FaTrash, FaArrowUpRightFromSquare
} from 'react-icons/fa6';

interface TaggedPost {
  id: string;
  headline: string;
  category: string;
  slug: string;
  publishedAt: string;
  isBreakingActive: boolean;
  expiresAt: string;
}

// Mock posts that were flagged as "Breaking / আলোচিত" during post creation/editing
const mockBreakingPosts: TaggedPost[] = [
  {
    id: 'post-101',
    headline: 'মেট্রোরেলের নতুন রুটের কাজ দ্রুত গতিতে এগিয়ে চলছে',
    category: 'জাতীয়',
    slug: 'metro-rail-route-update',
    publishedAt: '১০ মিনিট আগে',
    isBreakingActive: true,
    expiresAt: '২ ঘণ্টা পর সমাপ্ত',
  },
  {
    id: 'post-102',
    headline: 'বিশ্বকাপ ২০২৬ সামনে রেখে নতুন স্টেডিয়ামের প্রস্তুতি সম্পন্ন',
    category: 'খেলা',
    slug: 'world-cup-stadium-prep',
    publishedAt: '২৫ মিনিট আগে',
    isBreakingActive: true,
    expiresAt: '১ ঘণ্টা পর সমাপ্ত',
  },
  {
    id: 'post-103',
    headline: 'নিত্যপ্রয়োজনীয় পণ্যের দাম নিয়ন্ত্রণে নতুন টাস্কফোর্স গঠন',
    category: 'বাণিজ্য',
    slug: 'market-price-taskforce',
    publishedAt: '৪০ মিনিট আগে',
    isBreakingActive: true,
    expiresAt: '৪ ঘণ্টা পর সমাপ্ত',
  },
  {
    id: 'post-104',
    headline: 'বঙ্গোপসাগরে নতুন লঘুচাপ সৃষ্টির পূর্বাভাস দিল আবহাওয়া অফিস',
    category: 'জাতীয়',
    slug: 'weather-bay-of-bengal',
    publishedAt: '২ ঘণ্টা আগে',
    isBreakingActive: false,
    expiresAt: 'মেয়াদ সমাপ্ত',
  },
];

export default function BreakingNewsManagerPage() {
  const [posts, setPosts] = useState<TaggedPost[]>(mockBreakingPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isStripActive, setIsStripActive] = useState(true);

  // Toggle breaking status for a post
  const toggleBreakingStatus = (id: string) => {
    setPosts(
      posts.map((item) =>
        item.id === id ? { ...item, isBreakingActive: !item.isBreakingActive } : item
      )
    );
  };

  // Remove from breaking queue
  const removeFromBreaking = (id: string) => {
    if (confirm('এই পোস্টটিকে আলোচিত ফিড থেকে সরিয়ে ফেলতে চান?')) {
      setPosts(posts.filter((item) => item.id !== id));
    }
  };

  const filteredPosts = posts.filter((item) =>
    item.headline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTickerHeadlines = posts.filter((item) => item.isBreakingActive);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBolt className="text-red-600 animate-pulse" /> আলোচিত সংবাদ (Breaking News Controller)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            পোস্ট তৈরির সময় চিহ্নিত 'ব্রেকিং নিউজ' পোস্টের হেডলাইন ম্যানেজ ও লাইভ স্ক্রলিং টিংকার কন্ট্রোল করুন।
          </p>
        </div>

        {/* Master Switch */}
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
          <span className="text-xs font-bold text-gray-700">আলোচিত বার:</span>
          <button
            onClick={() => setIsStripActive(!isStripActive)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-sm ${
              isStripActive 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-300 text-gray-700'
            }`}
          >
            <FaPowerOff size={11} /> {isStripActive ? 'সক্রিয় (LIVE)' : 'বন্ধ (OFF)'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Flagged Posts Queue (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="হেডলাইন দিয়ে খুঁজুন..."
                className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
              মোট ফ্ল্যাগড পোস্ট: <strong className="text-gray-800">{posts.length}</strong>
            </span>
          </div>

          {/* Tagged Posts Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase">
                  <th className="p-3.5">পোস্ট হেডলাইন</th>
                  <th className="p-3.5">ক্যাটাগরি</th>
                  <th className="p-3.5">প্রকাশ / মেয়াাদ</th>
                  <th className="p-3.5 text-center">স্ক্রলিং স্ট্যাটাস</th>
                  <th className="p-3.5 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredPosts.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-3.5">
                      <p className="font-bold text-gray-800 line-clamp-1">{item.headline}</p>
                      <span className="text-[10px] text-gray-400 font-mono">/posts/{item.slug}</span>
                    </td>

                    <td className="p-3.5 font-semibold text-gray-600">{item.category}</td>

                    <td className="p-3.5 text-gray-500 whitespace-nowrap">
                      <div className="font-medium text-gray-800">{item.publishedAt}</div>
                      <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <FaClock size={9} /> {item.expiresAt}
                      </div>
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => toggleBreakingStatus(item.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition flex items-center gap-1 mx-auto ${
                          item.isBreakingActive 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {item.isBreakingActive ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                        {item.isBreakingActive ? 'Active' : 'Muted'}
                      </button>
                    </td>

                    <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                      <a
                        href={`/posts/${item.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded inline-block transition"
                        title="View Post"
                      >
                        <FaArrowUpRightFromSquare size={11} />
                      </a>
                      <button
                        onClick={() => removeFromBreaking(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded transition"
                        title="Remove Tag"
                      >
                        <FaTrash size={11} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* RIGHT PANEL: Live Replica of Post-Driven Header Strip (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FaRegEye className="text-red-600" /> Header Ticker Live Preview
              </h2>
              <span className="text-[10px] font-semibold bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                Frontend Style
              </span>
            </div>

            {/* Exact Replica of Front Page 'আলোচিত >' Strip */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-semibold text-gray-500 block">
                নেভবারের নিচে হেডলাইন স্ক্রলিং প্রিভিউ:
              </span>

              {isStripActive ? (
                <div className="bg-gray-100 border-y border-gray-200 py-2.5 px-4 flex items-center gap-3 overflow-hidden rounded-md">
                  <div className="flex items-center gap-1 font-bold text-xs text-gray-900 shrink-0">
                    <span>আলোচিত</span>
                    <span className="text-red-600">&gt;</span>
                  </div>

                  <div className="flex-1 overflow-hidden whitespace-nowrap text-xs font-semibold text-gray-800">
                    {activeTickerHeadlines.length > 0 ? (
                      <div className="inline-block animate-marquee">
                        {activeTickerHeadlines.map((item, idx) => (
                          <span key={item.id} className="inline-flex items-center">
                            <span className="hover:text-red-600 cursor-pointer">{item.headline}</span>
                            {idx < activeTickerHeadlines.length - 1 && (
                              <span className="mx-6 text-gray-300 font-normal">|</span>
                            )}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-xs">
                        কোনো আলোচিত সংবাদ সক্রিয় নেই...
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 text-gray-400 p-4 rounded-lg text-center text-xs font-semibold border border-dashed border-gray-300">
                  আলোচিত সেকশনটি বন্ধ রাখা হয়েছে।
                </div>
              )}
            </div>

            {/* Quick Summary */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">চিহ্নিত ব্রেকিং পোস্ট:</span>
                <span className="font-bold text-gray-800">{posts.length} টি</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">বর্তমানে স্ক্রল হচ্ছে:</span>
                <span className="font-bold text-red-600">{activeTickerHeadlines.length} টি</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}