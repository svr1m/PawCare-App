'use client'

import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F1] px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white border border-[#EADBC8]">
        <div className="text-center mb-6">
          <Image
            src="/logo.png"
            alt="PawCare Logo"
            width={80}
            height={80}
            className="mx-auto mb-4 rounded-xl shadow-md"
          />
          <h1 className="text-3xl font-extrabold text-[#F4A261] mb-1">🐾 Welcome Back to PawCare</h1>
          <p className="text-[#6D6875]">Sign in to manage your pets and connect with care.</p>
        </div>
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              card: 'shadow-none',
              formButtonPrimary: 'bg-[#F4A261] hover:bg-[#e48d49] text-white font-semibold',
            },
          }}
        />
      </div>
    </div>
  )
}
