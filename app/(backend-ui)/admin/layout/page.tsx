'use client';

import { useState } from 'react';
import { 
  FaTableCells, FaPlus, FaTrash, FaFloppyDisk, 
  FaArrowUp, FaArrowDown, FaPowerOff, FaRegEye,
  FaGripVertical, FaPenToSquare, FaFilter, FaCheck,
  FaSliders
} from 'react-icons/fa6';

// Available layout grid variant options mapped from actual site components
const LAYOUT_VARIANTS = [
  { id: 'SpecialFeatureGrid', name: 'Special Feature (Highlight Strip)' },
  { id: 'LeadNewsGrid', name: 'Lead News (Headline Hero Panel)' },
  { id: 'ThreeColumnGrid', name: 'Three-Column Editorial Feed' },
  { id: 'NationalSectionGrid', name: 'National Split Grid System' },
  { id: 'VideoSectionSlider', name: 'Video Section Slider Box' },
  { id: 'WorldSectionGrid', name: 'World Section Matrix' },
  { id: 'BusinessSectionGrid', name: 'Symmetrical Business Grid' },
  { id: 'EntertainmentSectionGrid', name: 'Asymmetric Entertainment Grid' },
  { id: 'LifestyleSectionGrid', name: 'Lifestyle Hybrid Module' },
  { id: 'OpinionEditorialGrid', name: 'Split Opinion & Editorial Columns' },
  { id: 'SportsSectionGrid', name: 'Reversed Asymmetric Sports Module' },
  { id: 'AgricultureSectionGrid', name: 'Symmetrical Agriculture Grid' },
  { id: 'EducationSectionGrid', name: 'Asymmetric Education Grid' },
  { id: 'PhotoGallerySectionGrid', name: 'Photo Gallery Showcase' },
];

interface CategoryOption {
  id: string;
  bnName: string;
  isFeaturedOnHome: boolean;
}

interface HomepageBlock {
  id: string;
  categoryId: string;
  categoryName: string;
  customTitle: string;
  layoutVariant: string; // Component Grid Variant ID
  itemLimit: number;
  isActive: boolean;
}

const defaultCategories: CategoryOption[] = [
  { id: 'cat-special', bnName: 'স্পেশাল ফিচার', isFeaturedOnHome: true },
  { id: 'cat-lead', bnName: 'প্রধান খবর', isFeaturedOnHome: true },
  { id: 'cat-national', bnName: 'জাতীয়', isFeaturedOnHome: true },
  { id: 'cat-video', bnName: 'ভিডিও', isFeaturedOnHome: true },
  { id: 'cat-world', bnName: 'আন্তর্জাতিক', isFeaturedOnHome: true },
  { id: 'cat-business', bnName: 'অর্থনীতি', isFeaturedOnHome: true },
  { id: 'cat-entertainment', bnName: 'বিনোদন', isFeaturedOnHome: true },
  { id: 'cat-lifestyle', bnName: 'জীবনযাপন', isFeaturedOnHome: true },
  { id: 'cat-opinion', bnName: 'মতামত ও সম্পাদকীয়', isFeaturedOnHome: true },
  { id: 'cat-sports', bnName: 'খেলাধুলা', isFeaturedOnHome: true },
  { id: 'cat-agriculture', bnName: 'কৃষি', isFeaturedOnHome: true },
  { id: 'cat-education', bnName: 'শিক্ষা', isFeaturedOnHome: true },
  { id: 'cat-gallery', bnName: 'ফটোগ্যালারি', isFeaturedOnHome: true },
];

