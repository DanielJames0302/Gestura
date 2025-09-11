"use client"

import {
  ClerkProvider,
} from '@clerk/nextjs'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <div className="bg-purple-400 min-h-screen">
        {children}
      </div>
    </ClerkProvider>
  )
}