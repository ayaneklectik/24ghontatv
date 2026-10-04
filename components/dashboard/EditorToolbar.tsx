'use client';
import { Editor } from '@tiptap/react';
import { Bold, Italic, Heading1, Heading2, Quote, Minus, Palette } from 'lucide-react';

export default function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const toggleHeading = (level: 1 | 2 | 3) => editor.chain().focus().toggleHeading({ level }).run();

  return (
    <div className="flex items-center gap-2 border-b border-black/10 pb-2 mb-2 bg-gray-50 p-2 rounded-t-lg">
      <button onClick={() => toggleHeading(1)} className="p-1.5 hover:bg-black/10 rounded"><Heading1 size={18} /></button>
      <button onClick={() => toggleHeading(2)} className="p-1.5 hover:bg-black/10 rounded"><Heading2 size={18} /></button>
      <div className="w-px h-6 bg-black/10 mx-1" />
      <button onClick={() => editor.chain().focus().toggleBold().run()} className="p-1.5 hover:bg-black/10 rounded"><Bold size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className="p-1.5 hover:bg-black/10 rounded"><Italic size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className="p-1.5 hover:bg-black/10 rounded"><Quote size={18} /></button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="p-1.5 hover:bg-black/10 rounded"><Minus size={18} /></button>
      <div className="w-px h-6 bg-black/10 mx-1" />
      <button onClick={() => editor.chain().focus().setColor('#ef4444').run()} className="p-1.5 hover:bg-black/10 rounded text-red-600"><Palette size={18} /></button>
    </div>
  );
}