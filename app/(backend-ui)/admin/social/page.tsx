'use client';

import { useState } from 'react';
import { 
  FaShareNodes, FaPlus, FaTrash, FaFloppyDisk, 
  FaRegEye, FaFacebook, FaYoutube, FaXTwitter, 
  FaInstagram, FaLinkedin, FaWhatsapp, FaGlobe,
  FaCheck, FaPenToSquare
} from 'react-icons/fa6';

interface SocialPlatform {
  id: string;
  name: string;
  url: string;
  followerText: string;
  isEnabled: boolean;
}

const initialPlatforms: SocialPlatform[] = [
  { id: 'fb', name: 'Facebook Page', url: 'https://facebook.com/24ghonta', followerText: '১.২M অনুসারী', isEnabled: true },
  { id: 'yt', name: 'YouTube Channel', url: 'https://youtube.com/24ghonta', followerText: '৮৫০K গ্রাহক', isEnabled: true },
  { id: 'tw', name: 'X (Twitter)', url: 'https://x.com/24ghonta', followerText: '১৫০K অনুসারী', isEnabled: true },
  { id: 'ig', name: 'Instagram', url: 'https://instagram.com/24ghonta', followerText: '২০০K অনুসারী', isEnabled: true },
  { id: 'wa', name: 'WhatsApp Channel', url: 'https://whatsapp.com/channel/24ghonta', followerText: '৫০K সদস্য', isEnabled: true },
  { id: 'li', name: 'LinkedIn', url: 'https://linkedin.com/company/24ghonta', followerText: '২৫K অনুসারী', isEnabled: false },
];

