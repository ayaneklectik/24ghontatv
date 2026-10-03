'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { deleteNews } from '@/lib/api';
import { fetchAdminNews, setNewsFlag, type AdminNews } from '@/lib/admin-api';
import { retryAlternateMediaHost } from '@/lib/urls';
import { 
  FaMagnifyingGlass, FaPen, FaTrash, FaEye, 
  FaFolder, FaBolt, FaStar, FaPlus, FaCheckDouble, FaXmark 
} from 'react-icons/fa6';

// DB News Data Structure
interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featuredImg?: string | null;
  status: string;
  views: number;
  createdAt: string;
  isLead?: boolean;
  isBreaking?: boolean;
  isTop?: boolean;
  isPopular?: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  author?: {
    name: string;
  };
}

const categories = ['সব ক্যাটাগরি', 'জাতীয়', 'আন্তর্জাতিক', 'বাণিজ্য', 'বিনোদন', 'খেলা', 'লাইফস্টাইল'];

function toNewsItem(item: AdminNews): NewsItem {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    content: item.content,
    featuredImg: item.imageUrl,
    status: item.status === 1 ? 'PUBLISHED' : 'DRAFT',
    views: item.views,
    createdAt: item.createdAt ?? '',
    isLead: item.isLead,
    isBreaking: item.isBreaking,
    isTop: item.isTop,
    isPopular: false,
    category: item.category ?? undefined,
    author: item.author ?? undefined,
  };
}

