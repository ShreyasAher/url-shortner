import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { generateShortCode, isValidUrl, normalizeUrl } from '@/lib/utils'

type CreateShortUrlBody = {
  longUrl: string
}


export async function POST(request: NextRequest) {

  if (!checkRateLimit(request, 10)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  try {
    const session = await auth()
    const userId = session?.user?.id || null

   
    const body: CreateShortUrlBody = await request.json()
    const { longUrl } = body

    if (!longUrl) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    const normalizedUrl = normalizeUrl(longUrl)
    
    if (!isValidUrl(normalizedUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

   
    const whereCondition = userId 
      ? { longUrl: normalizedUrl, userId }
      : { longUrl: normalizedUrl, userId: null }

    const existingLink = await prisma.link.findFirst({
      where: whereCondition
    })

    if (existingLink) {
      return NextResponse.json(
        {
          success: true,
          data: existingLink,
          message: 'URL already shortened'
        },
        { status: 200 }
      )
    }

   
    let shortCode = generateShortCode(6)
    let isUnique = false
    let attempts = 0
    const maxAttempts = 10

    while (!isUnique && attempts < maxAttempts) {
      const existing = await prisma.link.findUnique({
        where: { shortCode }
      })

      if (!existing) {
        isUnique = true
      } else {
        shortCode = generateShortCode(6)
        attempts++
      }
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Failed to generate unique code. Try again.' },
        { status: 500 }
      )
    }

    const link = await prisma.link.create({
      data: {
        longUrl: normalizedUrl,
        shortCode: shortCode,
        userId: userId 
      }
    })

    return NextResponse.json(
      {
        success: true,
        data: link
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating short URL:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


export async function GET() {
  try {
    
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    
    const links = await prisma.link.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: links
    })
    
  } catch (error) {
    console.error('Error fetching links:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    )
  }
}