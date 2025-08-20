import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Metadata } from 'next'
import Navbar from '@/components/navbar' // make sure path is correct
import { SignedIn } from '@clerk/nextjs'
export const metadata: Metadata = {
  title: 'PawCare',
  description: 'Pet care app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className="h-full bg-white text-gray-900">
         <SignedIn> <Navbar /></SignedIn>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}
