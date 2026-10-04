'use client';

import { useState, useRef } from 'react';
import { 
  FaImages, FaPlus, FaTrash, FaFloppyDisk, 
  FaRegEye, FaCloudArrowUp, FaCheck, FaPenToSquare, 
  FaSquareCheck, FaSquare, FaMagnifyingGlass, FaFilter
} from 'react-icons/fa6';

interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  category: string;
  photographer: string;
  uploadedAt: string;
  isPublished: boolean;
}

const initialPhotos: GalleryPhoto[] = [
  {
    id: 'photo-1',
    url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    title: 'জাতীয় স্মৃতিসৌধে বিজয় দিবসের বিশেষ শ্রদ্ধা নিবেদন',
    category: 'জাতীয়',
    photographer: 'আসিফ মাহমুদ',
    uploadedAt: '০৫ আগস্ট ২০২৬',
    isPublished: true,
  },
  {
    id: 'photo-2',
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    title: 'একুশে বইমেলায় পাঠকদের উপচে পড়া ভিড়',
    category: 'সংস্কৃতি',
    photographer: 'শাহাদাত হোসেন',
    uploadedAt: '০৪ আগস্ট ২০২৬',
    isPublished: true,
  },
  {
    id: 'photo-3',
    url: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80',
    title: 'আন্তর্জাতিক বাণিজ্য মেলায় নতুন পণ্যের প্রদর্শনী',
    category: 'অর্থনীতি',
    photographer: 'রহিম উল্লাহ',
    uploadedAt: '০৩ আগস্ট ২০২৬',
    isPublished: true,
  },
  {
    id: 'photo-4',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    title: 'সুন্দরবনের প্রাকৃতিক সৌন্দর্য ও বন্যপ্রাণী সংরক্ষণ',
    category: 'পরিবেশ',
    photographer: 'নিজস্ব আলোকচিত্রী',
    uploadedAt: '০২ আগস্ট ২০২৬',
    isPublished: false,
  },
];

