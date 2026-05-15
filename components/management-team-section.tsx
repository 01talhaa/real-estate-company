"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Linkedin } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { ManagementMember } from "@/types/management"

export function ManagementTeamSection() {
  const { t } = useLanguage()
  const [members, setMembers] = useState<ManagementMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await fetch("/api/management")
        const json = await response.json()
        if (json.success && Array.isArray(json.data)) {
          setMembers(json.data)
        }
      } catch {
        setMembers([])
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  const departments = [
    { en: "All Departments", bn: "সকল বিভাগ" },
    ...Array.from(new Map(members.map((member) => [member.department.en, member.department])).values()),
  ]
  const [activeDept, setActiveDept] = useState<string>("All Departments")

  const filtered = activeDept === "All Departments" ? members : members.filter((member) => member.department.en === activeDept)

  return (
    <section id="management-team" className="py-20 sm:py-28 bg-gradient-to-b from-white to-[#F0FDF4]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-10 h-px bg-[#064E3B]" />
            <p className="text-xs font-bold tracking-[0.2em] text-[#064E3B] uppercase">{t({ en: "Management", bn: "ব্যবস্থাপনা" })}</p>
            <span className="w-10 h-px bg-[#064E3B]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-5">
            {t({ en: "Our Management Team", bn: "আমাদের ব্যবস্থাপনা দল" })}
          </h2>
          <p className="text-lg text-gray-500 font-light">
            {t({
              en: "A dedicated team working every day to protect your investment and serve your family.",
              bn: "আপনার বিনিয়োগ সুরক্ষায় ও পরিবারের সেবায় প্রতিদিন কাজ করে যাওয়া একটি নিবেদিত দল।",
            })}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {departments.map((dept) => (
            <button
              key={dept.en}
              id={`dept-filter-${dept.en.toLowerCase().replace(/ /g, "-")}`}
              onClick={() => setActiveDept(dept.en)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activeDept === dept.en
                  ? "bg-[#064E3B] text-white shadow-lg shadow-[#064E3B]/20"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-[#064E3B]/30 hover:text-[#064E3B]"
              }`}
            >
              {t(dept)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
            Loading management team...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((member) => (
              <Link key={member.id} href={`/management/${member.id}`}>
                <MemberCard member={member} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function MemberCard({ member }: { member: ManagementMember }) {
  const { t } = useLanguage()

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={member.image}
          alt={t(member.name)}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#064E3B]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {member.linkedin && (
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#064E3B] hover:bg-[#064E3B] hover:text-white transition-colors shadow-lg"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-[#064E3B] rounded-full border border-[#10B981]/30">
            {t(member.department)}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-gray-900 text-xl mb-1 group-hover:text-[#064E3B] transition-colors">{t(member.name)}</h3>
        <p className="text-[#064E3B] font-semibold text-sm mb-3">{t(member.role)}</p>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{t(member.bio)}</p>
      </div>
    </div>
  )
}
