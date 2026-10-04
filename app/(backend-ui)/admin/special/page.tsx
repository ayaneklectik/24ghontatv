'use client';

import { useState, useRef, useEffect } from 'react';
import { resolveMediaUrl, retryAlternateMediaHost } from '@/lib/urls';
import { 
  FaStar, FaPowerOff, FaFloppyDisk, FaImage, 
  FaEye, FaEyeSlash, FaRegEye, FaTableColumns, 
  FaGrip, FaList, FaCloudArrowUp, FaTrash, FaLink,
  FaSliders, FaNewspaper, FaBoxesPacking
} from 'react-icons/fa6';

interface TaggedSpecialPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  image: string;
  role: 'main_lead' | 'sub_lead' | 'queued';
  slotOrder: number;
}

type LayoutType = 
  | 'classic_split' 
  | 'hero_top' 
  | 'grid_4' 
  | 'magazine_stack' 
  | 'featured_slider' 
  | 'editorial_column';

function normalizeNewsImage(item: any): string {
  const image = item?.featuredImg ?? item?.imageUrl ?? item?.image_url ?? item?.image;
  const raw = image ? String(image).trim() : '';
  const path = raw && !raw.includes('/') && !/^(https?:|data:|blob:)/i.test(raw)
    ? `images/news_img/${raw}`
    : raw;
  return resolveMediaUrl(path);
}

function SpecialImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(event) => retryAlternateMediaHost(event.currentTarget)}
    />
  );
}

