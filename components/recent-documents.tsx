"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Mail, MoreHorizontal, Eye, Download, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Document {
  id: string
  title: string
  type: "resume" | "cover-letter"
  company?: string
  createdAt: string
  status: "draft" | "completed"
  template?: string
}

export function RecentDocuments({ compact = false }: { compact?: boolean }) {
  const [documents, setDocuments] = useState<Document[]>([])

  const [loading, setLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/dashboard/documents", {
          credentials: 'include'
        })
        if (!res.ok) throw new Error(`Failed: ${res.status}`)
        const data = await res.json()
        if (!cancelled) setDocuments(data.documents as Document[])
      } catch {
        // Silently handle error
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const handleDelete = async (document: Document) => {
    setDocumentToDelete(document)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!documentToDelete) return

    try {
      setDeleting(true)
      const endpoint = documentToDelete.type === "resume" 
        ? `/api/resume/${documentToDelete.id}`
        : `/api/cover-letter/${documentToDelete.id}`

      const res = await fetch(endpoint, {
        method: "DELETE",
        credentials: 'include'
      })

      if (!res.ok) {
        throw new Error("Failed to delete document")
      }

      // Remove the document from the local state
      setDocuments(prev => prev.filter(doc => doc.id !== documentToDelete.id))
      setDeleteDialogOpen(false)
      setDocumentToDelete(null)
    } catch (error) {
      console.error("Error deleting document:", error)
      // Error handling removed since setError was removed
    } finally {
      setDeleting(false)
    }
  }

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
              {document.type === "resume" && (
                <DropdownMenuItem
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/resume/generate-pdf", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: 'include',
                        body: JSON.stringify({ 
                          resumeId: document.id, 
                          template: document.template || "minimal" 
                        }),
                      })
                      if (!res.ok) throw new Error("Failed to generate PDF")
                      const blob = await res.blob()
                      const url = URL.createObjectURL(blob)
                      const a = window.document.createElement("a")
                      a.href = url
                      a.download = `${document.title || "resume"}.pdf`
                      window.document.body.appendChild(a)
                      a.click()
                      a.remove()
                      URL.revokeObjectURL(url)
                    } catch (e) {
                      console.error(e)
                    }
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => handleDelete(document)}
              >
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

  if (!loading && documents.length === 0) {
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

  const gridClass = compact
    ? "grid grid-cols-1 gap-4"
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"

  return (
    <>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className={compact ? "flex w-full gap-2 overflow-x-auto" : "grid w-full grid-cols-3"}>
          <TabsTrigger value="all">All Documents ({documents.length})</TabsTrigger>
          <TabsTrigger value="resumes">Resumes ({resumes.length})</TabsTrigger>
          <TabsTrigger value="cover-letters">Cover Letters ({coverLetters.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className={gridClass}>
            {documents.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resumes" className="space-y-4">
          <div className={gridClass}>
            {resumes.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cover-letters" className="space-y-4">
          <div className={gridClass}>
            {coverLetters.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{documentToDelete?.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setDocumentToDelete(null)
              }}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