// Existing default homepage section stack loaded directly from page.tsx
const initialHomepageBlocks: HomepageBlock[] = [
  { id: 'blk-1', categoryId: 'cat-special', categoryName: 'স্পেশাল ফিচার', customTitle: 'বিশেষ সংবাদ', layoutVariant: 'SpecialFeatureGrid', itemLimit: 4, isActive: true },
  { id: 'blk-2', categoryId: 'cat-lead', categoryName: 'প্রধান খবর', customTitle: 'আজকের সেরা খবর', layoutVariant: 'LeadNewsGrid', itemLimit: 5, isActive: true },
  { id: 'blk-3', categoryId: 'cat-lead', categoryName: 'প্রধান খবর', customTitle: 'সম্পাদকীয় বাছাই', layoutVariant: 'ThreeColumnGrid', itemLimit: 6, isActive: true },
  { id: 'blk-4', categoryId: 'cat-national', categoryName: 'জাতীয়', customTitle: 'জাতীয় খবর', layoutVariant: 'NationalSectionGrid', itemLimit: 6, isActive: true },
  { id: 'blk-5', categoryId: 'cat-video', categoryName: 'ভিডিও', customTitle: 'ভিডিও গ্যালারি', layoutVariant: 'VideoSectionSlider', itemLimit: 8, isActive: true },
  { id: 'blk-6', categoryId: 'cat-world', categoryName: 'আন্তর্জাতিক', customTitle: 'বিশ্ব সংবাদ', layoutVariant: 'WorldSectionGrid', itemLimit: 6, isActive: true },
  { id: 'blk-7', categoryId: 'cat-business', categoryName: 'অর্থনীতি', customTitle: 'অর্থনীতি ও ব্যবসা', layoutVariant: 'BusinessSectionGrid', itemLimit: 4, isActive: true },
  { id: 'blk-8', categoryId: 'cat-entertainment', categoryName: 'বিনোদন', customTitle: 'বিনোদন জগত', layoutVariant: 'EntertainmentSectionGrid', itemLimit: 5, isActive: true },
  { id: 'blk-9', categoryId: 'cat-lifestyle', categoryName: 'জীবনযাপন', customTitle: 'লাইফস্টাইল', layoutVariant: 'LifestyleSectionGrid', itemLimit: 6, isActive: true },
  { id: 'blk-10', categoryId: 'cat-opinion', categoryName: 'মতামত ও সম্পাদকীয়', customTitle: 'মতামত ও কলাম', layoutVariant: 'OpinionEditorialGrid', itemLimit: 4, isActive: true },
  { id: 'blk-11', categoryId: 'cat-sports', categoryName: 'খেলাধুলা', customTitle: 'খেলাধুলার খবর', layoutVariant: 'SportsSectionGrid', itemLimit: 5, isActive: true },
  { id: 'blk-12', categoryId: 'cat-agriculture', categoryName: 'কৃষি', customTitle: 'কৃষি ও পরিবেশ', layoutVariant: 'AgricultureSectionGrid', itemLimit: 4, isActive: true },
  { id: 'blk-13', categoryId: 'cat-education', categoryName: 'শিক্ষা', customTitle: 'শিক্ষা ও ক্যাম্পাস', layoutVariant: 'EducationSectionGrid', itemLimit: 5, isActive: true },
  { id: 'blk-14', categoryId: 'cat-gallery', categoryName: 'ফটোগ্যালারি', customTitle: 'ছবিতে সংবাদ', layoutVariant: 'PhotoGallerySectionGrid', itemLimit: 8, isActive: true },
];

