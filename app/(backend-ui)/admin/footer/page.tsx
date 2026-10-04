'use client';

import { useState } from 'react';
import { 
  FaSitemap, FaPlus, FaTrash, FaFloppyDisk, 
  FaRegEye, FaGripVertical, FaArrowUp, FaArrowDown,
  FaLink, FaPenToSquare, FaPhone, FaEnvelope, FaLocationDot
} from 'react-icons/fa6';

interface FooterLink {
  id: string;
  label: string;
  url: string;
}

interface FooterColumn {
  id: string;
  columnTitle: string;
  links: FooterLink[];
}

const initialColumns: FooterColumn[] = [
  {
    id: 'col-1',
    columnTitle: 'আমাদের কথা',
    links: [
      { id: 'fl-1', label: 'আমাদের পরিচিতি', url: '/about' },
      { id: 'fl-2', label: 'সম্পাদকীয় প্যানেল', url: '/editorial-board' },
      { id: 'fl-3', label: 'গোপনীয়তা নীতি', url: '/privacy-policy' },
      { id: 'fl-4', label: 'ব্যবহারের শর্তাবলী', url: '/terms' },
    ],
  },
  {
    id: 'col-2',
    columnTitle: 'জনপ্রিয় বিষয়',
    links: [
      { id: 'fl-5', label: 'জাতীয় সংবাদ', url: '/category/national' },
      { id: 'fl-6', label: 'রাজনীতি', url: '/category/politics' },
      { id: 'fl-7', label: 'অর্থনীতি ও ব্যবসা', url: '/category/economy' },
      { id: 'fl-8', label: 'খেলাধুলা', url: '/category/sports' },
    ],
  },
  {
    id: 'col-3',
    columnTitle: 'যোগাযোগ ও অন্যান্য',
    links: [
      { id: 'fl-9', label: 'বিজ্ঞাপন মূল্য তালিকা', url: '/ad-rates' },
      { id: 'fl-10', label: 'যোগাযোগ করুন', url: '/contact' },
      { id: 'fl-11', label: 'সাইটম্যাপ', url: '/sitemap.xml' },
    ],
  },
];

