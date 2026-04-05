import { Megaphone } from "lucide-react"
import Link from "next/link"

const NOTICES = [
  { text: "Breaking: New ultra-luxury property listed in prime commercial district.", href: "/properties" },
  { text: "Market Update: Q3 Commercial Real Estate reports a 12% growth in yields.", href: "/insights" },
  { text: "Investor Alert: Sabit Asset Management limits new portfolio intakes this month.", href: "/services" },
  { text: "Exclusive Pre-launch: Waterfront residential towers now open for early viewing.", href: "/galleries" }
]

export function NoticeMarquee() {
  const displayNotices = [...NOTICES, ...NOTICES, ...NOTICES]

  return (
    <div className="w-full bg-[#03291E] text-[#D1FAE5] py-3 overflow-hidden flex items-center relative border-t border-green-light/20 shadow-inner z-[60]">
      <div className="absolute left-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-r from-[#03291E] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-l from-[#03291E] to-transparent z-10 pointer-events-none" />
      
      <div className="flex w-[300%] animate-scroll-left whitespace-nowrap items-center hover:[animation-play-state:paused]">
        {displayNotices.map((notice, i) => (
          <Link href={notice.href} key={i} className="flex items-center gap-3 px-8 flex-shrink-0 group cursor-pointer">
            <Megaphone className="w-4 h-4 text-green-light group-hover:text-white transition-colors" />
            <span className="text-sm font-bold tracking-widest uppercase group-hover:text-white transition-colors">{notice.text}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
