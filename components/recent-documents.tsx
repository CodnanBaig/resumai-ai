"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Mail, MoreHorizontal, Eye, Download, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Document {
  id: string
  title: string
  type: "resume" | "cover-letter"
  company?: string
  createdAt: string
  status: "draft" | "completed"
  template?: string
}

export function RecentDocuments() {
  // TODO: Fetch actual documents from API
  const [documents] = useState<Document[]>([
    {
      id: "1",
      title: "Software Developer Resume",
      type: "resume",
      createdAt: "2024-01-15",
      status: "completed",
      template: "minimal",
    },
    {
      id: "2",
      title: "Senior Developer Resume",
      type: "resume",
      createdAt: "2024-01-12",
      status: "completed",
      template: "corporate",
    },
    {
      id: "3",
      title: "Cover Letter - Tech Innovations",
      type: "cover-letter",
      company: "Tech Innovations Inc.",
      createdAt: "2024-01-10",
      status: "completed",
    },
    {
      id: "4",
      title: "Cover Letter - StartupCorp",
      type: "cover-letter",
      company: "StartupCorp",
      createdAt: "2024-01-08",
      status: "draft",
    },
  ])

  const resumes = documents.filter((doc) => doc.type === "resume")
  const coverLetters = documents.filter((doc) => doc.type === "cover-letter")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const DocumentCard = ({ document }: { document: Document }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {document.type === "resume" ? (
              <FileText className="w-4 h-4 text-primary" />
            ) : (
              <Mail className="w-4 h-4 text-primary" />
            )}
            <div>
              <CardTitle className="text-sm font-medium">{document.title}</CardTitle>
              {document.company && <CardDescription className="text-xs">{document.company}</CardDescription>}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/${document.type === "resume" ? "resume" : "cover-letter"}/${document.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={document.status === "completed" ? "default" : "secondary"}>{document.status}</Badge>
            {document.template && (
              <Badge variant="outline" className="text-xs">
                {document.template}
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{formatDate(document.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  )

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No documents yet</h3>
          <p className="text-muted-foreground mb-4">Create your first resume or cover letter to get started</p>
          <div className="flex justify-center gap-2">
            <Link href="/resume/new">
              <Button>Create Resume</Button>
            </Link>
            <Link href="/cover-letter/new">
              <Button variant="outline" className="bg-transparent">
                Create Cover Letter
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">All Documents ({documents.length})</TabsTrigger>
        <TabsTrigger value="resumes">Resumes ({resumes.length})</TabsTrigger>
        <TabsTrigger value="cover-letters">Cover Letters ({coverLetters.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="resumes" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="cover-letters" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coverLetters.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
