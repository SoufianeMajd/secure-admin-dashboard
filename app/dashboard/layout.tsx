"use client"

import type React from "react"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut,
  BarChart2,
  FileText,
  Settings,
  HelpCircle,
  Search,
  Bell,
  ChevronDown,
  Menu,
  Activity
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, logout, requireAuth } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    requireAuth()
  }, [requireAuth])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const NavItem = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => {
    const isActive = pathname === href
    return (
      <Link 
        href={href} 
        className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
          isActive 
            ? "bg-gray-800 text-white" 
            : "text-gray-400 hover:bg-gray-800 hover:text-white"
        }`}
      >
        <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-indigo-400" : "text-gray-400"}`} />
        {label}
      </Link>
    )
  }

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#111827] text-white flex flex-col shadow-xl z-10">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 mb-4 mt-2">
          <div className="w-8 h-8 rounded bg-indigo-500 flex items-center justify-center mr-3">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-wide">Medusa Admin</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 flex flex-col gap-1">
          <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem href="/dashboard/products" icon={Package} label="Products" />
          <NavItem href="/dashboard/orders" icon={ShoppingCart} label="Orders" />
          <NavItem href="/dashboard/users" icon={Users} label="Users" />
          
          <div className="mt-6 mb-2 px-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Analytics</p>
          </div>
          <NavItem href="#" icon={BarChart2} label="Analytics" />
          <NavItem href="#" icon={FileText} label="Reports" />
          
          <div className="mt-6 mb-2 px-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">System</p>
          </div>
          <NavItem href="#" icon={Settings} label="Settings" />
          <NavItem href="#" icon={HelpCircle} label="Help" />
        </nav>

        {/* Logout / Bottom Area */}
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={logout} 
            className="flex items-center w-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-0">
          <div className="flex items-center">
            <Menu className="w-5 h-5 text-gray-400 mr-6 cursor-pointer" />
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md px-3 py-2 w-96 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Global Search" 
                className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400" 
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="relative p-1 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </button>
            
            <div className="flex items-center cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden mr-3 border border-indigo-200">
                <span className="text-indigo-700 font-medium text-sm">
                  {user.email.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 leading-tight">
                  {user.email.split('@')[0]}
                </span>
                <span className="text-xs text-gray-500 capitalize leading-tight">
                  {user.type}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB] p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

