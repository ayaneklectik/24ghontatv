'use client';

import { useState } from 'react';
import { 
  FaVideo, FaPlus, FaTrash, FaFloppyDisk, 
  FaRegEye, FaYoutube, FaPlay, FaGripVertical,
  FaArrowUp, FaArrowDown, FaPenToSquare, FaTowerBroadcast
} from 'react-icons/fa6';

interface VideoItem {
  id: string;
  youtubeId: string;
  title: string;
  category: string;
  duration: string;
  isFeaturedOnHome: boolean;
  isActive: boolean;
}

const initialVideos: VideoItem[] = [
  { id: 'vid-1', youtubeId: 'dQw4w9WgXcQ', title: 'জাতীয় বাজেটের প্রধান দিকগুলো নিয়ে বিশেষ আলোচনা', category: 'অর্থনীতি', duration: '০৫:২৪', isFeaturedOnHome: true, isActive: true },
  { id: 'vid-2', youtubeId: '3JZ_D3ELwOQ', title: 'আন্তর্জাতিক মুদ্রা তহবিলের নতুন রিপোর্ট ও বাংলাদেশ', category: 'আন্তর্জাতিক', duration: '০৩:১৫', isFeaturedOnHome: true, isActive: true },
  { id: 'vid-3', youtubeId: 'L_LUpnjgPso', title: 'টি-২০ বিশ্বকাপের দল ঘোষণা করলেন প্রধান নির্বাচক', category: 'খেলাধুলা', duration: '০৪:১০', isFeaturedOnHome: true, isActive: true },
  { id: 'vid-4', youtubeId: 'fJ9rUzIMcZQ', title: 'আসন্ন ঈদের নতুন ছায়াছবির বিশেষ টিজার মুক্তি', category: 'বিনোদন', duration: '০২:৪৫', isFeaturedOnHome: false, isActive: true },
];

