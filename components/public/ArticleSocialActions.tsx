'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Copy, ExternalLink, X } from 'lucide-react';
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

type ShareNetwork = 'facebook' | 'whatsapp' | 'x' | 'instagram';

export default function ArticleSocialActions({
  title,
  description,
  imageUrl,
}: {
  title: string;
  description: string;
  imageUrl?: string | null;
}) {
  const social = useContext(PublicSocialContext);
  const [message, setMessage] = useState('');
  const [shareError, setShareError] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pendingNetwork, setPendingNetwork] = useState<ShareNetwork | null>(null);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (!previewOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPreviewOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [previewOpen]);

  const copyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setMessage('লিংক কপি হয়েছে');
      setShareError(false);
    } catch {
      const input = document.createElement('textarea');
      input.value = url;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      let copied = false;
      try {
        copied = document.execCommand('copy');
      } catch {
        copied = false;
      } finally {
        input.remove();
      }
      setMessage(copied ? 'লিংক কপি হয়েছে' : 'লিংক কপি করা যায়নি।');
      setShareError(!copied);
    }
  };

  const shareUrl = encodeURIComponent(currentUrl);
  const shareTitle = encodeURIComponent(title);
  const instagram = social.instagram || 'https://www.instagram.com/';

  const openSharePreview = (network: ShareNetwork) => {
    setPendingNetwork(network);
    setPreviewOpen(true);
  };

  const shareFromPreview = () => {
    if (!pendingNetwork || !currentUrl) return;

    if (pendingNetwork === 'instagram') {
      window.open(instagram, '_blank', 'noopener,noreferrer');
      void copyLink();
      setPreviewOpen(false);
      return;
    }

    const targets: Record<ShareNetwork, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      whatsapp: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
      x: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
      instagram,
    };
    const popup = window.open(
      targets[pendingNetwork],
      'article-share',
      'popup,width=680,height=620',
    );

    if (!popup) {
      setMessage('শেয়ার উইন্ডো খোলা যায়নি। ব্রাউজারের পপ-আপ অনুমতি দিন।');
      setShareError(true);
      return;
    }

    popup.opener = null;
    setPreviewOpen(false);
  };

  return (
    <section className="mt-5 border-b border-neutral-200 pb-5" aria-label="সংবাদ শেয়ার ও সামাজিক মাধ্যম">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-bold text-neutral-700">শেয়ার করুন</span>
        <button type="button" onClick={() => openSharePreview('whatsapp')} aria-label="WhatsApp-এ শেয়ার করুন" title="WhatsApp-এ শেয়ার করুন" className="flex h-9 items-center gap-2 rounded border border-neutral-200 px-3 text-sm font-bold text-neutral-700 transition hover:border-[#25D366] hover:text-[#128C4A]"><FaWhatsapp className="h-4 w-4" /> WhatsApp</button>
        <button type="button" onClick={() => openSharePreview('facebook')} aria-label="Facebook-এ শেয়ার করুন" title="Facebook-এ শেয়ার করুন" className="flex h-9 items-center gap-2 rounded border border-neutral-200 px-3 text-sm font-bold text-neutral-700 transition hover:border-[#1877F2] hover:text-[#1877F2]"><FaFacebookF className="h-3.5 w-3.5" /> Facebook</button>
        <button type="button" onClick={() => openSharePreview('x')} aria-label="X-এ শেয়ার করুন" title="X-এ শেয়ার করুন" className="flex h-9 items-center gap-2 rounded border border-neutral-200 px-3 text-sm font-bold text-neutral-700 transition hover:border-black hover:text-black"><FaXTwitter className="h-3.5 w-3.5" /> X</button>
        <button type="button" onClick={() => openSharePreview('instagram')} className="flex h-9 items-center gap-2 rounded border border-neutral-200 px-3 text-sm font-bold text-neutral-700 transition hover:border-[#E4405F] hover:text-[#E4405F]" aria-label="Instagram-এ শেয়ার করুন" title="প্রিভিউ দেখে লিংক কপি করুন"><FaInstagram className="h-4 w-4" /> Instagram</button>
        <button type="button" onClick={() => void copyLink()} className="flex h-9 items-center gap-2 rounded border border-neutral-200 px-3 text-sm font-bold text-neutral-700 transition hover:border-red-500 hover:text-red-600"><Copy className="h-4 w-4" /> লিংক কপি</button>
        {message && <span role={shareError ? 'alert' : 'status'} className={`text-sm ${shareError ? 'text-red-700' : 'text-green-700'}`}>{message}</span>}
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

      {previewOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPreviewOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-preview-title"
            className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <h2 id="share-preview-title" className="text-lg font-bold text-neutral-900">শেয়ার প্রিভিউ</h2>
              <button type="button" onClick={() => setPreviewOpen(false)} aria-label="প্রিভিউ বন্ধ করুন" className="rounded p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5">
              <div className="overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
                {imageUrl && !imageUrl.includes('/images/placeholder-news.svg') && (
                  <img src={imageUrl} alt="" className="max-h-64 w-full object-cover" />
                )}
                <div className="space-y-2 p-4">
                  <h3 className="line-clamp-3 text-lg font-bold text-neutral-900">{title}</h3>
                  {description && <p className="line-clamp-3 text-sm leading-relaxed text-neutral-600">{description}</p>}
                  <p className="break-all text-xs text-neutral-400">{currentUrl}</p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-neutral-500">
                সামাজিক মাধ্যম প্রিভিউ তাদের নিজস্বভাবে তৈরি করে। Facebook-এর ছবির জন্য এই নিবন্ধের প্রকাশিত Open Graph তথ্য ব্যবহার করা হবে।
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setPreviewOpen(false)} className="rounded border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">বাতিল</button>
                <button type="button" onClick={shareFromPreview} className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">
                  <ExternalLink className="h-4 w-4" /> শেয়ার করুন
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}