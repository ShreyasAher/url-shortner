import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'


export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    
    const links = await prisma.link.findMany({
      where: { userId }
    })

    
    const totalLinks = links.length
    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0)
    const avgClicks = totalLinks > 0 ? totalClicks / totalLinks : 0
    const mostClicked = links.sort((a, b) => b.clicks - a.clicks)[0] || null

    return NextResponse.json({
      success: true,
      data: {
        totalLinks,
        totalClicks,
        avgClicks: parseFloat(avgClicks.toFixed(1)),
        mostClicked: mostClicked ? {
          shortCode: mostClicked.shortCode,
          clicks: mostClicked.clicks,
          longUrl: mostClicked.longUrl
        } : null
      }
    })

  } catch (error) {
    console.error('Error fetching stats:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}