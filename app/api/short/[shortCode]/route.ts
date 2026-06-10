import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

type Props = {
  params: Promise<{
    shortCode: string
  }>
}


export async function GET(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { shortCode } = await params

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


export async function DELETE(
  request: NextRequest,
  { params }: Props
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { shortCode } = await params

    const link = await prisma.link.findUnique({
      where: { shortCode }
    })

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      )
    }

    if (link.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own links' },
        { status: 403 }
      )
    }

   
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