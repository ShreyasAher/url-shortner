"use client"

import { useState, useEffect } from 'react'
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from 'next/link'
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {session.user?.name || session.user?.email}!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                ← Home
              </Link>
              <Link
                href="/"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                ➕ Create New
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Links" value={stats.totalLinks} icon="🔗" />
            <StatCard title="Total Clicks" value={stats.totalClicks} icon="👆" />
            <StatCard title="Avg Clicks/Link" value={stats.avgClicks} icon="📊" />
          </div>
        )}

        {stats?.mostClicked && (
          <div className="bg-linear-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-purple-800 mb-2">
              🏆 Most Clicked Link
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <code className="text-sm text-purple-600 font-mono">
                  {window.location.origin}/u/{stats.mostClicked.shortCode}
                </code>
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {stats.mostClicked.longUrl}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-purple-800">
                  {stats.mostClicked.clicks}
                </p>
                <p className="text-xs text-gray-600">clicks</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8">
            <p className="text-red-600 font-semibold">❌ {error}</p>
            <button
              onClick={fetchData}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

       
        {!error && links.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Links Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first shortened URL to get started!
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Create Your First Link
            </Link>
          </div>
        )}

        
        {!error && links.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Your Links ({links.length})
              </h2>
              <button
                onClick={fetchData}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
              >
                🔄 Refresh
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
    </main>
  )
}