export default function GalleryManagerPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(initialPhotos);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [activeEditPhotoId, setActiveEditPhotoId] = useState<string | null>(initialPhotos[0].id);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // New Image Upload Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('জাতীয়');
  const [newPhotographer, setNewPhotographer] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activePhoto = photos.find((p) => p.id === activeEditPhotoId);

  // Handle Upload Image
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!newTitle) {
      alert('অনুগ্রহ করে ছবির একটি শিরোনাম (Title) দিন।');
      return;
    }

    const newPhotoItem: GalleryPhoto = {
      id: `photo-${Date.now()}`,
      url: URL.createObjectURL(file),
      title: newTitle,
      category: newCategory,
      photographer: newPhotographer || 'নিজস্ব আলোকচিত্রী',
      uploadedAt: '০৫ আগস্ট ২০২৬',
      isPublished: true,
    };

    setPhotos([newPhotoItem, ...photos]);
    setActiveEditPhotoId(newPhotoItem.id);

    // Reset Form
    setNewTitle('');
    setNewPhotographer('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Toggle Single Selection for Bulk Action
  const toggleSelectPhoto = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedPhotoIds.includes(id)) {
      setSelectedPhotoIds(selectedPhotoIds.filter((item) => item !== id));
    } else {
      setSelectedPhotoIds([...selectedPhotoIds, id]);
    }
  };

  // Select / Deselect All Photos
  const toggleSelectAll = () => {
    if (selectedPhotoIds.length === filteredPhotos.length) {
      setSelectedPhotoIds([]);
    } else {
      setSelectedPhotoIds(filteredPhotos.map((p) => p.id));
    }
  };

  // Delete Single Photo
  const handleDeletePhoto = (id: string) => {
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated);
    setSelectedPhotoIds(selectedPhotoIds.filter((item) => item !== id));
    if (activeEditPhotoId === id) {
      setActiveEditPhotoId(updated.length > 0 ? updated[0].id : null);
    }
  };

  // Bulk Remove Selected Photos
  const handleBulkRemove = () => {
    if (selectedPhotoIds.length === 0) return;
    if (!confirm(`Are you sure you want to remove ${selectedPhotoIds.length} selected photo(s)?`)) return;

    const updated = photos.filter((p) => !selectedPhotoIds.includes(p.id));
    setPhotos(updated);
    setSelectedPhotoIds([]);
    if (activeEditPhotoId && selectedPhotoIds.includes(activeEditPhotoId)) {
      setActiveEditPhotoId(updated.length > 0 ? updated[0].id : null);
    }
  };

  // Toggle Publish Status
  const togglePublishStatus = (id: string) => {
    setPhotos(
      photos.map((p) => (p.id === id ? { ...p, isPublished: !p.isPublished } : p))
    );
  };

  // Update Field Value for Active Photo
  const updateActivePhoto = (field: keyof GalleryPhoto, value: any) => {
    setPhotos(
      photos.map((p) => (p.id === activeEditPhotoId ? { ...p, [field]: value } : p))
    );
  };

  // Filtered Photos List
  const filteredPhotos = photos.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.photographer.includes(searchQuery);
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaImages className="text-red-600" /> Photo Gallery Media Manager
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Upload news images with Bengali titles, manage publication status, and perform bulk removals.
          </p>
        </div>

        <button
          onClick={() => alert('Photo Gallery Gallery State Saved!')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition flex items-center gap-2"
        >
          <FaFloppyDisk /> Save Gallery
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Upload Form (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
              <FaCloudArrowUp className="text-red-600" /> Upload New Photo
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Image Title (Bengali) *</label>
                <input
                  type="text"
                  placeholder="যেমন: বিজয় দিবসের প্যারেড"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-800"
                >
                  <option value="জাতীয়">জাতীয়</option>
                  <option value="রাজনীতি">রাজনীতি</option>
                  <option value="অর্থনীতি">অর্থনীতি</option>
                  <option value="সংস্কৃতি">সংস্কৃতি</option>
                  <option value="খেলাধুলা">খেলাধুলা</option>
                  <option value="আন্তর্জাতিক">আন্তর্জাতিক</option>
                  <option value="পরিবেশ">পরিবেশ</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Photographer Credit</label>
                <input
                  type="text"
                  placeholder="যেমন: আসিফ মাহমুদ / ২৪ঘণ্টা"
                  value={newPhotographer}
                  onChange={(e) => setNewPhotographer(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-700"
                />
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => {
                  if (!newTitle) {
                    alert('অনুগ্রহ করে প্রথমে ছবির শিরোনামটি টাইপ করুন!');
                    return;
                  }
                  fileInputRef.current?.click();
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs py-3 flex items-center justify-center gap-2 shadow transition"
              >
                <FaCloudArrowUp size={14} /> Choose Image & Publish
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE PANEL: All Uploaded Images Grid & Bulk Actions (8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Controls & Search Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex flex-wrap justify-between items-center gap-3">
              
              {/* Search Box */}
              <div className="relative flex-1 min-w-[200px]">
                <FaMagnifyingGlass className="absolute left-3 top-3 text-gray-400" size={12} />
                <input
                  type="text"
                  placeholder="Search uploaded images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold"
              >
                <option value="ALL">All Categories</option>
                <option value="জাতীয়">জাতীয়</option>
                <option value="রাজনীতি">রাজনীতি</option>
                <option value="অর্থনীতি">অর্থনীতি</option>
                <option value="সংস্কৃতি">সংস্কৃতি</option>
                <option value="খেলাধুলা">খেলাধুলা</option>
                <option value="পরিবেশ">পরিবেশ</option>
              </select>

              {/* Bulk Removal Button */}
              {selectedPhotoIds.length > 0 && (
                <button
                  onClick={handleBulkRemove}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 shrink-0"
                >
                  <FaTrash size={11} /> Bulk Delete ({selectedPhotoIds.length})
                </button>
              )}
            </div>

            {/* Select All Toggle Bar */}
            <div className="flex justify-between items-center pt-2 border-t text-xs text-gray-600">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 font-bold text-gray-700 hover:text-black"
              >
                {selectedPhotoIds.length === filteredPhotos.length && filteredPhotos.length > 0 ? (
                  <FaSquareCheck className="text-red-600" size={14} />
                ) : (
                  <FaSquare className="text-gray-300" size={14} />
                )}
                <span>Select All ({filteredPhotos.length} Images)</span>
              </button>

              <span className="text-[11px] text-gray-400 font-medium">
                {selectedPhotoIds.length} Selected
              </span>
            </div>
          </div>

          {/* Uploaded Images Media Grid */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            {filteredPhotos.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-xs">
                No uploaded photos found matching your filter criteria.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredPhotos.map((photo) => {
                  const isSelected = selectedPhotoIds.includes(photo.id);
                  const isActiveEdit = activeEditPhotoId === photo.id;

                  return (
                    <div
                      key={photo.id}
                      onClick={() => setActiveEditPhotoId(photo.id)}
                      className={`group relative rounded-xl overflow-hidden border cursor-pointer transition flex flex-col justify-between ${
                        isActiveEdit
                          ? 'border-red-500 ring-2 ring-red-500 bg-red-50/10'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      {/* Image Frame */}
                      <div className="relative aspect-video bg-gray-900 overflow-hidden">
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-full object-cover transition group-hover:scale-105"
                        />

                        {/* Checkbox Overlay for Selection */}
                        <button
                          type="button"
                          onClick={(e) => toggleSelectPhoto(photo.id, e)}
                          className="absolute top-2 left-2 z-10 p-1 bg-white/80 backdrop-blur rounded text-gray-800 hover:text-red-600"
                        >
                          {isSelected ? (
                            <FaSquareCheck className="text-red-600" size={15} />
                          ) : (
                            <FaSquare className="text-gray-400" size={15} />
                          )}
                        </button>

                        {/* Status Badge */}
                        <div className="absolute top-2 right-2">
                          <span
                            className={`text-[8px] font-bold px-1.5 py-0.5 rounded text-white ${
                              photo.isPublished ? 'bg-emerald-600' : 'bg-gray-500'
                            }`}
                          >
                            {photo.isPublished ? 'PUBLISHED' : 'DRAFT'}
                          </span>
                        </div>
                      </div>

                      {/* Info & Caption */}
                      <div className="p-2 space-y-1">
                        <h3 className="font-bold text-[11px] text-gray-800 leading-tight line-clamp-2">
                          {photo.title}
                        </h3>
                        <div className="flex justify-between items-center text-[9px] text-gray-400">
                          <span className="bg-gray-100 px-1 py-0.5 rounded font-bold text-gray-600 truncate max-w-[70px]">
                            {photo.category}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePhoto(photo.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 transition"
                            title="Delete Photo"
                          >
                            <FaTrash size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Photo Quick Edit Bar */}
          {activePhoto && (
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FaPenToSquare className="text-red-600" /> Quick Edit Image Details
                </h2>

                <button
                  type="button"
                  onClick={() => togglePublishStatus(activePhoto.id)}
                  className={`text-[10px] font-bold px-3 py-1 rounded-full transition ${
                    activePhoto.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {activePhoto.isPublished ? 'PUBLISHED' : 'UNPUBLISHED (DRAFT)'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 text-xs">
                <div className="sm:col-span-3 aspect-video bg-gray-900 rounded-lg overflow-hidden border">
                  <img src={activePhoto.url} alt="Active" className="w-full h-full object-cover" />
                </div>

                <div className="sm:col-span-9 space-y-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Photo Title Header</label>
                    <input
                      type="text"
                      value={activePhoto.title}
                      onChange={(e) => updateActivePhoto('title', e.target.value)}
                      className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Photographer Credit</label>
                      <input
                        type="text"
                        value={activePhoto.photographer}
                        onChange={(e) => updateActivePhoto('photographer', e.target.value)}
                        className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Category</label>
                      <input
                        type="text"
                        value={activePhoto.category}
                        onChange={(e) => updateActivePhoto('category', e.target.value)}
                        className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}