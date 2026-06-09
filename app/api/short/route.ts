import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateShortCode, isValidUrl, normalizeUrl } from '@/lib/utils'

// Type for the request body
type CreateShortUrlBody = {
  longUrl: string
}

/**
 * POST /api/short
 * Creates a shortened URL
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: CreateShortUrlBody = await request.json()
    const { longUrl } = body

    // Validation
    if (!longUrl) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Normalize and validate URL
    const normalizedUrl = normalizeUrl(longUrl)
    
    if (!isValidUrl(normalizedUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Check if URL already exists
    const existingLink = await prisma.link.findFirst({
      where: { longUrl: normalizedUrl }
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

    // Generate unique short code
    let shortCode = generateShortCode(6)
    let isUnique = false
    let attempts = 0
    const maxAttempts = 10

    // Ensure uniqueness (retry if collision)
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

    // Create the short URL in database
    const link = await prisma.link.create({
      data: {
        longUrl: normalizedUrl,
        shortCode: shortCode
      }
    })

    // Return success response
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

/**
 * GET /api/short
 * Get all shortened URLs (for dashboard later)
 */
export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10 // Limit to 10 most recent
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