'use client';

import { useState } from 'react';
import { 
  FaSliders, FaFloppyDisk, FaGlobe, FaShieldHalved, 
  FaChartLine, FaGears, FaPowerOff, FaCheck,
  FaImage, FaGoogle, FaFacebook
} from 'react-icons/fa6';

export default function SiteSettingsPage() {
  // General Site Settings
  const [siteTitle, setSiteTitle] = useState('২৪ঘণ্টা | অনলাইন সংবাদ পোর্টাল');
  const [siteDescription, setSiteDescription] = useState('২৪ঘণ্টা - সত্য ও নির্ভরযোগ্য অনলাইন সংবাদ মাধ্যম। জাতীয়, রাজনীতি, অর্থনীতি ও বিশ্বের সব খবর।');
  const [siteKeywords, setSiteKeywords] = useState('24ghonta, bangla news, bd news, online news portal, breaking news');
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  // SEO & Watermark Settings
  const [enableImageWatermark, setEnableImageWatermark] = useState(true);
  const [watermarkText, setWatermarkText] = useState('24GHONTA.COM');

  // Analytics & Tracking IDs
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('G-24GHONTA99');
  const [facebookPixelId, setFacebookPixelId] = useState('FP-1234567890');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaGears className="text-red-600" /> Global Site Settings
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure global SEO metadata, analytics tracking, watermarking, and site maintenance toggles.
          </p>
        </div>

        <button
          onClick={() => alert('Global site settings saved successfully!')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition flex items-center gap-2"
        >
          <FaFloppyDisk /> Save All Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: General & SEO Configuration (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* General SEO Metadata */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
              <FaGlobe className="text-red-600" /> General Site Identity & SEO Meta
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Site Meta Title</label>
                <input
                  type="text"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Site Meta Description</label>
                <textarea
                  rows={3}
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">SEO Keywords (Comma Separated)</label>
                <input
                  type="text"
                  value={siteKeywords}
                  onChange={(e) => setSiteKeywords(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Maintenance Mode & System State */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <FaPowerOff className="text-red-600" /> Maintenance Mode & Access Control
              </h2>
              <button
                type="button"
                onClick={() => setIsMaintenanceMode(!isMaintenanceMode)}
                className={`text-[10px] font-bold px-3 py-1 rounded-full transition ${
                  isMaintenanceMode ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {isMaintenanceMode ? 'MAINTENANCE ON' : 'SITE ONLINE'}
              </button>
            </div>

            <p className="text-[11px] text-gray-500">
              When maintenance mode is enabled, non-admin visitors will see a maintenance notice page.
            </p>
          </div>

        </div>

        {/* RIGHT PANEL: Analytics & Media Watermarking (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Tracking & Analytics IDs */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
              <FaChartLine className="text-red-600" /> Analytics & Pixel Tracking
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <FaGoogle className="text-gray-400" /> Google Analytics Measurement ID
                </label>
                <input
                  type="text"
                  value={googleAnalyticsId}
                  onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <FaFacebook className="text-gray-400" /> Facebook Pixel ID
                </label>
                <input
                  type="text"
                  value={facebookPixelId}
                  onChange={(e) => setFacebookPixelId(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Automatic Image Watermarking */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <FaImage className="text-red-600" /> Automatic Image Watermark
              </h2>
              <button
                type="button"
                onClick={() => setEnableImageWatermark(!enableImageWatermark)}
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  enableImageWatermark ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {enableImageWatermark ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Watermark Overlay Text</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold uppercase text-red-600"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}