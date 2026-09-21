// API utility functions for Flask backend integration

const API_BASE_URL = "http://localhost:5000/api"

export interface Product {
  productId: number
  name?: string
  price?: number
  description?: string
  category?: string
  stock?: number
}

export interface Order {
  orderId: number
  userId?: number
  productId?: number
  quantity?: number
  total?: number
  status?: string
  createdAt?: string
}

export interface User {
  userId: number
  email: string
  firstName?: string
  lastName?: string
  type?: string
  phone?: string
  address1?: string
  city?: string
  state?: string
  country?: string
}

// Generic API call function
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: token } : {}),
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login?error=session_expired"
    }
    throw new Error(`API call failed: ${response.statusText}`)
  }

  return response.json()
}

// Products API
export const productsApi = {
  getAll: () => apiCall<Product[]>("/products"),
  delete: (id: number) => apiCall(`/deleteProduct/${id}`, { method: "DELETE" }),
  create: (product: Omit<Product, "productId">) =>
    apiCall("/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),
  update: (id: number, product: Partial<Product>) =>
    apiCall(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    }),
  addProduct: (product: Omit<Product, "productId"> & { categoryId: number }) =>
    apiCall("/addProduct", {
      method: "POST",
      body: JSON.stringify(product),
    }),
  editProduct: (productId: number, product: Partial<Product> & { categoryId?: number }) =>
    apiCall(`/editProduct/${productId}`, {
      method: "POST",
      body: JSON.stringify(product),
    }),
}

// Orders API
export const ordersApi = {
  getAll: () => apiCall<Order[]>("/orders"),
  delete: (id: number) => apiCall(`/deleteOrder/${id}`, { method: "DELETE" }),
}

// Users API
export const usersApi = {
  getAll: () => apiCall<User[]>("/users"),
  delete: (id: number) => apiCall(`/deleteUser/${id}`, { method: "DELETE" }),
}

// Categories API
export const categoriesApi = {
  getAll: () => apiCall<{ categoryId: number; name: string }[]>("/categories"),
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiCall("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  signup: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) =>
    apiCall("/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
}
