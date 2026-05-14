"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { AlertCircle, Building2, Lock, Mail } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const success = await login(email, password, "admin")

    if (success) {
      document.cookie = "admin-session=authenticated; path=/; max-age=86400"
      router.push("/admin/dashboard")
    } else {
      setError("Invalid email or password.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_38%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_100%)] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-[1.05fr_0.95fr] gap-6 items-stretch">
        <section className="hidden lg:flex flex-col justify-between rounded-[2rem] bg-slate-950 text-white p-10 xl:p-12 overflow-hidden relative border border-white/10 shadow-2xl">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(59,130,246,0.28),transparent_35%,rgba(14,165,233,0.16)_70%,transparent)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <Building2 className="h-4 w-4" />
              GitHub-powered CMS
            </div>
            <h1 className="mt-8 max-w-xl text-5xl font-semibold tracking-tight">
              Real estate content management without a database.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
              Manage projects, events, and future content directly from JSON files in GitHub with
              validation, image uploads, and automatic redeploys.
            </p>
          </div>
          <div className="relative grid grid-cols-3 gap-4 text-sm text-slate-300">
            {[
              ["GitHub", "source of truth"],
              ["Zod", "validated forms"],
              ["Vercel", "redeploy on save"],
            ].map(([title, subtitle]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="font-medium text-white">{title}</div>
                <div className="mt-1 text-xs text-slate-300">{subtitle}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] bg-white/90 backdrop-blur-xl border border-white/70 shadow-[0_30px_100px_rgba(15,23,42,0.12)] p-6 sm:p-8 xl:p-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <Lock className="h-3.5 w-3.5" />
              Admin access
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900">Sign in to the dashboard</h2>
            <p className="mt-2 text-sm text-slate-600">
              Use your admin credentials to manage the CMS.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sabit.com"
                  autoComplete="email"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Open dashboard"}
            </button>
          </form>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Demo account: admin@sabitasset.com / admin123
          </div>
        </section>
      </div>
    </div>
  )
}
