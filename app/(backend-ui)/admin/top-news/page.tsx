'use client';

import { useState } from 'react';
import { 
  FaTrophy, FaGripVertical, FaMagnifyingGlass, 
  FaPlus, FaTrashCan, FaFloppyDisk, FaEye
} from 'react-icons/fa6';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  image: string;
}

const mockPublishedArticles: Article[] = [
  {
    id: 'art-101',
    title: 'জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে?',
    excerpt: 'কোরবানির ঈদ আসন্ন। আমরা শিক্ষকদের বাড়ি বাড়ি গিয়ে বলব, আপনারা এই ঈদে তো কোরবানি দিবেন না...',
    category: 'জাতীয়',
    publishedAt: '2026-08-04',
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800',
  },
  {
    id: 'art-102',
    title: 'জাতীয় বাজেট ২০২৬: মূল্যস্ফীতি নিয়ন্ত্রণে নতুন পরিকল্পনা',
    excerpt: 'অর্থনীতিবিদদের সাথে বৈঠকে নতুন বাজেটের রূপরেখা তৈরি করা হয়েছে...',
    category: 'বাণিজ্য',
    publishedAt: '2026-08-04',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
  },
  {
    id: 'art-103',
    title: 'টি-টোয়েন্টি সিরিজে বাংলাদেশের অবিস্মরণীয় জয়',
    excerpt: 'শেষ ওভারে উত্তেজনাপূর্ণ জয়ে সিরিজ নিজেদের করে নিল বাংলাদেশ...',
    category: 'খেলা',
    publishedAt: '2026-08-03',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400',
  },
  {
    id: 'art-104',
    title: 'স্মার্ট বাংলাদেশ বাস্তবায়নে নতুন এআই প্রযুক্তি সংযোজন',
    excerpt: 'তথ্যপ্রযুক্তি খাতে জোরালো পদক্ষেপ গ্রহণ করা হচ্ছে...',
    category: 'প্রযুক্তি',
    publishedAt: '2026-08-03',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
  },
  {
    id: 'art-105',
    title: 'পদ্মা সেতুতে রেকর্ড পরিমাণ টোল আদায়',
    excerpt: 'গত ২৪ ঘণ্টায় রেকর্ড সংখ্যক যানবাহন পারাপার হয়েছে...',
    category: 'জাতীয়',
    publishedAt: '2026-08-02',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=400',
  },
  {
    id: 'art-106',
    title: 'শেয়ার বাজারে বড় উত্থান: লেনদেন ছাড়াল ১০০০ কোটি টাকা',
    excerpt: 'সপ্তাহের তৃতীয় কার্যদিবসে সূচকের উর্ধ্বমুখী প্রবণতা লক্ষ্য করা গেছে...',
    category: 'বাণিজ্য',
    publishedAt: '2026-08-02',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
  },
];

export default function TopNewsPage() {
  const [topArticles, setTopArticles] = useState<Article[]>(mockPublishedArticles.slice(0, 5));
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  // Filter out articles already in Top 5
  const availableArticles = mockPublishedArticles.filter(
    (art) => 
      !topArticles.some((top) => top.id === art.id) &&
      art.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToTop = (article: Article) => {
    if (topArticles.length >= 5) {
      alert('সেরা ৫ তালিকা ইতিমধ্যে পূর্ণ! নতুন একটি যুক্ত করতে পূর্বের খবর সরান।');
      return;
    }
    setTopArticles([...topArticles, article]);
  };

  const handleRemove = (id: string) => {
    setTopArticles(topArticles.filter((item) => item.id !== id));
  };

  // Drag & Drop sequence positioning
  const handleDragStart = (index: number) => {
    setDraggedIdx(index);
  };

  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;

    const updated = [...topArticles];
    const [moved] = updated.splice(draggedIdx, 1);
    updated.splice(targetIdx, 0, moved);

    setDraggedIdx(targetIdx);
    setTopArticles(updated);
  };

  const handleSaveSequence = () => {
    console.log('Publishing Top 5 Layout to Homepage:', topArticles);
    alert('সেরা ৫ সেকশনের পজিশন সফলভাবে হোমপেজে আপডেট করা হয়েছে!');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaTrophy className="text-red-600" /> সেরা ৫ (Top 5 Position Manager)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            হোমপেজের 'সেরা ৫' সেকশনের পজিশন ও ক্রম নির্ধারণ করুন (পজিশন #১ মূল ফিচারড ব্যানার)।
          </p>
        </div>

        <button
          onClick={handleSaveSequence}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-3 rounded-lg shadow transition flex items-center gap-2"
        >
          <FaFloppyDisk /> Save Sequence
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Frontend Layout Sequence Manager (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <span>Active Homepage Layout</span>
                <span className="text-xs font-normal text-gray-500">({topArticles.length}/5 Assigned)</span>
              </h2>
              <span className="text-[11px] text-gray-400">ড্র্যাগ করে ক্রমানুসারে সাজান</span>
            </div>

            {/* Sequence Slots */}
            <div className="space-y-3">
              {topArticles.map((article, index) => (
                <div
                  key={article.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={() => setDraggedIdx(null)}
                  className={`flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border transition ${
                    index === 0 ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                  } ${draggedIdx === index ? 'opacity-30 border-dashed border-red-500' : 'hover:shadow-sm'}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Drag Handle & Position Badge */}
                    <div className="flex items-center gap-2">
                      <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                        <FaGripVertical size={14} />
                      </div>
                      <div className="flex flex-col items-center">
                        <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center text-white ${
                          index === 0 ? 'bg-red-600' : 'bg-gray-700'
                        }`}>
                          #{index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Thumbnail */}
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-16 h-11 object-cover rounded-lg border border-gray-200 shrink-0"
                    />

                    {/* Content Meta */}
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          index === 0 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {index === 0 ? 'মূল ফিচারড ব্যানার (Position #1)' : `পজিশন #${index + 1}`}
                        </span>
                        <span className="text-[10px] text-gray-400">{article.category}</span>
                      </div>
                      <h3 className="text-xs font-bold text-gray-800 line-clamp-1">
                        {article.title}
                      </h3>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(article.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition shrink-0"
                    title="সরিয়ে দিন"
                  >
                    <FaTrashCan size={12} />
                  </button>
                </div>
              ))}

              {topArticles.length < 5 && (
                <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center text-xs text-gray-400">
                  খালি পজিশন রয়েছে ({5 - topArticles.length} টি)। ডানপাশের তালিকা থেকে সংবাদ যোগ করুন।
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Search & Add Published Articles (5 Columns) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">
            প্রকাশিত সংবাদ সিলেক্ট করুন
          </h2>

          {/* Search Box */}
          <div className="relative">
            <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="শিরোনাম দিয়ে খুঁজুন..."
              className="w-full pl-8 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* Published Articles List */}
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {availableArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-lg hover:border-red-300 transition"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-gray-800 line-clamp-1">
                      {article.title}
                    </h4>
                    <span className="text-[10px] text-gray-400">{article.category}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAddToTop(article)}
                  disabled={topArticles.length >= 5}
                  className="px-2.5 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-md text-[11px] font-bold transition flex items-center gap-1 disabled:opacity-40 shrink-0"
                >
                  <FaPlus size={10} /> Add
                </button>
              </div>
            ))}

            {availableArticles.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-xs">
                কোন সংবাদ পাওয়া যায়নি।
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}