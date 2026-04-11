"use client"

import { Megaphone } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

const NOTICES = [
  {
    en: "New Project Launch: Sabit Khilgaon Block B — Flat registration now open.",
    bn: "নতুন প্রকল্প উদ্বোধন: সাবিত খিলগাঁও ব্লক বি — ফ্ল্যাট নিবন্ধন এখন চালু।",
    href: "/projects",
  },
  {
    en: "Upcoming Investor Meet — Q2 2025. Register your seat today.",
    bn: "আসন্ন বিনিয়োগকারী সভা — দ্বিতীয় প্রান্তিক ২০২৫। আজই আপনার আসন নিশ্চিত করুন।",
    href: "/events",
  },
  {
    en: "Announcement: Twin Towers project registration opens July 2025.",
    bn: "ঘোষণা: টুইন টাওয়ার প্রকল্পের নিবন্ধন জুলাই ২০২৫ থেকে শুরু হবে।",
    href: "/projects",
  },
  {
    en: "Sabit Green Homes — Jodhivita: 8 flats successfully handed over to owners.",
    bn: "সাবিত গ্রিন হোমস — জোড়াভিটা: ৮টি ফ্ল্যাট সফলভাবে মালিকদের হাতে তুলে দেওয়া হয়েছে।",
    href: "/projects",
  },
]

export function NoticeMarquee() {
  const { t } = useLanguage()

  // Triple the notices for seamless loop
  const displayNotices = [...NOTICES, ...NOTICES, ...NOTICES]

  return (
    <div className="w-full bg-[#03291E] text-[#D1FAE5] py-3 overflow-hidden flex items-center relative border-t border-green-light/20 shadow-inner z-[60]">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-r from-[#03291E] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-l from-[#03291E] to-transparent z-10 pointer-events-none" />

      <div className="flex w-[300%] animate-scroll-left whitespace-nowrap items-center hover:[animation-play-state:paused]">
        {displayNotices.map((notice, i) => (
          <Link
            href={notice.href}
            key={i}
            className="flex items-center gap-3 px-8 flex-shrink-0 group cursor-pointer"
          >
            <Megaphone className="w-4 h-4 text-green-light group-hover:text-white transition-colors shrink-0" />
            <span className="text-sm font-bold tracking-widest uppercase group-hover:text-white transition-colors">
              {t({ en: notice.en, bn: notice.bn })}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
