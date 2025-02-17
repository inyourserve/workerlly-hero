import React, { createContext, useState, useEffect, useContext } from 'react'
import Cookies from 'js-cookie'

export interface User {
  id: string
  email: string
  name: string
  role: {
    name: string
    permissions: Array<{
      resource: string
      actions: string[]
    }>
  }
}

export interface LoginResponse {
  access_token: string
  user: User
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
  login: (response: LoginResponse) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = Cookies.get('authToken')
    const storedUser = localStorage.getItem('user')

    if (token && storedUser) {
      setIsAuthenticated(true)
      setUser(JSON.parse(storedUser))
    }

    setIsLoading(false)
  }, [])

  const login = (response: LoginResponse) => {
    Cookies.set('authToken', response.access_token, { expires: 1 })
    localStorage.setItem('user', JSON.stringify(response.user))
    setIsAuthenticated(true)
    setUser(response.user)
  }

  const logout = () => {
    Cookies.remove('authToken')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
