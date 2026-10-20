'use client';

import { useEffect, useRef, useState } from 'react';

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
  visible: boolean;
};

const initialLayers: Layer[] = [
  { id: 'details', kind: 'text', name: 'Details in comments', text: '✓ বিস্তারিত  •  কমেন্টে', x: 4, y: 3, width: 47, height: 6, fontSize: 18, color: '#c82027', fontWeight: 700, align: 'left', fontFamily: 'Arial, sans-serif', visible: true },
  { id: 'date', kind: 'text', name: 'Date', text: '১৯ অক্টোবর ২০২৬', x: 65, y: 3, width: 31, height: 6, fontSize: 16, color: '#222222', fontWeight: 500, align: 'right', fontFamily: 'Arial, sans-serif', visible: true },
  { id: 'headline-red', kind: 'text', name: 'Headline — red line', text: 'দক্ষিণী সুন্দরী কৃতি শেঠির', x: 5, y: 11, width: 90, height: 8, fontSize: 25, color: '#c82027', fontWeight: 700, align: 'center', fontFamily: 'Arial, sans-serif', visible: true },
  { id: 'headline-black', kind: 'text', name: 'Headline — black line', text: 'বলিউডে রোমান্টিক অভিষেক', x: 4, y: 19, width: 92, height: 9, fontSize: 31, color: '#151515', fontWeight: 800, align: 'center', fontFamily: 'Arial, sans-serif', visible: true },
  { id: 'main-photo', kind: 'image', name: 'Main photo', src: '', x: 13, y: 29, width: 74, height: 54, fontSize: 16, color: '#111111', fontWeight: 500, align: 'center', fontFamily: 'Arial, sans-serif', visible: true },
  { id: 'brand-logo', kind: 'image', name: '24 Ghonta logo', src: '', x: 4, y: 86, width: 34, height: 11, fontSize: 16, color: '#111111', fontWeight: 500, align: 'center', fontFamily: 'Arial, sans-serif', visible: true },
  { id: 'slogan', kind: 'text', name: 'Brand slogan', text: 'খবরের নতুন\nবাতায়ন', x: 63, y: 86, width: 32, height: 11, fontSize: 19, color: '#c82027', fontWeight: 800, align: 'center', fontFamily: 'Arial, sans-serif', visible: true },
];

