"use client"

import { useState, useEffect } from "react"
import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

export function Header() {
  const { user } = useAuth()
  const [userName, setUserName] = useState("Guest User")

  useEffect(() => {
    if (user?.email) {
      const derivedName = user.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ")
      setUserName(user.name || derivedName.charAt(0).toUpperCase() + derivedName.slice(1))
    } else {
      setUserName("Guest User")
    }
  }, [user])

  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search..." className="pl-10" />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-200" />
            <div>
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-gray-500">{user?.email || "Not logged in"}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
