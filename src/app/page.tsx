'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center max-w-xs hover:shadow-2xl transition-shadow">
      <div className="text-[#2a9d8f] mb-4 text-5xl">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-[#6D6875]">{description}</p>
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const { isSignedIn } = useUser()

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard')
    }
  }, [isSignedIn, router])

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFF8F1] to-[#F4EBD9] text-[#264653] p-8 flex flex-col items-center">
      {/* Hero Section */}
      <section className="max-w-5xl text-center mb-16">
        <h1 className="text-6xl font-extrabold mb-6 text-[#F4A261] animate-pulse">
          🐾 Welcome to PawCare
        </h1>
        <p className="text-2xl max-w-3xl mx-auto mb-8 text-[#6D6875]">
          The ultimate AI-powered pet care app designed to keep your furry friends happy, healthy, and loved.
        </p>
        <SignedOut>
          <div className="flex justify-center gap-8">
            <Link href="/sign-in">
              <button
                className="bg-[#F4A261] hover:bg-[#e48d49] text-white px-8 py-3 rounded-full font-semibold shadow-md transition"
                aria-label="Sign In Button"
              >
                Sign In
              </button>
            </Link>
            <Link href="/sign-up">
              <button
                className="bg-[#2a9d8f] hover:bg-[#21867a] text-white px-8 py-3 rounded-full font-semibold shadow-md transition"
                aria-label="Sign Up Button"
              >
                Sign Up
              </button>
            </Link>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="mt-6 flex justify-center">
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-20">
        <FeatureCard
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              className="w-12 h-12 mx-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          title="Care Tips"
          description="Feeding? Walk time? Medication? Get timely nudges tailored to your pet’s unique care routine."
        />
        <FeatureCard
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              className="w-12 h-12 mx-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10l4.553-1.106a2 2 0 01.947 3.859L16 14m-3 3l-5 2.5m5-2.5l3-4m-3 4L9 21m0 0l-5-2.5m14-5l-5-2.5"
              />
            </svg>
          }
          title="AI Breed Identification"
          description="Upload a photo and instantly identify your dog's breed with our smart AI technology."
        />
        <FeatureCard
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              className="w-12 h-12 mx-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 8h10M7 12h4m-1 8v-2a4 4 0 014-4h4"
              />
            </svg>
          }
          title="Smart Chat Assistant"
          description="Get personalized pet care tips and answers by chatting with our AI assistant."
        />
        <FeatureCard
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              className="w-12 h-12 mx-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405M15 17l-5-5m5 5v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6m10-7h-4a2 2 0 00-2 2v1m6-3v3m0 0l-3-3"
              />
            </svg>
          }
          title="Secure Cloud Backup"
          description="All your pet’s records, safely stored and synced in the cloud—access them anywhere, anytime."
        />
      </section>

      {/* Call to Action Section */}
      <section className="max-w-4xl text-center mb-12 px-6">
        <h2 className="text-3xl font-bold mb-4 text-[#264653]">Ready to give your pet the best care?</h2>
        <p className="text-[#6D6875] text-lg mb-6">
          Sign up today and experience the joy of hassle-free, smart pet management with PawCare!
        </p>
        <SignedOut>
          <div className="flex justify-center gap-6">
            <Link href="/sign-up">
              <button className="bg-[#2a9d8f] hover:bg-[#21867a] text-white px-10 py-4 rounded-full font-semibold shadow-lg transition">
                Get Started
              </button>
            </Link>
          </div>
        </SignedOut>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-[#E7E5E4] pt-6 pb-4 text-center text-sm text-[#6D6875]">
        <p>© {new Date().getFullYear()} PawCare. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-2">
          {/* Placeholder social icons */}
          <a href="#" aria-label="Facebook" className="hover:text-[#F4A261] transition">
            <svg className="w-5 h-5 inline" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12a10 10 0 10-11.62 9.87v-6.99H8.08v-2.88h2.3V9.41c0-2.28 1.36-3.54 3.44-3.54.99 0 2.02.18 2.02.18v2.23h-1.14c-1.12 0-1.47.7-1.47 1.42v1.7h2.5l-.4 2.88h-2.1v6.99A10 10 0 0022 12z" />
            </svg>
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-[#F4A261] transition">
            <svg className="w-5 h-5 inline" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 19c7.732 0 11.965-6.404 11.965-11.965 0-.182 0-.364-.013-.544A8.58 8.58 0 0022 5.92a8.276 8.276 0 01-2.357.646 4.143 4.143 0 001.815-2.286 8.287 8.287 0 01-2.623 1 4.134 4.134 0 00-7.041 3.77 11.732 11.732 0 01-8.52-4.32 4.138 4.138 0 001.28 5.524 4.094 4.094 0 01-1.874-.518v.05a4.137 4.137 0 003.317 4.056 4.148 4.148 0 01-1.868.07 4.138 4.138 0 003.863 2.874A8.292 8.292 0 012 17.593a11.703 11.703 0 006.29 1.84" />
            </svg>
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-[#F4A261] transition">
            <svg className="w-5 h-5 inline" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a1 1 0 110 2 1 1 0 010-2zm-5 2a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
            </svg>
          </a>
        </div>
      </footer>
    </main>
  )
}
