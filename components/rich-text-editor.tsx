"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Link from '@tiptap/extension-link'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink
} from "lucide-react"
import { useCallback, useEffect, useState } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  maxLength?: number
  showToolbar?: boolean
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  className = "",
  maxLength = 2000,
  showToolbar = true
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit: maxLength,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
    ],
    content: isMounted ? content : '',
    onUpdate: ({ editor }) => {
      if (isMounted) {
        onChange(editor.getHTML())
      }
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[100px] p-4',
      },
    },
    immediatelyRender: false,
    editable: isMounted,
  }, [isMounted])

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && isMounted && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor, isMounted])

  const setLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  // Show loading state until mounted
  if (!isMounted) {
    return (
      <div className={`border rounded-lg ${className}`}>
        <div className="min-h-[120px] p-4 bg-gray-50 animate-pulse rounded">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!editor) {
    return (
      <div className={`border rounded-lg ${className}`}>
        <div className="min-h-[120px] p-4 bg-gray-50 animate-pulse rounded">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`border rounded-lg ${className}`}>
      {showToolbar && (
        <>
          <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-blue-100 text-blue-700' : ''}`}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : ''}`}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`h-8 w-8 p-0 ${editor.isActive('strike') ? 'bg-blue-100 text-blue-700' : ''}`}
              title="Strikethrough"
            >
              <Underline className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`h-8 w-8 p-0 ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : ''}`}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`h-8 w-8 p-0 ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : ''}`}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`h-8 w-8 p-0 ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-700' : ''}`}
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={setLink}
              className={`h-8 w-8 p-0 ${editor.isActive('link') ? 'bg-blue-100 text-blue-700' : ''}`}
              title="Add Link"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().unsetLink().run()}
              disabled={!editor.isActive('link')}
              className="h-8 w-8 p-0"
              title="Remove Link"
            >
              <Unlink className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="h-8 w-8 p-0"
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="h-8 w-8 p-0"
              title="Redo"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}

      <EditorContent
        editor={editor}
        className="min-h-[120px] prose prose-sm max-w-none focus-within:outline-none [&_*]:!m-0 [&_p]:!mb-2 [&_ul]:!mb-2 [&_ol]:!mb-2 [&_blockquote]:!mb-2 [&_h1]:!text-lg [&_h1]:!font-semibold [&_h1]:!mb-2 [&_h2]:!text-base [&_h2]:!font-semibold [&_h2]:!mb-2 [&_h3]:!text-sm [&_h3]:!font-semibold [&_h3]:!mb-2"
      />

      {maxLength && (
        <div className="px-4 py-2 text-xs text-gray-500 border-t bg-gray-50">
          {editor.storage.characterCount.characters()}/{maxLength} characters
        </div>
      )}
    </div>
  )
}
