'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import EditorToolbar from './EditorToolbar';

export default function NewsEditor({ content, onChange }: { content: string, onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      // StarterKit includes Heading, Blockquote, HorizontalRule, and TextStyle by default
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  return (
    <div className="border border-black/10 rounded-lg bg-white overflow-hidden">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="p-4 min-h-[300px] outline-none" />
    </div>
  );
}