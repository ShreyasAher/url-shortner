"use client"

import { useState } from 'react'
import type { ShortenedUrl, UrlFormState } from './types/url.types'

export default function Home() {
  const [formState, setFormState] = useState<UrlFormState>({
    longUrl: '',
    isLoading: false,
    error: null
  })
  
  const [result, setResult] = useState<ShortenedUrl | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormState(prev => ({
      ...prev,
      longUrl: e.target.value,
      error: null
    }))
  }

  const handleShorten = async (): Promise<void> => {
    if (!formState.longUrl.trim()) {
      setFormState(prev => ({ ...prev, error: 'Please enter a URL' }))
      return
    }

    setFormState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Call our API endpoint
      const response = await fetch('/api/short', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longUrl: formState.longUrl })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL')
      }

      setResult(data.data)
      setFormState(prev => ({ ...prev, isLoading: false, longUrl: '' }))
      
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Something went wrong'
      }))
    }
  }

  const handleCopy = async (text: string): Promise<void> => {
    await navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const shortUrl = result ? `${window.location.origin}/u/${result.shortCode}` : ''

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            URL Shortener
          </h1>
          <p className="text-gray-600">
            Transform long URLs into short, shareable links
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Enter your long URL (e.g., https://example.com)"
              value={formState.longUrl}
              onChange={handleInputChange}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition"
            />
            {formState.error && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <span>⚠️</span> {formState.error}
              </p>
            )}
          </div>

          <button 
            onClick={handleShorten}
            disabled={formState.isLoading || !formState.longUrl.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {formState.isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Shortening...
              </>
            ) : (
              <>
                <span>✂️</span>
                Shorten URL
              </>
            )}
          </button>
        </div>

        {result && (
          <div className="mt-6 p-5 bg-green-50 border-2 border-green-200 rounded-lg animate-fadeIn">
            <p className="text-sm font-semibold text-green-800 mb-3">
              ✅ Your shortened URL:
            </p>
            
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={shortUrl}
                readOnly
                className="flex-1 bg-white px-3 py-2 rounded border-2 border-green-300 text-blue-600 font-mono text-sm"
              />
              <button 
                onClick={() => handleCopy(shortUrl)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-semibold whitespace-nowrap"
              >
                📋 Copy
              </button>
            </div>

            <div className="text-xs text-gray-600 space-y-1 bg-white p-3 rounded border border-gray-200">
              <p><strong>Original:</strong> {result.longUrl}</p>
              <p><strong>Created:</strong> {new Date(result.createdAt).toLocaleString()}</p>
              <p><strong>Clicks:</strong> {result.clicks}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}