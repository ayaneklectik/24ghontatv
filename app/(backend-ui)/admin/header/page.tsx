'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  FaHeading, FaPlus, FaTrash, FaFloppyDisk, 
  FaRegEye, FaCloudArrowUp, FaGripVertical,
  FaArrowUp, FaArrowDown, FaMagnifyingGlass,
  FaRegCalendarDays, FaBullhorn, FaPenToSquare,
  FaLink, FaTag
} from 'react-icons/fa6';
import HeaderAppearanceSettings from '@/components/dashboard/HeaderAppearanceSettings';
import { fetchAdminDisplaySettings, updateAdminDisplaySettings } from '@/lib/admin-api';
import {
  formatBengaliDate,
  formatBengaliGregorianDate,
  formatEnglishDate,
} from '@/lib/bengali';

interface MenuItem {
  id: string;
  label: string;
  url: string;
  badge?: string; // Optional badge e.g. "HOT", "LIVE"
  isActive: boolean;
  isCustomLink: boolean;
}

const initialNavItems: MenuItem[] = [
  { id: 'm-1', label: 'প্রচ্ছদ', url: '/', isActive: true, isCustomLink: false },
  { id: 'm-2', label: 'জাতীয়', url: '/category/national', isActive: true, isCustomLink: false },
  { id: 'm-3', label: 'রাজনীতি', url: '/category/politics', isActive: true, isCustomLink: false },
  { id: 'm-4', label: 'অর্থনীতি', url: '/category/economy', isActive: true, isCustomLink: false },
  { id: 'm-5', label: 'খেলাধুলা', url: '/category/sports', badge: 'LIVE', isActive: true, isCustomLink: false },
  { id: 'm-6', label: 'বিনোদন', url: '/category/entertainment', isActive: true, isCustomLink: false },
  { id: 'm-7', label: 'আন্তর্জাতিক', url: '/category/international', isActive: true, isCustomLink: false },
  { id: 'm-8', label: 'জীবনযাপন', url: '/category/lifestyle', isActive: true, isCustomLink: false },
  { id: 'm-9', label: 'মতামত', url: '/category/opinion', isActive: true, isCustomLink: false },
];