export default function PageLayoutBuilder() {
  const [categories, setCategories] = useState<CategoryOption[]>(defaultCategories);
  const [blocks, setBlocks] = useState<HomepageBlock[]>(initialHomepageBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string>(initialHomepageBlocks[0].id);

  const activeBlock = blocks.find((b) => b.id === selectedBlockId) || blocks[0];

  // Toggle category appearance on home
  const toggleHomeCategory = (category: CategoryOption) => {
    const updatedStatus = !category.isFeaturedOnHome;
    setCategories(categories.map((c) => (c.id === category.id ? { ...c, isFeaturedOnHome: updatedStatus } : c)));

    if (updatedStatus) {
      // Add default block if category gets activated
      const newBlock: HomepageBlock = {
        id: `blk-${Date.now()}`,
        categoryId: category.id,
        categoryName: category.bnName,
        customTitle: category.bnName,
        layoutVariant: 'FourColumnGrid',
        itemLimit: 4,
        isActive: true,
      };
      setBlocks([...blocks, newBlock]);
      setSelectedBlockId(newBlock.id);
    } else {
      // Remove block if category gets unchecked
      const filtered = blocks.filter((b) => b.categoryId !== category.id);
      setBlocks(filtered);
      if (filtered.length > 0) setSelectedBlockId(filtered[0].id);
    }
  };

  const updateActiveBlock = (field: keyof HomepageBlock, value: any) => {
    setBlocks(blocks.map((b) => (b.id === selectedBlockId ? { ...b, [field]: value } : b)));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;

    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(targetIndex, 0, moved);
    setBlocks(newBlocks);
  };

  const toggleBlockActive = (id: string) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b)));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaTableCells className="text-red-600" /> Homepage Layout Builder
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Reorder homepage sections, assign news categories, and choose component layout variants.
          </p>
        </div>

        <button
          onClick={() => alert('Homepage Section Layout Saved!')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition flex items-center gap-2"
        >
          <FaFloppyDisk /> Save Homepage Layout
        </button>
      </div>

      {/* Category Toggle Bar */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
            <FaFilter className="text-red-600" /> Select Categories to Display on Homepage
          </h2>
          <span className="text-[10px] text-gray-500 font-bold">
            {categories.filter((c) => c.isFeaturedOnHome).length} of {categories.length} Selected
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => toggleHomeCategory(cat)}
              className={`p-2 rounded-xl border text-xs font-bold transition flex items-center justify-between gap-1 ${
                cat.isFeaturedOnHome
                  ? 'bg-red-50 border-red-500 text-red-700 shadow-sm'
                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <span className="truncate">{cat.bnName}</span>
              {cat.isFeaturedOnHome && (
                <span className="bg-red-600 text-white p-0.5 rounded-full text-[8px] shrink-0">
                  <FaCheck />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Section Sequence (5 Columns) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex justify-between items-center">
              <span>Homepage Section Stack ({blocks.length})</span>
              <span className="text-[10px] text-gray-400 font-normal">Reorder or edit</span>
            </h2>

            <div className="space-y-2">
              {blocks.map((blk, index) => (
                <div
                  key={blk.id}
                  onClick={() => setSelectedBlockId(blk.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                    selectedBlockId === blk.id
                      ? 'border-red-500 bg-red-50/20 shadow-sm ring-1 ring-red-500'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <FaGripVertical className="text-gray-300 shrink-0" size={13} />

                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="font-bold text-xs text-gray-800 truncate block">
                      {index + 1}. {blk.customTitle || blk.categoryName}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-bold">
                        {blk.categoryName}
                      </span>
                      <span>•</span>
                      <span className="text-red-600 font-mono text-[9px] font-semibold">{blk.layoutVariant}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => moveBlock(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 text-gray-500 hover:text-black disabled:opacity-30"
                    >
                      <FaArrowUp size={11} />
                    </button>
                    <button
                      onClick={() => moveBlock(index, 'down')}
                      disabled={index === blocks.length - 1}
                      className="p-1.5 text-gray-500 hover:text-black disabled:opacity-30"
                    >
                      <FaArrowDown size={11} />
                    </button>
                    <button
                      onClick={() => toggleBlockActive(blk.id)}
                      className={`p-1.5 rounded-lg text-[10px] font-bold transition ${
                        blk.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <FaPowerOff size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE PANEL: Active Block Component Variant Selector (4 Columns) */}
        {activeBlock && (
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <FaPenToSquare className="text-red-600" /> Section Settings
                </h2>
                <p className="text-[11px] text-gray-500 mt-0.5">{activeBlock.customTitle}</p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Title */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Frontend Headline</label>
                  <input
                    type="text"
                    value={activeBlock.customTitle}
                    onChange={(e) => updateActiveBlock('customTitle', e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-800"
                  />
                </div>

                {/* Layout Grid Variant Dropdown */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <FaSliders className="text-red-600" /> Layout Grid Variant Component
                  </label>
                  <select
                    value={activeBlock.layoutVariant}
                    onChange={(e) => updateActiveBlock('layoutVariant', e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    {LAYOUT_VARIANTS.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.name} (`&lt;{variant.id}/&gt;`)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Article Count */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Max Articles Limit</label>
                  <input
                    type="number"
                    min={2}
                    max={15}
                    value={activeBlock.itemLimit}
                    onChange={(e) => updateActiveBlock('itemLimit', parseInt(e.target.value) || 4)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT PANEL: Live Wireframe Layout Stack (3 Columns) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3 sticky top-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <FaRegEye className="text-red-600" /> Live Component Map
              </h2>
            </div>

            <div className="space-y-2">
              {blocks.map((blk, idx) => (
                <div
                  key={blk.id}
                  className={`p-2 rounded-lg border text-[11px] space-y-1 transition ${
                    blk.isActive ? 'bg-white border-gray-300 shadow-sm' : 'bg-gray-50 border-dashed opacity-50'
                  }`}
                >
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>{idx + 1}. {blk.customTitle}</span>
                  </div>
                  <div className="text-[9px] font-mono text-red-600 font-semibold bg-red-50 px-1.5 py-0.5 rounded border border-red-200 inline-block">
                    &lt;{blk.layoutVariant} /&gt;
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