export default function ManagePostsPage() {
  const [posts, setPosts] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataNotice, setDataNotice] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('সব ক্যাটাগরি');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // --- Bulk Selection States ---
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkCategory, setBulkCategory] = useState('');
  const [updatingFlags, setUpdatingFlags] = useState<Set<string>>(new Set());

  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const [serverPageCount, setServerPageCount] = useState(1);
  const [serverTotal, setServerTotal] = useState(0);
  const postsPerPage = 10;

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get('status');
    if (status === 'DRAFT' || status === 'PUBLISHED') setSelectedStatus(status);
  }, []);

  useEffect(() => {
    if (usingFallback) return;
    let active = true;

    const loadPage = async () => {
      setLoading(true);
      try {
        const result = await fetchAdminNews({
          perPage: postsPerPage,
          page: currentPage,
          search: debouncedSearch || undefined,
          status: selectedStatus === 'All' ? undefined : selectedStatus === 'PUBLISHED' ? 1 : 0,
        });
        if (!active) return;
        setPosts(result.items.map(toNewsItem));
        setServerPageCount(Math.max(1, Number(result.pagination?.last_page ?? 1)));
        setServerTotal(Number(result.pagination?.total ?? result.items.length));
        setDataNotice(null);
      } catch (err) {
        console.error('Error loading admin news:', err);
        try {
          const response = await fetch('/api/news?per_page=1000', { cache: 'no-store' });
          if (!response.ok) throw new Error(`Public news request failed: ${response.status}`);
          const news = await response.json();
          if (!Array.isArray(news)) throw new Error('Public news response was invalid.');
          if (!active) return;

          setPosts(news.map((item: any) => ({
            id: String(item.id),
            title: item.title ?? '',
            slug: item.slug ?? String(item.id),
            excerpt: item.excerpt ?? '',
            content: item.content ?? '',
            featuredImg: item.featuredImg ?? null,
            status: item.status ?? 'PUBLISHED',
            views: Number(item.views ?? 0),
            createdAt: item.createdAt ?? '',
            isBreaking: Boolean(item.isBreaking),
            isTop: Boolean(item.isTop),
            isPopular: Boolean(item.isPopular),
            category: item.category,
            author: item.author,
          })));
          setUsingFallback(true);
          setDataNotice('Showing published news only because the admin API request failed.');
        } catch (fallbackError) {
          console.error('Error loading public news fallback:', fallbackError);
          if (!active) return;
          setPosts([]);
          setDataNotice('News could not be loaded. Check the Laravel API and admin permissions.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadPage();
    return () => {
      active = false;
    };
  }, [currentPage, debouncedSearch, selectedStatus, usingFallback]);

  // Filter posts based on search, category, status
  const filteredPosts = posts.filter(post => {
    const categoryName = post.category?.name || 'Uncategorized';
    const authorName = post.author?.name || 'Admin';
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || authorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'সব ক্যাটাগরি' || categoryName === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || post.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination calculation
  const totalPages = usingFallback
    ? Math.ceil(filteredPosts.length / postsPerPage) || 1
    : serverPageCount;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = usingFallback
    ? filteredPosts.slice(indexOfFirstPost, indexOfLastPost)
    : filteredPosts;
  const displayedTotal = usingFallback ? filteredPosts.length : serverTotal;
  const displayedFrom = currentPosts.length > 0 ? indexOfFirstPost + 1 : 0;
  const displayedTo = usingFallback
    ? Math.min(indexOfLastPost, filteredPosts.length)
    : Math.min(indexOfFirstPost + currentPosts.length, serverTotal);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setSelectedIds([]);
  };

  const handleFlagChange = async (
    post: NewsItem,
    field: 'isLead' | 'isBreaking',
    flag: 'lead-status' | 'breaking-status',
    enabled: boolean,
  ) => {
    const key = `${post.id}:${field}`;
    const previousValue = Boolean(post[field]);
    setUpdatingFlags((current) => new Set(current).add(key));
    setPosts((current) => current.map((item) =>
      item.id === post.id ? { ...item, [field]: enabled } : item,
    ));

    try {
      await setNewsFlag(flag, { id: Number(post.id), status: enabled });
    } catch (error) {
      setPosts((current) => current.map((item) =>
        item.id === post.id ? { ...item, [field]: previousValue } : item,
      ));
      alert(error instanceof Error ? error.message : 'Could not update article flag.');
    } finally {
      setUpdatingFlags((current) => {
        const next = new Set(current);
        next.delete(key);
        return next;
      });
    }
  };

  // --- Selection Handlers ---
  const toggleSelectAll = () => {
    if (selectedIds.length === currentPosts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentPosts.map(p => p.id));
    }
  };

  const toggleSelectPost = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Delete Single Item
  const handleDeleteSingle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      await deleteNews(id);
      setPosts((current) => current.filter((p) => p.id !== id));
      setSelectedIds((current) => current.filter((itemId) => itemId !== id));
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Delete failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage All News</h1>
          <p className="text-xs text-gray-500 mt-1">Search, filter, update, or bulk-manage news articles</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow transition"
        >
          <FaPlus size={12} /> Add new News
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-2">
            <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search headline or reporter name..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none font-medium"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="PUBLISHED">Published (প্রকাশিত)</option>
              <option value="DRAFT">Drafts (ড্রাফট)</option>
            </select>
          </div>
        </div>

        {/* --- DYNAMIC BULK SELECTION TOOLBAR --- */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-red-50 border border-red-200 p-3 rounded-lg animate-fadeIn">
            <div className="flex items-center gap-2 text-red-700 text-sm font-semibold">
              <FaCheckDouble />
              <span>{selectedIds.length} article(s) selected</span>
              <button
                onClick={() => setSelectedIds([])}
                className="text-xs text-red-500 hover:underline ml-2 flex items-center gap-1"
              >
                <FaXmark /> Clear selection
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={async () => {
                  if (!confirm(`Delete ${selectedIds.length} selected article(s)?`)) return;
                  try {
                    await Promise.all(selectedIds.map((id) => deleteNews(id)));
                    setPosts((current) => current.filter((p) => !selectedIds.includes(p.id)));
                    setSelectedIds([]);
                  } catch (error) {
                    console.error(error);
                    alert(error instanceof Error ? error.message : 'Bulk delete failed.');
                  }
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition shadow-sm"
              >
                <FaTrash size={10} /> Move to Trash
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Articles Table */}
      {dataNotice && (
        <div role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {dataNotice}
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/70 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase">
                <th className="p-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={currentPosts.length > 0 && selectedIds.length === currentPosts.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                  />
                </th>
                <th className="p-4">Article</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author</th>
                <th className="p-4">Status</th>
                <th className="p-4">Views</th>
                <th className="p-4 text-center">isLead</th>
                <th className="p-4 text-center">isScrolled</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center p-8 text-gray-500">
                    Loading published news...
                  </td>
                </tr>
              ) : currentPosts.length > 0 ? (
                currentPosts.map((post) => {
                  const isSelected = selectedIds.includes(post.id);
                  const displayDate = new Date(post.createdAt).toLocaleDateString('bn-BD', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  });

                  return (
                    <tr 
                      key={post.id} 
                      className={`hover:bg-gray-50 transition ${isSelected ? 'bg-red-50/40' : ''}`}
                    >
                      {/* Checkbox Column */}
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectPost(post.id)}
                          className="w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                        />
                      </td>

                      {/* Title & Image Column */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.featuredImg || 'https://placehold.co/150x100?text=No+Image'}
                            alt=""
                            onError={(event) => retryAlternateMediaHost(event.currentTarget)}
                            className="w-14 h-10 object-cover rounded-md border border-gray-200 flex-shrink-0"
                          />
                          <div className="space-y-1">
                            <p className="font-bold text-gray-800 hover:text-red-600 line-clamp-1 transition cursor-pointer">
                              {post.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <span>{displayDate}</span>
                              {post.isBreaking && (
                                <span className="inline-flex items-center gap-0.5 text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                  <FaBolt size={9} /> Breaking
                                </span>
                              )}
                              {post.isTop && (
                                <span className="inline-flex items-center gap-0.5 text-red-600 font-semibold bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                                  <FaStar size={9} /> Lead
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <FaFolder className="text-gray-400" size={10} />
                          {post.category?.name || 'জাতীয়'}
                        </span>
                      </td>

                      {/* Author */}
                      <td className="p-4 text-gray-600 font-medium text-xs">
                        {post.author?.name || 'Admin'}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            post.status === 'PUBLISHED'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>

                      {/* View Count */}
                      <td className="p-4 text-gray-500 font-mono text-xs">
                        {(post.views || 0).toLocaleString()}
                      </td>

                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={Boolean(post.isLead)}
                          disabled={usingFallback || updatingFlags.has(`${post.id}:isLead`)}
                          onChange={(event) => void handleFlagChange(
                            post,
                            'isLead',
                            'lead-status',
                            event.target.checked,
                          )}
                          aria-label={`Toggle lead status for ${post.title}`}
                          className="h-4 w-4 accent-red-600 disabled:opacity-50"
                        />
                      </td>

                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={Boolean(post.isBreaking)}
                          disabled={usingFallback || updatingFlags.has(`${post.id}:isBreaking`)}
                          onChange={(event) => void handleFlagChange(
                            post,
                            'isBreaking',
                            'breaking-status',
                            event.target.checked,
                          )}
                          aria-label={`Toggle scrolled status for ${post.title}`}
                          className="h-4 w-4 accent-red-600 disabled:opacity-50"
                        />
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-2">
                        <Link
                          href={`/news/${encodeURIComponent(post.id)}`}
                          target="_blank"
                          title="View Story"
                          className="inline-block p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          href={`/admin/posts/edit/${post.id}`}
                          title="Edit Story"
                          className="inline-block p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded transition"
                        >
                          <FaPen />
                        </Link>
                        <button
                          onClick={() => handleDeleteSingle(post.id)}
                          title="Delete Story"
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="text-center p-8 text-gray-400">
                    {usingFallback && selectedStatus === 'DRAFT'
                      ? 'Drafts are unavailable because the admin API request failed; the fallback only includes published news.'
                      : 'No articles found matching your criteria.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600">
          <div>
            Showing <strong className="font-semibold text-gray-800">{displayedFrom}</strong> to{' '}
            <strong className="font-semibold text-gray-800">{displayedTo}</strong>{' '}
            of <strong className="font-semibold text-gray-800">{displayedTotal}</strong> articles
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white transition font-medium"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                    currentPage === page
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white transition font-medium"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}