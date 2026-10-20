'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';

type Layer = {
  id: string; name: string; kind: 'text' | 'image'; text?: string; src?: string;
  x: number; y: number; width: number; height: number; fontSize: number; color: string;
  fontWeight: number; align: 'left' | 'center' | 'right'; fontFamily: string;
  backgroundColor?: string; visible: boolean; opacity?: number; radius?: number;
  rotation?: number; letterSpacing?: number; lineHeight?: number; shadow?: boolean; locked?: boolean;
};
type Design = { name: string; category: string; bg: string; accent: string; style: number };
type SavedTemplate = { name: string; layers: Layer[]; background: string; cardSize: number };
type ArticleData = { title: string; image: string; date: string };
const FONT = '"Noto Sans Bengali", "Hind Siliguri", sans-serif';
const fonts = [
  ['Noto Sans Bengali', '"Noto Sans Bengali", sans-serif'], ['Hind Siliguri', '"Hind Siliguri", sans-serif'],
  ['Noto Serif Bengali', '"Noto Serif Bengali", serif'], ['Anek Bangla', '"Anek Bangla", sans-serif'],
  ['Tiro Bangla', '"Tiro Bangla", serif'], ['Baloo Da 2', '"Baloo Da 2", sans-serif'],
  ['Atma', '"Atma", cursive'], ['Galada', '"Galada", cursive'], ['Alkatra', '"Alkatra", cursive'],
  ['Mina', '"Mina", sans-serif'], ['Google Sans', '"Google Sans", sans-serif'],
  ['Kalpurush', '"Kalpurush", sans-serif'], ['SolaimanLipi', '"SolaimanLipi", "Kalpurush", sans-serif'],
] as const;
const designs: Design[] = [
  { name: 'Breaking News', category: 'Urgent', bg: '#111827', accent: '#ef233c', style: 0 },
  { name: 'Classic Bulletin', category: 'Editorial', bg: '#ffffff', accent: '#c82027', style: 1 },
  { name: 'Photo Focus', category: 'Photography', bg: '#101010', accent: '#ffca3a', style: 2 },
  { name: 'Split Screen', category: 'Modern', bg: '#f8fafc', accent: '#c82027', style: 3 },
  { name: 'Minimal White', category: 'Minimal', bg: '#ffffff', accent: '#111827', style: 4 },
  { name: 'Night Report', category: 'Dark', bg: '#111827', accent: '#38bdf8', style: 5 },
  { name: 'Red Alert', category: 'Urgent', bg: '#b91c1c', accent: '#ffffff', style: 6 },
  { name: 'The Daily', category: 'Editorial', bg: '#f4efe6', accent: '#1f2937', style: 7 },
  { name: 'Modern Gradient', category: 'Modern', bg: '#172554', accent: '#a5b4fc', style: 8 },
  { name: 'Quote Card', category: 'Typography', bg: '#fff7ed', accent: '#ea580c', style: 9 },
  { name: 'Social Square', category: 'Social', bg: '#fdf2f8', accent: '#be185d', style: 10 },
  { name: 'Business Desk', category: 'Business', bg: '#eff6ff', accent: '#1d4ed8', style: 11 },
  { name: 'Sports Flash', category: 'Sports', bg: '#0f172a', accent: '#84cc16', style: 12 },
  { name: 'World Report', category: 'World', bg: '#ecfeff', accent: '#0e7490', style: 13 },
  { name: 'Magazine Cover', category: 'Feature', bg: '#18181b', accent: '#fbbf24', style: 14 },
];
const id = () => 'layer-' + Math.random().toString(36).slice(2, 10);
const makeLayer = (name: string, text: string, x: number, y: number, width: number, height: number, size: number, color: string, weight = 800, bg?: string): Layer => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || id(),
  name, kind: 'text', text, x, y, width, height, fontSize: size, color, fontWeight: weight,
  align: 'left', fontFamily: FONT, backgroundColor: bg, visible: true, opacity: 1,
});
function makePreset(p: Design): Layer[] {
  const dark = ['#111827', '#101010', '#111827', '#172554', '#0f172a', '#18181b'].includes(p.bg);
  const white = dark ? '#ffffff' : '#171717';
  const title = 'আপনার সংবাদের শিরোনাম এখানে';
  const secondary = 'গুরুত্বপূর্ণ তথ্য ও সর্বশেষ আপডেট';
  const brand = makeLayer('Masthead', '২৪ঘণ্টা টিভি', 4, 3, 48, 7, 23, '#ffffff', 900, p.accent);
  const category = makeLayer('Category', 'জাতীয়  •  সর্বশেষ', 5, 13, 90, 5, 16, p.accent, 800);
  const headline = makeLayer('Headline', title, 5, 20, 90, 18, p.style === 2 ? 39 : 35, white, 900);
  const sub = makeLayer('Subheadline', secondary, 5, 39, 90, 9, 21, dark ? '#e5e7eb' : '#4b5563', 600);
  const photo: Layer = { id: 'main-photo', name: 'Main photo', kind: 'image', src: '', x: 5, y: 50, width: 90, height: 37, fontSize: 16, color: white, fontWeight: 500, align: 'center', fontFamily: FONT, visible: true, radius: 0 };
  const footer = makeLayer('Footer', '২৪ঘণ্টা টিভি  •  খবরের নতুন বাতায়ন', 4, 91, 92, 6, 15, dark ? '#d1d5db' : '#6b7280', 600);
  switch (p.style) {
    case 0: return [makeLayer('Breaking strip', 'ব্রেকিং নিউজ', 0, 0, 100, 12, 24, '#ffffff', 900, p.accent), category, headline, photo, makeLayer('Urgent footer', 'সর্বশেষ সংবাদ  •  ২৪ঘণ্টা টিভি', 0, 88, 100, 12, 18, '#ffffff', 800, '#111827')];
    case 1: return [brand, makeLayer('Date', '২০ অক্টোবর ২০২৬', 64, 4, 31, 5, 14, '#4b5563', 500), category, headline, sub, photo, makeLayer('Footer band', '২৪ঘণ্টা টিভি  |  সত্যের সঙ্গে', 0, 91, 100, 9, 18, '#ffffff', 700, p.accent)];
    case 2: return [photo, makeLayer('Photo overlay', 'বিশেষ প্রতিবেদন', 5, 54, 65, 6, 17, '#ffffff', 800, p.accent), makeLayer('Headline', title, 5, 64, 90, 19, 34, '#ffffff', 900, '#111111'), footer];
    case 3: return [brand, category, headline, sub, photo, makeLayer('Side accent', '', 0, 13, 2, 74, 1, '#ffffff', 400, p.accent), footer];
    case 4: return [makeLayer('Masthead', '২৪ঘণ্টা টিভি', 5, 4, 90, 7, 22, p.accent, 900), category, headline, sub, photo, footer];
    case 5: return [makeLayer('Masthead', '২৪ঘণ্টা টিভি  /  NEWS', 5, 4, 90, 7, 21, '#ffffff', 800), makeLayer('Eyebrow', 'THE LATEST  •  জাতীয়', 5, 16, 90, 5, 14, p.accent, 800), headline, sub, photo, makeLayer('Bottom line', 'LIVE UPDATES  /  24GHONTATV.COM', 5, 92, 90, 5, 12, '#9ca3af', 700)];
    case 6: return [makeLayer('Alert', 'জরুরি সংবাদ', 0, 0, 100, 15, 25, '#b91c1c', 900, '#ffffff'), headline, sub, photo, makeLayer('Footer', '২৪ঘণ্টা টিভি  •  সর্বশেষ', 0, 88, 100, 12, 19, '#ffffff', 900, '#111827')];
    case 7: return [makeLayer('Publication', '২৪ঘণ্টা টিভি  |  দৈনিক সংবাদ', 5, 4, 90, 7, 20, '#1f2937', 900), makeLayer('Rule', '', 5, 13, 90, 1, 1, '#ffffff', 400, p.accent), category, makeLayer('Headline', title, 5, 21, 90, 18, 34, '#1f2937', 900), sub, photo, footer];
    case 8: return [makeLayer('Masthead', '২৪ঘণ্টা টিভি', 5, 4, 90, 7, 22, '#ffffff', 900), makeLayer('Label', 'TOP STORY  /  ০১', 5, 15, 90, 5, 14, p.accent, 800), headline, sub, photo, makeLayer('Footer', 'সংবাদ • বিশ্লেষণ • প্রেক্ষাপট', 5, 92, 90, 5, 14, '#c7d2fe', 600)];
    case 9: return [makeLayer('Quote mark', '“', 5, 3, 20, 17, 70, p.accent, 900), makeLayer('Headline', title, 8, 22, 84, 31, 36, '#292524', 900), makeLayer('Source', '—  আজকের গুরুত্বপূর্ণ খবর', 8, 57, 84, 8, 19, p.accent, 700), photo, footer];
    case 10: return [makeLayer('Top label', 'আজকের খবর', 5, 5, 90, 6, 17, p.accent, 800), makeLayer('Headline', title, 5, 15, 90, 22, 34, '#831843', 900), photo, makeLayer('Social footer', 'আরও জানতে চোখ রাখুন ২৪ঘণ্টা টিভিতে', 5, 91, 90, 6, 15, '#9d174d', 700)];
    case 11: return [makeLayer('Masthead', 'BUSINESS  /  ২৪ঘণ্টা টিভি', 5, 4, 90, 7, 18, '#1e3a8a', 900), makeLayer('Label', 'অর্থনীতি ও ব্যবসা', 5, 15, 90, 5, 15, p.accent, 800), makeLayer('Headline', title, 5, 22, 90, 19, 34, '#172554', 900), sub, photo, footer];
    case 12: return [makeLayer('Sports label', 'SPORTS  •  খেলা', 0, 0, 100, 13, 24, '#0f172a', 900, p.accent), makeLayer('Headline', title, 5, 16, 90, 20, 37, '#ffffff', 900), photo, makeLayer('Score strip', 'ম্যাচ আপডেট  /  সর্বশেষ', 0, 88, 100, 12, 18, '#0f172a', 900, p.accent)];
    case 13: return [makeLayer('World label', 'বিশ্ব সংবাদ  /  WORLD', 5, 4, 90, 7, 19, '#0e7490', 900), makeLayer('Headline', title, 5, 15, 90, 20, 35, '#164e63', 900), sub, photo, makeLayer('Footer', 'বিশ্বজুড়ে কী ঘটছে?', 5, 92, 90, 5, 15, '#0e7490', 700)];
    default: return [makeLayer('Magazine masthead', '২৪ঘণ্টা', 4, 2, 92, 12, 43, '#ffffff', 900), makeLayer('Feature label', 'THE BIG STORY  •  বিশেষ প্রতিবেদন', 5, 17, 90, 5, 14, p.accent, 900), photo, makeLayer('Cover headline', title, 5, 64, 90, 21, 35, '#ffffff', 900, '#18181bcc'), makeLayer('Cover footer', 'সংবাদ • বিশ্লেষণ • আরও অনেক কিছু', 5, 92, 90, 5, 13, '#d4d4d8', 600)];
  }
}
function mergeArticleDataIntoLayers(templateLayers: Layer[], article: ArticleData | null): Layer[] {
  if (!article) return templateLayers.map(l => ({...l}));
  const layers = templateLayers.map(l => ({...l}));
  const textLayers = layers.filter(l => l.kind === 'text' && l.visible !== false && (l.text || '').trim());
  const namedHeadline = textLayers.find(l => /headline|title|cover headline|story title/i.test(l.name));
  const headline = namedHeadline || textLayers.filter(l => !/masthead|brand|footer|date|category|label|eyebrow|source|publication|logo|quote mark|breaking strip|alert|sports label/i.test(l.name)).sort((a,b) => b.fontSize-a.fontSize)[0] || textLayers.sort((a,b) => b.fontSize-a.fontSize)[0];
  if (headline && article.title.trim()) headline.text = article.title;
  if (article.date) {
    const dateLayer = layers.find(l => l.kind === 'text' && /^(date|publish date|article date)$/i.test(l.name.trim()));
    if (dateLayer) dateLayer.text = new Date(article.date).toLocaleDateString('bn-BD', {year:'numeric',month:'long',day:'numeric',timeZone:'Asia/Dhaka'});
  }
  const imageLayers = layers.filter(l => l.kind === 'image');
  const mainImage = imageLayers.find(l => /main photo|featured image|article image|hero image|cover photo|photo/i.test(l.name)) || imageLayers.sort((a,b) => (b.width*b.height)-(a.width*a.height))[0];
  if (mainImage && article.image) mainImage.src = article.image;
  return layers;
}

