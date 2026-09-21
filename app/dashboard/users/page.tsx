"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, Search, Eye, Filter, Mail, Phone, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usersApi, type User } from "@/lib/api"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await usersApi.getAll()
      setUsers(data)
    } catch (error) {
      setError("Failed to fetch users. Make sure your Flask server is running.")
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return

    try {
      await usersApi.delete(userId)
      setUsers(users.filter((u) => u.userId !== userId))
    } catch (error) {
      setError("Failed to delete user")
      console.error("Error deleting user:", error)
    }
  }

  const getUserTypeColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "admin":
        return "default"
      case "acheteur":
        return "secondary"
      case "vendeur":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getFullName = (user: User) => {
    const firstName = user.firstName || ""
    const lastName = user.lastName || ""
    return `${firstName} ${lastName}`.trim() || "N/A"
  }

  const getFullAddress = (user: User) => {
    const parts = [user.address1, user.city, user.state, user.country].filter(Boolean)
    return parts.length > 0 ? parts.join(", ") : "No address provided"
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId.toString().includes(searchTerm)

    const matchesType = typeFilter === "all" || user.type?.toLowerCase() === typeFilter.toLowerCase()

    return matchesSearch && matchesType
  })

  const uniqueTypes = Array.from(new Set(users.map((user) => user.type).filter(Boolean)))

  if (loading) {
    return <div>Loading users...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
          <CardDescription>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueTypes.map((type) => (
                      <SelectItem key={type} value={type?.toLowerCase() || ""}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell className="font-medium">{user.userId}</TableCell>
                    <TableCell>{getFullName(user)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getUserTypeColor(user.type)}>{user.type || "Unknown"}</Badge>
                    </TableCell>
                    <TableCell>
                      {user.phone ? (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{user.phone}</span>
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      {user.city || user.state || user.country ? (
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="truncate max-w-32">
                            {[user.city, user.state, user.country].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                              <DialogDescription>{user.email}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium text-sm text-gray-500">User ID</h4>
                                  <p className="font-medium">{user.userId}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium text-sm text-gray-500">Account Type</h4>
                                  <Badge variant={getUserTypeColor(user.type)}>{user.type || "Unknown"}</Badge>
                                </div>
                                <div>
                                  <h4 className="font-medium text-sm text-gray-500">First Name</h4>
                                  <p>{user.firstName || "N/A"}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium text-sm text-gray-500">Last Name</h4>
                                  <p>{user.lastName || "N/A"}</p>
                                </div>
                                <div className="col-span-2">
                                  <h4 className="font-medium text-sm text-gray-500">Email Address</h4>
                                  <div className="flex items-center space-x-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <p>{user.email}</p>
                                  </div>
                                </div>
                                <div className="col-span-2">
                                  <h4 className="font-medium text-sm text-gray-500">Phone Number</h4>
                                  <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <p>{user.phone || "Not provided"}</p>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium text-sm text-gray-500 mb-2">Address Information</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <div className="flex items-start space-x-2">
                                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                                    <div>
                                      <p>{getFullAddress(user)}</p>
                                      {user.address1 && (
                                        <div className="text-sm text-gray-600 mt-1">
                                          <p>Street: {user.address1}</p>
                                          {user.city && <p>City: {user.city}</p>}
                                          {user.state && <p>State: {user.state}</p>}
                                          {user.country && <p>Country: {user.country}</p>}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(user.userId)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((user) => user.type?.toLowerCase() === "admin").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Buyers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((user) => user.type?.toLowerCase() === "acheteur").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Users with Phone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((user) => user.phone).length}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
