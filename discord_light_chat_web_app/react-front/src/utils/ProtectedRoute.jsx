import React, { useContext, useEffect } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { AuthContext } from '@/contexts/AuthContext'
const PrivateRoute = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useContext(AuthContext)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, history])

  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

export default PrivateRoute
