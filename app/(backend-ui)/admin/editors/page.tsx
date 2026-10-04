'use client';

import { useState, useRef } from 'react';
import { 
  FaUserPen, FaFloppyDisk, FaCloudArrowUp, 
  FaRegEye, FaPowerOff, FaLink, FaPenToSquare,
  FaFileLines, FaEye, FaXmark
} from 'react-icons/fa6';

interface EditorialPost {
  id: string;
  editorName: string;
  editorRole: string;
  editorPhoto: string;
  headline: string;
  editorialText: string;
  readMoreUrl: string;
  publishedAt: string;
}

const mockEditorialHistory: EditorialPost[] = [
  {
    id: 'ed-1',
    editorName: 'আয়েশা রহমান',
    editorRole: 'প্রধান সম্পাদক',
    editorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    headline: 'কোরবানির ঈদ ও আমাদের সামাজিক সচেতনতা',
    editorialText: 'কোরবানির ঈদ আসন্ন। আমরা শিক্ষকদের বাড়ি বাড়ি গিয়ে বলব, আপনারা এই ঈদে তো কোরবানি দিবেন না। চামড়ার টাকাটা আমাদের দান করুন। আমরা বস্তির বাচ্চাদের জন্য একটা স্কুল বানাতে যাচ্ছি। সকলেই বললেন, তোমরা খুব ভাল কাজ করছ। অবহেলিত শিশুদের মধ্যে জ্ঞানের আলো জ্বালাতে যাচ্ছি। এই প্রশংসামূলক বাক্য শুনেই আমাদের সন্তুষ্ট থাকতে হল।',
    readMoreUrl: '/posts/editorial-eid-appeal',
    publishedAt: 'আজ, ১০:৩০ AM',
  },
  {
    id: 'ed-2',
    editorName: 'নুরুল ইসলাম',
    editorRole: 'সহকারী সম্পাদক',
    editorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    headline: 'ডিজিটাল যুগে সাংবাদিকতার নৈতিকতা',
    editorialText: 'তথ্য প্রযুক্তির এই যুগে বস্তুনিষ্ঠ সংবাদ পরিবেশন করা আমাদের প্রধান দায়িত্ব। সত্য উন্মোচন ও বস্তুনিষ্ঠতাই সাংবাদিকতার মূল ভিত্তি...',
    readMoreUrl: '/posts/journalism-ethics',
    publishedAt: 'গতকাল, ০৬:১৫ PM',
  },
];

