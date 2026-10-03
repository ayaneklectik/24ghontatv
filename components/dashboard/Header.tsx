'use client';
import { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, Globe, AlertCircle, Settings, Camera, Lock, LogOut } from 'lucide-react';
import { useTitle } from '@/context/TitleContext'; // Import the context hook
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { fetchAdminNews } from '@/lib/admin-api';

interface HeaderProps {
  adminName?: string;
  role?: string;
}

export default function Header({ adminName, role }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { title } = useTitle();
  const { data: session } = useSession();

  useEffect(() => {
    let active = true;
    fetchAdminNews({ perPage: 1, page: 1, status: 0 })
      .then((result) => {
        if (active) {
          setPendingCount(Number(result.pagination?.total ?? result.items.length));
        }
      })
      .catch(() => {
        if (active) setPendingCount(0);
      });

    return () => {
      active = false;
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = adminName ?? session?.user?.name ?? 'Admin';
  const displayRole = role ?? (session?.user as any)?.role ?? 'ADMIN';

  return (
    <header className="h-16 bg-white border-b border-black/10 flex items-center justify-between px-8 sticky top-0 z-20">
      {/* Left: Dynamic Title and Website Link */}
      <div className="flex items-center gap-4">
        <div className="text-sm font-bold text-black/80 capitalize">{title}</div>
        <div className="w-px h-4 bg-black/20" />
        <a href="/" target="_blank" rel="noopener noreferrer" className="text-black/40 hover:text-red-600 transition-colors" title="Open Website">
          <Globe size={18} />
        </a>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-black/30" size={16} />
          <input
            type="text"
            placeholder="Search news, settings, options..."
            className="pl-9 pr-4 py-1.5 w-64 bg-black/5 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-red-600 transition-all"
          />
        </div>

        <div className="w-px h-6 bg-black/10" />

        {/* Pending Reviews */}
        <Link
          href="/admin/posts?status=DRAFT"
          className="text-black/60 hover:text-amber-600 transition-colors relative"
          title="Pending Reviews"
          aria-label={`Pending reviews: ${pendingCount}`}
        >
          <AlertCircle size={20} />
          {pendingCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[16px] h-4 px-1 bg-amber-500 text-white text-[10px] font-bold rounded-full">
              {pendingCount > 9 ? '9+' : pendingCount}
            </span>
          )}
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            className="text-black/60 hover:text-red-600 transition-colors relative"
            title="Notifications"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            aria-controls="admin-notifications-panel"
          >
            <Bell size={20} />
          </button>
          {notificationsOpen && (
            <div
              id="admin-notifications-panel"
              role="status"
              className="absolute right-0 top-9 z-50 w-72 rounded-lg border border-black/10 bg-white p-4 shadow-xl"
            >
              <p className="text-sm font-semibold text-black/80">Notifications</p>
              <p className="mt-2 text-xs text-black/50">No notification feed is connected to this dashboard.</p>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-3 border-l border-black/10 pl-6">
            <div className="text-right">
              <p className="text-sm font-bold text-black/80">{displayName}</p>
              <p className="text-xs text-black/40 uppercase">{displayRole}</p>
            </div>
            <div className="w-9 h-9 bg-black/10 rounded-full flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-red-600 transition-all">
              <User size={20} className="text-black/60" />
            </div>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white border border-black/10 rounded-lg shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-black/5 mb-1">
                <p className="text-xs text-black/40 font-bold uppercase">Account</p>
              </div>
              <Link href="/admin/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-black/70 hover:bg-black/5"><Settings size={16} /> Edit Profile</Link>
              <Link href="/admin/profile/avatar" className="flex items-center gap-3 px-4 py-2 text-sm text-black/70 hover:bg-black/5"><Camera size={16} /> Change Avatar</Link>
              <Link href="/admin/profile/password" className="flex items-center gap-3 px-4 py-2 text-sm text-black/70 hover:bg-black/5"><Lock size={16} /> Change Password</Link>
              <div className="border-t border-black/5 my-1" />
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              ><LogOut size={16} /> Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}