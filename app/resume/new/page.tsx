"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ResumeForm } from "@/components/resume-form"
import { MobileNavigation } from "@/components/mobile-navigation"

export default function CreateResumePage() {
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
            Create Your Resume
          </h1>
          <p className="text-mobile text-gray-600">
            Build a professional resume that showcases your skills and experience.
          </p>
        </div>

        {/* Resume Form */}
        <div className="max-w-4xl mx-auto">
          <ResumeForm />
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileNavigation />
      </main>
    </div>
  )
}
