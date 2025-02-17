'use client'

import { useState } from 'react'
import { BarChart3, Users, Briefcase, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { icon: BarChart3, label: 'Dashboard' },
  { icon: Users, label: 'Users' },
  { icon: Briefcase, label: 'Jobs' },
  { icon: Settings, label: 'Settings' },
]

export default function AdminPanel() {
  const [activeMenuItem, setActiveMenuItem] = useState('Settings')

  return (
    <div className="flex h-screen bg-[#F8F9FC]">
      {/* Sidebar */}
      <div className="w-[240px] bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-semibold">Admin Panel</h1>
        </div>
        
        <nav className="flex-1 p-4">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveMenuItem(item.label)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                activeMenuItem === item.label 
                  ? "bg-[#F3F4F6] text-black" 
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-6">{activeMenuItem}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-lg border shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
                  <p className="text-3xl font-semibold mt-1">1,234</p>
                </div>
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">+10% from last month</p>
            </div>

            <div className="p-6 bg-white rounded-lg border shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Active Jobs</h3>
                  <p className="text-3xl font-semibold mt-1">567</p>
                </div>
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">+5% from last week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

