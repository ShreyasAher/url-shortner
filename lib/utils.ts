/**
 * Generate a random short code
 * @param length - Length of the code (default: 6)
 * @returns Random alphanumeric string
 */
export function generateShortCode(length: number = 6): string {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  
  return result
}

/**
 * Validate if a string is a valid URL
 * @param url - String to validate
 * @returns true if valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Ensure URL has protocol (http/https)
 * @param url - URL string
 * @returns URL with protocol
 */
export function normalizeUrl(url: string): string {
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`
  }
  return url
}