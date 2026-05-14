"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Linkedin, Mail } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { ManagementMember } from "@/src/lib/github/management-operations"

interface Director {
  name: { en: string; bn: string }
  role: { en: string; bn: string }
  bio: { en: string; bn: string }
  image: string
  social?: { linkedin?: string; mail?: string }
}

const directors: Director[] = [
  {
    name: { en: "Md. Abdul Karim", bn: "মোঃ আব্দুল করিম" },
    role: { en: "Chairman", bn: "চেয়ারম্যান" },
    bio: {
      en: "Visionary founder with 25+ years in Dhaka real estate. Pioneered the share-based flat model to serve middle-income Bangladeshi families.",
      bn: "ঢাকার রিয়েল এস্টেটে ২৫+ বছরের অভিজ্ঞতাসম্পন্ন দূরদর্শী প্রতিষ্ঠাতা। মধ্যবিত্ত বাংলাদেশি পরিবারের জন্য শেয়ার-ভিত্তিক ফ্ল্যাট মডেলের পথিকৃৎ।",
    },
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
    social: { linkedin: "#", mail: "#" },
  },
  {
    name: { en: "Md. Rafiqul Alam", bn: "মোঃ রফিকুল আলম" },
    role: { en: "Managing Director", bn: "ব্যবস্থাপনা পরিচালক" },
    bio: {
      en: "Drives day-to-day strategy and operations. Extensive background in property development and investor relations across Bangladesh.",
      bn: "দৈনন্দিন কৌশল ও কার্যক্রম পরিচালনা করেন। সারা বাংলাদেশে সম্পত্তি উন্নয়ন ও বিনিয়োগকারী সম্পর্কে ব্যাপক অভিজ্ঞতা রয়েছে।",
    },
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
    social: { linkedin: "#", mail: "#" },
  },
  {
    name: { en: "Nusrat Jahan", bn: "নুসরাত জাহান" },
    role: { en: "Director, Finance", bn: "পরিচালক (অর্থ বিভাগ)" },
    bio: {
      en: "Oversees all financial planning, shareholder accounts, and audit processes. CA-qualified with a decade of experience in property finance.",
      bn: "সমস্ত আর্থিক পরিকল্পনা, শেয়ারহোল্ডার অ্যাকাউন্ট এবং অডিট প্রক্রিয়া তত্ত্বাবধান করেন। সম্পত্তি অর্থায়নে এক দশকের অভিজ্ঞতাসহ সিএ-যোগ্য।",
    },
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    social: { linkedin: "#" },
  },
  {
    name: { en: "Kazi Tariqul Islam", bn: "কাজী তারিকুল ইসলাম" },
    role: { en: "Director, Operations", bn: "পরিচালক (পরিচালনা বিভাগ)" },
    bio: {
      en: "Manages construction timelines, contractor relationships, and quality assurance for all Sabit projects.",
      bn: "সমস্ত সাবিত প্রকল্পের নির্মাণ সময়সীমা, ঠিকাদার সম্পর্ক এবং মান নিশ্চিতকরণ পরিচালনা করেন।",
    },
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800",
    social: { mail: "#" },
  },
  {
    name: { en: "Adv. Shahida Khatun", bn: "অ্যাডভ. শাহিদা খাতুন" },
    role: { en: "Director, Legal & Compliance", bn: "পরিচালক (আইনি ও সম্মতি)" },
    bio: {
      en: "Ensures every property deed, shareholder contract, and land title is fully compliant with Bangladesh property law.",
      bn: "প্রতিটি সম্পত্তির দলিল, শেয়ারহোল্ডার চুক্তি এবং জমির দলিল বাংলাদেশ সম্পত্তি আইন পুরোপুরি মেনে চলে তা নিশ্চিত করেন।",
    },
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800",
    social: { linkedin: "#", mail: "#" },
  },
]

export function BoardOfDirectorsSection() {
  const { t } = useLanguage()
  const [managementPreview, setManagementPreview] = useState<ManagementMember[]>([])

  useEffect(() => {
    async function fetchManagementPreview() {
      try {
        const response = await fetch("/api/management")
        const json = await response.json()
        if (json.success && Array.isArray(json.data)) {
          setManagementPreview(json.data.slice(0, 3))
        }
      } catch {
        setManagementPreview([])
      }
    }

    fetchManagementPreview()
  }, [])

  return (
    <section id="board" className="py-24 bg-white relative">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-10 h-px bg-[#064E3B]" />
            <p className="text-xs font-bold tracking-[0.2em] text-[#064E3B] uppercase">{t({ en: "Leadership", bn: "নেতৃত্ব" })}</p>
            <span className="w-10 h-px bg-[#064E3B]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
            {t({ en: "Board of Directors", bn: "পরিচালনা পর্ষদ" })}
          </h2>
          <p className="text-xl text-gray-500 font-light leading-relaxed">
            {t({
              en: "Experienced leadership committed to your trust and investment.",
              bn: "আপনার বিশ্বাস ও বিনিয়োগের প্রতি দায়িত্বশীল অভিজ্ঞ নেতৃত্ব।",
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {directors.map((director, index) => (
            <div key={index} className="group flex flex-col">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] mb-6">
                <Image
                  src={director.image}
                  alt={t(director.name)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-[#064E3B]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center gap-4 backdrop-blur-sm p-6">
                  <p className="text-white text-center text-sm font-light leading-relaxed">{t(director.bio)}</p>
                  <div className="flex items-center gap-3 mt-2">
                    {director.social?.linkedin && (
                      <Link href={director.social.linkedin} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white text-white hover:text-[#064E3B] transition-colors">
                        <Linkedin className="w-4 h-4" />
                      </Link>
                    )}
                    {director.social?.mail && (
                      <Link href={director.social.mail} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white text-white hover:text-[#064E3B] transition-colors">
                        <Mail className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#064E3B] transition-colors mb-2">{t(director.name)}</h3>
                <span className="inline-block px-3 py-1 bg-[#064E3B]/10 text-[#064E3B] text-xs font-bold rounded-full">
                  {t(director.role)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {managementPreview.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-10">
              <p className="text-xs font-bold tracking-[0.2em] text-[#064E3B] uppercase mb-3">{t({ en: "Management", bn: "ব্যবস্থাপনা" })}</p>
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">{t({ en: "Management Spotlight", bn: "ব্যবস্থাপনা স্পটলাইট" })}</h3>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {managementPreview.map((member) => (
                <Link key={member.id} href={`/management/${member.id}`}>
                  <div className="group overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <Image src={member.image} alt={t(member.name)} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(min-width: 768px) 33vw, 100vw" />
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#064E3B]">{t(member.department)}</p>
                      <h4 className="mt-2 text-xl font-bold text-gray-900 group-hover:text-[#064E3B] transition-colors">{t(member.name)}</h4>
                      <p className="mt-1 text-sm font-semibold text-gray-500">{t(member.role)}</p>
                      <p className="mt-3 text-sm leading-7 text-gray-500 line-clamp-3">{t(member.bio)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
