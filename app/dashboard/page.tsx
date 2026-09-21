"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"

interface Stats {
  products: number
  orders: number
  users: number
}

// Medusa Admin style colors
const DONUT_COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B']
const PIE_COLORS = ['#F59E0B', '#10B981', '#3B82F6']
const BAR_COLOR = '#3B82F6'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({ products: 0, orders: 0, users: 0 })
  const [productsByCategory, setProductsByCategory] = useState<any[]>([])
  const [ordersByStatus, setOrdersByStatus] = useState<any[]>([])
  const [usersByType, setUsersByType] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { productsApi, ordersApi, usersApi } = await import("@/lib/api")
        const [products, orders, users] = await Promise.all([
          productsApi.getAll(),
          ordersApi.getAll(),
          usersApi.getAll(),
        ])

        setStats({
          products: products.length || 0,
          orders: orders.length || 0,
          users: users.length || 0,
        })

        // Process Products by Category
        const catCount = products.reduce((acc: any, p: any) => {
          const cat = p.category || 'Unknown'
          acc[cat] = (acc[cat] || 0) + 1
          return acc
        }, {})
        setProductsByCategory(Object.keys(catCount).map(key => ({ name: key, value: catCount[key] })))

        // Process Orders by Status
        const statusCount = orders.reduce((acc: any, o: any) => {
          const status = o.status || 'Pending'
          acc[status] = (acc[status] || 0) + 1
          return acc
        }, {})
        setOrdersByStatus(Object.keys(statusCount).map(key => ({ name: key, count: statusCount[key] })))

        // Process Users by Type (Admin vs User)
        const typeCount = users.reduce((acc: any, u: any) => {
          const type = u.type || 'user'
          acc[type] = (acc[type] || 0) + 1
          return acc
        }, {})
        setUsersByType(Object.keys(typeCount).map(key => ({ name: key, value: typeCount[key] })))

      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="flex h-[80vh] items-center justify-center text-gray-500">Loading dashboard...</div>
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.email.split('@')[0]}!</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white border-gray-200 text-gray-700 shadow-sm">
            Last 7 Days <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
          </Button>
          <Button className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white shadow-sm">
            Actions <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User Roles (Donut Chart) */}
        <Card className="shadow-sm border-gray-100 rounded-xl overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-0 pt-6">
            <CardTitle className="text-lg font-semibold text-gray-800">User Acquisition</CardTitle>
            <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
          </CardHeader>
          <p className="text-sm text-gray-500 px-6 pb-2">Donut Pie Chart. Distribution of roles.</p>
          <CardContent className="flex-1 flex flex-col justify-center">
            <div className="h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usersByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {usersByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-gray-900">{stats.users}</span>
                <span className="text-xs text-gray-500">Total signups</span>
              </div>
            </div>
            
            {/* Custom Legend */}
            <div className="mt-4 grid grid-cols-2 gap-y-2 px-2">
              {usersByType.map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }}></span>
                    <span className="text-gray-600 capitalize">{entry.name}</span>
                  </div>
                </div>
              ))}
              <div className="col-span-2 pt-2 mt-2 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-600">Total signups</span>
                <span className="text-xl font-bold text-gray-900">{stats.users}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders by Status (Bar Chart) */}
        <Card className="shadow-sm border-gray-100 rounded-xl overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-0 pt-6">
            <CardTitle className="text-lg font-semibold text-gray-800">Weekly Sales Revenue</CardTitle>
            <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
          </CardHeader>
          <p className="text-sm text-gray-500 px-6 pb-4">Column Bar Chart. Overview of order statuses.</p>
          <CardContent className="flex-1 flex flex-col justify-end">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersByStatus} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    cursor={{fill: '#F3F4F6'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="url(#colorBar)" radius={[4, 4, 0, 0]} barSize={32}>
                    {ordersByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLOR} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Products by Category (Pie Chart) */}
        <Card className="shadow-sm border-gray-100 rounded-xl overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-0 pt-6">
            <CardTitle className="text-lg font-semibold text-gray-800">Device Usage</CardTitle>
            <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
          </CardHeader>
          <p className="text-sm text-gray-500 px-6 pb-2">Pie Chart. Product category breakdown.</p>
          <CardContent className="flex-1 flex flex-col justify-center">
            <div className="h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productsByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={100}
                    paddingAngle={1}
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {productsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Custom Legend */}
            <div className="mt-4 grid grid-cols-2 gap-y-2 px-2">
              <div className="col-span-2 flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Total sessions</span>
                <span className="text-sm font-semibold text-gray-700">{stats.products}k</span>
              </div>
              {productsByCategory.map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></span>
                    <span className="text-gray-600 capitalize">{entry.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