export default function FooterPage() {
  // Footer Brand Information
  const [editorName, setEditorName] = useState('সম্পাদক ও প্রকাশক: ড. আবদুর রাজ্জাক');
  const [officeAddress, setOfficeAddress] = useState('কার্যালয়: ঢাকা, বাংলাদেশ');
  const [phone, setPhone] = useState('+৮৮০ ১৭০০ ০০০০০');
  const [email, setEmail] = useState('info@24ghonta.com');
  const [copyrightText, setCopyrightText] = useState('© ২০২৬ ২৪ঘণ্টা। সর্বস্বত্ব সংরক্ষিত।');

  // Multi-Column Links
  const [columns, setColumns] = useState<FooterColumn[]>(initialColumns);
  const [selectedColumnId, setSelectedColumnId] = useState<string>(initialColumns[0].id);

  // New Link Input State
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const activeColumn = columns.find((c) => c.id === selectedColumnId) || columns[0];

  const handleAddLinkToColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkLabel || !newLinkUrl) return;

    const newLinkItem: FooterLink = {
      id: `fl-${Date.now()}`,
      label: newLinkLabel,
      url: newLinkUrl,
    };

    setColumns(
      columns.map((col) =>
        col.id === selectedColumnId
          ? { ...col, links: [...col.links, newLinkItem] }
          : col
      )
    );

    setNewLinkLabel('');
    setNewLinkUrl('');
  };

  const handleDeleteLink = (linkId: string) => {
    setColumns(
      columns.map((col) =>
        col.id === selectedColumnId
          ? { ...col, links: col.links.filter((l) => l.id !== linkId) }
          : col
      )
    );
  };

  const updateColumnTitle = (title: string) => {
    setColumns(
      columns.map((col) =>
        col.id === selectedColumnId ? { ...col, columnTitle: title } : col
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaSitemap className="text-red-600" /> Footer Manager
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage footer editor credentials, office contact info, multi-column links, and copyright text.
          </p>
        </div>

        <button
          onClick={() => alert('Footer Configuration Saved Successfully!')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition flex items-center gap-2"
        >
          <FaFloppyDisk /> Save Footer Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Contact Details & Copyright Config (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b pb-2">
              Publication & Contact Info
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Editor / Publisher Info</label>
                <input
                  type="text"
                  value={editorName}
                  onChange={(e) => setEditorName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <FaLocationDot className="text-gray-400" /> Office Address
                </label>
                <input
                  type="text"
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <FaPhone className="text-gray-400" /> Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <FaEnvelope className="text-gray-400" /> Email
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Copyright Statement</label>
                <input
                  type="text"
                  value={copyrightText}
                  onChange={(e) => setCopyrightText(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-[11px] font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE PANEL: Multi-Column Link Builder (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Column Tab Selector */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b pb-2">
              Select Link Column
            </h2>

            <div className="grid grid-cols-3 gap-2">
              {columns.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setSelectedColumnId(col.id)}
                  className={`p-2 rounded-lg border text-xs font-bold truncate transition ${
                    selectedColumnId === col.id
                      ? 'border-red-600 bg-red-50 text-red-600 shadow-sm'
                      : 'border-gray-200 bg-gray-50 text-gray-600'
                  }`}
                >
                  {col.columnTitle}
                </button>
              ))}
            </div>
          </div>

          {/* Edit Column Content */}
          {activeColumn && (
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <label className="block text-xs font-bold text-gray-700 mb-1">Column Title Header</label>
                <input
                  type="text"
                  value={activeColumn.columnTitle}
                  onChange={(e) => updateColumnTitle(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg font-bold text-xs"
                />
              </div>

              {/* Add New Link */}
              <form onSubmit={handleAddLinkToColumn} className="space-y-2 bg-gray-50 p-3 rounded-lg border">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Add Link to {activeColumn.columnTitle}</span>
                <input
                  type="text"
                  placeholder="Link Label (e.g. গোপনীয়তা নীতি)"
                  value={newLinkLabel}
                  onChange={(e) => setNewLinkLabel(e.target.value)}
                  className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs"
                  required
                />
                <input
                  type="text"
                  placeholder="URL Path (e.g. /privacy-policy)"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  className="w-full p-2 bg-white border border-gray-300 rounded-lg font-mono text-[11px]"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-1.5 rounded-lg transition flex items-center justify-center gap-1"
                >
                  <FaPlus /> Add Link
                </button>
              </form>

              {/* Column Links List */}
              <div className="space-y-1.5">
                {activeColumn.links.map((link) => (
                  <div key={link.id} className="p-2 bg-gray-50 rounded-lg border flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-gray-800 block">{link.label}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{link.url}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition"
                    >
                      <FaTrash size={11} />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* RIGHT PANEL: Live Footer Preview (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-gray-900 text-gray-300 p-5 rounded-xl border border-gray-800 shadow-sm space-y-4 sticky top-6">
            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <FaRegEye className="text-red-500" /> Live Footer Preview
              </h2>
            </div>

            {/* Brand Title */}
            <div>
              <h3 className="text-xl font-black text-white">২৪ঘণ্টা</h3>
              <p className="text-[11px] text-gray-400 mt-1">{editorName}</p>
            </div>

            {/* Link Columns Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-800 text-[11px]">
              {columns.map((col) => (
                <div key={col.id} className="space-y-1.5">
                  <h4 className="font-bold text-white">{col.columnTitle}</h4>
                  <ul className="space-y-1 text-gray-400 text-[10px]">
                    {col.links.map((l) => (
                      <li key={l.id} className="hover:text-red-400 cursor-pointer">{l.label}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Office Contact Info */}
            <div className="border-t border-gray-800 pt-3 text-[10px] space-y-1 text-gray-400">
              <p>{officeAddress}</p>
              <p>ফোন: {phone} | ইমেইল: {email}</p>
            </div>

            {/* Copyright Bar */}
            <div className="border-t border-gray-800 pt-3 text-[9px] text-gray-500 text-center">
              {copyrightText}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}