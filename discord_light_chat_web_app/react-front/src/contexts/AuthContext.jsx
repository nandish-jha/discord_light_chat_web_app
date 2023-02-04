import React, { useState } from 'react'
import { Login, Register } from '../services/api.service'
import { useNavigate } from 'react-router-dom'

export const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = async ({ email, password }) => {
    try {
      const { user } = await Login({ email, password })
      if (user.id) {
        setUser(user)
        setError(null)
        setIsAuthenticated(true)
        navigate('/')
      }
    } catch (error) {
      setError(error.message)
    }
  }

  const handleRegister = async ({ email, password, username }) => {
    try {
      const res = await Register({ email, password, username })
      if (res.success) {
        setError(null)
        navigate('/login')
      }
    } catch (error) {
      setError(error.message)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    navigate('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        isAuthenticated,
        handleLogin,
        handleRegister,
        handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
