"use client"

import React, { createContext, useCallback, useContext, useEffect, useState } from "react"

export type Lang = "en" | "bn"

export interface BilingualText {
  en: string
  bn: string
}

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (content: BilingualText) => string
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "bn",
  setLang: () => {},
  t: (c) => c.bn,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bn")

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sabit-lang") as Lang | null
      if (stored === "en" || stored === "bn") {
        setLangState(stored)
      }
    } catch {}
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem("sabit-lang", l)
    } catch {}
  }, [])

  const t = useCallback(
    (content: BilingualText) => content[lang],
    [lang]
  )

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