export default function VideoManagerPage() {
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [selectedVideoId, setSelectedVideoId] = useState<string>(initialVideos[0].id);

  // Live Broadcast State
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveStreamTitle, setLiveStreamTitle] = useState('২৪ঘণ্টা সরাসরি সম্প্রচার (Live Stream)');
  const [liveYoutubeId, setLiveYoutubeId] = useState('dQw4w9WgXcQ');

  // New Video Form
  const [newTitle, setNewTitle] = useState('');
  const [newYoutubeUrl, setNewYoutubeUrl] = useState('');
  const [newCategory, setNewCategory] = useState('জাতীয়');

  const activeVideo = videos.find((v) => v.id === selectedVideoId) || videos[0];

  // Helper to extract YouTube Video ID from full URL
  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : url;
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newYoutubeUrl) return;

    const ytId = extractYoutubeId(newYoutubeUrl);
    const newVid: VideoItem = {
      id: `vid-${Date.now()}`,
      youtubeId: ytId,
      title: newTitle,
      category: newCategory,
      duration: '০৩:০০',
      isFeaturedOnHome: true,
      isActive: true,
    };

    setVideos([newVid, ...videos]);
    setSelectedVideoId(newVid.id);
    setNewTitle('');
    setNewYoutubeUrl('');
  };

  const updateActiveVideo = (field: keyof VideoItem, value: any) => {
    setVideos(
      videos.map((v) => (v.id === selectedVideoId ? { ...v, [field]: value } : v))
    );
  };

  const moveVideo = (index: number, direction: 'up' | 'down') => {
    const updated = [...videos];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;

    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setVideos(updated);
  };

  const handleDeleteVideo = (id: string) => {
    const filtered = videos.filter((v) => v.id !== id);
    setVideos(filtered);
    if (filtered.length > 0) setSelectedVideoId(filtered[0].id);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaVideo className="text-red-600" /> Video Gallery & Live Stream Manager
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage embedded YouTube news videos, featured video slider content, and live stream broadcasts.
          </p>
        </div>

        <button
          onClick={() => alert('Video Gallery Settings Saved!')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition flex items-center gap-2"
        >
          <FaFloppyDisk /> Save Video Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Live Stream & Add Video Form (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Live TV Broadcast Box */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <FaTowerBroadcast className="text-red-600" /> Live TV / Broadcast Stream
              </h2>
              <button
                type="button"
                onClick={() => setIsLiveActive(!isLiveActive)}
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition ${
                  isLiveActive ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {isLiveActive ? '🔴 LIVE NOW' : 'OFFLINE'}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Live Stream Headline</label>
                <input
                  type="text"
                  value={liveStreamTitle}
                  onChange={(e) => setLiveStreamTitle(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">YouTube Live Video ID / URL</label>
                <input
                  type="text"
                  value={liveYoutubeId}
                  onChange={(e) => setLiveYoutubeId(extractYoutubeId(e.target.value))}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Add New Video Form */}
          <form onSubmit={handleAddVideo} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b pb-2">
              Add New YouTube News Video
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Video Title (Bengali)</label>
                <input
                  type="text"
                  placeholder="যেমন: জাতীয় বাজেটের প্রতিক্রিয়া"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">YouTube Video Link or ID</label>
                <input
                  type="text"
                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                  value={newYoutubeUrl}
                  onChange={(e) => setNewYoutubeUrl(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-mono text-[11px]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold"
                >
                  <option value="জাতীয়">জাতীয়</option>
                  <option value="রাজনীতি">রাজনীতি</option>
                  <option value="অর্থনীতি">অর্থনীতি</option>
                  <option value="খেলাধুলা">খেলাধুলা</option>
                  <option value="বিনোদন">বিনোদন</option>
                  <option value="আন্তর্জাতিক">আন্তর্জাতিক</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs py-2.5 flex items-center justify-center gap-1.5 shadow transition"
              >
                <FaPlus /> Add Video to Gallery
              </button>
            </div>
          </form>

        </div>

        {/* MIDDLE PANEL: Video List Stack (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b pb-2 flex justify-between">
              <span>Video Gallery ({videos.length})</span>
              <span className="text-[10px] text-gray-400 font-normal">Reorder list</span>
            </h2>

            <div className="space-y-2">
              {videos.map((vid, index) => (
                <div
                  key={vid.id}
                  onClick={() => setSelectedVideoId(vid.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                    selectedVideoId === vid.id
                      ? 'border-red-500 bg-red-50/20 shadow-sm ring-1 ring-red-500'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <FaGripVertical className="text-gray-300 shrink-0" size={13} />

                  {/* Thumbnail Preview */}
                  <div className="relative w-16 h-10 bg-gray-900 rounded shrink-0 overflow-hidden border border-gray-300 flex items-center justify-center">
                    <img
                      src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bg-red-600/80 text-white rounded-full p-1">
                      <FaPlay size={8} />
                    </div>
                  </div>

                  <div className="space-y-0.5 min-w-0 flex-1">
                    <span className="font-bold text-xs text-gray-800 block truncate">{vid.title}</span>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded font-bold text-gray-600">{vid.category}</span>
                      <span>•</span>
                      <span>{vid.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => moveVideo(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-500 hover:text-black disabled:opacity-30"
                    >
                      <FaArrowUp size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveVideo(index, 'down')}
                      disabled={index === videos.length - 1}
                      className="p-1 text-gray-500 hover:text-black disabled:opacity-30"
                    >
                      <FaArrowDown size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Active Video Editor & Embed Preview (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          {activeVideo && (
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 sticky top-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FaPenToSquare className="text-red-600" /> Video Details & Embed
                </h2>
                <button
                  type="button"
                  onClick={() => handleDeleteVideo(activeVideo.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition"
                  title="Delete Video"
                >
                  <FaTrash size={12} />
                </button>
              </div>

              {/* YouTube Embed Player Preview */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden border shadow-sm">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}`}
                  title="YouTube Player"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Headline Title</label>
                  <input
                    type="text"
                    value={activeVideo.title}
                    onChange={(e) => updateActiveVideo('title', e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">YouTube Video ID</label>
                  <input
                    type="text"
                    value={activeVideo.youtubeId}
                    onChange={(e) => updateActiveVideo('youtubeId', e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-[11px]"
                  />
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border">
                  <span className="font-semibold text-gray-700">Show on Home Video Slider</span>
                  <button
                    type="button"
                    onClick={() => updateActiveVideo('isFeaturedOnHome', !activeVideo.isFeaturedOnHome)}
                    className={`text-[10px] font-bold px-3 py-1 rounded-full transition ${
                      activeVideo.isFeaturedOnHome ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {activeVideo.isFeaturedOnHome ? 'FEATURED' : 'NORMAL'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}