'use client';

import { useState } from 'react';
import { 
  FaEnvelope, FaPlus, FaTrash, FaFloppyDisk, 
  FaMagnifyingGlass, FaFileCsv, FaPaperPlane,
  FaCheck, FaUserCheck, FaUserXmark, FaFilter
} from 'react-icons/fa6';

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'ACTIVE' | 'UNSUBSCRIBED';
  source: string;
}

const initialSubscribers: Subscriber[] = [
  { id: 'sub-1', email: 'rahim.karim@gmail.com', subscribedAt: '০৪ আগস্ট ২০২৬', status: 'ACTIVE', source: 'Homepage Footer' },
  { id: 'sub-2', email: 'tanvir.ahmed@yahoo.com', subscribedAt: '০৩ আগস্ট ২০২৬', status: 'ACTIVE', source: 'Breaking News Popup' },
  { id: 'sub-3', email: 'nusrat.jahan@hotmail.com', subscribedAt: '০২ আগস্ট ২০২৬', status: 'UNSUBSCRIBED', source: 'Sidebar Widget' },
  { id: 'sub-4', email: 'editor.choice@24ghonta.com', subscribedAt: '০১ আগস্ট ২০২৬', status: 'ACTIVE', source: 'Homepage Footer' },
  { id: 'sub-5', email: 'shakib.al.hasan@gmail.com', subscribedAt: '৩০ জুলাই ২০২৬', status: 'ACTIVE', source: 'Article Page' },
];

export default function NewsletterManagerPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'UNSUBSCRIBED'>('ALL');

  // New Subscriber Form
  const [newEmail, setNewEmail] = useState('');

  // Newsletter Broadcast Email Form
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignBody, setCampaignBody] = useState('');

  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    const newSub: Subscriber = {
      id: `sub-${Date.now()}`,
      email: newEmail,
      subscribedAt: '০৫ আগস্ট ২০২৬',
      status: 'ACTIVE',
      source: 'Admin Manual Add',
    };

    setSubscribers([newSub, ...subscribers]);
    setNewEmail('');
  };

  const handleDeleteSubscriber = (id: string) => {
    setSubscribers(subscribers.filter((s) => s.id !== id));
  };

  const toggleSubscriberStatus = (id: string) => {
    setSubscribers(
      subscribers.map((s) =>
        s.id === id
          ? { ...s, status: s.status === 'ACTIVE' ? 'UNSUBSCRIBED' : 'ACTIVE' }
          : s
      )
    );
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Email,Subscribed Date,Status,Source']
        .concat(subscribers.map((s) => `${s.email},${s.subscribedAt},${s.status},${s.source}`))
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', '24ghonta_subscribers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubscribers = subscribers.filter((s) => {
    const matchesSearch = s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = subscribers.filter((s) => s.status === 'ACTIVE').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaEnvelope className="text-red-600" /> Newsletter Subscribers & Broadcast
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage email subscriber lists, export CSV reports, and dispatch newsletter campaigns.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition flex items-center gap-2"
        >
          <FaFileCsv size={14} /> Export CSV List
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase block">Total Subscribers</span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">{subscribers.length}</span>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <FaEnvelope size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase block">Active Subscribers</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">{activeCount}</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <FaUserCheck size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase block">Unsubscribed</span>
            <span className="text-2xl font-black text-gray-400 mt-1 block">{subscribers.length - activeCount}</span>
          </div>
          <div className="p-3 bg-gray-100 text-gray-500 rounded-xl">
            <FaUserXmark size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Subscriber Table & Controls (8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap justify-between items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <FaMagnifyingGlass className="absolute left-3 top-3 text-gray-400" size={12} />
              <input
                type="text"
                placeholder="Search subscriber emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-gray-800"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active Only</option>
                <option value="UNSUBSCRIBED">Unsubscribed</option>
              </select>
            </div>
          </div>

          {/* Subscribers Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-bold text-[10px]">
                  <th className="p-3">Subscriber Email</th>
                  <th className="p-3">Subscribed Date</th>
                  <th className="p-3">Signup Source</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-3 font-bold text-gray-800">{sub.email}</td>
                    <td className="p-3 text-gray-500 font-mono text-[11px]">{sub.subscribedAt}</td>
                    <td className="p-3 text-gray-600">{sub.source}</td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleSubscriberStatus(sub.id)}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          sub.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {sub.status}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteSubscriber(sub.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition"
                        title="Delete Subscriber"
                      >
                        <FaTrash size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* RIGHT PANEL: Manual Add & Email Broadcast (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Add Manual Subscriber */}
          <form onSubmit={handleAddSubscriber} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b pb-2">
              Add Subscriber Manually
            </h2>

            <div className="space-y-2 text-xs">
              <input
                type="email"
                placeholder="subscriber@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-medium"
                required
              />

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs py-2 flex items-center justify-center gap-1.5 transition"
              >
                <FaPlus /> Add Subscriber
              </button>
            </div>
          </form>

          {/* Quick Newsletter Broadcast Form */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3 sticky top-6">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
              <FaPaperPlane className="text-red-600" /> Send Quick Broadcast
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Email Subject Line</label>
                <input
                  type="text"
                  placeholder="২৪ঘণ্টা আজকের বিশেষ শিরোনাম"
                  value={campaignSubject}
                  onChange={(e) => setCampaignSubject(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Newsletter Content</label>
                <textarea
                  rows={4}
                  placeholder="এখানে বার্তার বিষয়বস্তু লিখুন..."
                  value={campaignBody}
                  onChange={(e) => setCampaignBody(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <button
                type="button"
                onClick={() => alert(`Broadcast sent to ${activeCount} active subscribers!`)}
                className="w-full bg-gray-900 hover:bg-black text-white font-bold rounded-lg text-xs py-2.5 flex items-center justify-center gap-2 shadow transition"
              >
                <FaPaperPlane size={12} /> Dispatch Broadcast ({activeCount})
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}