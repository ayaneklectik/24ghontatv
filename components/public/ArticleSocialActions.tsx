'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Copy, ExternalLink } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import type { PublicSiteData } from '@/types/public';

type SocialLinks = NonNullable<PublicSiteData['social_media']>;

const PublicSocialContext = createContext<SocialLinks>({});

export function PublicSocialProvider({
  social,
  children,
}: {
  social: SocialLinks;
  children: React.ReactNode;
}) {
  return <PublicSocialContext.Provider value={social}>{children}</PublicSocialContext.Provider>;
}

const followItems = [
  { key: 'facebook', label: 'Facebook', icon: FaFacebookF, className: 'bg-[#1877F2]' },
  { key: 'youtube', label: 'YouTube', icon: FaYoutube, className: 'bg-[#FF0000]' },
  { key: 'twitter', label: 'X', icon: FaXTwitter, className: 'bg-black' },
  { key: 'instagram', label: 'Instagram', icon: FaInstagram, className: 'bg-[#E4405F]' },
] as const;

export default function ArticleSocialActions({ title }: { title: string }) {
  const social = useContext(PublicSocialContext);
  const [message, setMessage] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const copyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement('textarea');
      input.value = url;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
    }
    setMessage('লিংক কপি হয়েছে');
  };

  const shareUrl = encodeURIComponent(currentUrl);
  const shareTitle = encodeURIComponent(title);
  const instagram = social.instagram || 'https://www.instagram.com/';

  return (
    <section className="mt-5 border-b border-neutral-200 pb-5" aria-label="সংবাদ শেয়ার ও সামাজিক মাধ্যম">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-bold text-neutral-700">শেয়ার করুন</span>
        <a href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp-এ শেয়ার করুন" title="WhatsApp-এ শেয়ার করুন" className="flex h-9 items-center gap-2 rounded border border-neutral-200 px-3 text-sm font-bold text-neutral-700 transition hover:border-[#25D366] hover:text-[#128C4A]"><FaWhatsapp className="h-4 w-4" /> WhatsApp</a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook-এ শেয়ার করুন" title="Facebook-এ শেয়ার করুন" className="flex h-9 items-center gap-2 rounded border border-neutral-200 px-3 text-sm font-bold text-neutral-700 transition hover:border-[#1877F2] hover:text-[#1877F2]"><FaFacebookF className="h-3.5 w-3.5" /> Facebook</a>
        <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer" aria-label="X-এ শেয়ার করুন" title="X-এ শেয়ার করুন" className="flex h-9 items-center gap-2 rounded border border-neutral-200 px-3 text-sm font-bold text-neutral-700 transition hover:border-black hover:text-black"><FaXTwitter className="h-3.5 w-3.5" /> X</a>
        <button type="button" onClick={() => { window.open(instagram, '_blank', 'noopener,noreferrer'); void copyLink(); }} className="flex h-9 items-center gap-2 rounded border border-neutral-200 px-3 text-sm font-bold text-neutral-700 transition hover:border-[#E4405F] hover:text-[#E4405F]" aria-label="Instagram-এ শেয়ার করুন" title="লিংক কপি করে Instagram খুলুন"><FaInstagram className="h-4 w-4" /> Instagram</button>
        <button type="button" onClick={() => void copyLink()} className="flex h-9 items-center gap-2 rounded border border-neutral-200 px-3 text-sm font-bold text-neutral-700 transition hover:border-red-500 hover:text-red-600"><Copy className="h-4 w-4" /> লিংক কপি</button>
        {message && <span role="status" className="text-sm text-green-700">{message}</span>}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-bold text-neutral-700">আমাদের অনুসরণ করুন</span>
        {followItems.map(({ key, label, icon: Icon, className }) => {
          const href = social[key];
          if (!href) return null;
          return (
            <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label}-এ আমাদের অনুসরণ করুন`} title={`${label}-এ আমাদের অনুসরণ করুন`} className={`flex h-8 items-center gap-2 rounded px-3 text-sm font-bold text-white transition hover:opacity-85 ${className}`}>
              <Icon className="h-3.5 w-3.5" /> {label} <ExternalLink className="h-3 w-3" />
            </a>
          );
        })}
      </div>
    </section>
  );
}