export default function HeaderPage() {
  // Top Bar Settings
  const [showTopBar, setShowTopBar] = useState(true);
  const [topNoticeText, setTopNoticeText] = useState('স্বাগতম ২৪ঘণ্টা অনলাইন নিউজ পোর্টালে');
  const [showBengaliDate, setShowBengaliDate] = useState(true);
  const [dateSettingsLoaded, setDateSettingsLoaded] = useState(false);
  const [savingDateSetting, setSavingDateSetting] = useState(false);
  const [dateSettingError, setDateSettingError] = useState('');
  const [previewDate, setPreviewDate] = useState({
    english: '',
    bengaliGregorian: '',
    bengaliCalendar: '',
  });

  // Logo Branding Settings
  const [logoType, setLogoType] = useState<'text' | 'image'>('text');
  const [logoText, setLogoText] = useState('২৪ঘণ্টা');
  const [logoTagline, setLogoTagline] = useState('অনলাইন সংবাদ পোর্টাল');
  const [logoImageUrl, setLogoImageUrl] = useState('/logo.png');

  // Search & Utility Buttons
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [showEpaperButton, setShowEpaperButton] = useState(true);

  // Navigation Items
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialNavItems);
  const [selectedItemId, setSelectedItemId] = useState<string>(initialNavItems[0].id);

  // New Menu Item Input State
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const logoFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let active = true;
    fetchAdminDisplaySettings()
      .then((settings) => {
        if (active) setShowBengaliDate(settings.showBengaliDate ?? true);
      })
      .catch((error: unknown) => {
        if (active) {
          setDateSettingError(error instanceof Error ? error.message : 'তারিখের সেটিং লোড করা যায়নি।');
        }
      })
      .finally(() => {
        if (active) setDateSettingsLoaded(true);
      });

    const today = new Date();
    setPreviewDate({
      english: formatEnglishDate(today),
      bengaliGregorian: formatBengaliGregorianDate(today),
      bengaliCalendar: formatBengaliDate(today),
    });

    return () => {
      active = false;
    };
  }, []);

  const toggleBengaliDate = async () => {
    setSavingDateSetting(true);
    setDateSettingError('');
    try {
      const settings = await fetchAdminDisplaySettings();
      const nextShowBengaliDate = !showBengaliDate;
      await updateAdminDisplaySettings({
        ...settings,
        showBengaliDate: nextShowBengaliDate,
      });
      setShowBengaliDate(nextShowBengaliDate);
    } catch (error) {
      setDateSettingError(error instanceof Error ? error.message : 'তারিখের সেটিং সংরক্ষণ করা যায়নি।');
    } finally {
      setSavingDateSetting(false);
    }
  };

  // Active Selected Item Object
  const activeItem = menuItems.find((m) => m.id === selectedItemId) || menuItems[0];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoImageUrl(URL.createObjectURL(file));
    }
  };

  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newUrl) return;

    const newItem: MenuItem = {
      id: `m-${Date.now()}`,
      label: newLabel,
      url: newUrl,
      isActive: true,
      isCustomLink: true,
    };

    setMenuItems([...menuItems, newItem]);
    setSelectedItemId(newItem.id);
    setNewLabel('');
    setNewUrl('');
  };

  // Update Field Value for Currently Selected Menu Item
  const updateActiveItem = (field: keyof MenuItem, value: any) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === selectedItemId ? { ...item, [field]: value } : item
      )
    );
  };

  const moveMenuItem = (index: number, direction: 'up' | 'down') => {
    const updated = [...menuItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;

    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setMenuItems(updated);
  };

  const toggleItemActive = (id: string) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    if (menuItems.length <= 1) {
      alert('You must have at least one menu item.');
      return;
    }
    const filtered = menuItems.filter((m) => m.id !== id);
    setMenuItems(filtered);
    setSelectedItemId(filtered[0].id);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <HeaderAppearanceSettings showBengaliDate={showBengaliDate} />

      {/* Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaHeading className="text-red-600" /> Header & Navigation Manager
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Edit header top bar, site branding logo, search bar, and primary navigation links.
          </p>
        </div>

        <button
          type="submit"
          form="header-appearance-form"
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition flex items-center gap-2"
        >
          <FaFloppyDisk /> Save Header Design
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Top Bar & Branding Config (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Top Utility Bar Controls */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <FaBullhorn className="text-red-600" /> Top Notice & Utility
              </h2>
              <button
                type="button"
                onClick={() => setShowTopBar(!showTopBar)}
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition ${
                  showTopBar ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {showTopBar ? 'BAR ON' : 'BAR OFF'}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notice Announcement Text</label>
                <input
                  type="text"
                  value={topNoticeText}
                  onChange={(e) => setTopNoticeText(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-800"
                />
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                  <FaRegCalendarDays className="text-gray-400" /> Date Display
                </span>
                <button
                  type="button"
                  onClick={() => void toggleBengaliDate()}
                  disabled={!dateSettingsLoaded || savingDateSetting}
                  className={`text-[10px] font-bold px-2 py-1 rounded transition ${
                    showBengaliDate ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                  } disabled:cursor-wait disabled:opacity-50`}
                >
                  {savingDateSetting ? 'সংরক্ষণ হচ্ছে…' : showBengaliDate ? 'বাংলা তারিখ' : 'English Date'}
                </button>
              </div>
              {dateSettingError && (
                <p role="alert" className="text-xs text-red-600">{dateSettingError}</p>
              )}
            </div>
          </div>

          {/* Logo Branding Controls */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b pb-2">
              Header Branding & Logo
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Logo Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLogoType('text')}
                    className={`p-2.5 rounded-lg border font-bold text-xs ${
                      logoType === 'text' ? 'border-red-600 bg-red-50 text-red-600' : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  >
                    Text Logo
                  </button>

                  <button
                    type="button"
                    onClick={() => setLogoType('image')}
                    className={`p-2.5 rounded-lg border font-bold text-xs ${
                      logoType === 'image' ? 'border-red-600 bg-red-50 text-red-600' : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  >
                    Graphic Image Logo
                  </button>
                </div>
              </div>

              {logoType === 'text' ? (
                <div className="space-y-2">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Brand Text</label>
                    <input
                      type="text"
                      value={logoText}
                      onChange={(e) => setLogoText(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-black text-xl text-red-600"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={logoTagline}
                      onChange={(e) => setLogoTagline(e.target.value)}
                      className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 font-bold"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Upload Brand Logo</label>
                  <input
                    type="file"
                    ref={logoFileRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <img src={logoImageUrl} alt="Logo" className="h-10 object-contain bg-white p-1 rounded border" />
                    <button
                      type="button"
                      onClick={() => logoFileRef.current?.click()}
                      className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-bold flex items-center gap-2"
                    >
                      <FaCloudArrowUp className="text-red-600" /> Upload File
                    </button>
                  </div>
                </div>
              )}

              {/* Utility Toggles */}
              <div className="border-t pt-3 space-y-2">
                <label className="block font-semibold text-gray-700">Header Controls</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSearchBar(!showSearchBar)}
                    className={`p-2 rounded-lg border font-bold flex items-center justify-center gap-1.5 ${
                      showSearchBar ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <FaMagnifyingGlass size={11} /> Search Input
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowEpaperButton(!showEpaperButton)}
                    className={`p-2 rounded-lg border font-bold ${
                      showEpaperButton ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    ই-পেপার বাটন
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* MIDDLE PANEL: Navigation Menu Item Selector & Stack (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Add Menu Link */}
          <form onSubmit={handleAddMenuItem} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b pb-2">
              Add New Navigation Link
            </h2>

            <div className="space-y-2 text-xs">
              <input
                type="text"
                placeholder="Menu Label (e.g. বিনোদন)"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg font-bold"
                required
              />

              <input
                type="text"
                placeholder="URL Path (e.g. /category/entertainment)"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-[11px]"
                required
              />

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs py-2 flex items-center justify-center gap-1"
              >
                <FaPlus /> Add Menu Item
              </button>
            </div>
          </form>

          {/* Menu Items Stack */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b pb-2 flex justify-between">
              <span>Menu Sequence ({menuItems.length})</span>
              <span className="text-[10px] text-gray-400 font-normal">Click item to edit</span>
            </h2>

            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                    selectedItemId === item.id
                      ? 'border-red-500 bg-red-50/20 shadow-sm ring-1 ring-red-500'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <FaGripVertical className="text-gray-300 shrink-0" size={12} />

                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-800 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="bg-red-600 text-white text-[8px] font-bold px-1 rounded">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 block truncate">{item.url}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => moveMenuItem(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-500 hover:text-black disabled:opacity-30"
                    >
                      <FaArrowUp size={10} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveMenuItem(index, 'down')}
                      disabled={index === menuItems.length - 1}
                      className="p-1 text-gray-500 hover:text-black disabled:opacity-30"
                    >
                      <FaArrowDown size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: Active Menu Item Edit Form & Live Preview (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Active Item Edit Form */}
          {activeItem && (
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FaPenToSquare className="text-red-600" /> Edit Menu Item
                </h2>

                <button
                  type="button"
                  onClick={() => handleDeleteItem(activeItem.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition"
                  title="Delete Menu Link"
                >
                  <FaTrash size={12} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {/* Edit Label */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Menu Label Title</label>
                  <input
                    type="text"
                    value={activeItem.label}
                    onChange={(e) => updateActiveItem('label', e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                {/* Edit Target URL */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <FaLink className="text-gray-400" /> Target URL Path
                  </label>
                  <input
                    type="text"
                    value={activeItem.url}
                    onChange={(e) => updateActiveItem('url', e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-mono text-[11px]"
                  />
                </div>

                {/* Edit Optional Badge */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <FaTag className="text-gray-400" /> Highlight Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={activeItem.badge || ''}
                    onChange={(e) => updateActiveItem('badge', e.target.value)}
                    placeholder="e.g. HOT, LIVE, NEW"
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg font-bold text-red-600 uppercase"
                  />
                </div>

                {/* Toggle Active */}
                <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-200 pt-2">
                  <span className="font-semibold text-gray-700">Display Status</span>
                  <button
                    type="button"
                    onClick={() => toggleItemActive(activeItem.id)}
                    className={`text-[10px] font-bold px-3 py-1 rounded-full transition ${
                      activeItem.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {activeItem.isActive ? 'ACTIVE' : 'DISABLED'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Live Header Replica Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden space-y-0 sticky top-6">
            <span className="bg-gray-800 text-white text-[10px] font-bold px-3 py-1.5 block uppercase tracking-wider">
              Live Navigation Header Preview
            </span>

            {/* Top Bar Replica */}
            {showTopBar && (
              <div className="bg-gray-100 border-b border-gray-200 px-3 py-1.5 flex justify-between items-center text-[10px] text-gray-600">
                <span className="truncate max-w-[200px]">{topNoticeText}</span>
                <span className="shrink-0 text-right">
                  {showBengaliDate ? previewDate.bengaliGregorian : previewDate.english}
                  <br />
                  {previewDate.bengaliCalendar}
                </span>
              </div>
            )}

            {/* Main Header Bar */}
            <div className="p-3 flex justify-between items-center border-b border-gray-200">
              <div className="flex items-center gap-2">
                {logoType === 'text' ? (
                  <div>
                    <span className="text-xl font-black text-red-600 leading-none block">{logoText}</span>
                    <span className="text-[8px] font-bold text-gray-500 block">{logoTagline}</span>
                  </div>
                ) : (
                  <img src={logoImageUrl} alt="Logo" className="h-7 object-contain" />
                )}
              </div>

              <div className="flex items-center gap-2">
                {showEpaperButton && (
                  <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                    ই-পেপার
                  </span>
                )}
                {showSearchBar && (
                  <div className="p-1 text-gray-500 bg-gray-100 rounded-full">
                    <FaMagnifyingGlass size={10} />
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Strip Preview */}
            <div className="bg-gray-900 text-white px-3 py-2 flex gap-3 text-xs font-bold overflow-x-auto">
              {menuItems.filter((m) => m.isActive).map((item) => (
                <span key={item.id} className="hover:text-red-400 cursor-pointer whitespace-nowrap flex items-center gap-1">
                  {item.label}
                  {item.badge && (
                    <span className="bg-red-600 text-white text-[7px] font-bold px-1 rounded">
                      {item.badge}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
