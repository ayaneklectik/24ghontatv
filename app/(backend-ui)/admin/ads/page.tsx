'use client';

import { useState, useRef } from 'react';
import { 
  FaRectangleAd, FaPlus, FaTrash, FaFloppyDisk, 
  FaRegEye, FaPowerOff, FaCode, FaImage, FaCalendarDays,
  FaArrowUpRightFromSquare, FaPenToSquare, FaCloudArrowUp,
  FaFileCode, FaCheck
} from 'react-icons/fa6';

interface AdSlot {
  id: string;
  slotName: string;
  slotLocation: string;
  recommendedSize: string;
  adType: 'image' | 'script' | 'html';
  imageUrl?: string;
  targetUrl?: string;
  scriptCode?: string;
  htmlCode?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

const initialAdSlots: AdSlot[] = [
  {
    id: 'ad-header-top',
    slotName: 'Header Main Banner',
    slotLocation: 'Top Header (Next to Logo)',
    recommendedSize: '728x90 px',
    adType: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    targetUrl: 'https://example.com/promo-campaign',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    isActive: true,
  },
  {
    id: 'ad-sidebar-top',
    slotName: 'Sidebar Top Box Ad',
    slotLocation: 'Right Sidebar (Top Widget Area)',
    recommendedSize: '300x250 px',
    adType: 'script',
    scriptCode: '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>\n<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-123456" data-ad-slot="7890"></ins>',
    startDate: '2026-07-15',
    endDate: '2026-09-15',
    isActive: true,
  },
  {
    id: 'ad-sidebar-bottom',
    slotName: 'Sidebar Sticky Half-Page Ad',
    slotLocation: 'Right Sidebar (Bottom Sticky Area)',
    recommendedSize: '300x600 px',
    adType: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
    targetUrl: 'https://example.com/festive-sale',
    startDate: '2026-08-01',
    endDate: '2026-08-25',
    isActive: true,
  },
  {
    id: 'ad-article-mid',
    slotName: 'In-Article Content Mid Banner',
    slotLocation: 'Inside News Detail Page (After Paragraph 3)',
    recommendedSize: '728x90 px',
    adType: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800',
    targetUrl: 'https://example.com/special-deal',
    startDate: '2026-08-05',
    endDate: '2026-08-20',
    isActive: true,
  },
  {
    id: 'ad-category-header',
    slotName: 'Category Top Leaderboard',
    slotLocation: 'Top of Category Listing Page',
    recommendedSize: '970x90 px',
    adType: 'html',
    htmlCode: '<div style="background:#111;color:#fff;padding:15px;text-align:center;font-weight:bold;">⚡ EXCLUSIVE SPONSORSHIP BANNER - CLICK HERE</div>',
    startDate: '2026-08-01',
    endDate: '2026-08-15',
    isActive: false,
  },
  {
    id: 'ad-footer-sticky',
    slotName: 'Footer Sticky Banner',
    slotLocation: 'Bottom Floating Fixed Bar across Portal',
    recommendedSize: '728x90 px',
    adType: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800',
    targetUrl: 'https://example.com/app-download',
    startDate: '2026-08-01',
    endDate: '2026-08-30',
    isActive: false,
  },
  {
    id: 'ad-popup-modal',
    slotName: 'Welcome Popup Overlay',
    slotLocation: 'Portal Entry Lightbox Modal',
    recommendedSize: '600x400 px',
    adType: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=600',
    targetUrl: 'https://example.com/breaking-event',
    startDate: '2026-08-01',
    endDate: '2026-08-10',
    isActive: false,
  }
];

export default function AdsPage() {
  const [slots, setSlots] = useState<AdSlot[]>(initialAdSlots);
  const [selectedSlotId, setSelectedSlotId] = useState<string>(initialAdSlots[0].id);

  // Active Selected Slot Object
  const currentSlot = slots.find((s) => s.id === selectedSlotId) || slots[0];

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Update Field Value for Current Active Slot
  const updateCurrentSlotField = (field: keyof AdSlot, value: any) => {
    setSlots(
      slots.map((slot) =>
        slot.id === selectedSlotId ? { ...slot, [field]: value } : slot
      )
    );
  };

  // Local Image File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      updateCurrentSlotField('imageUrl', objectUrl);
    }
  };

  // Toggle Master Slot Active Switch
  const toggleSlotActive = (id: string) => {
    setSlots(
      slots.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  // Add New Custom Ad Slot
  const handleAddNewSlot = () => {
    const newSlotName = prompt('Enter New Ad Placement Name:', 'Custom Section Banner');
    if (!newSlotName) return;

    const newSlot: AdSlot = {
      id: `ad-custom-${Date.now()}`,
      slotName: newSlotName,
      slotLocation: 'Custom Page Location',
      recommendedSize: '728x90 px',
      adType: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
      targetUrl: 'https://example.com',
      isActive: true,
    };

    setSlots([...slots, newSlot]);
    setSelectedSlotId(newSlot.id);
  };

  // Save Settings
  const handleSaveAll = () => {
    console.log('Updated Ad Slots Configuration:', slots);
    alert('All Advertisement Slots and Banner Settings Saved Successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaRectangleAd className="text-red-600" /> Advertisements & Banner Engine
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage banner placements, uploaded ad graphics, Google AdSense tags, and schedules across all portal sections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddNewSlot}
            className="bg-gray-900 hover:bg-black text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow transition flex items-center gap-2"
          >
            <FaPlus /> Add New Ad Slot
          </button>

          <button
            onClick={handleSaveAll}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition flex items-center gap-2"
          >
            <FaFloppyDisk /> Save All Configurations
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Ad Placement Selector List (4 Columns) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex justify-between items-center">
              <span>Ad Placements ({slots.length})</span>
              <span className="text-[10px] text-gray-400 font-normal">Click to edit</span>
            </h2>

            <div className="space-y-2">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex justify-between items-center gap-3 ${
                    selectedSlotId === slot.id
                      ? 'border-red-500 bg-red-50/20 shadow-sm ring-1 ring-red-500'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-800 truncate">{slot.slotName}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 truncate">{slot.slotLocation}</p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-1.5 py-0.5 rounded border border-gray-200">
                        {slot.recommendedSize}
                      </span>
                      <span className="text-[9px] font-semibold text-gray-400 uppercase">
                        {slot.adType}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSlotActive(slot.id);
                    }}
                    className={`p-2 rounded-lg text-[10px] font-bold transition shrink-0 ${
                      slot.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                    }`}
                    title={slot.isActive ? 'Disable Slot' : 'Enable Slot'}
                  >
                    <FaPowerOff size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE PANEL: Active Slot Form (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <FaPenToSquare className="text-red-600" /> Edit: {currentSlot.slotName}
                </h2>
                <p className="text-[11px] text-gray-500 mt-0.5">{currentSlot.slotLocation}</p>
              </div>

              <button
                onClick={() => toggleSlotActive(currentSlot.id)}
                className={`text-[10px] font-bold px-3 py-1 rounded-full transition flex items-center gap-1.5 ${
                  currentSlot.isActive
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                <FaPowerOff size={10} />
                {currentSlot.isActive ? 'SLOT ACTIVE' : 'SLOT INACTIVE'}
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Ad Type Mode Selector */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Select Ad Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => updateCurrentSlotField('adType', 'image')}
                    className={`p-2 rounded-lg border font-bold flex flex-col items-center justify-center gap-1 text-[11px] transition ${
                      currentSlot.adType === 'image'
                        ? 'border-red-600 bg-red-50 text-red-600'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  >
                    <FaImage size={13} /> Image Banner
                  </button>

                  <button
                    type="button"
                    onClick={() => updateCurrentSlotField('adType', 'script')}
                    className={`p-2 rounded-lg border font-bold flex flex-col items-center justify-center gap-1 text-[11px] transition ${
                      currentSlot.adType === 'script'
                        ? 'border-red-600 bg-red-50 text-red-600'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  >
                    <FaCode size={13} /> AdSense / JS
                  </button>

                  <button
                    type="button"
                    onClick={() => updateCurrentSlotField('adType', 'html')}
                    className={`p-2 rounded-lg border font-bold flex flex-col items-center justify-center gap-1 text-[11px] transition ${
                      currentSlot.adType === 'html'
                        ? 'border-red-600 bg-red-50 text-red-600'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  >
                    <FaFileCode size={13} /> Custom HTML
                  </button>
                </div>
              </div>

              {/* Dynamic Inputs Based on Selected Ad Type */}
              {currentSlot.adType === 'image' && (
                <div className="space-y-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                  {/* Image Upload or URL */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Banner Image Source</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition"
                      >
                        <FaCloudArrowUp className="text-red-600" /> Upload Image File
                      </button>
                      <span className="text-[10px] text-gray-400">or enter image URL below</span>
                    </div>

                    <input
                      type="text"
                      value={currentSlot.imageUrl || ''}
                      onChange={(e) => updateCurrentSlotField('imageUrl', e.target.value)}
                      placeholder="https://example.com/banner.png"
                      className="w-full p-2 bg-white border border-gray-300 rounded-lg font-mono text-[11px]"
                    />
                  </div>

                  {/* Redirect Click Target URL */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      Click Target URL <FaArrowUpRightFromSquare size={10} className="text-gray-400" />
                    </label>
                    <input
                      type="text"
                      value={currentSlot.targetUrl || ''}
                      onChange={(e) => updateCurrentSlotField('targetUrl', e.target.value)}
                      placeholder="https://example.com/destination"
                      className="w-full p-2 bg-white border border-gray-300 rounded-lg font-mono text-[11px]"
                    />
                  </div>
                </div>
              )}

              {currentSlot.adType === 'script' && (
                <div className="space-y-2 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                  <label className="block font-semibold text-gray-700 mb-1">
                    Google AdSense / JavaScript Script Snippet
                  </label>
                  <textarea
                    rows={6}
                    value={currentSlot.scriptCode || ''}
                    onChange={(e) => updateCurrentSlotField('scriptCode', e.target.value)}
                    placeholder="<script async src='https://pagead2.googlesyndication.com...'></script>"
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg font-mono text-[11px] leading-relaxed"
                  />
                </div>
              )}

              {currentSlot.adType === 'html' && (
                <div className="space-y-2 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                  <label className="block font-semibold text-gray-700 mb-1">
                    Custom HTML / Iframe Embed Code
                  </label>
                  <textarea
                    rows={6}
                    value={currentSlot.htmlCode || ''}
                    onChange={(e) => updateCurrentSlotField('htmlCode', e.target.value)}
                    placeholder="<div><a href='...'>HTML Banner</a></div>"
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg font-mono text-[11px] leading-relaxed"
                  />
                </div>
              )}

              {/* Campaign Schedule Dates */}
              <div className="space-y-1">
                <label className="block font-semibold text-gray-700 flex items-center gap-1">
                  <FaCalendarDays className="text-gray-400" /> Campaign Validity Schedule
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-gray-500 block mb-0.5">Start Date</span>
                    <input
                      type="date"
                      value={currentSlot.startDate || ''}
                      onChange={(e) => updateCurrentSlotField('startDate', e.target.value)}
                      className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block mb-0.5">Expiry Date</span>
                    <input
                      type="date"
                      value={currentSlot.endDate || ''}
                      onChange={(e) => updateCurrentSlotField('endDate', e.target.value)}
                      className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Live Ad Preview (3 Columns) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3 sticky top-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <FaRegEye className="text-red-600" /> Live Preview
              </h2>
              <span className="text-[9px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                {currentSlot.recommendedSize}
              </span>
            </div>

            {currentSlot.isActive ? (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  {currentSlot.slotName}
                </span>

                {currentSlot.adType === 'image' && (
                  currentSlot.imageUrl ? (
                    <a
                      href={currentSlot.targetUrl || undefined}
                      target="_blank"
                      rel="noreferrer"
                      className="block group relative rounded-lg overflow-hidden border border-gray-300 shadow-sm transition hover:opacity-95"
                    >
                      <img src={currentSlot.imageUrl} alt={currentSlot.slotName} className="w-full h-auto object-cover" />
                      <div className="absolute top-1 right-1 bg-black/70 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                        SPONSORED AD
                      </div>
                    </a>
                  ) : (
                    <div className="bg-gray-100 p-8 rounded-lg border border-dashed border-gray-300 text-center text-gray-400 text-xs font-medium">
                      No Image Banner Source Selected
                    </div>
                  )
                )}

                {currentSlot.adType === 'script' && (
                  <div className="bg-gray-900 text-emerald-400 p-3 rounded-lg font-mono text-[10px] border border-gray-800 break-all leading-relaxed">
                    <span className="text-gray-500 block mb-1">// Script Executed On-Load</span>
                    {currentSlot.scriptCode || '<!-- JS Code Here -->'}
                  </div>
                )}

                {currentSlot.adType === 'html' && (
                  <div 
                    className="border border-gray-300 rounded-lg p-2 bg-gray-50 text-xs"
                    dangerouslySetInnerHTML={{ __html: currentSlot.htmlCode || '<div class="text-gray-400 text-center">HTML Preview Placeholder</div>' }}
                  />
                )}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center text-xs font-semibold text-gray-400 border border-dashed border-gray-300">
                This ad placement is currently disabled on the frontend portal.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}