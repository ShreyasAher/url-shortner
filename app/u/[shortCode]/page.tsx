import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

// This tells Next.js this is a dynamic route
type Props = {
  params: {
    shortCode: string
  }
}

export default async function RedirectPage({ params }: Props) {
  const { shortCode } = params

  // Find the link in database
  const link = await prisma.link.findUnique({
    where: { shortCode }
  })

  // If not found, show 404
  if (!link) {
    notFound()
  }

  // Increment click count (fire and forget - don't wait)
  prisma.link.update({
    where: { shortCode },
    data: { clicks: { increment: 1 } }
  }).catch(err => console.error('Failed to update clicks:', err))

  // Redirect to the original URL
  redirect(link.longUrl)
}