export default function EditorsPage() {
  const [isSectionActive, setIsSectionActive] = useState(true);

  // Active Live Editorial Post State (Displayed on Frontend Pink Box)
  const [activeEditorial, setActiveEditorial] = useState<EditorialPost>(mockEditorialHistory[0]);

  // Form Fields
  const [editorName, setEditorName] = useState(mockEditorialHistory[0].editorName);
  const [editorRole, setEditorRole] = useState(mockEditorialHistory[0].editorRole);
  const [editorPhoto, setEditorPhoto] = useState(mockEditorialHistory[0].editorPhoto);
  const [headline, setHeadline] = useState(mockEditorialHistory[0].headline);
  const [editorialText, setEditorialText] = useState(mockEditorialHistory[0].editorialText);
  const [readMoreUrl, setReadMoreUrl] = useState(mockEditorialHistory[0].readMoreUrl);

  const [history, setHistory] = useState<EditorialPost[]>(mockEditorialHistory);
  const [previewModalPost, setPreviewModalPost] = useState<EditorialPost | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditorPhoto(URL.createObjectURL(file));
    }
  };

  // Publish / Save New Editorial Post
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorName || !editorialText) {
      alert('অনুগ্রহ করে সম্পাদকের নাম এবং সম্পাদকীয় বক্তব্য লিখুন।');
      return;
    }

    const newPost: EditorialPost = {
      id: `ed-${Date.now()}`,
      editorName,
      editorRole,
      editorPhoto,
      headline,
      editorialText,
      readMoreUrl: readMoreUrl || '#',
      publishedAt: 'এখনই',
    };

    setActiveEditorial(newPost);
    setHistory([newPost, ...history]);
    alert('নতুন সম্পাদকীয় কলাম সফলভাবে প্রকাশিত হয়েছে!');
  };

  // Load an existing editorial from history into the form & preview
  const handleLoadFromHistory = (post: EditorialPost) => {
    setActiveEditorial(post);
    setEditorName(post.editorName);
    setEditorRole(post.editorRole);
    setEditorPhoto(post.editorPhoto);
    setHeadline(post.headline);
    setEditorialText(post.editorialText);
    setReadMoreUrl(post.readMoreUrl);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaUserPen className="text-red-600" /> সম্পাদকীয় কলাম লেখক (Editorial Publisher)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            প্রধান সম্পাদক ও সম্পাদকীয় প্যানেলের কলাম পোস্ট ও পরিচালনা করুন।
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Post Form & History List (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Editorial Form */}
          <form onSubmit={handlePublish} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
              <FaPenToSquare className="text-red-600" /> নতুন 'সম্পাদকীয়' পোস্ট লিখুন
            </h2>

            <div className="space-y-3 text-xs">
              
              {/* Photo Upload */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">সম্পাদকের প্রোফাইল ছবি</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <img
                    src={editorPhoto}
                    alt={editorName}
                    className="w-14 h-14 object-cover rounded-lg border border-gray-300 shrink-0"
                  />
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition"
                    >
                      <FaCloudArrowUp className="text-red-600" /> ছবি আপলোড করুন
                    </button>
                    <p className="text-[10px] text-gray-400">অনুমোদিত সাইজ: ৩০০ × ৩০০ পিক্সেল</p>
                  </div>
                </div>
              </div>

              {/* Author Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">সম্পাদকের নাম *</label>
                  <input
                    type="text"
                    value={editorName}
                    onChange={(e) => setEditorName(e.target.value)}
                    placeholder="যেমন: সম্পাদকের নাম"
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">পদবী</label>
                  <input
                    type="text"
                    value={editorRole}
                    onChange={(e) => setEditorRole(e.target.value)}
                    placeholder="যেমন: প্রধান সম্পাদক"
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Article Headline */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">শিরোনাম (Headline)</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="সম্পাদকীয় কলামের শিরোনাম..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* Main Content Body */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  সম্পাদকীয় বক্তব্য / কলামের বিবরণ (Editorial Content) *
                </label>
                <textarea
                  rows={6}
                  value={editorialText}
                  onChange={(e) => setEditorialText(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-normal text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 leading-relaxed"
                  placeholder="সম্পাদকীয় লেখাটি এখানে লিখুন..."
                  required
                />
              </div>

              {/* Link */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <FaLink className="text-gray-400" /> 'বিস্তারিত পড়ুন...' লিংক URL
                </label>
                <input
                  type="text"
                  value={readMoreUrl}
                  onChange={(e) => setReadMoreUrl(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow transition flex items-center gap-2"
                >
                  <FaFloppyDisk /> কলামটি পাবলিশ করুন
                </button>
              </div>

            </div>
          </form>

          {/* Previous Editorial Posts History */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
              <FaFileLines className="text-gray-500" /> পূর্বে প্রকাশিত সম্পাদকীয় কলামসমূহ ({history.length})
            </h2>

            <div className="space-y-2">
              {history.map((post) => (
                <div
                  key={post.id}
                  className={`p-3 rounded-lg border flex justify-between items-center gap-3 transition ${
                    activeEditorial.id === post.id ? 'border-red-500 bg-red-50/20' : 'border-gray-200 bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img src={post.editorPhoto} alt={post.editorName} className="w-10 h-10 object-cover rounded border shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <span className="font-bold text-gray-800">{post.editorName}</span>
                        <span>•</span>
                        <span>{post.publishedAt}</span>
                      </div>
                      <p className="text-xs font-bold text-gray-800 line-clamp-1">{post.editorialText}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setPreviewModalPost(post)}
                      className="p-1.5 text-gray-500 hover:text-red-600 bg-white border border-gray-200 rounded transition"
                      title="সম্পূর্ণ লেখা দেখুন"
                    >
                      <FaEye size={11} />
                    </button>
                    <button
                      onClick={() => handleLoadFromHistory(post)}
                      className="px-2 py-1 text-[10px] font-bold bg-white hover:bg-gray-100 border border-gray-300 rounded text-gray-700 transition"
                    >
                      একটিভ করুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: Live Pink Card Replica Preview (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 sticky top-6">
            
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FaRegEye className="text-red-600" /> Frontend Editorial Box Preview
              </h2>
              <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                Live Box
              </span>
            </div>

            {isSectionActive ? (
              /* EXACT PINK SIDEBAR BOX REPLICA FROM SCREENSHOT */
              <div className="bg-[#fca5a5] p-4 rounded-md space-y-3 border border-red-300 text-gray-900 flex flex-col justify-between min-h-[380px]">
                <div className="space-y-3">
                  {/* Title */}
                  <div className="border-b border-red-400/60 pb-1">
                    <h3 className="font-extrabold text-base text-gray-900 tracking-wide">
                      সম্পাদকীয়
                    </h3>
                  </div>

                  {/* Author Profile Badge */}
                  <div className="flex gap-2.5 items-center">
                    <img
                      src={editorPhoto}
                      alt={editorName}
                      className="w-14 h-14 object-cover rounded border border-white/50 shrink-0"
                    />
                    <div className="text-[10px] leading-snug space-y-0.5">
                      <p className="font-bold text-gray-900">নাম: {editorName}</p>
                      <p className="text-gray-800 font-medium">{editorRole}</p>
                    </div>
                  </div>

                  {/* Paragraph Body */}
                  <p className="text-[11px] text-gray-900 leading-relaxed whitespace-pre-line line-clamp-[12]">
                    {editorialText}
                  </p>
                </div>

                {/* Read More Link */}
                <div className="pt-2">
                  <a
                    href={readMoreUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-bold text-gray-900 hover:underline block"
                  >
                    বিস্তারিত পড়ুন...
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center text-xs font-semibold text-gray-400 border border-dashed border-gray-300">
                'সম্পাদকীয়' সেকশনটি ফ্রন্টএন্ডে বন্ধ রাখা হয়েছে।
              </div>
            )}

            {/* Read Details Preview Modal */}
            {previewModalPost && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-300 space-y-2 text-xs">
                <div className="flex justify-between items-center border-b pb-1">
                  <span className="font-bold text-red-600">সম্পূর্ণ সম্পাদকীয় কলাম</span>
                  <button onClick={() => setPreviewModalPost(null)} className="p-1 text-gray-500 hover:text-black">
                    <FaXmark size={14} />
                  </button>
                </div>
                <div className="text-[10px] text-gray-500 font-bold">
                  {previewModalPost.editorName} ({previewModalPost.editorRole})
                </div>
                <p className="text-gray-800 text-[11px] leading-relaxed whitespace-pre-line">{previewModalPost.editorialText}</p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}