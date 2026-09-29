'use client';

import { useState, useRef } from 'react';
import { 
  FaPenNib, FaPlus, FaTrash, FaFloppyDisk, 
  FaRegEye, FaThumbtack, FaPowerOff,
  FaCloudArrowUp, FaEye, FaXmark
} from 'react-icons/fa6';

interface SpecialWritingPost {
  id: string;
  title: string;
  details: string; // Full Article Content
  authorName: string;
  authorProfession: string;
  authorAvatar: string;
  publishedAt: string;
  isPinned: boolean;
}

const mockPosts: SpecialWritingPost[] = [
  {
    id: 'sw-1',
    title: 'জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা',
    details: 'কোরবানির ঈদ আসন্ন। আমরা শিক্ষকদের বাড়ি বাড়ি গিয়ে বলব, আপনারা এই ঈদে তো কোরবানি দিবেন না। চামড়ার টাকাটা আমাদের দান করুন। আমরা বস্তির বাচ্চাদের জন্য একটা স্কুল বানাতে যাচ্ছি। সকলেই বললেন, তোমরা খুব ভাল কাজ করছ। অবহেলিত শিশুদের মধ্যে জ্ঞানের আলো জ্বালাতে যাচ্ছি। এই প্রশংসামূলক বাক্য শুনেই আমাদের সন্তুষ্ট থাকতে হল।',
    authorName: 'কাজী নজরুল ইসলাম',
    authorProfession: 'কলামিস্ট ও প্রাবন্ধিক',
    authorAvatar: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300',
    publishedAt: '১০ মিনিট আগে',
    isPinned: true,
  },
  {
    id: 'sw-2',
    title: 'জাতীয় অর্থনীতিতে তরুণ উদ্যোক্তাদের অবদান ও নতুন সুযোগ',
    details: 'বর্তমান বাজার পরিস্থিতিতে তরুণ উদ্যোক্তাদের জন্য নতুন অর্থনৈতিক পরিকল্পনা জরুরি। কৃত্রিম বুদ্ধিমত্তা ও নতুন প্রযুক্তির ব্যবহারের মাধ্যমে ক্ষুদ্র শিল্প খাতকে এগিয়ে নিতে হবে...',
    authorName: 'ড. আবদুর রাজ্জাক',
    authorProfession: 'অর্থনীতিবিদ',
    authorAvatar: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300',
    publishedAt: '২৫ মিনিট আগে',
    isPinned: false,
  },
];

