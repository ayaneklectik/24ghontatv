'use client';

import { useState } from 'react';
import { 
  FaFolder, FaPlus, FaPenToSquare, FaTrashCan, 
  FaEye, FaEyeSlash, FaSitemap, FaGripVertical,
  FaIndent, FaOutdent, FaLayerGroup
} from 'react-icons/fa6';

interface Category {
  id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  parentId: string | null;
  showInNav: boolean;
  postCount: number;
}

const mockCategories: Category[] = [
  { id: 'cat-1', nameBn: 'জাতীয়', nameEn: 'National', slug: 'national', parentId: null, showInNav: true, postCount: 142 },
  { id: 'cat-2', nameBn: 'রাজনীতি', nameEn: 'Politics', slug: 'politics', parentId: 'cat-1', showInNav: true, postCount: 89 },
  { id: 'cat-3', nameBn: 'অপরাধ', nameEn: 'Crime', slug: 'crime', parentId: 'cat-1', showInNav: true, postCount: 34 },
  { id: 'cat-4', nameBn: 'বাণিজ্য', nameEn: 'Business', slug: 'business', parentId: null, showInNav: true, postCount: 65 },
  { id: 'cat-5', nameBn: 'শেয়ার বাজার', nameEn: 'Stock Market', slug: 'stock-market', parentId: 'cat-4', showInNav: false, postCount: 24 },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  // Form State
  const [categoryType, setCategoryType] = useState<'MAIN' | 'SUB'>('MAIN');
  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [showInNav, setShowInNav] = useState<boolean>(true);

  // Auto-generate slug
  const handleNameEnChange = (val: string) => {
    setNameEn(val);
    if (!editingId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameBn || !slug) return;

    const finalParentId = categoryType === 'SUB' ? parentId : null;

    if (editingId) {
      setCategories(categories.map(c => c.id === editingId ? {
        ...c,
        nameBn,
        nameEn,
        slug,
        parentId: finalParentId,
        showInNav,
      } : c));
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        nameBn,
        nameEn,
        slug,
        parentId: finalParentId,
        showInNav,
        postCount: 0,
      };

      if (finalParentId) {
        // If it's a subcategory, place it directly below its parent in the list
        const parentIdx = categories.findIndex(c => c.id === finalParentId);
        if (parentIdx !== -1) {
          const updated = [...categories];
          updated.splice(parentIdx + 1, 0, newCat);
          setCategories(updated);
        } else {
          setCategories([...categories, newCat]);
        }
      } else {
        setCategories([...categories, newCat]);
      }
    }
    resetForm();
  };

  const resetForm = () => {
    setNameBn('');
    setNameEn('');
    setSlug('');
    setParentId('');
    setCategoryType('MAIN');
    setShowInNav(true);
    setEditingId(null);
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setNameBn(cat.nameBn);
    setNameEn(cat.nameEn);
    setSlug(cat.slug);
    setCategoryType(cat.parentId ? 'SUB' : 'MAIN');
    setParentId(cat.parentId || '');
    setShowInNav(cat.showInNav);
  };

  const toggleNavVisibility = (id: string) => {
    setCategories(categories.map(c => c.id === id ? { ...c, showInNav: !c.showInNav } : c));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this category? Subcategories under it will also be deleted.')) {
      setCategories(categories.filter(c => c.id !== id && c.parentId !== id));
    }
  };

  // --- NATIVE DRAG & DROP REORDERING ---
  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;

    const updated = [...categories];
    const [draggedItem] = updated.splice(draggedIdx, 1);
    updated.splice(targetIdx, 0, draggedItem);

    setDraggedIdx(targetIdx);
    setCategories(updated);
  };

  // --- TOGGLE SUB-CATEGORY STATUS ---
  const toggleSubcategory = (index: number) => {
    if (index === 0) return;

    const updated = [...categories];
    const current = updated[index];

    if (current.parentId === null) {
      const prevItem = updated[index - 1];
      current.parentId = prevItem.parentId || prevItem.id;
    } else {
      current.parentId = null;
    }

    setCategories(updated);
  };

  const mainCategoriesList = categories.filter(c => c.parentId === null && c.id !== editingId);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">News Category Management</h1>
        <p className="text-xs text-gray-500 mt-1">
          Create new main or subcategories, drag to reorder header sequence, and switch navigation visibility.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT PANEL: Category Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <FaFolder className="text-red-600" />
              {editingId ? 'Edit Category' : 'Create Category'}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-xs text-red-600 hover:underline">
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Category Type Switcher */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Category Type
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setCategoryType('MAIN');
                    setParentId('');
                  }}
                  className={`py-2 text-xs font-bold rounded-md transition ${
                    categoryType === 'MAIN' 
                      ? 'bg-white text-red-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Main Category
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryType('SUB')}
                  className={`py-2 text-xs font-bold rounded-md transition ${
                    categoryType === 'SUB' 
                      ? 'bg-white text-red-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Subcategory
                </button>
              </div>
            </div>

            {/* Select Parent Category (When Subcategory is selected) */}
            {categoryType === 'SUB' && (
              <div className="bg-red-50/50 p-3 rounded-lg border border-red-100 space-y-1">
                <label className="block text-xs font-semibold text-red-800">
                  Select Parent Main Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full p-2.5 bg-white border border-red-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                >
                  <option value="">-- Choose Parent Category --</option>
                  {mainCategoriesList.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nameBn} ({c.nameEn})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category Name (Bangla) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                placeholder="e.g. জাতীয়"
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category Name (English)
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => handleNameEnChange(e.target.value)}
                placeholder="e.g. National"
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. national"
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                required
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInNav}
                  onChange={(e) => setShowInNav(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
                <span className="text-xs font-semibold text-gray-700">Display in Header Navbar</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 rounded-lg shadow transition"
            >
              <FaPlus size={12} />
              {editingId ? 'Update Category' : categoryType === 'SUB' ? 'Add Subcategory' : 'Add Main Category'}
            </button>
          </form>
        </div>

        {/* RIGHT PANEL: Category List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <FaSitemap className="text-gray-500" /> Navigation Order & Structure
            </h2>
            <span className="text-xs text-gray-500">Total: {categories.length}</span>
          </div>

          <div className="p-4 space-y-2">
            {categories.map((cat, index) => {
              const isSub = cat.parentId !== null;
              const parentCat = isSub ? categories.find(c => c.id === cat.parentId) : null;

              return (
                <div
                  key={cat.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={() => setDraggedIdx(null)}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                    isSub ? 'ml-8 bg-gray-50 border-gray-200 border-l-4 border-l-red-500' : 'bg-white border-gray-300 font-bold'
                  } ${draggedIdx === index ? 'opacity-40 border-dashed border-red-500' : 'hover:shadow-sm'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                      <FaGripVertical size={14} />
                    </div>

                    <FaFolder className={isSub ? 'text-gray-400' : 'text-amber-500'} size={15} />

                    <div>
                      <div className="text-xs text-gray-800 flex items-center gap-2">
                        {cat.nameBn}
                        {isSub && parentCat && (
                          <span className="text-[10px] font-normal text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">
                            under {parentCat.nameBn}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono">{cat.slug}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Indent / Outdent button */}
                    {index > 0 && (
                      <button
                        onClick={() => toggleSubcategory(index)}
                        title={isSub ? 'Make Main Category' : 'Make Subcategory'}
                        className="flex items-center gap-1 text-[10px] font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                      >
                        {isSub ? <FaOutdent size={11} /> : <FaIndent size={11} />}
                        {isSub ? 'Outdent' : 'Indent'}
                      </button>
                    )}

                    {/* Navbar Toggle */}
                    <button
                      onClick={() => toggleNavVisibility(cat.id)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
                        cat.showInNav ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {cat.showInNav ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                      {cat.showInNav ? 'Navbar' : 'Hidden'}
                    </button>

                    <button
                      onClick={() => handleEdit(cat)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <FaPenToSquare size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <FaTrashCan size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}