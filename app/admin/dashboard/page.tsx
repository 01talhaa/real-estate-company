"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, BarChart3, CalendarDays, Building2, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [projectCount, setProjectCount] = useState(0)
  const [eventCount, setEventCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProjectCount(0)
      setEventCount(0)
      setLoading(false)
    }, 200)

    return () => clearTimeout(timer)
  }, [])

  const cards = [
    { label: "Projects", value: loading ? "..." : projectCount, icon: Building2, href: "/admin/projects" },
    { label: "Events", value: loading ? "..." : eventCount, icon: CalendarDays, href: "/admin/events" },
    { label: "Content status", value: "MongoDB", icon: Sparkles, href: "/admin/projects" },
  ]

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 p-8 text-white shadow-2xl">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Admin dashboard</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          MongoDB-powered content control.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
          Manage projects and events from a clean SaaS-style dashboard backed by a fast database.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.label} href={card.href}>
              <Card className="border-slate-200 bg-white/90 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{card.label}</p>
                      <p className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-950 p-3 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200 bg-white/90 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-900">Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Link href="/admin/projects" className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-sm font-medium text-slate-700 hover:border-slate-400">
              Manage projects
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/admin/events" className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-sm font-medium text-slate-700 hover:border-slate-400">
              Manage events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/90 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-900">What’s next</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>Monitor index health and query performance for consistent low-latency responses.</p>
            <p>Seed new environments with the MongoDB data migration script.</p>
            <p>Keep media assets optimized with Cloudinary presets.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}