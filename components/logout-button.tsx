"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function LogoutButton() {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: 'include',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Logged out successfully",
        })
        router.push("/")
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      })
    }
  }

  return (
    <Button variant="ghost" onClick={handleLogout}>
      Sign Out
    </Button>
  )
}
