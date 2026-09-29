'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createNewsArticle, fetchCategories } from '@/lib/api';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function PostForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [isLead, setIsLead] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);

  // Fetch dynamic categories for the dropdown
  useEffect(() => {
    async function loadCategories() {
      try {
        setCategoriesLoading(true);
        const data = await fetchCategories();
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          setCategoryId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
        setError('Could not load categories. Please refresh.');
      } finally {
        setCategoriesLoading(false);
      }
    }
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryId) {
      setError('Please select a valid category.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        categoryId,
        featuredImage: featuredImage.trim() || undefined,
        isLead,
        isBreaking,
        status: 'PUBLISHED' as const,
      };

      const response = await createNewsArticle(payload);

      if (response && !response.error) {
        // Redirect back to posts table on successful creation
        router.push('/admin/posts');
        router.refresh();
      } else {
        setError(response?.error || 'Failed to publish post. Please check backend logs.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('An error occurred while publishing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      {/* Post Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Post Title / শিরোনাম
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title here..."
          className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-red-500 focus:outline-none"
        />
      </div>

      {/* Category Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category / ক্যাটাগরি
        </label>
        <select
          value={categoryId}
          disabled={categoriesLoading}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-red-500 focus:outline-none bg-white disabled:bg-gray-100"
        >
          {categoriesLoading ? (
            <option value="">Loading categories...</option>
          ) : (
            categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Featured Image URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Featured Image URL / ছবি (URL)
        </label>
        <input
          type="url"
          value={featuredImage}
          onChange={(e) => setFeaturedImage(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-red-500 focus:outline-none"
        />
      </div>

      {/* Content Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content / বিস্তারিত সংবাদ
        </label>
        <textarea
          rows={10}
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your article here..."
          className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-red-500 focus:outline-none"
        />
      </div>

      {/* Flags / Checkboxes */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={isLead}
            onChange={(e) => setIsLead(e.target.checked)}
            className="accent-red-600 rounded"
          />
          Lead News (প্রধান সংবাদ)
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={isBreaking}
            onChange={(e) => setIsBreaking(e.target.checked)}
            className="accent-red-600 rounded"
          />
          Breaking News (ব্রেকিং নিউজ)
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || categoriesLoading}
          className="rounded-md bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish Post'}
        </button>
      </div>
    </form>
  );
}