import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

type Props = {
  params: Promise<{
    shortCode: string
  }>
}

export default async function RedirectPage({ params }: Props) {

  const { shortCode } = await params

  console.log('shortCode:', shortCode)

  const link = await prisma.link.findUnique({
    where: { shortCode }
  })

  if (!link) {
    notFound()
  }

  prisma.link.update({
    where: { shortCode },
    data: {
      clicks: {
        increment: 1
      }
    }
  }).catch(err => console.error(err))

  redirect(link.longUrl)
}