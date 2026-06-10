import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "@/components/SessionProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShortItOut - URL Shortener",
  description: "Shorten your links, broaden your reach. Fast, secure, and free URL shortening service.",
  keywords: ["url shortener", "link shortener", "short url", "tiny url"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "ShortItOut - URL Shortener",
    description: "Shorten your links, broaden your reach",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShortItOut - URL Shortener",
    description: "Shorten your links, broaden your reach",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}