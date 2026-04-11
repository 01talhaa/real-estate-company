"use client"

import { LanguageProvider } from "@/contexts/language-context"
import { Toaster } from "@/components/ui/sonner"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      {children}
      <Toaster />
    </LanguageProvider>
  )
}
