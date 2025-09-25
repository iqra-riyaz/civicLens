import React, { createContext, useContext, useEffect, useState } from 'react'
import { setAuthToken, getMe } from './api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) setAuthToken(token)
    async function load() {
      try {
        if (token) {
          const { user } = await getMe()
          setUser(user)
        }
      } catch (e) {
        setAuthToken(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  function loginWithToken(newToken, user) {
    setAuthToken(newToken)
    setToken(newToken)
    setUser(user)
  }

  function logout() {
    setAuthToken(null)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}