export default function SocialMediaPage() {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>(initialPlatforms);
  const [selectedId, setSelectedId] = useState<string>(initialPlatforms[0].id);

  // Widget Toggles
  const [enableFloatingShare, setEnableFloatingShare] = useState(true);
  const [enableFbFeedWidget, setEnableFbFeedWidget] = useState(true);
  const [enableYtSubscribeBox, setEnableYtSubscribeBox] = useState(true);

  const activePlatform = platforms.find((p) => p.id === selectedId) || platforms[0];

  const updateActivePlatform = (field: keyof SocialPlatform, value: any) => {
    setPlatforms(
      platforms.map((p) => (p.id === selectedId ? { ...p, [field]: value } : p))
    );
  };

  const togglePlatform = (id: string) => {
    setPlatforms(
      platforms.map((p) => (p.id === id ? { ...p, isEnabled: !p.isEnabled } : p))
    );
  };

  const renderPlatformIcon = (id: string) => {
    switch (id) {
      case 'fb': return <FaFacebook className="text-blue-600" size={18} />;
      case 'yt': return <FaYoutube className="text-red-600" size={18} />;
      case 'tw': return <FaXTwitter className="text-black" size={18} />;
      case 'ig': return <FaInstagram className="text-pink-600" size={18} />;
      case 'wa': return <FaWhatsapp className="text-emerald-500" size={18} />;
      case 'li': return <FaLinkedin className="text-blue-700" size={18} />;
      default: return <FaGlobe className="text-gray-500" size={18} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaShareNodes className="text-red-600" /> Social Media & Links Manager
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage official social media profile URLs, follower stats, social sharing widgets, and embeds.
          </p>
        </div>

        <button
          onClick={() => alert('Social media links and widget configuration saved!')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition flex items-center gap-2"
        >
          <FaFloppyDisk /> Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Platforms List (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b pb-2">
              Official Social Profiles ({platforms.length})
            </h2>

            <div className="space-y-2">
              {platforms.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                    selectedId === p.id
                      ? 'border-red-500 bg-red-50/20 shadow-sm ring-1 ring-red-500'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-gray-50 rounded-lg border shrink-0">
                      {renderPlatformIcon(p.id)}
                    </div>
                    <div className="space-y-0.5 truncate">
                      <span className="font-bold text-xs text-gray-800 block truncate">{p.name}</span>
                      <span className="text-[10px] text-gray-400 block truncate">{p.followerText}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlatform(p.id);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition shrink-0 ${
                      p.isEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {p.isEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Social Widgets Toggles */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b pb-2">
              Frontend Social Features
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                <span className="font-semibold text-gray-700">Sticky Article Share Bar</span>
                <button
                  type="button"
                  onClick={() => setEnableFloatingShare(!enableFloatingShare)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                    enableFloatingShare ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {enableFloatingShare ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                <span className="font-semibold text-gray-700">Sidebar Facebook Widget</span>
                <button
                  type="button"
                  onClick={() => setEnableFbFeedWidget(!enableFbFeedWidget)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                    enableFbFeedWidget ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {enableFbFeedWidget ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                <span className="font-semibold text-gray-700">YouTube Subscribe Box</span>
                <button
                  type="button"
                  onClick={() => setEnableYtSubscribeBox(!enableYtSubscribeBox)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                    enableYtSubscribeBox ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {enableYtSubscribeBox ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* MIDDLE PANEL: Active Platform Editor (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          {activePlatform && (
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  {renderPlatformIcon(activePlatform.id)} Edit {activePlatform.name}
                </h2>
                <button
                  type="button"
                  onClick={() => togglePlatform(activePlatform.id)}
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    activePlatform.isEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {activePlatform.isEnabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={activePlatform.name}
                    onChange={(e) => updateActivePlatform('name', e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Target Profile / Channel URL</label>
                  <input
                    type="text"
                    value={activePlatform.url}
                    onChange={(e) => updateActivePlatform('url', e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Followers / Subscriber Label</label>
                  <input
                    type="text"
                    value={activePlatform.followerText}
                    onChange={(e) => updateActivePlatform('followerText', e.target.value)}
                    placeholder="e.g. ১.২M অনুসারী"
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-red-600"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Live Social Feed Card Preview (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 sticky top-6">
            <div className="border-b pb-2 flex items-center justify-between">
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <FaRegEye className="text-red-600" /> OpenGraph Social Share Preview
              </h2>
            </div>

            <p className="text-[11px] text-gray-500">
              Preview how news stories from <strong className="text-gray-800">২৪ঘণ্টা</strong> look when shared on Facebook and Twitter feeds.
            </p>

            {/* Simulated Facebook Post Card */}
            <div className="border border-gray-300 rounded-xl overflow-hidden bg-gray-50 shadow-xs">
              <div className="p-3 bg-white border-b flex items-center gap-2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center font-black text-white text-xs">
                  ২৪
                </div>
                <div>
                  <span className="font-bold text-xs text-gray-800 block leading-tight">২৪ঘণ্টা</span>
                  <span className="text-[10px] text-gray-400 block">Just now • 🌐</span>
                </div>
              </div>

              {/* Mock Banner */}
              <div className="bg-gray-800 h-32 flex items-center justify-center text-white font-bold text-xs">
                [ News OpenGraph Feature Image ]
              </div>

              <div className="p-3 bg-white border-t border-gray-200 space-y-1">
                <span className="text-[9px] font-mono uppercase text-gray-400 font-bold">24GHONTA.COM</span>
                <h3 className="font-bold text-xs text-gray-900 leading-snug">
                  জাতীয় বাজেট ২০২৬-২৭: অর্থনীতি সমৃদ্ধির নতুন দিগন্ত
                </h3>
                <p className="text-[10px] text-gray-500 line-clamp-2">
                  বিস্তারিত সংবাদ পড়তে ক্লিক করুন...
                </p>
              </div>
            </div>

            {/* Enabled Channels Summary */}
            <div className="border-t pt-3 space-y-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Active Header/Footer Icons</span>
              <div className="flex flex-wrap gap-2">
                {platforms.filter((p) => p.isEnabled).map((p) => (
                  <div key={p.id} className="p-1.5 bg-gray-100 rounded-lg border flex items-center gap-1 text-[11px] font-bold text-gray-700">
                    {renderPlatformIcon(p.id)}
                    <span className="text-[10px]">{p.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}