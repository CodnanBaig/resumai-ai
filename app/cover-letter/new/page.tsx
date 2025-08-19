"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CoverLetterForm } from "@/components/cover-letter-form"
import { MobileNavigation } from "@/components/mobile-navigation"

export default function CreateCoverLetterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container-responsive">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <Link href="/dashboard" className="text-xl sm:text-2xl font-bold text-gray-900">
                ResumeAI
              </Link>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-responsive py-6 sm:py-8 lg:py-10">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="heading-mobile text-gray-900 mb-2">
            Create Your Cover Letter
          </h1>
          <p className="text-mobile text-gray-600">
            Write a compelling cover letter that complements your resume and gets you noticed.
          </p>
        </div>

        {/* Cover Letter Form */}
        <div className="max-w-6xl mx-auto">
          <CoverLetterForm />
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileNavigation />
      </main>
    </div>
  )
}
