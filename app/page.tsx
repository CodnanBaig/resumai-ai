import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container-responsive py-4 sm:py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-900">ResumeAI</span>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:inline-flex">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="text-sm sm:text-base px-3 sm:px-6 py-2 sm:py-3">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container-responsive py-12 sm:py-16 lg:py-20">
        <div className="text-center space-y-6 sm:space-y-8">
          <h1 className="heading-mobile text-gray-900 leading-tight">
            Build Professional Resumes with{" "}
            <span className="text-blue-600">AI-Powered</span> Intelligence
          </h1>
          <p className="text-mobile text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Create tailored resumes and cover letters that stand out. Upload your existing resume 
            or start from scratch with our intelligent builder that adapts to your industry and experience.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link href="/resume/new">
              <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-base sm:text-lg">
                Create Resume
              </Button>
            </Link>
            <Link href="/cover-letter/new">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3 text-base sm:text-lg">
                Write Cover Letter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-responsive py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="heading-mobile text-gray-900 mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-mobile text-gray-600 max-w-2xl mx-auto">
            Our comprehensive platform provides all the tools you need to create compelling 
            resumes and cover letters that get you noticed.
          </p>
        </div>

        <div className="grid-responsive">
          {/* AI Enhancement */}
          <Card className="mobile-card hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <CardTitle className="text-lg sm:text-xl">AI-Powered Enhancement</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Get intelligent suggestions to improve your resume content, optimize keywords, and tailor it to specific job descriptions.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Professional Templates */}
          <Card className="mobile-card hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <CardTitle className="text-lg sm:text-xl">Professional Templates</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Choose from multiple professionally designed templates that adapt to different industries and experience levels.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Easy Export */}
          <Card className="mobile-card hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <CardTitle className="text-lg sm:text-xl">Easy Export</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Download your resume in multiple formats including PDF, Word, and plain text. Perfect for online applications and printing.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container-responsive py-12 sm:py-16 lg:py-20 bg-white">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="heading-mobile text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-mobile text-gray-600 max-w-2xl mx-auto">
            Get started in minutes with our simple three-step process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h3 className="subheading-mobile text-gray-900 mb-3">Create or Upload</h3>
            <p className="text-mobile text-gray-600">
              Start with a blank template or upload your existing resume to get started quickly.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h3 className="subheading-mobile text-gray-900 mb-3">Customize & Enhance</h3>
            <p className="text-mobile text-gray-600">
              Use AI-powered suggestions to improve your content and choose from professional templates.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h3 className="subheading-mobile text-gray-900 mb-3">Download & Apply</h3>
            <p className="text-mobile text-gray-600">
              Export your professional resume and start applying to your dream job.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-responsive py-12 sm:py-16 lg:py-20">
        <div className="bg-blue-600 rounded-2xl p-8 sm:p-12 lg:p-16 text-center text-white">
          <h2 className="heading-mobile mb-4">
            Ready to create your professional resume?
          </h2>
          <p className="text-mobile mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of professionals who have already landed their dream jobs with ResumeAI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8 py-3 text-base sm:text-lg">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-3 text-base sm:text-lg border-white text-white hover:bg-white hover:text-blue-600">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container-responsive py-8 sm:py-12 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p className="text-sm sm:text-base">
            © 2024 ResumeAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
