"use client"

import type React from "react"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, logout, requireAuth } = useAuth()

  useEffect(() => {
    requireAuth()
  }, [requireAuth])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-xs text-gray-500 capitalize">{user.type}</p>
        </div>

        <nav className="mt-6">
          <Link href="/dashboard" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Overview
          </Link>
          <Link href="/dashboard/products" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50">
            <Package className="w-5 h-5 mr-3" />
            Products
          </Link>
          <Link href="/dashboard/orders" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50">
            <ShoppingCart className="w-5 h-5 mr-3" />
            Orders
          </Link>
          <Link href="/dashboard/users" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50">
            <Users className="w-5 h-5 mr-3" />
            Users
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6">
          <Button variant="outline" onClick={logout} className="flex items-center bg-transparent">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  )
}
