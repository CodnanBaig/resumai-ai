"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ResponsiveTestPage() {
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
              <Link href="/" className="text-xl sm:text-2xl font-bold text-gray-900">
                ResumeAI
              </Link>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                Back to Home
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
            Responsive Design Test
          </h1>
          <p className="text-mobile text-gray-600">
            This page demonstrates the responsive design features of ResumeAI.
          </p>
        </div>

        {/* Responsive Grid Demo */}
        <div className="mb-8 sm:mb-10">
          <h2 className="subheading-mobile text-gray-900 mb-4">Responsive Grid Layout</h2>
          <div className="grid-responsive">
            <Card className="mobile-card">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Mobile First</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Designed for mobile devices first, then enhanced for larger screens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-gray-600">
                  This card will stack vertically on mobile and align horizontally on larger screens.
                </p>
              </CardContent>
            </Card>

            <Card className="mobile-card">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Touch Friendly</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Optimized for touch interactions on mobile devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-gray-600">
                  Buttons and inputs are sized appropriately for mobile use.
                </p>
              </CardContent>
            </Card>

            <Card className="mobile-card">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Adaptive Typography</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Text sizes adjust based on screen size
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-gray-600">
                  Use heading-mobile, text-mobile, and subheading-mobile classes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Responsive Utilities Demo */}
        <div className="mb-8 sm:mb-10">
          <h2 className="subheading-mobile text-gray-900 mb-4">Responsive Utilities</h2>
          <div className="space-y-4">
            <Card className="mobile-card">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Container Responsive</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  The <code className="bg-gray-100 px-2 py-1 rounded">container-responsive</code> class provides consistent padding and max-width across all screen sizes.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs sm:text-sm text-blue-800">
                    <strong>Mobile:</strong> px-4<br/>
                    <strong>Small:</strong> px-6<br/>
                    <strong>Large:</strong> px-8<br/>
                    <strong>Max Width:</strong> max-w-7xl
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mobile-card">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Form Group Responsive</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  The <code className="bg-gray-100 px-2 py-1 rounded">form-group-responsive</code> class creates responsive form layouts.
                </p>
                <div className="form-group-responsive gap-4">
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-xs text-gray-600">Field 1</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-xs text-gray-600">Field 2</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  On mobile: single column, on small screens and up: two columns
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Navigation Demo */}
        <div className="mb-8 sm:mb-10">
          <h2 className="subheading-mobile text-gray-900 mb-4">Mobile Navigation</h2>
          <Card className="mobile-card">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Bottom Navigation Bar</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Fixed bottom navigation for mobile devices (hidden on larger screens)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mobile-nav sm:hidden">
                <div className="flex items-center justify-around">
                  <div className="mobile-nav-item text-blue-600">
                    <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span className="text-xs">Dashboard</span>
                  </div>
                  <div className="mobile-nav-item text-gray-600">
                    <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs">Create</span>
                  </div>
                  <div className="mobile-nav-item text-gray-600">
                    <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a1 1 0 002-2V8.118z" />
                    </svg>
                    <span className="text-xs">Cover Letter</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 sm:hidden">
                This navigation bar is visible on mobile devices
              </p>
              <p className="text-xs text-gray-500 mt-4 hidden sm:block">
                This navigation bar is hidden on larger screens
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Responsive Breakpoints Info */}
        <div className="mb-8 sm:mb-10">
          <h2 className="subheading-mobile text-gray-900 mb-4">Responsive Breakpoints</h2>
          <Card className="mobile-card">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Tailwind CSS Breakpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Mobile</span>
                  <span className="text-xs text-gray-600">Default (0px+)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Small (sm)</span>
                  <span className="text-xs text-gray-600">640px+</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Medium (md)</span>
                  <span className="text-xs text-gray-600">768px+</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Large (lg)</span>
                  <span className="text-xs text-gray-600">1024px+</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Extra Large (xl)</span>
                  <span className="text-xs text-gray-600">1280px+</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

