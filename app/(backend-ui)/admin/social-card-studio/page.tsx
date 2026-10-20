'use client';

import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';

type Layer = {
  id: string;
  kind: 'text' | 'image';
  name: string;
  text?: string;
  src?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  color: string;
  fontWeight: number;
  align: 'left' | 'center' | 'right';
  fontFamily: string;
  backgroundColor?: string;
  visible: boolean;
};

const bengaliFonts = [
  { label: 'Noto Sans Bengali — News / clean', value: '"Noto Sans Bengali", sans-serif' },
  { label: 'Noto Serif Bengali — Editorial serif', value: '"Noto Serif Bengali", serif' },
  { label: 'Hind Siliguri — Readable', value: '"Hind Siliguri", sans-serif' },
  { label: 'Anek Bangla — Modern', value: '"Anek Bangla", sans-serif' },
  { label: 'Tiro Bangla — Traditional', value: '"Tiro Bangla", serif' },
  { label: 'Baloo Da 2 — Bold display', value: '"Baloo Da 2", sans-serif' },
  { label: 'Atma — Display', value: '"Atma", cursive' },
  { label: 'Galada — Decorative', value: '"Galada", cursive' },
  { label: 'Alkatra — Handwritten display', value: '"Alkatra", cursive' },
  { label: 'Mina — Compact', value: '"Mina", sans-serif' },
  { label: 'Google Sans — Contemporary', value: '"Google Sans", sans-serif' },
  { label: 'Kalpurush — Local font', value: '"Kalpurush", sans-serif' },
  { label: 'SolaimanLipi — Legacy fallback', value: '"SolaimanLipi", "Kalpurush", sans-serif' },
  { label: 'Siyam Rupali — Legacy fallback', value: '"Siyam Rupali", "Kalpurush", sans-serif' },
  { label: 'AdorshoLipi — Legacy fallback', value: '"AdorshoLipi", "Kalpurush", sans-serif' },
];

const initialLayers: Layer[] = [
  { id: 'masthead', kind: 'text', name: '24 Ghonta masthead', text: '২৪ঘণ্টা টিভি  |  সংবাদ', x: 4, y: 3, width: 55, height: 7, fontSize: 23, color: '#ffffff', fontWeight: 800, align: 'left', fontFamily: '"Noto Sans Bengali", sans-serif', backgroundColor: '#c82027', visible: true },
  { id: 'date', kind: 'text', name: 'Date', text: '২০ অক্টোবর ২০২৬', x: 64, y: 3, width: 32, height: 6, fontSize: 15, color: '#333333', fontWeight: 500, align: 'right', fontFamily: '"Hind Siliguri", sans-serif', visible: true },
  { id: 'category', kind: 'text', name: 'News category', text: 'জাতীয়  •  সর্বশেষ', x: 5, y: 12, width: 90, height: 5, fontSize: 17, color: '#c82027', fontWeight: 700, align: 'left', fontFamily: '"Hind Siliguri", sans-serif', visible: true },
  { id: 'headline-red', kind: 'text', name: 'Main headline', text: 'আপনার সংবাদের শিরোনাম এখানে', x: 5, y: 18, width: 90, height: 13, fontSize: 36, color: '#171717', fontWeight: 800, align: 'left', fontFamily: '"Noto Sans Bengali", sans-serif', visible: true },
  { id: 'headline-black', kind: 'text', name: 'Secondary headline', text: 'গুরুত্বপূর্ণ তথ্য বা সংক্ষিপ্ত উপশিরোনাম', x: 5, y: 30, width: 90, height: 7, fontSize: 22, color: '#444444', fontWeight: 500, align: 'left', fontFamily: '"Hind Siliguri", sans-serif', visible: true },
  { id: 'main-photo', kind: 'image', name: 'Main photo', src: '', x: 5, y: 39, width: 90, height: 45, fontSize: 16, color: '#111111', fontWeight: 500, align: 'center', fontFamily: '"Noto Sans Bengali", sans-serif', visible: true },
  { id: 'footer-rule', kind: 'text', name: 'Footer brand strip', text: '২৪ঘণ্টা টিভি  •  খবরের নতুন বাতায়ন', x: 4, y: 87, width: 92, height: 8, fontSize: 20, color: '#ffffff', fontWeight: 700, align: 'center', fontFamily: '"Noto Sans Bengali", sans-serif', backgroundColor: '#c82027', visible: true },
];

