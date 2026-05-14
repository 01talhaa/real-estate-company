"use client"

/**
 * Protected Route Component
 * Wraps admin pages and ensures user is authenticated
 * Redirects to login if not authenticated
 */

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ReactNode } from "react"
import { FormSkeleton } from "./admin/skeletons"

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/auth/me")
        if (!response.ok) {
          router.push("/admin/login")
          return
        }
        setIsAuthenticated(true)
      } catch (error) {
        router.push("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="p-8">
        <FormSkeleton />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
