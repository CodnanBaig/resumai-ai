"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard-stats"
import { QuickActions } from "@/components/quick-actions"
import { RecentDocuments } from "@/components/recent-documents"
import { LogoutButton } from "@/components/logout-button"
import { MobileNavigation } from "@/components/mobile-navigation"

export default function DashboardPage() {
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
              <span className="text-xl sm:text-2xl font-bold text-gray-900">ResumeAI</span>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  Home
                </Button>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-responsive py-6 sm:py-8 lg:py-10">
        {/* Welcome Section */}
        <div className="mb-8 sm:mb-10">
          <h1 className="heading-mobile text-gray-900 mb-2">
            Welcome back!
          </h1>
          <p className="text-mobile text-gray-600">
            Here's what's happening with your resumes and cover letters.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 sm:mb-10">
          <DashboardStats />
        </div>

        {/* Quick Actions and Recent Documents - stacked layout */}
        <div className="space-y-6 sm:space-y-8">
          <QuickActions />
          <RecentDocuments />
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileNavigation />
      </main>
    </div>
  )
}
