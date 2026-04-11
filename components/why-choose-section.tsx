"use client"

import { useLanguage } from "@/contexts/language-context"

const features = [
  {
    icon: "🏠",
    en: { title: "Prime Location Flats", desc: "Modern flats in Khilgaon & Jodhivita — the heart of Dhaka." },
    bn: { title: "প্রাইম লোকেশনে ফ্ল্যাট", desc: "খিলগাঁও ও জোড়াভিটায় আধুনিক ফ্ল্যাট — ঢাকার প্রাণকেন্দ্রে।" },
  },
  {
    icon: "💰",
    en: { title: "Easy Payment Plan", desc: "Affordable monthly installments designed for middle-income families." },
    bn: { title: "সহজ কিস্তি পদ্ধতি", desc: "মধ্যবিত্ত পরিবারের জন্য সাশ্রয়ী মাসিক কিস্তিতে পরিশোধের সুবিধা।" },
  },
  {
    icon: "📄",
    en: { title: "Full Legal Documentation", desc: "Every transaction backed by verified, complete property documents." },
    bn: { title: "সম্পূর্ণ আইনি কাগজপত্র", desc: "প্রতিটি লেনদেন যাচাইকৃত ও সম্পূর্ণ সম্পত্তির কাগজপত্র দ্বারা সমর্থিত।" },
  },
  {
    icon: "🔒",
    en: { title: "Secure & Transparent Investment", desc: "Full financial transparency — monthly reports, open audits." },
    bn: { title: "নিরাপদ ও স্বচ্ছ বিনিয়োগ", desc: "সম্পূর্ণ আর্থিক স্বচ্ছতা — মাসিক প্রতিবেদন, উন্মুক্ত অডিট।" },
  },
  {
    icon: "🏗️",
    en: { title: "Quality Construction", desc: "Engineered to last — Grade-A materials, BUET-supervised builds." },
    bn: { title: "মানসম্পন্ন নির্মাণকাজ", desc: "দীর্ঘস্থায়ী নির্মাণ — গ্রেড-এ উপকরণ, বুয়েট-তত্ত্বাবধানে।" },
  },
  {
    icon: "👨‍👩‍👧",
    en: { title: "Family-Friendly Community", desc: "Safe, peaceful neighbourhoods with mosques and schools nearby." },
    bn: { title: "পারিবারিক পরিবেশ", desc: "নিরাপদ, শান্তিপূর্ণ মহল্লা — পাশে মসজিদ ও স্কুল।" },
  },
  {
    icon: "📊",
    en: { title: "Regular Progress Reporting", desc: "Construction milestones shared with shareholders every month." },
    bn: { title: "নিয়মিত অগ্রগতি প্রতিবেদন", desc: "প্রতি মাসে নির্মাণ অগ্রগতি শেয়ারহোল্ডারদের সাথে ভাগ করা হয়।" },
  },
  {
    icon: "📞",
    en: { title: "Dedicated Customer Support", desc: "Our team is always a call away — no query left unanswered." },
    bn: { title: "নিবেদিত গ্রাহক সেবা", desc: "আমাদের দল সর্বদা একটি ফোনে পাওয়া যায় — কোনো প্রশ্ন অনুত্তরিত থাকে না।" },
  },
]

export function WhyChooseSection() {
  const { t } = useLanguage()

  return (
    <section id="why-choose" className="py-20 sm:py-28 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-10 h-px bg-[#064E3B]" />
            <p className="text-xs font-bold tracking-[0.2em] text-[#064E3B] uppercase">
              {t({ en: "Why Choose Us", bn: "কেন আমরা" })}
            </p>
            <span className="w-10 h-px bg-[#064E3B]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-5">
            {t({ en: "Why Choose Sabit?", bn: "কেন সাবিত বেছে নেবেন?" })}
          </h2>
          <p className="text-lg text-gray-500 font-light">
            {t({
              en: "Eight reasons thousands of families trust us with their most important investment.",
              bn: "আটটি কারণ যেজন্য হাজার হাজার পরিবার তাদের সবচেয়ে গুরুত্বপূর্ণ বিনিয়োগে আমাদের বিশ্বাস করেন।",
            })}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-xl hover:border-[#064E3B]/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Hover bg fill */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#064E3B]/[0.02] to-[#10B981]/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="text-4xl mb-5 leading-none">{f.icon}</div>
                <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-[#064E3B] transition-colors">
                  {t({ en: f.en.title, bn: f.bn.title })}
                </h3>
                <p className="text-gray-400 text-xs font-medium mb-3 leading-snug">
                  {t({ en: "", bn: f.bn.title !== f.en.title ? f.en.title : "" })}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t({ en: f.en.desc, bn: f.bn.desc })}
                </p>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#064E3B]/5 rounded-bl-[3rem] group-hover:bg-[#064E3B]/10 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