const newId = () => `layer-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const exportSafeImageSrc = (src: string) => {
  if (!src || src.startsWith('data:') || src.startsWith('blob:')) return src;
  try {
    const url = new URL(src, typeof window !== 'undefined' ? window.location.origin : 'https://www.24ghontatv.com');
    if (url.protocol === 'https:' && ['api.24ghontatv.com', '24ghontatv.com', 'www.24ghontatv.com'].includes(url.hostname)) {
      return `/api/social-card-image?url=${encodeURIComponent(url.toString())}`;
    }
  } catch {
    // Keep unsupported image sources unchanged; export will surface a useful error.
  }
  return src;
};

export default function SocialCardStudioPage() {
  const [layers, setLayers] = useState<Layer[]>(initialLayers);
  const [selectedId, setSelectedId] = useState('headline-black');
  const [background, setBackground] = useState('#ffffff');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [cardSize, setCardSize] = useState(1080);
  const [templateName, setTemplateName] = useState('24 Ghonta default');
  const [savedTemplates, setSavedTemplates] = useState<{ name: string; layers: Layer[]; background: string; backgroundImage: string; cardSize: number }[]>([]);
  const [notice, setNotice] = useState('');
  const [activeTab, setActiveTab] = useState<'quick' | 'design'>('quick');
  const [zoom, setZoom] = useState(100);
  const [isExporting, setIsExporting] = useState(false);
  const [dragging, setDragging] = useState<{ id: string; mode: 'move' | 'resize'; startX: number; startY: number; x: number; y: number; width: number; height: number } | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});
  const loadedArticleRef = useRef('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('articleId');
    if (!articleId || loadedArticleRef.current === articleId) return;
    loadedArticleRef.current = articleId;

    const title = params.get('title') ?? '';
    const image = params.get('image') ?? '';
    const dateValue = params.get('date') ?? '';
    const formattedDate = dateValue
      ? new Date(dateValue).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Dhaka' })
      : '';

    setLayers((current) => current.map((layer) => {
      if (layer.id === 'headline-red') return { ...layer, text: title, name: 'Article headline' };
      if (layer.id === 'headline-black') return { ...layer, text: '', visible: false, name: 'Extra headline line' };
      if (layer.id === 'main-photo') return { ...layer, src: image, name: 'Article featured image' };
      if (layer.id === 'date' && formattedDate) return { ...layer, text: formattedDate };
      return layer;
    }));
    setSelectedId(image ? 'main-photo' : 'headline-red');
    setNotice(image
      ? 'Article loaded. Review the headline and image, then edit the card and download the PNG.'
      : 'Article headline loaded. This article has no featured image, so add one before exporting.');
  }, []);

  const selected = layers.find((layer) => layer.id === selectedId) ?? layers[0];

  useEffect(() => {
    try {
      const raw = localStorage.getItem('24ghontatv-social-card-templates');
      if (raw) setSavedTemplates(JSON.parse(raw));
    } catch {
      // Ignore invalid locally saved template data.
    }
  }, []);

  const updateLayer = (id: string, patch: Partial<Layer>) => {
    setLayers((current) => current.map((layer) => layer.id === id ? { ...layer, ...patch } : layer));
  };

  const readImage = (file: File, callback: (src: string) => void) => {
    if (!file.type.startsWith('image/')) {
      setNotice('Please choose an image file (PNG, JPG, or WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') callback(reader.result);
    };
    reader.onerror = () => setNotice('The image could not be read.');
    reader.readAsDataURL(file);
  };

  const addText = () => {
    const layer: Layer = { id: newId(), kind: 'text', name: 'New text', text: 'নতুন লেখা', x: 20, y: 40, width: 60, height: 10, fontSize: 24, color: '#222222', fontWeight: 700, align: 'center', fontFamily: 'Arial, sans-serif', visible: true };
    setLayers((current) => [...current, layer]);
    setSelectedId(layer.id);
  };

  const addHeadline = () => {
    const source = selected?.kind === 'text' ? selected : layers.find((layer) => layer.id === 'headline-red');
    const layer: Layer = {
      id: newId(),
      kind: 'text',
      name: 'New headline',
      text: 'নতুন শিরোনাম',
      x: 10,
      y: 30,
      width: 80,
      height: 10,
      fontSize: source?.fontSize ?? 28,
      color: source?.color ?? '#151515',
      fontWeight: source?.fontWeight ?? 800,
      align: source?.align ?? 'center',
      fontFamily: source?.fontFamily ?? 'Arial, sans-serif',
      visible: true,
    };
    setLayers((current) => [...current, layer]);
    setSelectedId(layer.id);
    setNotice('New headline added. Edit its text and drag it into position.');
  };

  const addImage = () => {
    const layer: Layer = { id: newId(), kind: 'image', name: 'New PNG/image', src: '', x: 35, y: 35, width: 25, height: 18, fontSize: 16, color: '#111111', fontWeight: 500, align: 'center', fontFamily: 'Arial, sans-serif', visible: true };
    setLayers((current) => [...current, layer]);
    setSelectedId(layer.id);
    window.setTimeout(() => fileInputs.current[layer.id]?.click(), 0);
  };

  const saveTemplate = () => {
    const next = [...savedTemplates.filter((item) => item.name !== templateName.trim()), { name: templateName.trim() || 'Untitled template', layers, background, backgroundImage, cardSize }];
    setSavedTemplates(next);
    localStorage.setItem('24ghontatv-social-card-templates', JSON.stringify(next));
    setNotice('Template saved in this browser.');
  };

  const loadTemplate = (name: string) => {
    const template = savedTemplates.find((item) => item.name === name);
    if (!template) return;
    setTemplateName(template.name);
    setLayers(template.layers);
    setBackground(template.background);
    setBackgroundImage(template.backgroundImage);
    setCardSize(template.cardSize);
    setSelectedId(template.layers[0]?.id ?? '');
    setNotice(`Loaded “${template.name}”.`);
  };

  const exportPng = async () => {
    const preview = previewRef.current;
    if (!preview || isExporting) return;

    setNotice('Preparing your PNG…');
    setIsExporting(true);
    try {
      // Capture the actual preview after React removes editor-only controls.
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      await document.fonts.ready;
      const node = previewRef.current;
      if (!node) throw new Error('Preview is unavailable');

      const bounds = node.getBoundingClientRect();
      const sourceWidth = Math.max(1, Math.round(bounds.width));
      const sourceHeight = Math.max(1, Math.round(bounds.height));
      const dataUrl = await toPng(node, {
        pixelRatio: cardSize / sourceWidth,
        cacheBust: true,
        width: sourceWidth,
        height: sourceHeight,
        backgroundColor: background,
        filter: (element) => !(element instanceof HTMLElement && element.hasAttribute('data-editor-ui')),
      });

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = '24ghontatv-social-card.png';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setNotice('PNG downloaded from the live preview.');
    } catch (error) {
      console.error('Social card PNG export failed:', error);
      // html-to-image can reject with a string or a plain object, not always an Error.
      const detail = error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : error && typeof error === 'object' && 'message' in error
            ? String((error as { message?: unknown }).message)
            : (() => {
                try { return JSON.stringify(error); } catch { return String(error); }
              })();
      const reason = detail && detail !== '{}' ? detail : Object.prototype.toString.call(error);
      setNotice(`PNG export failed: ${reason.slice(0, 180)}`);
    } finally {
      setIsExporting(false);
    }
  };

  const startDrag = (event: React.PointerEvent<HTMLDivElement>, layer: Layer) => {
    if ((event.target as HTMLElement).closest('[data-editor-ui]')) return;
    event.preventDefault();
    setSelectedId(layer.id);
    setDragging({ id: layer.id, mode: 'move', startX: event.clientX, startY: event.clientY, x: layer.x, y: layer.y, width: layer.width, height: layer.height });
    previewRef.current?.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || !previewRef.current) return;
    const bounds = previewRef.current.getBoundingClientRect();
    const dx = ((event.clientX - dragging.startX) / bounds.width) * 100;
    const dy = ((event.clientY - dragging.startY) / bounds.height) * 100;
    if (dragging.mode === 'resize') {
      updateLayer(dragging.id, { width: Math.max(3, Math.min(100 - dragging.x, dragging.width + dx)), height: Math.max(3, Math.min(100 - dragging.y, dragging.height + dy)) });
    } else {
      updateLayer(dragging.id, { x: Math.max(0, Math.min(100 - dragging.width, dragging.x + dx)), y: Math.max(0, Math.min(100 - dragging.height, dragging.y + dy)) });
    }
  };

  const startResize = (event: React.PointerEvent<HTMLButtonElement>, layer: Layer) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedId(layer.id);
    setDragging({ id: layer.id, mode: 'resize', startX: event.clientX, startY: event.clientY, x: layer.x, y: layer.y, width: layer.width, height: layer.height });
    previewRef.current?.setPointerCapture(event.pointerId);
  };

  const finishDrag = () => setDragging(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[1700px] flex-wrap items-center gap-3">
          <div className="mr-auto flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 font-black text-white">২৪</div><div><h1 className="text-base font-bold">Social Card Studio</h1><p className="text-xs text-slate-500">Create a post in under 30 seconds</p></div></div>
          <select aria-label="Choose template" value={savedTemplates.some((item) => item.name === templateName) ? templateName : ''} onChange={(e) => loadTemplate(e.target.value)} className="h-10 max-w-52 rounded-lg border border-slate-300 bg-white px-3 text-sm">
            <option value="">Current design</option>{savedTemplates.map((template) => <option key={template.name} value={template.name}>{template.name}</option>)}
          </select>
          <button onClick={saveTemplate} className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold hover:bg-slate-50">▣ Save</button>
          <details className="relative"><summary aria-label="More actions" title="More actions" className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-300 text-xl hover:bg-slate-50">…</summary><div className="absolute right-0 top-12 z-40 w-56 rounded-xl border bg-white p-2 shadow-xl">
            <label className="block px-2 pt-2 text-xs font-semibold text-slate-500">Template name</label><input value={templateName} onChange={(e) => setTemplateName(e.target.value)} className="m-2 w-[calc(100%-1rem)] rounded-lg border px-3 py-2 text-sm" />
            <button onClick={saveTemplate} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50">Save current template</button>
            <button onClick={addText} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50">＋ Add text</button>
            <button onClick={addImage} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50">＋ Add image / logo</button>
            <button onClick={() => { setLayers(initialLayers); setSelectedId('headline-black'); setBackground('#ffffff'); setBackgroundImage(''); setNotice('Default card layout restored.'); }} className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50">Reset card layout</button>
          </div></details>
          <button onClick={exportPng} disabled={isExporting} className="h-10 rounded-lg bg-red-600 px-4 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60">{isExporting ? 'Preparing PNG…' : '↓ Download PNG'}</button>
        </div>
      </header>
      {notice && <div role="status" className="fixed right-4 top-20 z-50 flex max-w-md gap-3 rounded-xl border bg-white px-4 py-3 text-sm shadow-lg"><span className="flex-1">{notice}</span><button aria-label="Dismiss notification" onClick={() => setNotice('')} className="font-bold text-slate-400">×</button></div>}
      <main className="mx-auto grid max-w-[1700px] grid-cols-1 items-start gap-4 p-3 sm:p-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-6">
        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between"><div><h2 className="text-sm font-semibold">Canvas</h2><p className="text-xs text-slate-500">Select an element to edit</p></div><div className="flex items-center gap-1 rounded-lg border bg-white p-1"><button aria-label="Zoom out" onClick={() => setZoom((v) => Math.max(50, v - 10))} className="h-8 w-8 rounded hover:bg-slate-100">−</button><span className="w-10 text-center text-xs">{zoom}%</span><button aria-label="Zoom in" onClick={() => setZoom((v) => Math.min(130, v + 10))} className="h-8 w-8 rounded hover:bg-slate-100">＋</button><button onClick={() => setZoom(100)} className="rounded px-2 py-1 text-xs font-semibold hover:bg-slate-100">Fit</button></div></div>
          <div className="flex min-h-[380px] items-center justify-center overflow-auto rounded-2xl border bg-slate-200 p-3 sm:p-5 lg:min-h-[calc(100vh-150px)]"><div className="w-full max-w-[760px]" style={{ width: zoom + '%' }}>
            <div ref={previewRef} onPointerMove={moveDrag} onPointerUp={finishDrag} onPointerCancel={finishDrag} className="relative aspect-square w-full overflow-hidden bg-white shadow-xl" style={{ backgroundColor: background, backgroundImage: backgroundImage ? 'url("' + backgroundImage + '")' : 'radial-gradient(#0000000c 0.7px, transparent 0.7px), linear-gradient(135deg, #f0efed, #deddd9)', backgroundSize: backgroundImage ? 'cover' : '5px 5px, 100% 100%', backgroundPosition: 'center' }}>
              {layers.filter((layer) => layer.visible).map((layer) => <div key={layer.id} data-card-layer={layer.id} onPointerDown={(event) => startDrag(event, layer)} onClick={() => { setSelectedId(layer.id); if (layer.kind === 'image' && !layer.src) window.setTimeout(() => fileInputs.current[layer.id]?.click(), 0); if (layer.kind === 'text') setActiveTab('quick'); }} className={'absolute ' + (!isExporting && selectedId === layer.id ? 'ring-2 ring-blue-500 ring-offset-1' : !isExporting ? 'hover:ring-1 hover:ring-blue-300' : '')} style={{ left: layer.x + '%', top: layer.y + '%', width: layer.width + '%', height: layer.height + '%', cursor: dragging?.id === layer.id ? 'grabbing' : 'grab' }}>
                {layer.kind === 'image' ? (layer.src ? <img src={exportSafeImageSrc(layer.src)} alt={layer.name} draggable={false} crossOrigin="anonymous" className="h-full w-full object-cover" /> : <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setSelectedId(layer.id); setActiveTab('quick'); window.setTimeout(() => fileInputs.current[layer.id]?.click(), 0); }} className="flex h-full w-full flex-col items-center justify-center border-2 border-dashed border-slate-400 bg-white/70 p-3 text-center text-sm font-medium">＋<span>Drop a photo here or click to upload</span></button>) : <div className="flex h-full w-full items-center whitespace-pre-line break-words" style={{ fontFamily: layer.fontFamily, fontSize: 'clamp(6px, ' + (layer.fontSize / 10) + 'cqw, 80px)', lineHeight: 1.25, color: layer.color, fontWeight: layer.fontWeight, backgroundColor: layer.backgroundColor ?? 'transparent', padding: layer.backgroundColor ? '0.35em 0.55em' : 0, textAlign: layer.align, justifyContent: layer.align === 'left' ? 'flex-start' : layer.align === 'right' ? 'flex-end' : 'center' }}>{layer.text}</div>}
                {!isExporting && selectedId === layer.id && layer.kind === 'image' && <button type="button" data-editor-ui onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); fileInputs.current[layer.id]?.click(); }} className="absolute left-1 top-1 rounded bg-slate-900/90 px-2 py-1 text-xs font-semibold text-white">Replace image</button>}
                {!isExporting && selectedId === layer.id && <button type="button" data-editor-ui onPointerDown={(e) => startResize(e, layer)} aria-label={'Resize ' + layer.name} title="Drag to resize" className="absolute bottom-0 right-0 h-5 w-5 cursor-nwse-resize rounded-tl-md border-2 border-white bg-blue-600 shadow" />}
              </div>)}
              {!isExporting && <div data-editor-ui className="pointer-events-none absolute bottom-2 right-2 rounded bg-white/80 px-2 py-1 text-[10px] text-slate-500">EDITOR PREVIEW</div>}
            </div>
          </div></div>
        </section>
        <aside className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-2 border-b p-1.5"><button onClick={() => setActiveTab('quick')} className={'rounded-lg px-3 py-2.5 text-sm font-semibold ' + (activeTab === 'quick' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100')}>Quick edit</button><button onClick={() => setActiveTab('design')} className={'rounded-lg px-3 py-2.5 text-sm font-semibold ' + (activeTab === 'design' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100')}>Design</button></div>
          {activeTab === 'quick' ? <div className="space-y-5 p-4">
            <div><label htmlFor="quick-headline-red" className="mb-2 flex items-center gap-2 text-sm font-semibold"><span className="h-2.5 w-2.5 rounded-full bg-[#E30613]" />Headline line 1 <span className="font-normal text-slate-500">Red</span></label><textarea id="quick-headline-red" value={layers.find((l) => l.id === 'headline-red')?.text ?? ''} onChange={(e) => { const l = layers.find((item) => item.id === 'headline-red'); if (l) updateLayer(l.id, { text: e.target.value, visible: true }); }} rows={2} placeholder="Type the first headline…" className="w-full rounded-xl border border-slate-300 px-3 py-3 text-base leading-relaxed focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100" /></div>
            <div><label htmlFor="quick-headline-black" className="mb-2 flex items-center gap-2 text-sm font-semibold"><span className="h-2.5 w-2.5 rounded-full bg-[#111111]" />Headline line 2 <span className="font-normal text-slate-500">Black</span></label><textarea id="quick-headline-black" value={layers.find((l) => l.id === 'headline-black')?.text ?? ''} onChange={(e) => { const l = layers.find((item) => item.id === 'headline-black'); if (l) updateLayer(l.id, { text: e.target.value, visible: true }); }} rows={2} placeholder="Type the second headline…" className="w-full rounded-xl border border-slate-300 px-3 py-3 text-base leading-relaxed focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100" /></div>
            <div><label htmlFor="quick-date" className="mb-2 block text-sm font-semibold">Date</label><input id="quick-date" value={layers.find((l) => l.id === 'date')?.text ?? ''} onChange={(e) => { const l = layers.find((item) => item.id === 'date'); if (l) updateLayer(l.id, { text: e.target.value, visible: true }); }} placeholder="দিন মাস বছর" className="h-11 w-full rounded-xl border border-slate-300 px-3 text-base focus:border-red-500 focus:outline-none" /></div>
            <div><div className="mb-2 flex items-center justify-between"><span className="text-sm font-semibold">Photo</span><span className="text-xs text-slate-500">{layers.find((l) => l.id === 'main-photo')?.src ? 'Photo added' : 'No photo yet'}</span></div>{(() => { const photo = layers.find((l) => l.id === 'main-photo'); return photo ? <><input ref={(el) => { fileInputs.current[photo.id] = el; }} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) readImage(f, (src) => { updateLayer(photo.id, { src }); setNotice('Photo updated.'); }); e.currentTarget.value = ''; }} className="sr-only" /><button onClick={() => fileInputs.current[photo.id]?.click()} className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm font-semibold hover:bg-red-50">{photo.src ? '↑ Replace photo' : '↑ Upload photo'}</button><label className="mt-4 block text-sm font-medium">Photo zoom<input type="range" min={100} max={300} defaultValue={100} onChange={(e) => { const node = document.querySelector('[data-card-layer="' + photo.id + '"] img') as HTMLImageElement | null; if (node) node.style.transform = 'scale(' + (Number(e.target.value) / 100) + ')'; }} className="mt-3 w-full accent-red-600" /></label></> : <p className="text-sm text-slate-500">No photo layer available. Add one in Design.</p>; })()}</div>
            <button onClick={exportPng} disabled={isExporting} className="w-full rounded-xl bg-red-600 px-4 py-3 text-base font-bold text-white hover:bg-red-700 disabled:opacity-60">↓ {isExporting ? 'Preparing PNG…' : 'Download PNG'}</button>
          </div> : <div className="divide-y divide-slate-200">
            <details open><summary className="cursor-pointer list-none px-4 py-3.5 text-sm font-bold">Layers <span className="float-right text-xs font-normal text-slate-500">{layers.length} items</span></summary><div className="max-h-64 space-y-1 overflow-y-auto px-3 pb-3">{layers.map((layer) => <div key={layer.id} className={'flex items-center gap-2 rounded-lg px-2 py-1.5 ' + (selectedId === layer.id ? 'bg-red-50' : 'hover:bg-slate-50')}><button onClick={() => updateLayer(layer.id, { visible: !layer.visible })} title={layer.visible ? 'Hide layer' : 'Show layer'} aria-label={(layer.visible ? 'Hide ' : 'Show ') + layer.name} className="h-8 w-8">{layer.visible ? '◉' : '○'}</button><button onClick={() => setSelectedId(layer.id)} className="min-w-0 flex-1 truncate py-1 text-left text-sm font-medium">{layer.name}</button><span className="text-[10px] uppercase text-slate-500">{layer.kind}</span></div>)}</div></details>
            <details open><summary className="cursor-pointer list-none px-4 py-3.5 text-sm font-bold">Selected item</summary><div className="space-y-3 px-4 pb-4">{!selected ? <p className="text-sm text-slate-500">Select an element.</p> : <>{selected.kind === 'text' ? <><label className="block text-xs font-semibold">Text<input value={selected.text ?? ''} onChange={(e) => updateLayer(selected.id, { text: e.target.value })} className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm font-normal" /></label><label className="block text-xs font-semibold">Font family<select value={selected.fontFamily} onChange={(e) => updateLayer(selected.id, { fontFamily: e.target.value })} className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm font-normal">{bengaliFonts.map((font) => <option key={font.value} value={font.value}>{font.label}</option>)}</select></label><div className="grid grid-cols-2 gap-3"><label className="text-xs font-semibold">Font size<input type="number" value={selected.fontSize} onChange={(e) => updateLayer(selected.id, { fontSize: Number(e.target.value) })} className="mt-1 w-full rounded-lg border px-2 py-2 text-sm font-normal" /></label><label className="text-xs font-semibold">Weight<select value={selected.fontWeight} onChange={(e) => updateLayer(selected.id, { fontWeight: Number(e.target.value) })} className="mt-1 w-full rounded-lg border px-2 py-2 text-sm font-normal"><option value={400}>Regular</option><option value={500}>Medium</option><option value={600}>Semi-bold</option><option value={700}>Bold</option><option value={800}>Extra bold</option><option value={900}>Black</option></select></label></div><div><span className="mb-2 block text-xs font-semibold">Text color</span><div className="flex gap-2">{['#E30613', '#111111', '#ffffff'].map((color) => <button key={color} onClick={() => updateLayer(selected.id, { color })} aria-label={'Set color ' + color} className="h-8 w-8 rounded-full border border-slate-300" style={{ backgroundColor: color }} />)}<input type="color" value={selected.color} onChange={(e) => updateLayer(selected.id, { color: e.target.value })} className="h-8 w-10 rounded border p-1" /></div></div><label className="block text-xs font-semibold">Alignment<select value={selected.align} onChange={(e) => updateLayer(selected.id, { align: e.target.value as Layer['align'] })} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-normal"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></label></> : <><input ref={(el) => { fileInputs.current[selected.id] = el; }} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) readImage(f, (src) => updateLayer(selected.id, { src })); e.currentTarget.value = ''; }} className="block w-full text-xs" /><p className="text-xs text-slate-500">Choose a replacement image.</p></>}<div className="grid grid-cols-2 gap-2">{(['x', 'y', 'width', 'height'] as const).map((field) => <label key={field} className="text-xs font-semibold">{field === 'x' ? 'X (%)' : field === 'y' ? 'Y (%)' : field === 'width' ? 'Width (%)' : 'Height (%)'}<input type="number" value={selected[field]} onChange={(e) => updateLayer(selected.id, { [field]: Number(e.target.value) })} className="mt-1 w-full rounded-lg border px-2 py-2 text-sm font-normal" /></label>)}</div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selected.visible} onChange={(e) => updateLayer(selected.id, { visible: e.target.checked })} />Visible</label><button onClick={() => { setLayers((current) => current.filter((l) => l.id !== selected.id)); setSelectedId(layers.find((l) => l.id !== selected.id)?.id ?? ''); }} className="w-full rounded-lg border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50">Delete selected item</button></>}</div></details>
            <details><summary className="cursor-pointer list-none px-4 py-3.5 text-sm font-bold">Background</summary><div className="space-y-3 px-4 pb-4"><label className="block text-xs font-semibold">Background color<input type="color" value={background} onChange={(e) => setBackground(e.target.value)} className="mt-1.5 block h-10 w-full rounded-lg border p-1" /></label><label className="block text-xs font-semibold">Texture / image<input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) readImage(f, setBackgroundImage); e.currentTarget.value = ''; }} className="mt-1.5 block w-full text-xs" /></label>{backgroundImage && <button onClick={() => setBackgroundImage('')} className="text-sm font-semibold text-red-700">Remove texture</button>}</div></details>
            <details><summary className="cursor-pointer list-none px-4 py-3.5 text-sm font-bold">Add element</summary><div className="grid grid-cols-2 gap-2 px-4 pb-4"><button onClick={addText} className="rounded-lg border px-3 py-2.5 text-sm font-semibold hover:bg-slate-50">＋ Text</button><button onClick={addImage} className="rounded-lg border px-3 py-2.5 text-sm font-semibold hover:bg-slate-50">＋ Image / logo</button></div></details>
          </div>}
        </aside>
      </main>
    </div>
  );}