export default function SpecialWritingsPage() {
  const [isSectionActive, setIsSectionActive] = useState(true);
  const [sectionTitle, setSectionTitle] = useState('মতামত');
  const [posts, setPosts] = useState<SpecialWritingPost[]>(mockPosts);
  
  // Fast Post Form Toggle
  const [showPostForm, setShowPostForm] = useState(false);

  // New Post Form State (Including Details)
  const [newTitle, setNewTitle] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newAuthorProfession, setNewAuthorProfession] = useState('');
  const [newAuthorAvatar, setNewAuthorAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300');

  // Preview Modal State
  const [selectedPostForPreview, setSelectedPostForPreview] = useState<SpecialWritingPost | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAuthorAvatar(URL.createObjectURL(file));
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAuthorName || !newDetails) {
      alert('অনুগ্রহ করে শিরোনাম, লেখকের নাম এবং বিস্তারিত বক্তব্য লিখুন।');
      return;
    }

    const newPostItem: SpecialWritingPost = {
      id: `sw-${Date.now()}`,
      title: newTitle,
      details: newDetails,
      authorName: newAuthorName,
      authorProfession: newAuthorProfession || 'কলামিস্ট',
      authorAvatar: newAuthorAvatar,
      publishedAt: 'এখনই',
      isPinned: false,
    };

    setPosts([newPostItem, ...posts]);
    setNewTitle('');
    setNewDetails('');
    setNewAuthorName('');
    setNewAuthorProfession('');
    setShowPostForm(false);
    alert('মতামত কলামটি সফলভাবে পোস্ট হয়েছে!');
  };

  const togglePin = (id: string) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, isPinned: !post.isPinned } : post
      )
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('আপনি কি এই মতামতটি মুছে ফেলতে চান?')) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaPenNib className="text-red-600" /> বিশেষ লেখা / মতামত (Special Writings Engine)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            হোমপেজের 'মতামত' সেকশনের কলাম পোস্ট করুন ও মূল বক্তব্য পরিচালনা করুন।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSectionActive(!isSectionActive)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-sm ${
              isSectionActive ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-700'
            }`}
          >
            <FaPowerOff size={11} /> {isSectionActive ? 'সেকশন চালু (ON)' : 'সেকশন বন্ধ (OFF)'}
          </button>

          <button
            onClick={() => setShowPostForm(!showPostForm)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition flex items-center gap-2"
          >
            <FaPlus /> {showPostForm ? 'ফর্ম বন্ধ করুন' : 'নতুন মতামত লিখুন'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Post Form & Management (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Post Creation Form */}
          {showPostForm && (
            <form onSubmit={handleCreatePost} className="bg-white p-5 rounded-xl border border-red-300 shadow-sm space-y-3">
              <h2 className="text-xs font-bold text-red-600 uppercase tracking-wider border-b border-gray-100 pb-2">
                নতুন মতামত পোস্ট করুন (Fast Post Writer)
              </h2>

              <div className="space-y-3 text-xs">
                {/* 1. Headline */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">মতামত / কলামের শিরোনাম *</label>
                  <textarea
                    rows={2}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="শিরোনাম লিখুন..."
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>

                {/* 2. Author Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">লেখকের নাম *</label>
                    <input
                      type="text"
                      value={newAuthorName}
                      onChange={(e) => setNewAuthorName(e.target.value)}
                      placeholder="যেমন: কাজী নজরুল ইসলাম"
                      className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">লেখকের পেশা / পদবী</label>
                    <input
                      type="text"
                      value={newAuthorProfession}
                      onChange={(e) => setNewAuthorProfession(e.target.value)}
                      placeholder="যেমন: কলামিস্ট ও প্রাবন্ধিক"
                      className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* 3. Author Avatar Upload */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">লেখকের ছবি</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                    <img
                      src={newAuthorAvatar}
                      alt="Avatar Preview"
                      className="w-10 h-10 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white border border-gray-300 hover:bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 flex items-center gap-2"
                    >
                      <FaCloudArrowUp className="text-red-600" /> ছবি আপলোড করুন
                    </button>
                  </div>
                </div>

                {/* 4. Full Article Details (DETAILS TEXTAREA) */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    বিস্তারিত বিবরণ / কলামের মূল কথা (Article Details) *
                  </label>
                  <textarea
                    rows={5}
                    value={newDetails}
                    onChange={(e) => setNewDetails(e.target.value)}
                    placeholder="এখানে পুরো কলামের মূল লেখাটি লিখুন..."
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPostForm(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow hover:bg-red-700 transition"
                  >
                    <FaFloppyDisk /> পাবলিশ করুন
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Section Title Config */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-gray-700">সেকশন হেডার শিরোনাম</label>
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-gray-800"
            />
          </div>

          {/* Special Writings Queue List */}
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className={`bg-white p-3.5 rounded-xl border shadow-sm transition flex items-center gap-3 ${
                  post.isPinned ? 'border-amber-400 bg-amber-50/20' : 'border-gray-200'
                }`}
              >
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-12 h-12 object-cover rounded-lg border shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-[11px] text-gray-800">{post.authorName}</span>
                    <span className="text-[10px] text-gray-400">({post.authorProfession})</span>
                  </div>
                  <h3 className="font-bold text-xs text-gray-800 line-clamp-1">{post.title}</h3>
                  <p className="text-[10px] text-gray-500 line-clamp-1">{post.details}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedPostForPreview(post)}
                    className="p-2 text-gray-500 hover:text-red-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                    title="বিস্তারিত দেখুন"
                  >
                    <FaEye size={11} />
                  </button>

                  <button
                    onClick={() => togglePin(post.id)}
                    className={`p-2 rounded-lg transition ${
                      post.isPinned ? 'bg-amber-500 text-white shadow' : 'bg-gray-100 text-gray-400 hover:text-amber-600'
                    }`}
                    title={post.isPinned ? 'পিন তুলুন' : 'উপরে পিন করুন'}
                  >
                    <FaThumbtack size={11} />
                  </button>

                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg transition"
                    title="মুছে ফেলুন"
                  >
                    <FaTrash size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT PANEL: Live Frontend Display Preview (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 sticky top-6">
            
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FaRegEye className="text-red-600" /> Frontend Live Display
              </h2>
              <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full uppercase">
                Opinion Feed
              </span>
            </div>

            {isSectionActive ? (
              <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-3">
                <div className="flex items-center gap-1 font-extrabold text-base text-gray-900 border-b border-gray-200 pb-1">
                  <span>{sectionTitle}</span>
                  <span className="text-red-600">&gt;</span>
                </div>

                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="flex gap-3 border-b border-gray-100 pb-3 last:border-b-0">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-16 h-14 object-cover rounded shrink-0 border border-gray-200"
                      />
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <h4 className="font-bold text-[11px] text-gray-900 leading-snug line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex gap-1.5 text-[9px]">
                          <span className="bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-gray-600 font-semibold">
                            {post.authorName}
                          </span>
                          <span className="bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-gray-600 font-semibold">
                            {post.authorProfession}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center text-xs font-semibold text-gray-400 border border-dashed border-gray-300">
                মতামত সেকশনটি বন্ধ রাখা হয়েছে।
              </div>
            )}

            {/* Read Details Preview Popup */}
            {selectedPostForPreview && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-300 space-y-2 text-xs">
                <div className="flex justify-between items-center border-b pb-1">
                  <span className="font-bold text-red-600">বিস্তারিত দেখুন (Article Content)</span>
                  <button onClick={() => setSelectedPostForPreview(null)} className="p-1 text-gray-500 hover:text-black">
                    <FaXmark size={14} />
                  </button>
                </div>
                <h3 className="font-bold text-gray-900">{selectedPostForPreview.title}</h3>
                <p className="text-gray-700 text-[11px] leading-relaxed whitespace-pre-line">{selectedPostForPreview.details}</p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}