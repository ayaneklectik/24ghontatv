'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FaTrash, FaRotateLeft, FaTrashCan, FaMagnifyingGlass, 
  FaCheckDouble, FaXmark, FaFileLines, FaFolder 
} from 'react-icons/fa6';

interface ArchivedItem {
  id: string;
  title: string;
  category: string;
  author: string;
  type: 'Draft' | 'Trash';
  deletedAt?: string;
  updatedAt: string;
}

const mockArchivedData: ArchivedItem[] = [
  {
    id: 'trash-1',
    title: 'পুরানো বাজেট বিশ্লেষণের পূর্ববর্তী খসড়া',
    category: 'বাণিজ্য',
    author: 'রহিম উল্লাহ',
    type: 'Trash',
    deletedAt: '০৩ আগস্ট ২০২৬',
    updatedAt: '০২ আগস্ট ২০২৬',
  },
  {
    id: 'trash-2',
    title: 'টেস্ট নিউজ হেডলাইন - সিস্টেম টেস্টিং',
    category: 'জাতীয়',
    author: 'কাজী আশরাফ',
    type: 'Trash',
    deletedAt: '০৪ আগস্ট ২০২৬',
    updatedAt: '০৪ আগস্ট ২০২৬',
  },
  {
    id: 'draft-1',
    title: 'জলবায়ু পরিবর্তনের প্রভাবে উপকূলীয় অঞ্চলে ফসলহানির আশঙ্কা',
    category: 'জাতীয়',
    author: 'কাজী আশরাফ',
    type: 'Draft',
    updatedAt: '০৪ আগস্ট ২০২৬',
  },
  {
    id: 'draft-2',
    title: 'নতুন স্মার্টফোন সিরিজের বৈশ্বিক উন্মোচন পরের সপ্তাহে',
    category: 'প্রযুক্তি',
    author: 'তানভীর আহমেদ',
    type: 'Draft',
    updatedAt: '০৩ আগস্ট ২০২৬',
  },
];

export default function DraftsTrashPage() {
  const [items, setItems] = useState<ArchivedItem[]>(mockArchivedData);
  const [activeTab, setActiveTab] = useState<'Trash' | 'Draft'>('Trash');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter items based on active tab & search query
  const filteredItems = items.filter(
    (item) => item.type === activeTab && item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Selection Handlers ---
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((item) => item.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // --- Actions ---
  const handleRestore = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
    alert('Article restored successfully!');
  };

  const handlePermanentDelete = (id: string) => {
    if (confirm('Are you sure? This action CANNOT be undone.')) {
      setItems(items.filter((item) => item.id !== id));
      setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
    }
  };

  const handleBulkRestore = () => {
    if (!selectedIds.length) return;
    setItems(items.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    alert(`${selectedIds.length} item(s) restored successfully!`);
  };

  const handleBulkPermanentDelete = () => {
    if (!selectedIds.length) return;
    if (confirm(`Permanently delete ${selectedIds.length} selected item(s)? This action CANNOT be undone.`)) {
      setItems(items.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]);
    }
  };

  const handleEmptyTrash = () => {
    if (confirm('Are you sure you want to empty the entire trash? All trashed items will be permanently deleted.')) {
      setItems(items.filter((item) => item.type !== 'Trash'));
      setSelectedIds([]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Drafts & Trash Workspace</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage unpublished article drafts or restore/permanently purge deleted content
          </p>
        </div>

        {activeTab === 'Trash' && items.some((i) => i.type === 'Trash') && (
          <button
            onClick={handleEmptyTrash}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow transition"
          >
            <FaTrashCan size={12} /> Empty Trash
          </button>
        )}
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-3">
          {/* Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('Trash');
                setSelectedIds([]);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'Trash'
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <FaTrash size={12} /> Trash ({items.filter((i) => i.type === 'Trash').length})
            </button>

            <button
              onClick={() => {
                setActiveTab('Draft');
                setSelectedIds([]);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'Draft'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <FaFileLines size={12} /> Drafts ({items.filter((i) => i.type === 'Draft').length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${activeTab.toLowerCase()}...`}
              className="w-full pl-8 pr-4 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>
        </div>

        {/* --- DYNAMIC BULK ACTION BAR --- */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-red-50 border border-red-200 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 text-xs font-semibold">
              <FaCheckDouble />
              <span>{selectedIds.length} item(s) selected</span>
              <button
                onClick={() => setSelectedIds([])}
                className="text-xs text-red-500 hover:underline ml-2 flex items-center gap-1"
              >
                <FaXmark /> Clear selection
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkRestore}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded text-xs font-medium transition"
              >
                <FaRotateLeft size={10} /> Restore Selected
              </button>

              {activeTab === 'Trash' && (
                <button
                  onClick={handleBulkPermanentDelete}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition"
                >
                  <FaTrashCan size={10} /> Permanently Delete
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/70 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase">
                <th className="p-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filteredItems.length > 0 && selectedIds.length === filteredItems.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                  />
                </th>
                <th className="p-4">Article Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author</th>
                <th className="p-4">{activeTab === 'Trash' ? 'Deleted Date' : 'Last Updated'}</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 transition ${isSelected ? 'bg-red-50/40' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectItem(item.id)}
                          className="w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                        />
                      </td>

                      {/* Title */}
                      <td className="p-4 font-bold text-gray-800 line-clamp-1">{item.title}</td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <FaFolder className="text-gray-400" size={10} />
                          {item.category}
                        </span>
                      </td>

                      {/* Author */}
                      <td className="p-4 text-gray-600 font-medium text-xs">{item.author}</td>

                      {/* Date */}
                      <td className="p-4 text-gray-500 font-mono text-xs">
                        {activeTab === 'Trash' ? item.deletedAt : item.updatedAt}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-2">
                        {activeTab === 'Draft' ? (
                          <Link
                            href="/admin/posts/new"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-xs font-semibold transition"
                          >
                            Continue Editing
                          </Link>
                        ) : (
                          <>
                            <button
                              onClick={() => handleRestore(item.id)}
                              title="Restore Article"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-semibold transition"
                            >
                              <FaRotateLeft size={10} /> Restore
                            </button>
                            <button
                              onClick={() => handlePermanentDelete(item.id)}
                              title="Delete Permanently"
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                            >
                              <FaTrashCan size={12} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-400">
                    No {activeTab.toLowerCase()} items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
          Showing <strong>{filteredItems.length}</strong> {activeTab.toLowerCase()} item(s)
        </div>
      </div>
    </div>
  );
}