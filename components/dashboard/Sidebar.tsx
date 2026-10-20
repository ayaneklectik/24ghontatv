'use client';
import { useState, type ComponentType } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Lucide from 'lucide-react';

type SidebarIcon = ComponentType<{ size?: number; className?: string }>;

const iconMap: Record<string, SidebarIcon> = {
  LayoutDashboard: Lucide.LayoutDashboard,
  FilePlus: Lucide.FilePlus,
  FileText: Lucide.FileText,
  Trash2: Lucide.Trash2,
  ListTree: Lucide.ListTree,
  Trophy: Lucide.Trophy,
  Clock: Lucide.Clock,
  TrendingUp: Lucide.TrendingUp,
  AlertCircle: Lucide.AlertCircle,
  Star: Lucide.Star,
  Users: Lucide.Users,
  PenTool: Lucide.PenTool,
  Megaphone: Lucide.Megaphone,
  Layout: Lucide.Layout,
  Heading: Lucide.Heading,
  PanelBottom: Lucide.PanelBottom,
  Share2: Lucide.Share2,
  Video: Lucide.Video,
  Image: Lucide.Image,
  Mail: Lucide.Mail,
  UserCog: Lucide.UserCog,
  Settings: Lucide.Settings,
};

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
    { label: 'Add new News', href: '/admin/posts/new', icon: 'FilePlus' },
    { label: 'Manage All News', href: '/admin/posts', icon: 'FileText' },
    { label: 'Drafts/Trash', href: '/admin/posts/drafts', icon: 'Trash2' }, // New
    { label: 'News Category', href: '/admin/categories', icon: 'ListTree' },
    { label: 'Top 5 News', href: '/admin/top-news', icon: 'Trophy' },
    { label: 'Recent News', href: '/admin/recent', icon: 'Clock' },
    { label: 'Popular News', href: '/admin/popular', icon: 'TrendingUp' },
    { label: 'Breaking News', href: '/admin/breaking', icon: 'AlertCircle' },
    { label: 'Special Section', href: '/admin/special', icon: 'Star' },
    { label: 'Editors', href: '/admin/editors', icon: 'Users' },
    { label: 'Special Writings', href: '/admin/writings', icon: 'PenTool' },
    { label: 'Advertisements', href: '/admin/ads', icon: 'Megaphone' }, // New
    { label: 'Page Layout', href: '/admin/layout', icon: 'Layout' },
    { label: 'Header', href: '/admin/header', icon: 'Heading' },
    { label: 'Footer', href: '/admin/footer', icon: 'PanelBottom' },
    { label: 'Social Media', href: '/admin/social', icon: 'Share2' },
    { label: 'Social Card Studio', href: '/admin/social-card-studio', icon: 'Image' },
    { label: 'Videos', href: '/admin/videos', icon: 'Video' },
    { label: 'Gallery', href: '/admin/gallery', icon: 'Image' },
    { label: 'Newsletter', href: '/admin/newsletter', icon: 'Mail' }, // New
    { label: 'User Management', href: '/admin/users', icon: 'UserCog' },
    { label: 'Site Settings', href: '/admin/settings', icon: 'Settings' }, // New
  ];

  return (
    <div 
      className={`h-screen flex-shrink-0 transition-all duration-300 flex flex-col relative ${isCollapsed ? 'w-20' : 'w-64'}`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
    >
      <div className="p-6 border-b border-black/10 flex justify-center items-center">
        <Image src="/logo.png" alt="Logo" width={isCollapsed ? 40 : 120} height={40} className="object-contain" />
      </div>

      <nav className="flex-grow py-2 overflow-y-auto scrollbar-none">
        {navItems.map((item, index) => {
          const IconComponent = iconMap[item.icon] ?? Lucide.CircleHelp;
          const isActive = pathname === item.href;

          return (
            <div key={item.label}>
              <Link 
                href={item.href} 
                className={`flex items-center gap-3 px-6 py-3 transition-colors whitespace-nowrap font-medium text-sm ${
                  isActive 
                    ? 'bg-red-600 text-white' 
                    : 'text-black/70 hover:bg-black/5'
                }`}
              >
                <IconComponent size={18} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
              {index < navItems.length - 1 && (
                <div className="mx-6 border-b border-black/5" style={{ borderWidth: '0.25px' }} />
              )}
            </div>
          );
        })}
      </nav>

      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-red-600 text-white border-2 border-white p-1.5 rounded-full shadow-md transition-all duration-300 hover:bg-white hover:text-red-600 hover:border-red-600 z-10"
      >
        <Lucide.ChevronLeft 
          size={16} 
          className={`${isCollapsed ? 'rotate-180' : ''} transition-transform duration-300`} 
        />
      </button>
    </div>
  );
}