const safeImage = (src: string) => {
  if (!src || src.startsWith('data:') || src.startsWith('blob:')) return src;
  try {
    const u = new URL(src, window.location.origin);
    if (u.protocol === 'https:' && ['api.24ghontatv.com', '24ghontatv.com', 'www.24ghontatv.com'].includes(u.hostname)) return '/api/social-card-image?url=' + encodeURIComponent(u.toString());
  } catch {}
  return src;
};

export default function SocialCardStudio() {
  const [layers, setLayers] = useState<Layer[]>(() => makePreset(designs[1]));
  const [selectedId, setSelectedId] = useState('headline');
  const [background, setBackground] = useState('#ffffff');
  const [cardSize, setCardSize] = useState(1080);
  const [zoom, setZoom] = useState(78);
  const [safeArea, setSafeArea] = useState(true);
  const [showCenterGuides, setShowCenterGuides] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const [snap, setSnap] = useState(true);
  const [templateName, setTemplateName] = useState('Classic Bulletin');
  const [saved, setSaved] = useState<SavedTemplate[]>([]);
  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const [tab, setTab] = useState<'templates' | 'layers' | 'text' | 'canvas'>('templates');
  const [filter, setFilter] = useState('All');
  const [notice, setNotice] = useState('');
  const [exporting, setExporting] = useState(false);
  const [drag, setDrag] = useState<{id:string; x:number;y:number;px:number;py:number;w:number;h:number;mode:'move'|'resize'}|null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const selected = layers.find(l => l.id === selectedId) ?? layers[0];
  const update = (layerId: string, patch: Partial<Layer>) => setLayers(prev => prev.map(l => l.id === layerId ? {...l, ...patch} : l));
  const activeDesign = designs.find(d => d.name === templateName);
  const categories = ['All', ...Array.from(new Set(designs.map(d => d.category)))];
  const filteredDesigns = useMemo(() => filter === 'All' ? designs : designs.filter(d => d.category === filter), [filter]);

  useEffect(() => { try { const raw = localStorage.getItem('24ghontatv-social-card-templates'); if (raw) { const v = JSON.parse(raw); if (Array.isArray(v)) setSaved(v); } } catch {} }, []);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const articleId = q.get('articleId');
    if (!articleId && !q.get('title') && !q.get('image')) return;
    const article = { title: q.get('title') || '', image: q.get('image') || '', date: q.get('date') || '' };
    setArticleData(article);
    setLayers(prev => mergeArticleDataIntoLayers(prev, article));
    setNotice('Article loaded. Choose a saved preset to apply its design while keeping this headline and image.');
  }, []);

  const applyDesign = (design: Design) => {
    const presetLayers = makePreset(design);
    setLayers(mergeArticleDataIntoLayers(presetLayers, articleData)); setBackground(design.bg); setTemplateName(design.name);
    setSelectedId(presetLayers.find(l => l.kind === 'text' && /headline|title/i.test(l.name))?.id || presetLayers[0]?.id || '');
    setNotice(articleData ? 'Applied ' + design.name + ' with the article headline and image.' : 'Applied ' + design.name + '. You can edit the headline and add a photo.');
  };
  const readImage = (file: File, cb: (src:string)=>void) => {
    if (!file.type.startsWith('image/')) { setNotice('Choose an image file such as PNG, JPG, or WebP.'); return; }
    const reader = new FileReader(); reader.onload = () => { if (typeof reader.result === 'string') cb(reader.result); }; reader.onerror = () => setNotice('Could not read this image.'); reader.readAsDataURL(file);
  };
  const addText = () => { const l = makeLayer('New text', 'নতুন লেখা', 20, 40, 60, 10, 28, '#171717', 700); l.id = id(); setLayers(p => [...p,l]); setSelectedId(l.id); setTab('text'); };
  const addImage = () => { const l: Layer = {id:id(),name:'Image / logo',kind:'image',src:'',x:32,y:35,width:36,height:22,fontSize:16,color:'#111111',fontWeight:500,align:'center',fontFamily:FONT,visible:true}; setLayers(p=>[...p,l]); setSelectedId(l.id); window.setTimeout(()=>fileRefs.current[l.id]?.click(),50); };
  const saveTemplate = () => {
    const name = templateName.trim() || 'Untitled design';
    const next = [...saved.filter(t=>t.name!==name), {name,layers,background,cardSize}];
    setSaved(next); try { localStorage.setItem('24ghontatv-social-card-templates', JSON.stringify(next)); setNotice('Saved “'+name+'” in this browser.'); } catch { setNotice('Could not save: browser storage may be full.'); }
  };
  const loadSaved = (name: string) => { const t = saved.find(s=>s.name===name); if (!t) return; const nextLayers = mergeArticleDataIntoLayers(t.layers, articleData); setLayers(nextLayers);setBackground(t.background);setCardSize(t.cardSize);setTemplateName(t.name);setSelectedId(nextLayers.find(l => l.kind === 'text' && /headline|title/i.test(l.name))?.id || nextLayers.find(l => l.kind === 'image')?.id || nextLayers[0]?.id || '');setNotice(articleData ? 'Applied saved preset “'+t.name+'” with the article headline and image. You can now edit any layer.' : 'Loaded '+t.name+'.'); };
  const exportPng = async () => {
    if (!canvasRef.current || exporting) return;
    setExporting(true); setNotice('Preparing high-resolution PNG…');
    try {
      await document.fonts.ready;
      await new Promise<void>(resolve => requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
      const node = canvasRef.current; if (!node) throw new Error('Canvas unavailable');
      const url = await toPng(node, { pixelRatio: cardSize / Math.max(1,node.getBoundingClientRect().width), cacheBust: true, backgroundColor: background, filter: el => !(el instanceof HTMLElement && el.hasAttribute('data-editor-ui')) });
      const a = document.createElement('a'); a.href=url; a.download='24ghontatv-social-card.png'; document.body.appendChild(a);a.click();a.remove();setNotice('PNG exported at '+cardSize+' × '+cardSize+'.');
    } catch(e) { const message = e instanceof Error ? e.message : String(e); setNotice('Export failed: '+message.slice(0,150)); }
    finally { setExporting(false); }
  };
  const startDrag = (e: React.PointerEvent<HTMLElement>, l: Layer, mode: 'move'|'resize'='move') => {
    if ((e.target as HTMLElement).closest('[data-editor-ui]') || l.locked) return;
    e.preventDefault(); e.stopPropagation(); setSelectedId(l.id);
    setDrag({id:l.id,x:l.x,y:l.y,px:e.clientX,py:e.clientY,w:l.width,h:l.height,mode});
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const moveDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag || !canvasRef.current) return;
    const r=canvasRef.current.getBoundingClientRect(); let dx=(e.clientX-drag.px)/r.width*100; let dy=(e.clientY-drag.py)/r.height*100;
    if (snap) { dx=Math.round(dx*2)/2; dy=Math.round(dy*2)/2; }
    if (drag.mode==='resize') update(drag.id,{width:Math.max(3,Math.min(100-drag.x,drag.w+dx)),height:Math.max(3,Math.min(100-drag.y,drag.h+dy))});
    else {
      let x=Math.max(0,Math.min(100-drag.w,drag.x+dx)), y=Math.max(0,Math.min(100-drag.h,drag.y+dy));
      if (snap) { if (Math.abs(x+drag.w/2-50)<1.2) x=50-drag.w/2; if (Math.abs(y+drag.h/2-50)<1.2) y=50-drag.h/2; if (Math.abs(x-5)<.7) x=5; if (Math.abs(y-5)<.7) y=5; }
      update(drag.id,{x,y});
    }
  };
  const nudge = useCallback((e: KeyboardEvent) => {
    if (!selected || ['INPUT','TEXTAREA','SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
    const delta = e.shiftKey ? 1 : .2; const moves:Record<string,[number,number]> = {ArrowLeft:[-delta,0],ArrowRight:[delta,0],ArrowUp:[0,-delta],ArrowDown:[0,delta]};
    if (moves[e.key]) { e.preventDefault(); const [dx,dy]=moves[e.key]; update(selected.id,{x:Math.max(0,Math.min(100-selected.width,selected.x+dx)),y:Math.max(0,Math.min(100-selected.height,selected.y+dy))}); }
    if ((e.key==='Delete'||e.key==='Backspace') && selected) { setLayers(p=>p.filter(l=>l.id!==selected.id)); setSelectedId(''); }
  }, [selected, layers]);
  useEffect(()=>{window.addEventListener('keydown',nudge);return()=>window.removeEventListener('keydown',nudge)},[nudge]);

  return <div className="min-h-screen bg-[#f4f5f7] text-slate-900">
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-[66px] flex-wrap items-center gap-3 px-4 py-2 lg:px-6">
        <div className="flex items-center gap-3 mr-auto"><div className="grid h-10 w-10 place-items-center rounded-xl bg-red-600 text-sm font-black text-white">২৪</div><div><h1 className="text-sm font-bold">Social Card Studio</h1><p className="text-[11px] text-slate-500">Design workspace · 24GhontaTV</p></div></div>
        <input aria-label="Design name" value={templateName} onChange={e=>setTemplateName(e.target.value)} className="h-9 w-40 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-red-400 sm:w-48"/>
        <select aria-label="Apply saved preset to article" value="" onChange={e=>{if(e.target.value)loadSaved(e.target.value);e.currentTarget.value='';}} className="h-9 max-w-48 rounded-lg border border-purple-200 bg-purple-50 px-2 text-xs font-semibold text-purple-800"><option value="">Apply saved preset ({saved.length})…</option>{saved.map(t=><option key={t.name} value={t.name}>{t.name}</option>)}</select>
        <button onClick={saveTemplate} className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-semibold hover:bg-slate-50">▣ Save</button>
        <button onClick={exportPng} disabled={exporting} className="h-9 rounded-lg bg-red-600 px-4 text-xs font-bold text-white shadow-sm hover:bg-red-700 disabled:opacity-60">{exporting?'Preparing…':'↓ Export PNG'}</button>
      </div>
    </header>
    {notice&&<div role="status" className="fixed right-4 top-[76px] z-50 flex max-w-sm items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs shadow-xl"><span className="flex-1">{notice}</span><button onClick={()=>setNotice('')} aria-label="Dismiss" className="text-lg leading-4 text-slate-400">×</button></div>}
    <main className="mx-auto grid max-w-[1800px] grid-cols-1 items-start gap-4 p-3 md:p-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-3 py-3 sm:px-4">
          <span className="mr-auto text-xs font-bold text-slate-700">CANVAS <span className="font-normal text-slate-400">· {cardSize} × {cardSize}</span></span>
          <button onClick={()=>setShowRulers(v=>!v)} className={'rounded-md px-2.5 py-2 text-[11px] font-semibold '+(showRulers?'bg-slate-900 text-white':'bg-slate-100 text-slate-600')}>Rulers</button>
          <button onClick={()=>setShowGrid(v=>!v)} className={'rounded-md px-2.5 py-2 text-[11px] font-semibold '+(showGrid?'bg-slate-900 text-white':'bg-slate-100 text-slate-600')}>Gridlines</button>
          <button onClick={()=>setSnap(v=>!v)} className={'rounded-md px-2.5 py-2 text-[11px] font-semibold '+(snap?'bg-slate-900 text-white':'bg-slate-100 text-slate-600')}>Snap {snap?'on':'off'}</button>
          <button onClick={()=>setSafeArea(v=>!v)} className={'rounded-md px-2.5 py-2 text-[11px] font-semibold '+(safeArea?'bg-emerald-700 text-white':'bg-slate-100 text-slate-600')}>Safe area</button>
          <button onClick={()=>setShowCenterGuides(v=>!v)} className={'rounded-md px-2.5 py-2 text-[11px] font-semibold '+(showCenterGuides?'bg-blue-700 text-white':'bg-slate-100 text-slate-600')}>Center guides</button>
          <div className="flex items-center gap-2 rounded-md bg-slate-100 px-2 py-1"><button onClick={()=>setZoom(z=>Math.max(30,z-10))} aria-label="Zoom out" className="px-1 text-sm">−</button><span className="w-9 text-center text-[11px] tabular-nums">{zoom}%</span><button onClick={()=>setZoom(z=>Math.min(120,z+10))} aria-label="Zoom in" className="px-1 text-sm">＋</button><button onClick={()=>setZoom(78)} className="border-l border-slate-300 pl-2 text-[10px] font-semibold">Fit</button></div>
        </div>
        <div className="relative flex min-h-[520px] items-center justify-center overflow-auto bg-[#e9ebef] px-3 py-8 sm:px-8" onPointerMove={moveDrag} onPointerUp={()=>setDrag(null)} onPointerCancel={()=>setDrag(null)}>
          {showRulers&&<div className="pointer-events-none absolute left-3 right-3 top-2 flex justify-between text-[9px] text-slate-500 sm:left-8 sm:right-8">{Array.from({length:11},(_,i)=><span key={i}>{i*10}%</span>)}</div>}
          <div className="relative shrink-0" style={{width:'min('+zoom+'vw, '+(980*zoom/78)+'px)',maxWidth:'100%'}}>
            {showRulers&&<div className="pointer-events-none absolute -left-5 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500">{Array.from({length:11},(_,i)=><span key={i}>{i*10}</span>)}</div>}
            <div ref={canvasRef} onPointerMove={moveDrag} onPointerUp={()=>setDrag(null)} onPointerCancel={()=>setDrag(null)} className="relative aspect-square w-full overflow-hidden shadow-[0_12px_40px_rgba(15,23,42,.18)]" style={{backgroundColor:background,containerType:'inline-size'}}>
              {showGrid&&!exporting&&<div data-editor-ui className="pointer-events-none absolute inset-0" style={{backgroundImage:'linear-gradient(to right, #64748b20 1px, transparent 1px),linear-gradient(to bottom, #64748b20 1px, transparent 1px)',backgroundSize:'10% 10%'}}/>}
              {showCenterGuides&&!exporting&&<div data-editor-ui className="pointer-events-none absolute inset-0"><div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-blue-400/50"/><div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-blue-400/50"/></div>}
              {safeArea&&!exporting&&<div data-editor-ui className="pointer-events-none absolute inset-[5%] border border-dashed border-emerald-500/40"/>}
              {layers.filter(l=>l.visible).map(l=><div key={l.id} data-card-layer={l.id} onPointerDown={e=>startDrag(e,l)} onClick={()=>setSelectedId(l.id)} className={'absolute '+(selectedId===l.id&&!exporting?'ring-2 ring-blue-500 ring-offset-1':'')+(!exporting?' cursor-move':'')} style={{left:l.x+'%',top:l.y+'%',width:l.width+'%',height:l.height+'%',opacity:l.opacity??1,transform:`rotate(${l.rotation||0}deg)`,transformOrigin:'center center',boxShadow:l.shadow?'0 10px 28px rgba(0,0,0,.28)':undefined,borderRadius:l.kind==='image'?(l.radius||0)+'px':undefined}}>
                {l.kind==='image' ? (l.src?<img src={safeImage(l.src)} alt={l.name} draggable={false} className="h-full w-full object-cover" />:<button data-editor-ui onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();fileRefs.current[l.id]?.click()}} className="flex h-full w-full flex-col items-center justify-center border-2 border-dashed border-slate-400 bg-slate-100/90 text-center text-[clamp(8px,1.5cqw,16px)] font-semibold text-slate-500">＋<span>Upload photo</span></button>) :
                  <div className="flex h-full w-full items-center whitespace-pre-wrap break-words" style={{fontFamily:l.fontFamily,fontSize:'clamp(7px,'+(l.fontSize/10)+'cqw,90px)',color:l.color,fontWeight:l.fontWeight,textAlign:l.align,letterSpacing:(l.letterSpacing||0)+'px',lineHeight:l.lineHeight||1.12,justifyContent:l.align==='left'?'flex-start':l.align==='right'?'flex-end':'center',backgroundColor:l.backgroundColor??'transparent',padding:l.backgroundColor?'0.25em 0.45em':0,borderRadius:l.radius?l.radius+'px':0}}>{l.text}</div>}
                {!exporting&&selectedId===l.id&&<><div data-editor-ui className="pointer-events-none absolute inset-0 border border-blue-500"/><button data-editor-ui aria-label="Resize layer" title="Drag to resize" onPointerDown={e=>startDrag(e,l,'resize')} className="absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 cursor-nwse-resize rounded-sm border-2 border-white bg-blue-600 shadow"/></>}
              </div>)}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 bg-white px-4 py-3"><button onClick={addText} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50">＋ Add text</button><button onClick={addImage} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50">▧ Add image / logo</button><span className="ml-auto text-[10px] text-slate-400">Drag to move · corner handle to resize · arrow keys to nudge</span></div>
      </section>
      <aside className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-4 border-b border-slate-200 p-1.5">{(['templates','layers','text','canvas'] as const).map((t)=><button key={t} onClick={()=>setTab(t)} className={'rounded-lg px-1 py-2.5 text-[11px] font-semibold capitalize '+(tab===t?'bg-slate-900 text-white':'text-slate-500 hover:bg-slate-100')}>{t==='canvas'?'Canvas':t==='text'?'Style':t==='layers'?'Layers':'Presets'}</button>)}</div>
        {tab==='templates'&&<div className="p-3">
          <div className="mb-3 flex flex-wrap gap-1.5">{categories.map(c=><button key={c} onClick={()=>setFilter(c)} className={'rounded-full px-2.5 py-1.5 text-[10px] font-semibold '+(filter===c?'bg-red-600 text-white':'bg-slate-100 text-slate-600 hover:bg-slate-200')}>{c}</button>)}</div>
          <div className="grid grid-cols-2 gap-2">{filteredDesigns.map(d=><button key={d.name} onClick={()=>applyDesign(d)} className={'group overflow-hidden rounded-xl border text-left transition hover:-translate-y-0.5 hover:shadow-md '+(templateName===d.name?'border-red-500 ring-1 ring-red-200':'border-slate-200')}><div className="relative aspect-square overflow-hidden p-[8%]" style={{background:d.bg}}><div className="absolute left-0 top-0 h-[12%] w-full" style={{background:d.accent}}/><div className="absolute left-[9%] top-[22%] h-[5%] w-[55%] rounded-sm" style={{background:d.accent}}/><div className="absolute left-[9%] top-[31%] h-[20%] w-[82%] rounded-sm" style={{background:d.bg==='#ffffff'||d.bg==='#f8fafc'||d.bg==='#f4efe6'||d.bg==='#eff6ff'||d.bg==='#ecfeff'||d.bg==='#fff7ed'||d.bg==='#fdf2f8'?'#171717':'#ffffff'}}/><div className="absolute bottom-[15%] left-[9%] right-[9%] h-[30%] rounded-sm opacity-80" style={{background:d.accent}}/><div className="absolute bottom-[4%] left-[9%] h-[4%] w-[55%] rounded-sm" style={{background:d.bg==='#ffffff'||d.bg==='#f8fafc'||d.bg==='#f4efe6'||d.bg==='#eff6ff'||d.bg==='#ecfeff'||d.bg==='#fff7ed'||d.bg==='#fdf2f8'?'#64748b':'#cbd5e1'}}/></div><div className="p-2.5"><p className="truncate text-[11px] font-bold">{d.name}</p><p className="mt-0.5 text-[10px] text-slate-500">{d.category}</p></div></button>)}</div>
          {saved.length>0&&<div className="mt-5 border-t border-slate-100 pt-3"><p className="mb-2 text-[11px] font-bold">YOUR SAVED DESIGNS</p>{saved.map(t=><div key={t.name} className="flex items-center gap-2 py-1.5"><button onClick={()=>loadSaved(t.name)} className="min-w-0 flex-1 truncate text-left text-xs hover:text-red-600">{t.name}</button><button onClick={()=>{const n=saved.filter(x=>x.name!==t.name);setSaved(n);localStorage.setItem('24ghontatv-social-card-templates',JSON.stringify(n));}} className="px-2 text-xs text-slate-400 hover:text-red-600" aria-label={'Delete '+t.name}>×</button></div>)}</div>}
        </div>}
        {tab==='layers'&&<div className="p-3"><div className="mb-3 flex items-center justify-between"><span className="text-xs font-bold">Objects ({layers.length})</span><button onClick={addText} className="rounded-md bg-slate-100 px-2 py-1.5 text-[10px] font-semibold">＋ Add</button></div><div className="space-y-1">{[...layers].reverse().map(l=><div key={l.id} className={'flex items-center gap-2 rounded-lg px-2 py-2 '+(selectedId===l.id?'bg-red-50':'hover:bg-slate-50')}><button onClick={()=>update(l.id,{visible:!l.visible})} aria-label={l.visible?'Hide '+l.name:'Show '+l.name} className="w-6 text-slate-500">{l.visible?'◉':'○'}</button><button onClick={()=>setSelectedId(l.id)} className="min-w-0 flex-1 truncate text-left text-xs font-medium">{l.name}</button><span className="text-[9px] uppercase text-slate-400">{l.kind}</span><button onClick={()=>{const copy={...l,id:id(),name:l.name+' copy',x:Math.min(85,l.x+2),y:Math.min(85,l.y+2)};setLayers(p=>[...p,copy]);setSelectedId(copy.id)}} title="Duplicate layer" className="px-1 text-slate-400 hover:text-blue-600">▣</button><button onClick={()=>setLayers(p=>p.filter(x=>x.id!==l.id))} title="Delete layer" className="px-1 text-slate-400 hover:text-red-600">×</button></div>)}</div><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={()=>{if(!selected)return;setLayers(p=>{const a=[...p],i=a.findIndex(l=>l.id===selected.id);if(i<a.length-1){[a[i],a[i+1]]=[a[i+1],a[i]]}return a})}} className="rounded-lg border px-2 py-2 text-[10px] font-semibold">Bring forward ↑</button><button onClick={()=>{if(!selected)return;setLayers(p=>{const a=[...p],i=a.findIndex(l=>l.id===selected.id);if(i>0){[a[i],a[i-1]]=[a[i-1],a[i]]}return a})}} className="rounded-lg border px-2 py-2 text-[10px] font-semibold">Send backward ↓</button></div></div>}
        {tab==='text'&&<div className="space-y-4 p-4">{!selected?<p className="text-xs text-slate-500">Select a layer on the canvas.</p>:<>{selected.kind==='text'?<><label className="block text-[11px] font-semibold">Text content<textarea value={selected.text||''} onChange={e=>update(selected.id,{text:e.target.value})} rows={3} className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-red-400"/></label><label className="block text-[11px] font-semibold">Font family<select value={selected.fontFamily} onChange={e=>update(selected.id,{fontFamily:e.target.value})} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-normal">{fonts.map(([name,value])=><option key={value} value={value}>{name}</option>)}</select></label><div className="grid grid-cols-2 gap-3"><label className="text-[11px] font-semibold">Font size<input type="number" min={6} max={100} value={selected.fontSize} onChange={e=>update(selected.id,{fontSize:Math.max(6,Math.min(100,Number(e.target.value)||6))})} className="mt-1.5 w-full rounded-lg border px-3 py-2 text-xs font-normal"/></label><label className="text-[11px] font-semibold">Font weight<select value={selected.fontWeight} onChange={e=>update(selected.id,{fontWeight:Number(e.target.value)})} className="mt-1.5 w-full rounded-lg border px-3 py-2 text-xs font-normal">{[400,500,600,700,800,900].map(w=><option key={w} value={w}>{w}</option>)}</select></label></div><div className="grid grid-cols-2 gap-3"><label className="text-[11px] font-semibold">Letter spacing (px)<input type="number" min={-5} max={20} step={0.5} value={selected.letterSpacing||0} onChange={e=>update(selected.id,{letterSpacing:Number(e.target.value)})} className="mt-1.5 w-full rounded-lg border px-3 py-2 text-xs font-normal"/></label><label className="text-[11px] font-semibold">Line height<input type="number" min={0.7} max={2.5} step={0.05} value={selected.lineHeight||1.12} onChange={e=>update(selected.id,{lineHeight:Number(e.target.value)})} className="mt-1.5 w-full rounded-lg border px-3 py-2 text-xs font-normal"/></label></div><div><p className="mb-2 text-[11px] font-semibold">Text color</p><div className="flex items-center gap-2"><input type="color" value={selected.color} onChange={e=>update(selected.id,{color:e.target.value})} className="h-9 w-12 rounded border p-1"/><input value={selected.color} onChange={e=>update(selected.id,{color:e.target.value})} className="h-9 min-w-0 flex-1 rounded-lg border px-3 text-xs uppercase"/></div></div><div><p className="mb-2 text-[11px] font-semibold">Alignment</p><div className="grid grid-cols-3 gap-1">{(['left','center','right'] as const).map(a=><button key={a} onClick={()=>update(selected.id,{align:a})} className={'rounded-lg border py-2 text-xs capitalize '+(selected.align===a?'border-slate-900 bg-slate-900 text-white':'border-slate-200')}>{a}</button>)}</div></div><label className="block text-[11px] font-semibold">Text background<input type="color" value={selected.backgroundColor||'#ffffff'} onChange={e=>update(selected.id,{backgroundColor:e.target.value})} className="mt-1.5 block h-9 w-full rounded border p-1"/></label><button onClick={()=>update(selected.id,{backgroundColor:undefined})} className="text-left text-[10px] font-semibold text-red-600">Remove text background</button></>:<><p className="text-xs font-semibold">Image / logo</p><button onClick={()=>fileRefs.current[selected.id]?.click()} className="w-full rounded-lg border border-dashed p-4 text-xs font-semibold">↑ Choose image</button><input ref={el=>{fileRefs.current[selected.id]=el}} type="file" accept="image/*" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)readImage(f,src=>update(selected.id,{src}));e.currentTarget.value=''}}/>{selected.src&&<button onClick={()=>update(selected.id,{src:''})} className="text-xs text-red-600">Remove image</button>}</>}<div className="border-t border-slate-100 pt-4"><p className="mb-3 text-[11px] font-bold">POSITION & SIZE</p><div className="grid grid-cols-2 gap-3">{([['x','X position'],['y','Y position'],['width','Width'],['height','Height']] as const).map(([field,label])=><label key={field} className="text-[10px] font-semibold text-slate-600">{label} (%)<input type="number" min={0} max={100} value={Math.round(selected[field]*10)/10} onChange={e=>update(selected.id,{[field]:Math.max(0,Math.min(100,Number(e.target.value)||0))})} className="mt-1 w-full rounded-lg border px-2.5 py-2 text-xs font-normal"/></label>)}</div><div className="mt-3 grid grid-cols-2 gap-3"><label className="text-[10px] font-semibold">Rotation (°)<input type="number" min={-180} max={180} value={selected.rotation||0} onChange={e=>update(selected.id,{rotation:Math.max(-180,Math.min(180,Number(e.target.value)||0))})} className="mt-1 w-full rounded-lg border px-2.5 py-2 text-xs font-normal"/></label><label className="text-[10px] font-semibold">Opacity<input type="number" min={0} max={1} step={0.05} value={selected.opacity??1} onChange={e=>update(selected.id,{opacity:Math.max(0,Math.min(1,Number(e.target.value)))})} className="mt-1 w-full rounded-lg border px-2.5 py-2 text-xs font-normal"/></label></div><div className="mt-3 flex flex-wrap gap-3 text-xs"><label className="flex items-center gap-2"><input type="checkbox" checked={!!selected.shadow} onChange={e=>update(selected.id,{shadow:e.target.checked})}/>Drop shadow</label><label className="flex items-center gap-2"><input type="checkbox" checked={!!selected.locked} onChange={e=>update(selected.id,{locked:e.target.checked})}/>Lock layer</label></div><label className="mt-3 flex items-center gap-2 text-xs"><input type="checkbox" checked={selected.visible} onChange={e=>update(selected.id,{visible:e.target.checked})}/>Visible on canvas</label></div></>}</div>}
        {tab==='canvas'&&<div className="space-y-4 p-4"><label className="block text-[11px] font-semibold">Canvas background<input type="color" value={background} onChange={e=>setBackground(e.target.value)} className="mt-1.5 block h-10 w-full rounded-lg border p-1"/></label><label className="block text-[11px] font-semibold">Export dimensions<select value={cardSize} onChange={e=>setCardSize(Number(e.target.value))} className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-xs font-normal"><option value={1080}>1080 × 1080 · Square social post</option><option value={1200}>1200 × 1200 · High-res square</option><option value={1600}>1600 × 1600 · Print / archive</option></select></label><div className="rounded-xl bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600">Guides, rulers, selection outlines, and editing handles are for the workspace only and will not appear in your exported PNG.</div><button onClick={()=>{setLayers(makePreset(designs[1]));setBackground('#ffffff');setTemplateName('Classic Bulletin');setSelectedId('headline');setNotice('Canvas reset to Classic Bulletin.')}} className="w-full rounded-lg border border-red-200 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50">Reset design</button></div>}
      </aside>
    </main>
    <div className="hidden">{layers.filter(l=>l.kind==='image').map(l=><input key={l.id} ref={el=>{fileRefs.current[l.id]=el}} type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(f)readImage(f,src=>update(l.id,{src}));e.currentTarget.value=''}}/>)}</div>
  </div>;
}
