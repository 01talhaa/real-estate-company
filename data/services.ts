import { Building2, TrendingUp, BarChart3, FileSearch, Shield, Briefcase, Check, Clock, Users, Award, DollarSign, Target, MapPin } from "lucide-react"
import { LucideIcon } from "lucide-react"

export interface ServicePackage {
  name: string
  price: string
  duration: string
  revisions: string
  features: string[]
  popular?: boolean
}

export interface ProcessStep {
  step: string
  description: string
}

export interface ServiceStat {
  icon: LucideIcon
  label: string
  value: string
}

export interface Service {
  id: string
  icon: LucideIcon
  title: string
  tagline: string
  description: string
  longDescription?: string
  features: string[]
  process?: ProcessStep[]
  packages?: ServicePackage[]
  stats?: ServiceStat[]
  pricing?: string
  color: string
  image: string
}

export const servicesData: Record<string, Service> = {
  "portfolio-management": {
    id: "portfolio-management",
    icon: Building2,
    title: "Portfolio Management",
    tagline: "Comprehensive Property Portfolio Optimization",
    description: "Strategic management of your entire real estate portfolio to maximize value, minimize risk, and optimize returns.",
    features: [
      "Real-time Portfolio Performance Monitoring",
      "Asset Allocation & Diversification Strategy",
      "Risk Assessment & Mitigation",
      "Comprehensive Financial Reporting"
    ],
    pricing: "Starting $2,500/month",
    color: "from-green-dark to-green-dark",
    image: "/commercial-property-management.jpg"
  }
}

export const servicesArray = Object.values(servicesData)
