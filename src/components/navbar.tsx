'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PawPrint, ImagePlus, MessageCircle } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/', icon: <Home size={18} /> },
  { label: 'Pet Profile', href: '/dashboard/pets', icon: <PawPrint size={18} /> },
  { label: 'Breed Identifier', href: '/dashboard/identify', icon: <ImagePlus size={18} /> },
  { label: 'Chatbot', href: '/dashboard/chatbot', icon: <MessageCircle size={18} /> },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-gradient-to-r from-teal-600 to-teal-400 text-white px-10 py-3 shadow-lg rounded-b-lg backdrop-blur-sm">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Logo + App Name */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="PawCare Logo" width={32} height={32} className="rounded-full" />
          <span className="text-2xl font-bold tracking-wide text-white">PawCare</span>
        </Link>

        {/* Navigation Items */}
        <ul className="flex space-x-8">
          {navItems.map(({ href, label, icon }) => {
            const isActive = pathname === href
            return (
              <li key={href} className="relative">
                <Link
                  href={href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-transform duration-300
                    ${
                      isActive
                        ? 'font-semibold text-white scale-110 bg-teal-700/80 shadow-lg'
                        : 'text-teal-100 hover:text-white hover:scale-105 hover:bg-teal-700/40 hover:backdrop-blur-sm'
                    }
                  `}
                >
                  <span
                    className={`
                      transition-colors duration-300
                      ${isActive ? 'text-white' : 'text-teal-200'}
                    `}
                  >
                    {icon}
                  </span>
                  <span className="text-base">{label}</span>
                </Link>

                {isActive && (
                  <span className="absolute -bottom-1 left-4 w-[calc(100%-2rem)] h-1 bg-white rounded-full animate-bounceUnderline"></span>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      <style jsx>{`
        @keyframes bounceUnderline {
          0%, 100% {
            transform: scaleX(1);
          }
          50% {
            transform: scaleX(1.3);
          }
        }
        .animate-bounceUnderline {
          animation: bounceUnderline 1.2s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
    </nav>
  )
}
