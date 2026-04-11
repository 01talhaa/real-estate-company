export type EventType = "launch" | "investor-meet" | "community" | "announcement"

export interface SabitEvent {
  id: string
  title: { en: string; bn: string }
  date: string // ISO format
  location: { en: string; bn: string }
  description: { en: string; bn: string }
  type: EventType
  registrationLink?: string
  isUpcoming: boolean
}

export const events: SabitEvent[] = [
  {
    id: "project-launch-block-b-2025",
    title: {
      en: "Project Launch: Sabit Khilgaon Block B",
      bn: "প্রকল্প উদ্বোধন: সাবিত খিলগাঁও ব্লক বি",
    },
    date: "2025-05-15",
    location: {
      en: "Khilgaon Community Hall, Dhaka",
      bn: "খিলগাঁও কমিউনিটি হল, ঢাকা",
    },
    description: {
      en: "Join us for the official handover ceremony of Sabit Khilgaon Block B. Flat owners will receive their keys, documents, and a guided tour of their new homes.",
      bn: "সাবিত খিলগাঁও ব্লক বি-এর আনুষ্ঠানিক হস্তান্তর অনুষ্ঠানে যোগ দিন। ফ্ল্যাট মালিকরা তাদের চাবি, কাগজপত্র এবং নতুন বাড়ির ট্যুর পাবেন।",
    },
    type: "launch",
    registrationLink: "https://wa.me/8801401658685",
    isUpcoming: true,
  },
  {
    id: "investor-meet-q2-2025",
    title: {
      en: "Investor Meet — Q2 2025",
      bn: "বিনিয়োগকারী সভা — দ্বিতীয় প্রান্তিক ২০২৫",
    },
    date: "2025-06-10",
    location: {
      en: "Sabit Office, Khilgaon, Dhaka",
      bn: "সাবিত অফিস, খিলগাঁও, ঢাকা",
    },
    description: {
      en: "An exclusive session for current shareholders and prospective investors. Project updates, financial reports, and Q&A with the Board of Directors will be presented.",
      bn: "বর্তমান শেয়ারহোল্ডার এবং সম্ভাব্য বিনিয়োগকারীদের জন্য একটি বিশেষ অধিবেশন। প্রকল্পের আপডেট, আর্থিক প্রতিবেদন এবং পরিচালনা পর্ষদের সাথে প্রশ্নোত্তর পর্ব অনুষ্ঠিত হবে।",
    },
    type: "investor-meet",
    registrationLink: "https://wa.me/8801401658685",
    isUpcoming: true,
  },
  {
    id: "community-eid-gathering-2025",
    title: {
      en: "Community Eid Gathering 2025",
      bn: "কমিউনিটি ঈদ মিলনমেলা ২০২৫",
    },
    date: "2025-04-05",
    location: {
      en: "Jodhivita Building Rooftop, Dhaka",
      bn: "জোড়াভিটা ভবন ছাদ, ঢাকা",
    },
    description: {
      en: "A warm Eid celebration for all Sabit flat owners and their families. Food, community bonding, and an announcement about the upcoming Twin Towers project.",
      bn: "সমস্ত সাবিত ফ্ল্যাট মালিক এবং তাদের পরিবারের জন্য উষ্ণ ঈদ উদযাপন। খাবার, সামাজিক বন্ধন এবং আসন্ন টুইন টাওয়ার প্রকল্পের ঘোষণা থাকবে।",
    },
    type: "community",
    isUpcoming: false,
  },
  {
    id: "twin-towers-announcement",
    title: {
      en: "Twin Towers Project Announcement",
      bn: "টুইন টাওয়ার প্রকল্পের ঘোষণা",
    },
    date: "2025-07-01",
    location: {
      en: "Online + Sabit Office, Dhaka",
      bn: "অনলাইন + সাবিত অফিস, ঢাকা",
    },
    description: {
      en: "We are proud to announce the registration opening for our largest project — Sabit Khilgaon Twin Towers. 40 flats available at introductory pricing for early registrants.",
      bn: "আমাদের সবচেয়ে বড় প্রকল্প — সাবিত খিলগাঁও টুইন টাওয়ার-এর নিবন্ধন উদ্বোধন ঘোষণা করতে পেরে আমরা গর্বিত। প্রাথমিক নিবন্ধনকারীদের জন্য আকর্ষণীয় মূল্যে ৪০টি ফ্ল্যাট পাওয়া যাবে।",
    },
    type: "announcement",
    registrationLink: "https://wa.me/8801401658685",
    isUpcoming: true,
  },
  {
    id: "jodhivita-green-homes-handover",
    title: {
      en: "Jodhivita Green Homes — Handover Ceremony",
      bn: "জোড়াভিটা গ্রিন হোমস — হস্তান্তর অনুষ্ঠান",
    },
    date: "2022-12-20",
    location: {
      en: "Jodhivita Residential Area, Dhaka",
      bn: "জোড়াভিটা আবাসিক এলাকা, ঢাকা",
    },
    description: {
      en: "Successfully handed over 8 flats to their rightful owners at Sabit Green Homes, Jodhivita. A proud milestone in our journey.",
      bn: "সাবিত গ্রিন হোমস, জোড়াভিটায় ৮টি ফ্ল্যাট তাদের প্রকৃত মালিকদের কাছে সফলভাবে হস্তান্তর করা হয়েছে। আমাদের যাত্রায় একটি গর্বিত মাইলফলক।",
    },
    type: "launch",
    isUpcoming: false,
  },
  {
    id: "investor-meet-2024",
    title: {
      en: "Annual Investor Meet 2024",
      bn: "বার্ষিক বিনিয়োগকারী সভা ২০২৪",
    },
    date: "2024-11-15",
    location: {
      en: "BIAM Foundation, Dhaka",
      bn: "বিআইএএম ফাউন্ডেশন, ঢাকা",
    },
    description: {
      en: "Over 150 shareholders attended our 2024 annual meet. Project progress updates, financial statements, and the announcement of Phase 2 expansion plans.",
      bn: "আমাদের ২০২৪ বার্ষিক সভায় ১৫০ জনেরও বেশি শেয়ারহোল্ডার যোগ দিয়েছিলেন। প্রকল্পের অগ্রগতির আপডেট, আর্থিক বিবৃতি এবং ফেজ ২ সম্প্রসারণ পরিকল্পনার ঘোষণা করা হয়েছিল।",
    },
    type: "investor-meet",
    isUpcoming: false,
  },
]

export const getUpcomingEvents = () => events.filter((e) => e.isUpcoming)
export const getPastEvents = () => events.filter((e) => !e.isUpcoming)
