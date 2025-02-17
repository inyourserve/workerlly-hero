// components/Sidebar.tsx
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { usePermissions } from '@/hooks/usePermission'
import { 
  BarChart3, 
  Users, 
  Briefcase, 
  Settings, 
  LogOut, 
  Building2, 
  Tags, 
  Map, 
  HelpCircle, 
  Shield, 
  Play,
  LucideIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MenuItem {
  icon: LucideIcon
  label: string
  href: string
  resource: string
  action: string
  alwaysShow?: boolean
  requireSuperAdmin?: boolean
}

const MENU_ITEMS: MenuItem[] = [
  { 
    icon: BarChart3, 
    label: 'Dashboard', 
    href: '/dashboard',
    resource: 'dashboard',
    action: 'read',
    alwaysShow: true
  },
  { 
    icon: Tags, 
    label: 'Category Management', 
    href: '/dashboard/categories',
    resource: 'categories',
    action: 'read'
  },
  { 
    icon: Users, 
    label: 'User Management', 
    href: '/dashboard/users',
    resource: 'users',
    action: 'read'
  },
  { 
    icon: Briefcase, 
    label: 'Job Management', 
    href: '/dashboard/jobs',
    resource: 'jobs',
    action: 'read'
  },
  { 
    icon: Users, 
    label: 'Worker Management', 
    href: '/dashboard/workers',
    resource: 'workers',
    action: 'read'
  },
  { 
    icon: Users, 
    label: 'Provider Management', 
    href: '/dashboard/providers',
    resource: 'providers',
    action: 'read'
  },
  { 
    icon: Map, 
    label: 'City Management', 
    href: '/dashboard/cities',
    resource: 'cities',
    action: 'read'
  },
  { 
    icon: Building2, 
    label: 'Rate Management', 
    href: '/dashboard/rates',
    resource: 'rates',
    action: 'read'
  },
  { 
    icon: Shield, 
    label: 'Admin Management', 
    href: '/dashboard/admins',
    resource: 'admins',
    action: 'read'
  },
  { 
    icon: HelpCircle, 
    label: 'FAQ Management', 
    href: '/dashboard/faqs',
    resource: 'faqs',
    action: 'read'
  },
  { 
    icon: Play, 
    label: 'Role Management', 
    href: '/dashboard/roles',
    resource: 'roles',
    action: 'read',
    requireSuperAdmin: true
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()
  const { hasPermission, isSuperAdmin } = usePermissions()

  const authorizedMenuItems = MENU_ITEMS.filter(item => {
    if (item.requireSuperAdmin && !isSuperAdmin()) {
      return false
    }
    
    return item.alwaysShow || isSuperAdmin() || hasPermission(item.resource, item.action)
  })

  const firstAuthorizedItem = authorizedMenuItems[0]

  return (
    <div className="w-[240px] bg-white border-r flex flex-col h-screen">
      <div className="p-6 border-b">
        <h1 className="text-xl font-semibold">Admin Panel</h1>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
        {authorizedMenuItems.map((item) => (
          <Link
            key={item.href}
            href={hasPermission(item.resource, item.action) ? item.href : firstAuthorizedItem.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors mb-1",
              !hasPermission(item.resource, item.action) && "opacity-50 pointer-events-none",
              pathname === item.href 
                ? "bg-[#F3F4F6] text-black" 
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t mt-auto">
        <div className="mb-4 px-3 py-2">
          <p className="text-sm font-medium">{user?.email}</p>
          <p className="text-xs text-gray-500">
            {user?.role?.name}
          </p>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )
}
