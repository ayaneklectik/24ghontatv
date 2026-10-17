'use client';

import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import { Download, Minus, Plus, RotateCcw, X } from 'lucide-react';

export default function ArticleImagePreview({ children }: { children: ReactNode }) {
  const [image, setImage] = useState<{ src: string; alt: string } | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!image) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setImage(null);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [image]);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLImageElement)) return;
    const src = target.currentSrc || target.src;
    if (!src) return;
    event.preventDefault();
    event.stopPropagation();
    setZoom(1);
    setImage({ src, alt: target.alt || 'সংবাদের ছবি' });
  };

  return (
    <>
      <div className="contents" onClick={handleClick}>
        {children}
      </div>
      {image && (
        <div
          className="fixed inset-0 z-[200] flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label="ছবির প্রিভিউ"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setImage(null);
          }}
        >
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/15 px-4 py-3 text-white">
            <p className="min-w-0 truncate text-sm">{image.alt}</p>
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" onClick={() => setZoom((value) => Math.max(0.5, Number((value - 0.25).toFixed(2))))} disabled={zoom <= 0.5} className="rounded p-2 hover:bg-white/15 disabled:opacity-40" aria-label="ছোট করুন" title="ছোট করুন"><Minus className="h-5 w-5" /></button>
              <span className="min-w-12 text-center text-xs tabular-nums">{Math.round(zoom * 100)}%</span>
              <button type="button" onClick={() => setZoom((value) => Math.min(3, Number((value + 0.25).toFixed(2))))} disabled={zoom >= 3} className="rounded p-2 hover:bg-white/15 disabled:opacity-40" aria-label="বড় করুন" title="বড় করুন"><Plus className="h-5 w-5" /></button>
              <button type="button" onClick={() => setZoom(1)} className="rounded p-2 hover:bg-white/15" aria-label="আসল আকারে ফিরুন" title="আসল আকার"><RotateCcw className="h-5 w-5" /></button>
              <a href={image.src} download target="_blank" rel="noreferrer" className="rounded p-2 hover:bg-white/15" aria-label="ছবি ডাউনলোড করুন" title="ছবি ডাউনলোড করুন"><Download className="h-5 w-5" /></a>
              <button type="button" onClick={() => setImage(null)} className="rounded p-2 hover:bg-white/15" aria-label="ছবির প্রিভিউ বন্ধ করুন" title="বন্ধ করুন"><X className="h-6 w-6" /></button>
            </div>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-4 sm:p-8">
            <img
              src={image.src}
              alt={image.alt}
              draggable={false}
              className="max-h-full max-w-full select-none object-contain transition-transform duration-150"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            />
          </div>
          <p className="shrink-0 px-4 pb-3 text-center text-xs text-white/65">বড় বা ছোট করতে + / − চাপুন · বন্ধ করতে Esc চাপুন</p>
        </div>
      )}
    </>
  );
}
