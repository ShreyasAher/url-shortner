export interface ShortenedUrl {
  id?: string              
  longUrl: string
  shortCode: string
  createdAt: Date         
  clicks: number       
}

export type UrlFormState = {
  longUrl: string
  isLoading: boolean
  error: string | null
}

export type CreateUrlInput = {
  longUrl: string
  shortCode: string
}