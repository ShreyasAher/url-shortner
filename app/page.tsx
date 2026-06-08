"use client"

import { useState } from 'react'

export default function Home() {
  const [longUrl, setLongUrl] = useState('')
  const [shortCode, setShortCode] = useState('')

  const handleShorten = () => {
    // Generate a random 6-character code (temporary mock logic)
    const randomCode = Math.random().toString(36).substring(2, 8)
    setShortCode(randomCode)
  }

  const handleClear = () => {
  setLongUrl('')
  setShortCode('')
}

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white shadow-md rounded-xl p-6">
        <h1 className="text-3xl font-bold text-center mb-4">URL Shortener</h1>
        <p className="text-gray-600 text-center mb-6">
          Paste your long URL and create a short one.
        </p>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter your long URL"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleShorten}
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Shorten URL
          </button>
        </div>

        {shortCode && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Your shortened URL:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-white px-3 py-2 rounded border text-blue-600">
                localhost:3000/{shortCode}
              </code>
              <button 
                onClick={() => navigator.clipboard.writeText(`localhost:3000/${shortCode}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                Copy
              </button>
              <button onClick={handleClear} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}