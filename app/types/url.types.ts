// Interface for a shortened URL
export interface ShortenedUrl {
  id?: string
  longUrl: string
  shortCode: string
  createdAt?: Date
  clicks?: number
}

// Type for form input state
export type UrlFormState = {
  longUrl: string
  isLoading: boolean
  error: string | null
}

// Type for the shorten function response
export type ShortenResponse = {
  success: boolean
  shortCode?: string
  error?: string
}