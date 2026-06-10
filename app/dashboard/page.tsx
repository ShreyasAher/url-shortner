"use client"

import { useState, useEffect } from 'react'
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from 'next/link'
import { BarChart3, Link as LinkIcon, LogOut, Plus, RefreshCw } from 'lucide-react'
import type { ShortenedUrl } from '@/app/types/url.types'
import { LinkCard } from '@/components/ui/link-card'
import { StatCard } from '@/components/ui/stat-card'

type UserStats = {
  totalLinks: number
  totalClicks: number
  avgClicks: number
  mostClicked: {
    shortCode: string
    clicks: number
    longUrl: string
  } | null
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [links, setLinks] = useState<ShortenedUrl[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      fetchData()
    }
  }, [status, router])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [linksRes, statsRes] = await Promise.all([
        fetch('/api/short'),
        fetch('/api/user/stats')
      ])

      const linksData = await linksRes.json()
      const statsData = await statsRes.json()

      if (linksData.success) {
        setLinks(linksData.data)
      }
      
      if (statsData.success) {
        setStats(statsData.data)
      }

    } catch (err) {
      console.error('Fetch error:', err)
      setError('Error loading data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = (deletedId: string) => {
    setLinks(prev => prev.filter(link => link.id !== deletedId))
    fetchData()
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            SHORTITOUT
          </Link>
          
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium transition inline-flex items-center gap-2"
            >
              <Plus size={16} />
              NEW LINK
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium transition inline-flex items-center gap-2"
            >
              <LogOut size={16} />
              SIGN OUT
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-zinc-400">
            Welcome back, {session.user?.name || session.user?.email}
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard 
              title="Total Links" 
              value={stats.totalLinks} 
              icon={<LinkIcon size={24} />} 
            />
            <StatCard 
              title="Total Clicks" 
              value={stats.totalClicks} 
              icon={<BarChart3 size={24} />} 
            />
            <StatCard 
              title="Average Clicks" 
              value={stats.avgClicks} 
              icon={<BarChart3 size={24} />} 
            />
          </div>
        )}

        {/* Most Clicked */}
        {stats?.mostClicked && (
          <div className="bg-zinc-900 border border-zinc-800 p-6 mb-12">
            <h3 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wide">
              Most Clicked Link
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <code className="text-sm font-mono text-white">
                  {window.location.origin}/u/{stats.mostClicked.shortCode}
                </code>
                <p className="text-xs text-zinc-500 mt-2 truncate">
                  {stats.mostClicked.longUrl}
                </p>
              </div>
              <div className="text-right ml-6">
                <p className="text-3xl font-bold">{stats.mostClicked.clicks}</p>
                <p className="text-xs text-zinc-500">clicks</p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-6 mb-12">
            <p className="font-medium mb-2">{error}</p>
            <button
              onClick={fetchData}
              className="text-sm underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Links */}
        {!error && links.length === 0 && (
          <div className="text-center py-16 bg-zinc-900 border border-zinc-800">
            <LinkIcon className="mx-auto mb-4 text-zinc-600" size={48} />
            <h3 className="text-xl font-bold mb-2">No Links Yet</h3>
            <p className="text-zinc-400 mb-6">
              Create your first shortened URL to get started
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium hover:bg-zinc-200 transition"
            >
              <Plus size={16} />
              CREATE LINK
            </Link>
          </div>
        )}

        {!error && links.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                Your Links ({links.length})
              </h2>
              <button
                onClick={fetchData}
                className="text-sm text-zinc-400 hover:text-white inline-flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {links.map(link => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onDelete={handleDelete}
                  canDelete={true}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}