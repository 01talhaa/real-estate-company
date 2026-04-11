"use client"

import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

export function OurStorySection() {
  const { t } = useLanguage()

  return (
    <section
      id="our-story"
      className="relative overflow-hidden py-20 sm:py-28 bg-gradient-to-br from-[#F0FDF4] via-white to-[#F0FDF4]"
    >
      {/* Decorative background circles */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#064E3B]/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-[#10B981]/5 blur-3xl" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left (desktop) / Bottom (mobile): Image ── */}
          <div className="order-2 lg:order-1 relative">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-[#064E3B]/10 aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=1200"
                alt={t({
                  en: "A happy family in front of their new home",
                  bn: "পরিবার তাদের নতুন বাড়ির সামনে",
                })}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#064E3B]/40 via-transparent to-transparent" />

              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-lg">
                <p className="text-[#064E3B] font-bold text-sm">
                  {t({
                    en: "Share-Based Flat Acquisition",
                    bn: "শেয়ার ভিত্তিক ফ্ল্যাট অর্জন পদ্ধতি",
                  })}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {t({
                    en: "Easy installments · Low cost · Full legal documentation",
                    bn: "সহজ কিস্তি · স্বল্প খরচ · সম্পূর্ণ আইনি কাগজপত্র",
                  })}
                </p>
              </div>
            </div>

            {/* Decorative accent card */}
            <div className="absolute -top-6 -left-6 bg-[#064E3B] rounded-2xl p-5 shadow-xl hidden lg:block">
              <div className="text-white text-center">
                <div className="text-2xl font-black">৳</div>
                <div className="text-xs text-green-200 font-semibold mt-1">
                  {t({ en: "Affordable", bn: "সাশ্রয়ী" })}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right (desktop) / Top (mobile): Text ── */}
          <div className="order-1 lg:order-2">
            {/* Section badge */}
            <div className="inline-flex items-center gap-3 mb-8">
              <span className="w-10 h-px bg-[#064E3B]" />
              <p className="text-xs font-bold tracking-[0.2em] text-[#064E3B] uppercase">
                {t({ en: "Our Story", bn: "আমাদের কথা" })}
              </p>
              <span className="w-10 h-px bg-[#064E3B]" />
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
              {t({ en: "Our Story", bn: "আমাদের কথা" })}
            </h2>

            {/* Bismillah / Opening block */}
            <div className="relative mb-8 pl-5 border-l-4 border-[#064E3B]/40">
              <div className="text-xl font-bold text-[#064E3B] mb-1 font-serif" dir="rtl">
                بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </div>
              <p className="text-sm text-gray-500 italic">
                {t({
                  en: "In the name of Allah, the Most Gracious, the Most Merciful.",
                  bn: "পরম করুণাময় আল্লাহর নামে শুরু করছি।",
                })}
              </p>
            </div>

            {/* Story paragraphs */}
            <div className="space-y-5 text-gray-600 text-[15px] leading-relaxed font-normal">
              <p>
                {t({
                  en: "In today's rapidly rising economy, making ends meet in urban Bangladesh has become a daily challenge. Education costs, healthcare expenses, and rising rents consume 50–60% of a middle-income family's earnings — leaving little room to breathe, let alone build a future.",
                  bn: "ক্রমবর্ধমান বাজার ও অস্থির অর্থনৈতিক অবস্থায় নগর জীবন পার করা প্রতিদিনই কঠিন হয়ে পড়ছে। সন্তানের পড়ালেখা, চিকিৎসা, এবং বাড়ি ভাড়া মিলিয়ে একজন মধ্যবিত্তের আয়ের ৫০–৬০% খরচ হয়ে যায়।",
                })}
              </p>
              <p>
                {t({
                  en: "Buying a flat through a developer, priced per square foot, remains a distant dream for low and middle-income earners. Sabit Property Management Ltd. was founded to bridge that gap.",
                  bn: "ডেভেলপার কোম্পানির কাছ থেকে প্রতি বর্গফুট দরে ফ্ল্যাট কেনা স্বল্প ও মধ্যম আয়ের মানুষের জন্য কার্যত অসম্ভব। সেই স্বপ্নকে বাস্তবে রূপ দিতেই যাত্রা শুরু করেছে 'সাবিত প্রপার্টি ম্যানেজমেন্ট লিঃ'।",
                })}
              </p>
              <p>
                {t({
                  en: "Through our innovative share-based flat acquisition model, we make homeownership achievable — on easy terms, at low cost, without the burden of conventional developer pricing.",
                  bn: "আমাদের শেয়ার ভিত্তিক ফ্ল্যাট অর্জনের পদ্ধতিতে — সহজ শর্তে, স্বল্প খরচে — আপনার স্বপ্নের বাড়ি এখন আর স্বপ্ন নয়।",
                })}
              </p>
              <p>
                {t({
                  en: "We are currently offering modern flats in prime Dhaka locations — Khilgaon Thana residential area and Trimohoni Bridge-connected Jodhivita residential area — ensuring your family lives in safety, comfort, and dignity.",
                  bn: "আমরা ঢাকার প্রাইম লোকেশনে — খিলগাঁও থানা আবাসিক এলাকা এবং ত্রিমোহনী ব্রিজ সংলগ্ন জোড়াভিটা আবাসিক এলাকায় — আধুনিক ফ্ল্যাটের নিশ্চয়তা দিচ্ছি।",
                })}
              </p>
            </div>

            {/* Closing dua */}
            <p className="mt-8 text-sm text-gray-500 italic border-t border-gray-100 pt-6">
              {t({
                en: "May Allah be our guide and helper.",
                bn: "আল্লাহ যেন আমাদের সহায় হন।",
              })}
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
