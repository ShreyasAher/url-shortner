import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Props = {
  params: Promise<{
    shortCode: string
  }>
}

/**
 * GET /api/short/:shortCode
 * Get details of a specific short URL
 */
export async function GET(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { shortCode } = await params  // ← Added await

    const link = await prisma.link.findUnique({
      where: { shortCode }
    })

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: link
    })

  } catch (error) {
    console.error('Error fetching link:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/short/:shortCode
 * Delete a short URL
 */
export async function DELETE(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { shortCode } = await params  // ← Added await

    await prisma.link.delete({
      where: { shortCode }
    })

    return NextResponse.json({
      success: true,
      message: 'Link deleted'
    })

  } catch (error) {
    console.error('Error deleting link:', error)
    
    return NextResponse.json(
      { error: 'Failed to delete link' },
      { status: 500 }
    )
  }
}