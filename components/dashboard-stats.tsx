"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Mail, Sparkles, Download } from "lucide-react"
import { useEffect, useState } from "react"

type Stats = {
  totalResumes: number
  totalCoverLetters: number
  aiEnhancements: number
  totalDownloads: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null)


  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch("/api/dashboard/stats", {
          credentials: 'include'
        })
        if (!res.ok) throw new Error(`Failed: ${res.status}`)
        const data = await res.json()
        if (!cancelled) setStats(data.stats as Stats)
      } catch {
        // Silently handle error
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalResumes ?? "—"}</div>
          <p className="text-xs text-muted-foreground">Active resume versions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cover Letters</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalCoverLetters ?? "—"}</div>
          <p className="text-xs text-muted-foreground">Generated this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI Enhancements</CardTitle>
          <Sparkles className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.aiEnhancements ?? "—"}</div>
          <p className="text-xs text-muted-foreground">AI improvements made</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Downloads</CardTitle>
          <Download className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalDownloads ?? "—"}</div>
          <p className="text-xs text-muted-foreground">PDF downloads</p>
        </CardContent>
      </Card>
    </div>
  )
}
