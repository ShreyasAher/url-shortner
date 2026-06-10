"use client"

import { useState } from 'react'
import { Copy, Check, ExternalLink, Trash2 } from 'lucide-react'
import type { ShortenedUrl } from '@/app/types/url.types'

type LinkCardProps = {
  link: ShortenedUrl
  onDelete: (id: string) => void
  canDelete?: boolean
}

export function LinkCard({ link, onDelete, canDelete = true }: LinkCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [copied, setCopied] = useState(false)

  const shortUrl = `${window.location.origin}/u/${link.shortCode}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    if (!confirm('Delete this link permanently?')) return

    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/short/${link.shortCode}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        onDelete(link.id)
      } else {
        alert('Failed to delete link')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Error deleting link')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-5 hover:border-zinc-700 transition">
      <div className="mb-4">
        <label className="text-xs text-zinc-500 uppercase tracking-wide mb-2 block">
          Short URL
        </label>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm font-mono text-white truncate">
            {shortUrl}
          </code>
          <button
            onClick={handleCopy}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition"
            title="Copy"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs text-zinc-500 uppercase tracking-wide mb-2 block">
          Original URL
        </label>
        <p className="text-sm text-zinc-300 truncate" title={link.longUrl}>
          {link.longUrl}
        </p>
      </div>

      
      <div className="grid grid-cols-2 gap-3 mb-4 pt-4 border-t border-zinc-800">
        <div>
          <p className="text-xs text-zinc-500">Clicks</p>
          <p className="text-2xl font-bold">{link.clicks}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Created</p>
          <p className="text-sm">{new Date(link.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 py-2 text-sm font-medium transition inline-flex items-center justify-center gap-2"
        >
          <ExternalLink size={14} />
          VISIT
        </a>
        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2 text-sm font-medium transition inline-flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Trash2 size={14} />
            {isDeleting ? "..." : "DELETE"}
          </button>
        )}
      </div>
    </div>
  )
}