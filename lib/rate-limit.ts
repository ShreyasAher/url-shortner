import { NextRequest } from 'next/server'

const rateLimit = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(request: NextRequest, limit: number = 10): boolean {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  const now = Date.now()
  const windowMs = 60 * 1000 

  const current = rateLimit.get(ip)

  if (!current || now > current.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (current.count >= limit) {
    return false
  }

  current.count++
  return true
}