const newId = () => `layer-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export default function SocialCardStudioPage() {
  const [layers, setLayers] = useState<Layer[]>(initialLayers);
  const [selectedId, setSelectedId] = useState('headline-black');
  const [background, setBackground] = useState('#e9e8e5');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [cardSize, setCardSize] = useState(1080);
  const [templateName, setTemplateName] = useState('24 Ghonta default');
  const [savedTemplates, setSavedTemplates] = useState<{ name: string; layers: Layer[]; background: string; backgroundImage: string; cardSize: number }[]>([]);
  const [notice, setNotice] = useState('');
  const [dragging, setDragging] = useState<{ id: string; mode: 'move' | 'resize'; startX: number; startY: number; x: number; y: number; width: number; height: number } | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

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
    const node = previewRef.current;
    if (!node) return;
    setNotice('Preparing PNG export…');
    try {
      const clone = node.cloneNode(true) as HTMLDivElement;
      clone.querySelectorAll('[data-editor-ui]').forEach((item) => item.remove());
      clone.style.width = `${cardSize}px`;
      clone.style.height = `${cardSize}px`;
      clone.style.position = 'fixed';
      clone.style.left = '-10000px';
      clone.style.top = '0';
      clone.style.transform = 'none';
      clone.style.border = '0';
      clone.style.boxShadow = 'none';
      clone.querySelectorAll<HTMLElement>('[data-card-layer]').forEach((item) => {
        item.style.outline = 'none';
        item.style.cursor = 'default';
      });
      document.body.appendChild(clone);
      const html = new XMLSerializer().serializeToString(clone);
      document.body.removeChild(clone);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cardSize}" height="${cardSize}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="width:${cardSize}px;height:${cardSize}px">${html}</div></foreignObject></svg>`;
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = cardSize;
        canvas.height = cardSize;
        const context = canvas.getContext('2d');
        if (!context) {
          URL.revokeObjectURL(url);
          setNotice('PNG export is not supported in this browser.');
          return;
        }
        context.drawImage(image, 0, 0, cardSize, cardSize);
        URL.revokeObjectURL(url);
        canvas.toBlob((png) => {
          if (!png) {
            setNotice('PNG export failed. Try using uploaded images rather than remote image URLs.');
            return;
          }
          const link = document.createElement('a');
          link.href = URL.createObjectURL(png);
          link.download = '24ghontatv-social-card.png';
          link.click();
          URL.revokeObjectURL(link.href);
          setNotice('PNG export started. Check the downloaded file.');
        }, 'image/png');
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        setNotice('PNG export failed in this browser. The editor itself is unchanged.');
      };
      image.src = url;
    } catch {
      setNotice('PNG export failed in this browser. The editor itself is unchanged.');
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
    <div className="mx-auto max-w-[1500px] space-y-5 text-gray-800">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Social Card Studio</h1>
          <p className="mt-1 text-sm text-gray-500">Build editable 1:1 Bengali news cards. This is an isolated studio; article publishing is not connected to it yet.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={addText} className="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-gray-50">+ Add text</button>
          <button onClick={addImage} className="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-gray-50">+ Add PNG/image</button>
          <button onClick={exportPng} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">Export PNG</button>
        </div>
      </header>

      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}<button className="ml-3 font-bold" onClick={() => setNotice('')}>×</button></div>}

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-semibold">Live preview <span className="font-normal text-gray-400">— drag to move; drag the blue corner to resize</span></div>
            <label className="flex items-center gap-2 text-xs text-gray-600">Preview size
              <select value={cardSize} onChange={(e) => setCardSize(Number(e.target.value))} className="rounded border px-2 py-1">
                <option value={1080}>1080 × 1080</option><option value={1200}>1200 × 1200</option><option value={800}>800 × 800</option>
              </select>
            </label>
          </div>
          <div className="mx-auto w-full max-w-[760px]">
            <div
              ref={previewRef}
              onPointerMove={moveDrag}
              onPointerUp={finishDrag}
              onPointerCancel={finishDrag}
              className="relative aspect-square w-full overflow-hidden border border-gray-300 shadow-inner"
              style={{
                backgroundColor: background,
                backgroundImage: backgroundImage ? `url("${backgroundImage}")` : 'radial-gradient(#0000000c 0.7px, transparent 0.7px), linear-gradient(135deg, #f0efed, #deddd9)',
                backgroundSize: backgroundImage ? 'cover' : '5px 5px, 100% 100%',
                backgroundPosition: 'center',
              }}
            >
              {layers.filter((layer) => layer.visible).map((layer) => (
                <div
                  key={layer.id}
                  data-card-layer={layer.id}
                  onPointerDown={(event) => startDrag(event, layer)}
                  onClick={() => {
                    setSelectedId(layer.id);
                    if (layer.kind === 'image' && !layer.src) window.setTimeout(() => fileInputs.current[layer.id]?.click(), 0);
                  }}
                  className={`absolute overflow-hidden ${selectedId === layer.id ? 'ring-2 ring-blue-500 ring-offset-1' : 'hover:ring-1 hover:ring-blue-300'}`}
                  style={{ left: `${layer.x}%`, top: `${layer.y}%`, width: `${layer.width}%`, height: `${layer.height}%`, cursor: dragging?.id === layer.id ? 'grabbing' : 'grab' }}
                >
                  {layer.kind === 'image' ? (
                    layer.src ? <img src={layer.src} alt={layer.name} draggable={false} className="h-full w-full object-cover" /> :
                    <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); setSelectedId(layer.id); window.setTimeout(() => fileInputs.current[layer.id]?.click(), 0); }} className="flex h-full w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed border-gray-500/60 bg-white/40 text-center text-xs text-gray-700">{layer.name}<span className="mt-1 font-semibold underline">Click to choose image</span></button>
                  ) : (
                    <div className="flex h-full w-full items-center whitespace-pre-line break-words" style={{ fontFamily: layer.fontFamily, fontSize: `clamp(6px, ${layer.fontSize / 10}cqw, 80px)`, lineHeight: 1.05, color: layer.color, fontWeight: layer.fontWeight, textAlign: layer.align, justifyContent: layer.align === 'left' ? 'flex-start' : layer.align === 'right' ? 'flex-end' : 'center' }}>{layer.text}</div>
                  )}
                  {selectedId === layer.id && layer.kind === 'image' && <button type="button" data-editor-ui onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); fileInputs.current[layer.id]?.click(); }} className="absolute left-1 top-1 z-10 rounded bg-gray-900/90 px-2 py-1 text-[11px] font-semibold text-white shadow hover:bg-black">Replace image</button>}
                  {selectedId === layer.id && <button type="button" data-editor-ui onPointerDown={(event) => startResize(event, layer)} aria-label={`Resize ${layer.name}`} title="Drag to resize" className="absolute bottom-0 right-0 z-10 h-5 w-5 cursor-nwse-resize rounded-tl-md border-2 border-white bg-blue-600 shadow" />}
                </div>
              ))}
              <div data-editor-ui className="pointer-events-none absolute bottom-1 right-1 rounded bg-white/70 px-1 text-[9px] text-gray-500">EDITOR PREVIEW</div>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">Tip: select an element, then change its properties on the right. Uploaded PNGs with transparency are supported. Remote images may block PNG export; uploading the image file avoids that issue.</p>
        </section>

        <aside className="space-y-4">
          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-bold">Canvas background</h2>
            <label className="mb-3 block text-xs font-medium">Background color
              <input type="color" value={background} onChange={(e) => setBackground(e.target.value)} className="mt-1 block h-9 w-full cursor-pointer rounded border p-1" />
            </label>
            <label className="block text-xs font-medium">Background texture / image
              <input type="file" accept="image/*" className="mt-1 block w-full text-xs" onChange={(e) => { const file = e.target.files?.[0]; if (file) readImage(file, setBackgroundImage); e.currentTarget.value = ''; }} />
            </label>
            {backgroundImage && <button onClick={() => setBackgroundImage('')} className="mt-2 text-xs font-semibold text-red-600">Remove background image</button>}
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-bold">Selected element</h2>
            {!selected ? <p className="text-sm text-gray-500">Select an element on the card.</p> : <>
              <label className="mb-3 block text-xs font-medium">Element name
                <input value={selected.name} onChange={(e) => updateLayer(selected.id, { name: e.target.value })} className="mt-1 w-full rounded border px-3 py-2 text-sm" />
              </label>
              {selected.kind === 'text' ? <>
                <label className="mb-3 block text-xs font-medium">Text
                  <textarea value={selected.text ?? ''} onChange={(e) => updateLayer(selected.id, { text: e.target.value })} rows={3} className="mt-1 w-full rounded border px-3 py-2 text-sm" />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-xs font-medium">Font size
                    <input type="number" min={8} max={100} value={selected.fontSize} onChange={(e) => updateLayer(selected.id, { fontSize: Number(e.target.value) })} className="mt-1 w-full rounded border px-2 py-2" />
                  </label>
                  <label className="text-xs font-medium">Weight
                    <select value={selected.fontWeight} onChange={(e) => updateLayer(selected.id, { fontWeight: Number(e.target.value) })} className="mt-1 w-full rounded border px-2 py-2">
                      <option value={400}>Regular</option><option value={500}>Medium</option><option value={600}>Semi-bold</option><option value={700}>Bold</option><option value={800}>Extra bold</option><option value={900}>Black</option>
                    </select>
                  </label>
                  <label className="text-xs font-medium">Text color
                    <input type="color" value={selected.color} onChange={(e) => updateLayer(selected.id, { color: e.target.value })} className="mt-1 block h-9 w-full rounded border p-1" />
                  </label>
                  <label className="text-xs font-medium">Alignment
                    <select value={selected.align} onChange={(e) => updateLayer(selected.id, { align: e.target.value as Layer['align'] })} className="mt-1 w-full rounded border px-2 py-2">
                      <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
                    </select>
                  </label>
                </div>
                <label className="mt-3 block text-xs font-medium">Font family
                  <select value={selected.fontFamily} onChange={(e) => updateLayer(selected.id, { fontFamily: e.target.value })} className="mt-1 w-full rounded border px-2 py-2">
                    <option value="Arial, sans-serif">Default / Arial fallback</option><option value="sans-serif">Sans-serif</option><option value="serif">Serif</option><option value="Georgia, serif">Georgia</option><option value="'Noto Sans Bengali', sans-serif">Noto Sans Bengali (if installed)</option>
                  </select>
                </label>
              </> : <>
                <div className="mb-3">
                  <p className="mb-2 block text-xs font-medium">{selected.src ? 'Replace this image' : 'Choose an image'}</p>
                  <input ref={(el) => { fileInputs.current[selected.id] = el; }} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => { const file = e.target.files?.[0]; if (file) readImage(file, (src) => { updateLayer(selected.id, { src }); setNotice('Image updated.'); }); e.currentTarget.value = ''; }} className="sr-only" />
                  <button type="button" onClick={() => fileInputs.current[selected.id]?.click()} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold hover:bg-gray-50">{selected.src ? 'Choose replacement image…' : 'Choose image from computer…'}</button>
                </div>
                <label className="mb-3 block text-xs font-medium">Image fit
                  <span className="mt-1 flex gap-2"><button onClick={() => { const node = document.querySelector(`[data-card-layer="${selected.id}"] img`) as HTMLImageElement | null; if (node) node.style.objectFit = 'cover'; }} className="rounded border px-3 py-1.5">Crop / fill</button><button onClick={() => { const node = document.querySelector(`[data-card-layer="${selected.id}"] img`) as HTMLImageElement | null; if (node) node.style.objectFit = 'contain'; }} className="rounded border px-3 py-1.5">Fit whole</button></span>
                </label>
              </>}
              <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">Move this element by dragging it on the card. Resize it by dragging the blue handle at its bottom-right corner.</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={selected.visible} onChange={(e) => updateLayer(selected.id, { visible: e.target.checked })} /> Visible</label>
                <button onClick={() => { setLayers((current) => current.filter((layer) => layer.id !== selected.id)); setSelectedId(layers.find((layer) => layer.id !== selected.id)?.id ?? ''); }} className="rounded border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Delete element</button>
              </div>
            </>}
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-bold">Templates</h2>
            <label className="block text-xs font-medium">Template name
              <input value={templateName} onChange={(e) => setTemplateName(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm" />
            </label>
            <button onClick={saveTemplate} className="mt-3 w-full rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-black">Save current template</button>
            {savedTemplates.length > 0 && <div className="mt-3 space-y-2">{savedTemplates.map((template) => <div key={template.name} className="flex items-center gap-2"><button onClick={() => loadTemplate(template.name)} className="min-w-0 flex-1 truncate rounded border px-3 py-2 text-left text-xs hover:bg-gray-50">{template.name}</button><button onClick={() => { const next = savedTemplates.filter((item) => item.name !== template.name); setSavedTemplates(next); localStorage.setItem('24ghontatv-social-card-templates', JSON.stringify(next)); }} className="rounded border px-2 py-2 text-xs text-red-600" aria-label={`Delete ${template.name}`}>×</button></div>)}</div>}
            <p className="mt-2 text-[11px] text-gray-500">Templates are stored in this browser only for this first isolated version. They are not yet shared across staff or devices.</p>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-2 font-bold">Layers ({layers.length})</h2>
            <div className="max-h-56 space-y-1 overflow-y-auto">{layers.map((layer) => <button key={layer.id} onClick={() => setSelectedId(layer.id)} className={`flex w-full items-center justify-between rounded px-2 py-2 text-left text-xs ${selectedId === layer.id ? 'bg-blue-50 font-bold text-blue-800' : 'hover:bg-gray-50'}`}><span className="truncate">{layer.kind === 'image' ? '▧' : 'T'} {layer.name}</span><span className="ml-2 text-gray-400">{layer.visible ? 'Shown' : 'Hidden'}</span></button>)}</div>
          </section>
        </aside>
      </div>
    </div>
  );
}
