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

    try {
      new URL(formState.longUrl)
    } catch {
      setFormState(prev => ({ ...prev, error: 'Please enter a valid URL' }))
      return
    }

    setFormState(prev => ({ ...prev, isLoading: true, error: null }))

    await new Promise(resolve => setTimeout(resolve, 500))

    const randomCode: string = Math.random().toString(36).substring(2, 8)
    
    const shortenedUrl: ShortenedUrl = {
      id: '',
      longUrl: formState.longUrl,
      shortCode: randomCode,
      createdAt: new Date(),
      clicks: 0
    }

    setResult(shortenedUrl)
    setFormState(prev => ({ ...prev, isLoading: false }))
  }

  const handleCopy = async (text: string): Promise<void> => {
    await navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white shadow-md rounded-xl p-6">
        <h1 className="text-3xl font-bold text-center mb-4">URL Shortener</h1>
        <p className="text-gray-600 text-center mb-6">
          Paste your long URL and create a short one.
        </p>

        <div className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              placeholder="Enter your long URL (e.g., https://example.com)"
              value={formState.longUrl}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formState.error && (
              <p className="text-red-500 text-sm mt-2">{formState.error}</p>
            )}
          </div>

          <button 
            onClick={handleShorten}
            disabled={formState.isLoading || !formState.longUrl.trim()}
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {formState.isLoading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </div>

        {result && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Your shortened URL:</p>
            <div className="flex items-center gap-2 mb-3">
              <code className="flex-1 bg-white px-3 py-2 rounded border text-blue-600 overflow-x-auto">
                localhost:3000/u/{result.shortCode}
              </code>
              <button 
                onClick={() => handleCopy(`http://localhost:3000/u/${result.shortCode}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm whitespace-nowrap"
              >
                Copy
              </button>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Original: {result.longUrl}</p>
              <p>Created: {result.createdAt?.toLocaleString()}</p>
              <p>Clicks: {result.clicks}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}