export default function SpecialSectionControlPage() {
  const [isSectionActive, setIsSectionActive] = useState(true);
  const [sectionTitle, setSectionTitle] = useState('বিশেষ আয়োজন / বিশ্বকাপ ২০২৬');
  
  // Banner & Scoreboard States
  const [showBanner, setShowBanner] = useState(true);
  const [showScoreWidget, setShowScoreWidget] = useState(true);
  const [bannerImage, setBannerImage] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerTargetLink, setBannerTargetLink] = useState('/topics/world-cup-2026');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [layoutStyle, setLayoutStyle] = useState<LayoutType>('classic_split');
  const [posts, setPosts] = useState<TaggedSpecialPost[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch live articles and saved configuration on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [newsRes, configRes] = await Promise.all([
          fetch('/api/news'),
          fetch('/api/settings/special-section')
        ]);

        const newsData = await newsRes.json();
        const configData = await configRes.json();

        const settings = configData?.data?.special_section ?? configData?.special_section ?? configData?.data ?? configData;

        // Apply config states
        if (settings && typeof settings === 'object') {
          setIsSectionActive(settings.isSectionActive ?? true);
          setSectionTitle(settings.sectionTitle || 'বিশেষ আয়োজন / বিশ্বকাপ ২০২৬');
          setLayoutStyle(settings.layoutStyle || 'classic_split');
          setShowBanner(settings.showBanner ?? true);
          setBannerImage(settings.bannerImage ? resolveMediaUrl(settings.bannerImage) : '');
          setBannerTargetLink(settings.bannerTargetLink || '');
          setShowScoreWidget(settings.showScoreWidget ?? true);
        }

        const rolesMap = settings?.postRoles || {};

        if (Array.isArray(newsData)) {
          const mappedPosts: TaggedSpecialPost[] = newsData.map((item: any, idx: number) => ({
            id: item.id,
            title: item.title,
            excerpt: item.excerpt || '',
            category: item.category?.name || 'বিশেষ',
            publishedAt: new Date(item.createdAt).toLocaleTimeString('bn-BD'),
            image: normalizeNewsImage(item),
            role: rolesMap[item.id] || (idx === 0 ? 'main_lead' : idx < 4 ? 'sub_lead' : 'queued'),
            slotOrder: idx + 1,
          }));
          setPosts(mappedPosts);
        }
      } catch (err) {
        console.error('Failed to load control page data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBannerImage(URL.createObjectURL(file));
    }
  };

  const assignRole = (id: string, newRole: 'main_lead' | 'sub_lead' | 'queued') => {
    setPosts(
      posts.map((post) => {
        if (post.id === id) {
          return { ...post, role: newRole };
        }
        if (newRole === 'main_lead' && post.role === 'main_lead') {
          return { ...post, role: 'sub_lead' };
        }
        return post;
      })
    );
  };

  const mainLeadPost = posts.find((p) => p.role === 'main_lead');
  const subLeadPosts = posts.filter((p) => p.role === 'sub_lead');

  // 2. Save settings to DB endpoint
  const handleSaveLayout = async () => {
    const postRoles: Record<string, string> = {};
    posts.forEach((p) => {
      postRoles[p.id] = p.role;
    });

    const payload = {
      isSectionActive,
      sectionTitle,
      layoutStyle,
      showBanner,
      bannerImage,
      bannerTargetLink,
      showScoreWidget,
      postRoles,
    };

    try {
      const form = new FormData();
      form.append('isSectionActive', isSectionActive ? '1' : '0');
      form.append('sectionTitle', sectionTitle);
      form.append('layoutStyle', layoutStyle);
      form.append('showBanner', showBanner ? '1' : '0');
      form.append('bannerImage', bannerImage);
      form.append('bannerTargetLink', bannerTargetLink);
      form.append('showScoreWidget', showScoreWidget ? '1' : '0');
      form.append('postRoles', JSON.stringify(postRoles));
      if (bannerFile) form.append('bannerFile', bannerFile);

      const res = await fetch('/api/settings/special-section', {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        alert('বিশেষ সেকশনের কাস্টম লেআউট সফলভাবে সংরক্ষিত হয়েছে!');
      } else {
        alert('সংরক্ষণ করতে সমস্যা হয়েছে।');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving layout configuration');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-bold">লোড হচ্ছে...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-kalpurush">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaStar className="text-red-600" /> বিশেষ সংবাদ কাস্টমাইজেশন (Multi-Layout Engine)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            টপ ব্যানার, ৬টি ভিন্ন লেআউট টেমপ্লেট এবং বিশেষ সংবাদের পজিশনিং কন্ট্রোল করুন।
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
            onClick={handleSaveLayout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow transition flex items-center gap-2"
          >
            <FaFloppyDisk /> Save Layout Config
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Layout Library & Controls (6 Columns) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* 1. Extended Layout Preset Picker */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center justify-between">
              <span>১. লেআউট টেমপ্লেট লাইব্রেরি (Choose Layout)</span>
              <span className="text-[10px] text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-semibold">
                6 Presets
              </span>
            </h2>

            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setLayoutStyle('classic_split')}
                className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  layoutStyle === 'classic_split'
                    ? 'border-red-600 bg-red-50/60 text-red-600 font-bold shadow-sm'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                <FaTableColumns size={18} />
                <span className="text-[10px]">ক্লাসিক স্প্লিট (1+3)</span>
              </button>

              <button
                type="button"
                onClick={() => setLayoutStyle('hero_top')}
                className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  layoutStyle === 'hero_top'
                    ? 'border-red-600 bg-red-50/60 text-red-600 font-bold shadow-sm'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                <FaList size={18} />
                <span className="text-[10px]">হিরো টপ (Hero Stack)</span>
              </button>

              <button
                type="button"
                onClick={() => setLayoutStyle('grid_4')}
                className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  layoutStyle === 'grid_4'
                    ? 'border-red-600 bg-red-50/60 text-red-600 font-bold shadow-sm'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                <FaGrip size={18} />
                <span className="text-[10px]">৪-কার্ড গ্রিড (Equal)</span>
              </button>

              <button
                type="button"
                onClick={() => setLayoutStyle('magazine_stack')}
                className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  layoutStyle === 'magazine_stack'
                    ? 'border-red-600 bg-red-50/60 text-red-600 font-bold shadow-sm'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                <FaBoxesPacking size={18} />
                <span className="text-[10px]">ম্যাগাজিন ফিড (Horizontal)</span>
              </button>

              <button
                type="button"
                onClick={() => setLayoutStyle('featured_slider')}
                className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  layoutStyle === 'featured_slider'
                    ? 'border-red-600 bg-red-50/60 text-red-600 font-bold shadow-sm'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                <FaSliders size={18} />
                <span className="text-[10px]">ফিচার্ড স্লাইডার (Carousel)</span>
              </button>

              <button
                type="button"
                onClick={() => setLayoutStyle('editorial_column')}
                className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  layoutStyle === 'editorial_column'
                    ? 'border-red-600 bg-red-50/60 text-red-600 font-bold shadow-sm'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                <FaNewspaper size={18} />
                <span className="text-[10px]">৩-কলাম কলামিস্ট (Editorial)</span>
              </button>
            </div>
          </div>

          {/* 2. Top Banner & Scoreboard Control */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <FaImage className="text-red-600" /> ২. টপ ব্যানার ও স্কোরবোর্ড ম্যানেজমেন্ট
              </h2>
            </div>

            {/* Scoreboard Toggle */}
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-gray-800 block">লাইভ স্কোরবোর্ড উইজেট</span>
                <span className="text-[10px] text-gray-500 block">বিশ্বকাপ বা খেলার সেকশনের জন্য স্কোর বোর্ড প্রদর্শন করুন</span>
              </div>
              <button
                type="button"
                onClick={() => setShowScoreWidget(!showScoreWidget)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  showScoreWidget ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-700'
                }`}
              >
                {showScoreWidget ? 'স্কোরবোর্ড Visible (ON)' : 'স্কোরবোর্ড Hidden (OFF)'}
              </button>
            </div>

            {/* Banner Toggle */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs font-bold text-gray-700">টপ ব্যানার ইমেজ</span>
              <button
                type="button"
                onClick={() => setShowBanner(!showBanner)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  showBanner ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {showBanner ? 'ব্যানার Visible' : 'ব্যানার Hidden'}
              </button>
            </div>

            {showBanner && (
              <div className="space-y-3 text-xs">
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleBannerFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 bg-gray-50 flex items-center gap-4">
                    {bannerImage ? (
                      <div className="relative w-28 h-16 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                        <SpecialImage src={bannerImage} alt="Banner preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setBannerImage('')}
                          className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-red-600 transition"
                        >
                          <FaTrash size={9} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-28 h-16 rounded-lg border bg-white flex items-center justify-center text-gray-400 shrink-0">
                        <FaImage size={18} />
                      </div>
                    )}

                    <div className="flex-1 space-y-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition"
                      >
                        <FaCloudArrowUp className="text-red-600" /> নতুন ইমেজ আপলোড করুন
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <FaLink className="text-gray-400" /> ব্যানার টার্গেট লিংক
                  </label>
                  <input
                    type="text"
                    value={bannerTargetLink}
                    onChange={(e) => setBannerTargetLink(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-[11px]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. Section Branding & Role Queue */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm p-4 space-y-3">
            <div className="border-b border-gray-100 pb-2">
              <label className="block font-bold text-xs text-gray-700 mb-1">সেকশন হেডার টাইটেল</label>
              <input
                type="text"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-800 text-xs"
              />
            </div>

            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-gray-700 uppercase block">বিশেষ সংবাদ রোল নির্বাচন</span>
              {posts.map((post) => (
                <div
                  key={post.id}
                  className={`p-2.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                    post.role === 'main_lead' ? 'bg-amber-50/40 border-amber-300' : 'bg-white border-gray-200'
                  }`}
                >
                  <SpecialImage src={post.image} alt={post.title} className="w-10 h-8 object-cover rounded border shrink-0" />
                  <h3 className="font-bold text-xs text-gray-800 line-clamp-1 flex-1">{post.title}</h3>
                  <select
                    value={post.role}
                    onChange={(e) => assignRole(post.id, e.target.value as any)}
                    className="text-[10px] font-bold p-1 rounded-lg border bg-gray-50"
                  >
                    <option value="main_lead">Main Lead</option>
                    <option value="sub_lead">Sub Lead</option>
                    <option value="queued">Queue</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: Live Selected Layout Preview (6 Columns) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 sticky top-6">
            
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FaRegEye className="text-red-600" /> Live Layout Preview
              </h2>
              <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full uppercase">
                {layoutStyle}
              </span>
            </div>

            {isSectionActive ? (
              <div className="border border-gray-200 p-4 rounded-lg space-y-4 bg-white shadow-inner">
                
                {/* Header Title */}
                <div className="flex items-center gap-1 font-extrabold text-base text-gray-900 border-b border-gray-100 pb-2">
                  <span>{sectionTitle}</span>
                  <span className="text-red-600">&gt;</span>
                </div>

                {/* Banner */}
                {showBanner && bannerImage && (
                  <a href={bannerTargetLink} target="_blank" rel="noreferrer" className="block rounded-lg overflow-hidden border border-gray-200 h-24 relative">
                    <SpecialImage src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
                  </a>
                )}

                {/* Scoreboard Preview */}
                {showScoreWidget && (
                  <div className="p-2 bg-neutral-100 rounded border border-neutral-200 text-xs font-bold text-neutral-600 text-center">
                    ⚽ SCOREBOARD WIDGET (ARG 2 - 1 BRA)
                  </div>
                )}

                {/* Layout Previews */}
                {layoutStyle === 'classic_split' && (
                  <div className="grid grid-cols-12 gap-3 pt-1">
                    {mainLeadPost && (
                      <div className="col-span-7 space-y-2">
                        <SpecialImage src={mainLeadPost.image} alt={mainLeadPost.title} className="w-full h-32 object-cover rounded border" />
                        <h3 className="font-bold text-xs text-gray-900 leading-snug">{mainLeadPost.title}</h3>
                      </div>
                    )}
                    <div className="col-span-5 space-y-2 divide-y divide-gray-100">
                      {subLeadPosts.slice(0, 3).map((art) => (
                        <div key={art.id} className="pt-2 first:pt-0 flex gap-2 items-start">
                          <SpecialImage src={art.image} alt={art.title} className="w-12 h-9 object-cover rounded shrink-0 border" />
                          <h4 className="font-bold text-[10px] text-gray-800 line-clamp-2 leading-tight">{art.title}</h4>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {layoutStyle === 'hero_top' && (
                  <div className="space-y-3 pt-1">
                    {mainLeadPost && (
                      <div className="relative rounded-lg overflow-hidden border">
                        <SpecialImage src={mainLeadPost.image} alt={mainLeadPost.title} className="w-full h-36 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent p-3 flex flex-col justify-end">
                          <h3 className="text-white font-bold text-xs leading-snug line-clamp-2">{mainLeadPost.title}</h3>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-2">
                      {subLeadPosts.slice(0, 3).map((art) => (
                        <div key={art.id} className="space-y-1">
                          <SpecialImage src={art.image} alt={art.title} className="w-full h-14 object-cover rounded border" />
                          <h4 className="font-bold text-[10px] text-gray-800 line-clamp-2 leading-tight">{art.title}</h4>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {layoutStyle === 'grid_4' && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {[mainLeadPost, ...subLeadPosts].filter(Boolean).slice(0, 4).map((art) => (
                      <div key={art?.id} className="bg-gray-50 p-2 rounded-lg border space-y-1.5">
                        <SpecialImage src={art?.image ?? ''} alt={art?.title ?? ''} className="w-full h-20 object-cover rounded" />
                        <h4 className="font-bold text-[11px] text-gray-800 line-clamp-2 leading-tight">{art?.title}</h4>
                      </div>
                    ))}
                  </div>
                )}

                {layoutStyle === 'magazine_stack' && (
                  <div className="space-y-2 pt-1">
                    {[mainLeadPost, ...subLeadPosts].filter(Boolean).slice(0, 4).map((art) => (
                      <div key={art?.id} className="flex gap-3 bg-gray-50 p-2 rounded-lg border items-center">
                        <SpecialImage src={art?.image ?? ''} alt={art?.title ?? ''} className="w-16 h-12 object-cover rounded shrink-0" />
                        <h4 className="font-bold text-xs text-gray-800 line-clamp-2 leading-snug">{art?.title}</h4>
                      </div>
                    ))}
                  </div>
                )}

                {layoutStyle === 'featured_slider' && (
                  <div className="space-y-2 pt-1">
                    {mainLeadPost && (
                      <div className="relative rounded-xl overflow-hidden border">
                        <SpecialImage src={mainLeadPost.image} alt={mainLeadPost.title} className="w-full h-40 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent p-3 flex flex-col justify-end">
                          <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded w-max mb-1">
                            SLIDE 1/4
                          </span>
                          <h3 className="text-white font-bold text-xs line-clamp-2">{mainLeadPost.title}</h3>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {layoutStyle === 'editorial_column' && (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[mainLeadPost, ...subLeadPosts].filter(Boolean).slice(0, 3).map((art) => (
                      <div key={art?.id} className="border-r border-gray-200 last:border-r-0 pr-2 space-y-1.5">
                        <SpecialImage src={art?.image ?? ''} alt={art?.title ?? ''} className="w-full h-16 object-cover rounded" />
                        <h4 className="font-bold text-[10px] text-gray-900 line-clamp-3 leading-snug">{art?.title}</h4>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center text-xs font-semibold text-gray-400 border border-dashed border-gray-300">
                বিশেষ সেকশনটি বর্তমানে অ্যাডমিন থেকে সম্পূর্ণ বন্ধ (Disabled) রাখা হয়েছে।
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}