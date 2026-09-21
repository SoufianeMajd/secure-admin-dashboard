"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  userId: number
  email: string
  type: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (data.success) {
      const userData = {
        userId: data.userId,
        email: data.email,
        type: data.type,
      }
      if (data.access_token) {
        localStorage.setItem("token", data.access_token)
      }
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } else {
      return { success: false, error: data.error }
    }
  }

  const signup = async (formData: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => {
    const response = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (data.success) {
      const userData = {
        userId: data.userId,
        email: data.email,
        type: data.type,
      }
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } else {
      return { success: false, error: data.error }
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    router.push("/login")
  }

  const requireAuth = () => {
    if (!loading) {
      if (!user) {
        router.push("/login")
      } else if (user.type !== "admin") {
        router.push("/login?error=unauthorized")
      }
    }
  }

  return {
    user,
    loading,
    login,
    signup,
    logout,
    requireAuth,
    isAuthenticated: !!user,
  }
}
