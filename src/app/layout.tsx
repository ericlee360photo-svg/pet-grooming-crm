import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BarkBook - Professional Pet Grooming CRM",
  description: "The complete CRM solution for professional pet groomers. Manage appointments, clients, and your business with ease.",
  keywords: "pet grooming, CRM, appointment booking, pet salon, grooming business",
  authors: [{ name: "BarkBook Team" }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: "BarkBook - Professional Pet Grooming CRM",
    description: "The complete CRM solution for professional pet groomers.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BarkBook - Professional Pet Grooming CRM",
    description: "The complete CRM solution for professional pet groomers.",
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
        <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100">
          {children}
        </div>
      </body>
    </html>
  )
}
