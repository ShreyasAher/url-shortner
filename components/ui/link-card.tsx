"use client"

import { useState } from 'react'
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
    if (!confirm('Are you sure you want to delete this link?')) return

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
    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition">
      <div className="mb-4">
        <label className="text-xs text-gray-500 uppercase font-semibold">
          Short URL
        </label>
        <div className="flex items-center gap-2 mt-1">
          <code className="flex-1 bg-blue-50 px-3 py-2 rounded border border-blue-200 text-blue-600 font-mono text-sm truncate">
            {shortUrl}
          </code>
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded font-semibold text-sm transition ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs text-gray-500 uppercase font-semibold">
          Original URL
        </label>
        <p className="text-sm text-gray-700 mt-1 truncate" title={link.longUrl}>
          {link.longUrl}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded p-3">
          <p className="text-xs text-gray-500">Clicks</p>
          <p className="text-xl font-bold text-gray-800">{link.clicks}</p>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <p className="text-xs text-gray-500">Created</p>
          <p className="text-sm font-semibold text-gray-800">
            {new Date(link.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold text-sm transition"
        >
          🔗 Visit
        </a>
        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded font-semibold text-sm transition disabled:opacity-50"
          >
            {isDeleting ? '⏳ Deleting...' : '🗑️ Delete'}
          </button>
        )}
      </div>
    </div>
  )
}