"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Link as LinkIcon, Copy, Check, TrendingUp, Shield, Zap } from 'lucide-react'
import type { ShortenedUrl, UrlFormState } from './types/url.types'

export default function Home() {
  const { data: session, status } = useSession()
  const [formState, setFormState] = useState<UrlFormState>({
    longUrl: '',
    isLoading: false,
    error: null
  })
  
  const [result, setResult] = useState<ShortenedUrl | null>(null)
  const [copied, setCopied] = useState(false)

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
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shortUrl = result ? `${window.location.origin}/u/${result.shortCode}` : ''

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      
      <nav className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            SHORTITOUT
          </Link>
          
          <div className="flex items-center gap-4">
            {status === "loading" ? (
              <div className="text-zinc-500 text-sm">Loading...</div>
            ) : session ? (
              <>
                <span className="text-sm text-zinc-400">
                  {session.user?.email}
                </span>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-white text-black text-sm font-medium hover:bg-zinc-200 transition"
                >
                  DASHBOARD
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-zinc-300 hover:text-white transition"
                >
                  LOGIN
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-white text-black text-sm font-medium hover:bg-zinc-200 transition"
                >
                  SIGN UP
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
          SHORTEN YOUR LINKS,<br />
          BROADEN YOUR REACH.
        </h1>
        <p className="text-zinc-400 text-lg mb-12 max-w-2xl mx-auto">
          Enter long URL, make it short in seconds, share, unlimited free.
        </p>

        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input
                type="text"
                placeholder="https://very-long-url-to-be-shortened.com/xyz..."
                value={formState.longUrl}
                onChange={handleInputChange}
                className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-zinc-600 transition font-mono"
              />
            </div>
            <button
              onClick={handleShorten}
              disabled={formState.isLoading || !formState.longUrl.trim()}
              className="px-8 py-4 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-medium text-sm transition flex items-center gap-2"
            >
              SHORTEN
              {formState.isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
            </button>
          </div>

          {formState.error && (
            <p className="text-red-400 text-sm text-left">{formState.error}</p>
          )}
        </div>

       
        {result && (
          <div className="max-w-2xl mx-auto mt-8 bg-zinc-900 border border-zinc-800 p-6">
            <p className="text-zinc-500 text-xs uppercase tracking-wide mb-3">
              Your shortened URL
            </p>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={shortUrl}
                readOnly
                className="flex-1 bg-zinc-800 border border-zinc-700 text-white px-4 py-3 text-sm font-mono focus:outline-none"
              />
              <button
                onClick={() => handleCopy(shortUrl)}
                className="px-6 py-3 bg-white text-black hover:bg-zinc-200 transition flex items-center gap-2 text-sm font-medium"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    COPIED
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    COPY
                  </>
                )}
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-zinc-500 text-xs mb-1">Original URL</p>
                <p className="text-zinc-300 text-sm truncate font-mono">{result.longUrl}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs mb-1">Clicks</p>
                <p className="text-zinc-300 text-2xl font-bold">{result.clicks}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8 border-t border-zinc-900">
        <div className="text-center">
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
            <Zap className="text-zinc-400" size={24} />
          </div>
          <h3 className="font-semibold mb-2">Lightning Fast</h3>
          <p className="text-zinc-500 text-sm">
            Shorten URLs instantly with our optimized infrastructure
          </p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="text-zinc-400" size={24} />
          </div>
          <h3 className="font-semibold mb-2">Track Performance</h3>
          <p className="text-zinc-500 text-sm">
            Monitor clicks and analyze link performance in real-time
          </p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
            <Shield className="text-zinc-400" size={24} />
          </div>
          <h3 className="font-semibold mb-2">Secure & Reliable</h3>
          <p className="text-zinc-500 text-sm">
            Your links are protected with enterprise-grade security
          </p>
        </div>
      </section>

      
      <footer className="border-t border-zinc-900 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-zinc-600 text-sm">
          © 2024 SHORTITOUT. Built with Next.js & Prisma.
        </div>
      </footer>
    </div>
  )
}