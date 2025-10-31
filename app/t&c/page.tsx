import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms and Conditions — Sabit Asset Management",
  description: "Terms and conditions for Sabit Asset Management real estate services.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
}

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <section className="bg-white text-black py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl liquid-glass p-6 sm:p-10 shadow-xl border border-green-muted bg-green-muted">
              <div className="relative space-y-12">
                <header className="space-y-4">
                  <h1 className="text-[#064E3B] text-4xl font-bold tracking-tight text-green-dark">Terms and Conditions</h1>
                  <p className="text-black text-lg">
                    Welcome to Sabit Asset Management LTD. By accessing our website, you agree to these terms and conditions. Please read
                    them carefully.
                  </p>
                </header>

                <section className="space-y-3">
                  <h2 className="text-[#064E3B] text-2xl font-semibold text-black">1. Introduction</h2>
                  <p className="text-black">
                    These Terms and Conditions govern your use of the Sabit Asset Management LTD website and services. By using our
                    website, you accept these terms in full.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-[#064E3B] text-2xl font-semibold text-black">2. Intellectual Property Rights</h2>
                  <p className="text-black">
                    Unless otherwise stated, Sabit Asset Management LTD owns all intellectual property rights. This includes all reports,
                    analysis, valuations, and any materials provided to the client, which remain the sole property of
                    Sabit Asset Management LTD, even if shared.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-black">
                    <li>You must not republish material from this site.</li>
                    <li>
                      You must not reproduce, duplicate, or copy material for commercial purposes without permission.
                    </li>
                    <li>You must not edit or modify any content without consent.</li>
                    <li>Currently all the content on the site are just place-holders (site is under production)</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h2 className="text-[#064E3B] text-2xl font-semibold text-black">3. Acceptable Use</h2>
                  <p className="text-black">
                    You must not use this website in any way that causes, or may cause, damage to the website or
                    impairment of the availability or accessibility of the website.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-[#064E3B] text-2xl font-semibold text-black">
                    4. Limitation of Liability & Subjectivity of Content
                  </h2>
                  <p className="text-black">
                    Sabit Asset Management LTD will not be liable for any direct, indirect, or consequential loss or damage arising under
                    these Terms or in connection with our website or services. The perceived quality, methodology, or
                    suitability of analysis provided by us remains subjective and cannot be used as grounds to increase
                    scope of work. Service modifications are strictly governed by our{" "}
                    <Link href="/revisions" className="text-green-dark underline hover:text-green-dark">
                      revision policy
                    </Link>
                    .
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-[#064E3B] text-2xl font-semibold text-black">5. Changes to These Terms</h2>
                  <p className="text-black">
                    We may revise these Terms from time to time. The revised Terms will apply from the date of
                    publication on this site.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-[#064E3B] text-2xl font-semibold text-black">6. Contact Us</h2>
                  <p className="text-black">If you have any questions about these Terms, please contact us at:</p>
                  <p className="text-black">
                    Email:{" "}
                    <a href="mailto:hello@sabitasset.com" className="text-green-dark underline hover:text-green-dark">
                      hello@sabitasset.com
                    </a>
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AppverseFooter />
    </>
  )
}
