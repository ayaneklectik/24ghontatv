'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import { 
  FaBold, FaItalic, FaQuoteLeft, FaListUl, FaListOl, 
  FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify, 
  FaImage, FaYoutube, FaLink, FaRotateLeft, FaRotateRight,
  FaUpload, FaTag, FaXmark, FaGlobe, FaStar, FaBolt, FaCheck
} from 'react-icons/fa6';
import { createNewsArticle } from '@/lib/api';
import { fetchAdminCategories, uploadNewsEditorImage } from '@/lib/admin-api';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
}

export default function NewPostPage() {
  const router = useRouter();

  // --- Form States ---
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  
  // Category Taxonomy States
  const [categoryList, setCategoryList] = useState<CategoryItem[]>([]);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const inlineImageInput = useRef<HTMLInputElement>(null);
  
  // News Placement Toggles
  const [isBreaking, setIsBreaking] = useState(false);
  const [isLead, setIsLead] = useState(false);
  const [isTopNews, setIsTopNews] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false);

  // Tags & SEO
  const [tags, setTags] = useState<string[]>(['জাতীয়', 'সংবাদ']);
  const [tagInput, setTagInput] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Status & Feedback States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // --- Load Dynamic Categories from Backend ---
  useEffect(() => {
    async function loadCategories() {
      try {
        setCategoriesLoading(true);
        const data = await fetchAdminCategories();
        if (Array.isArray(data) && data.length > 0) {
          setCategoryList(data);
          const topLevel = data.filter((c: CategoryItem) => !c.parentId);
          if (topLevel.length > 0) {
            setCategory(topLevel[0].id);
          } else {
            setCategory(data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories.');
      } finally {
        setCategoriesLoading(false);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // --- Dynamic Category Filtering ---
  const mainCategories = categoryList.filter(c => !c.parentId);
  const availableSubCategories = categoryList.filter(c => c.parentId === category);

  const handleCategoryChange = (catId: string) => {
    setCategory(catId);
    setSubCategory(''); // Clear subcategory when main category switches
  };

  // --- TipTap Rich Text Editor Configuration ---
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      Youtube.configure({ width: 640, height: 360 }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '<p>এখানে বিস্তারিত সংবাদ লেখা শুরু করুন...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[380px] p-4 bg-white border border-gray-200 rounded-b-lg text-gray-800 font-kalpurush',
      },
    },
  });

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    setSlug(value.trim().toLowerCase().replace(/\s+/g, '-'));
  };

  // Add Tag Chip
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Editor Action Handlers
  const addImageUrl = () => {
    const url = prompt('Enter Image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const uploadInlineImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);
    input.value = '';
    if (!editor || files.length === 0) return;

    setUploadingImages(true);
    setError(null);
    try {
      for (const file of files) {
        const imageUrl = await uploadNewsEditorImage(file);
        editor.chain().focus().setImage({ src: imageUrl, alt: file.name }).run();
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Could not upload article image.');
    } finally {
      setUploadingImages(false);
    }
  };

  const addYoutubeVideo = () => {
    const url = prompt('Enter YouTube Video URL:');
    if (url && editor) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  // Form Submit Handler connected to Backend API
  const handleSubmit = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!title.trim()) {
      setError('Please provide an article headline.');
      return;
    }

    if (!category) {
      setError('Please select a valid category.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const postData = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || undefined,
      content: editor?.getHTML() || '',
      categoryId: category,
      subCategoryId: subCategory || undefined,
      authorId: 'admin-user-id',
      imageCaption: imageCaption.trim() || undefined,
      isBreaking,
      isLead,
      isTopNews,
      isSpecial,
      tags,
      metaTitle: metaTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || excerpt.trim(),
      status,
    };

    try {
      const response = await createNewsArticle(postData, selectedImage);

      if (response && !response.error) {
        // Show success notification
        setSuccess(`Article successfully ${status === 'PUBLISHED' ? 'published' : 'saved as draft'}! You can publish another story below.`);

        // --- Reset Form Fields for Next Article ---
        setTitle('');
        setSlug('');
        setExcerpt('');
        setSelectedImage(null);
        setImagePreview(null);
        setImageCaption('');
        setIsBreaking(false);
        setIsLead(false);
        setIsTopNews(false);
        setIsSpecial(false);
        setTags(['জাতীয়', 'সংবাদ']);
        setMetaTitle('');
        setMetaDescription('');
        editor?.commands.setContent('<p>এখানে বিস্তারিত সংবাদ লেখা শুরু করুন...</p>');

        // Refresh router in background to keep Next.js cache updated
        router.refresh();
      } else {
        setError(response?.error || 'Failed to submit article.');
      }
    } catch (err: any) {
      console.error('Error submitting article:', err);
      setError(err?.message || 'An unexpected error occurred while saving the post.');
    } finally {
      setLoading(false);
    }
  };

  if (!editor) return null;

  return (
    <form onSubmit={(e) => e.preventDefault()} className="max-w-7xl mx-auto space-y-6">
      {/* Top Bar / Publish Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Create New Article</h1>
          <p className="text-xs text-gray-500">Draft your news story and configure placements</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={loading || uploadingImages}
            onClick={() => handleSubmit('DRAFT')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            disabled={loading || uploadingImages}
            onClick={() => handleSubmit('PUBLISHED')}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish Story'}
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 border border-green-200 font-medium flex items-center justify-between shadow-sm">
          <span className="flex items-center gap-2">
            <FaCheck className="text-green-600" /> {success}
          </span>
          <button 
            type="button" 
            onClick={() => setSuccess(null)}
            className="text-green-800 font-bold ml-4 hover:underline text-xs"
          >
            ✕ Dismiss
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200 font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Headline & Slug Inputs */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Headline / সংবাদের শিরোনাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="এখানে মূল শিরোনামটি লিখুন..."
                className="w-full text-lg font-bold p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">URL Slug</label>
              <div className="flex items-center text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600">
                <span className="text-gray-400">24ghonta.com/news/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="bg-transparent focus:outline-none flex-1 text-gray-800 font-mono text-xs ml-1"
                />
              </div>
            </div>

            {/* Sub-headline / Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Summary / সারসংক্ষেপ (Excerpt)
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="সংবাদের একটি ছোট সারসংক্ষেপ লিখুন (যা কার্ড ও সার্চে দেখাবে)..."
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* TipTap Rich Text Editor Container */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Custom Rich Text Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1 items-center text-gray-700 text-sm">
              {/* Undo / Redo */}
              <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="p-2 hover:bg-gray-200 rounded disabled:opacity-40 text-gray-700"
              >
                <FaRotateLeft />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="p-2 hover:bg-gray-200 rounded disabled:opacity-40 text-gray-700"
              >
                <FaRotateRight />
              </button>
              <div className="w-[1px] h-5 bg-gray-300 mx-1" />

              {/* Headings */}
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`px-2 py-1 font-bold rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-red-100 text-red-600' : 'hover:bg-gray-200'}`}
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`px-2 py-1 font-bold rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-red-100 text-red-600' : 'hover:bg-gray-200'}`}
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`px-2 py-1 font-bold rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-red-100 text-red-600' : 'hover:bg-gray-200'}`}
              >
                H3
              </button>
              <div className="w-[1px] h-5 bg-gray-300 mx-1" />

              {/* Inline Styles */}
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded ${editor.isActive('bold') ? 'bg-red-100 text-red-600' : 'hover:bg-gray-200'}`}
              >
                <FaBold />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded ${editor.isActive('italic') ? 'bg-red-100 text-red-600' : 'hover:bg-gray-200'}`}
              >
                <FaItalic />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded ${editor.isActive('blockquote') ? 'bg-red-100 text-red-600' : 'hover:bg-gray-200'}`}
              >
                <FaQuoteLeft />
              </button>
              <div className="w-[1px] h-5 bg-gray-300 mx-1" />

              {/* Lists */}
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-red-100 text-red-600' : 'hover:bg-gray-200'}`}
              >
                <FaListUl />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-red-100 text-red-600' : 'hover:bg-gray-200'}`}
              >
                <FaListOl />
              </button>
              <div className="w-[1px] h-5 bg-gray-300 mx-1" />

              {/* Alignments */}
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-red-100 text-red-600' : 'hover:bg-gray-200'}`}
              >
                <FaAlignLeft />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-red-100 text-red-600' : 'hover:bg-gray-200'}`}
              >
                <FaAlignCenter />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-red-100 text-red-600' : 'hover:bg-gray-200'}`}
              >
                <FaAlignRight />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={`p-2 rounded ${editor.isActive({ textAlign: 'justify' }) ? 'bg-red-100 text-red-600' : 'hover:bg-gray-200'}`}
              >
                <FaAlignJustify />
              </button>
              <div className="w-[1px] h-5 bg-gray-300 mx-1" />

              {/* Media & Embed Tools */}
              <button
                type="button"
                onClick={addImageUrl}
                className="p-2 hover:bg-gray-200 rounded text-blue-600 flex items-center gap-1 font-medium"
                title="Insert an image from a URL"
              >
                <FaImage /> Image
              </button>
              <button
                type="button"
                onClick={() => inlineImageInput.current?.click()}
                disabled={uploadingImages}
                className="p-2 hover:bg-gray-200 rounded text-blue-700 flex items-center gap-1 font-medium disabled:opacity-50"
                title="Upload one or more images into the article"
              >
                <FaUpload /> {uploadingImages ? 'Uploading...' : 'Upload images'}
              </button>
              <input
                ref={inlineImageInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={uploadInlineImages}
                className="hidden"
                aria-label="Upload article images"
              />
              <button
                type="button"
                onClick={addYoutubeVideo}
                className="p-2 hover:bg-gray-200 rounded text-red-600 flex items-center gap-1 font-medium"
              >
                <FaYoutube /> Video
              </button>
              <button
                type="button"
                onClick={setLink}
                className={`p-2 rounded ${editor.isActive('link') ? 'bg-red-100 text-red-600' : 'hover:bg-gray-200'}`}
              >
                <FaLink />
              </button>
            </div>

            {/* TipTap Editor Surface */}
            <EditorContent editor={editor} />
          </div>

          {/* SEO Metadata Box */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <FaGlobe className="text-blue-500" /> Search Engine Optimization (SEO)
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Meta Title</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={title || 'Meta Title Defaults to Article Title'}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Meta Description</label>
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder={excerpt || 'Meta Description Defaults to Article Excerpt'}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls (Right Column) */}
        <div className="space-y-6">
          {/* Category Selector */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-800 border-b pb-2">Category & Taxonomy</h3>
            
            {/* Primary Category Selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Primary Category</label>
              <select
                value={category}
                disabled={categoriesLoading}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50"
              >
                {categoriesLoading ? (
                  <option value="">Loading categories...</option>
                ) : (
                  mainCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Dynamic Subcategory Selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Sub Category (Optional)</label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                disabled={availableSubCategories.length === 0}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50 disabled:bg-gray-100"
              >
                <option value="">
                  {availableSubCategories.length === 0 
                    ? '-- No Subcategories Available --' 
                    : '-- Select Subcategory --'}
                </option>
                {availableSubCategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Featured Image Box */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-800 border-b pb-2 flex items-center justify-between">
              <span>Featured Image</span>
              <FaUpload className="text-gray-400 text-sm" />
            </h3>

            {imagePreview ? (
              <div className="space-y-2">
                <div className="relative rounded-lg overflow-hidden border border-gray-200">
                  <img src={imagePreview} alt="Featured preview" className="w-full h-40 object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow flex items-center justify-center"
                    aria-label="Remove featured image"
                  >
                    <FaXmark size={12} />
                  </button>
                </div>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Image Caption / ছবি ক্যাপশন"
                  className="w-full p-2 text-xs border border-gray-300 rounded focus:outline-none"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                  <FaImage className="mx-auto text-gray-400 mb-2" size={28} />
                  <p className="text-xs text-gray-500">Choose a featured image</p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setSelectedImage(file);
                    setImagePreview(file ? URL.createObjectURL(file) : null);
                  }}
                  className="w-full text-xs text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-red-50 file:px-3 file:py-2 file:font-medium file:text-red-700 hover:file:bg-red-100"
                />
                <p className="text-[11px] text-gray-500">JPG, PNG, or WebP. Maximum 5 MB.</p>
              </div>
            )}
          </div>

          {/* Homepage Feature Flags */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-3">
            <h3 className="font-bold text-gray-800 border-b pb-2">Homepage Placements</h3>

            <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaBolt className="text-amber-500" /> Breaking News (ব্রেকিং নিউজ)
              </span>
              <input
                type="checkbox"
                checked={isBreaking}
                onChange={(e) => setIsBreaking(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
            </label>

            <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaStar className="text-red-500" /> Lead Story / Hero Section
              </span>
              <input
                type="checkbox"
                checked={isLead}
                onChange={(e) => setIsLead(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
            </label>

            <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
              <span className="text-sm font-medium text-gray-700">Top News (প্রধান সংবাদ)</span>
              <input
                type="checkbox"
                checked={isTopNews}
                onChange={(e) => setIsTopNews(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
            </label>

            <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
              <span className="text-sm font-medium text-gray-700">Special Feature</span>
              <input
                type="checkbox"
                checked={isSpecial}
                onChange={(e) => setIsSpecial(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
            </label>
          </div>

          {/* Tags Manager */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-3">
            <h3 className="font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
              <FaTag className="text-gray-500" /> Tags
            </h3>

            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type tag and press Enter..."
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
            />

            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full font-medium"
                >
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500">
                    <FaXmark size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
