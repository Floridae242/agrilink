import React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from './components/Layout'
import { useAuth } from './lib/auth'

// Define routes that should not use the layout
const LAYOUT_EXCLUDED_ROUTES = ['/login', '/register', '/qr']

export default function App() {
  const { i18n } = useTranslation()
  const nav = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()
  
  const handleLogout = async () => {
    await logout()
    nav('/')
  }

  // Check if current route should exclude layout
  const shouldExcludeLayout = LAYOUT_EXCLUDED_ROUTES.some(route => 
    location.pathname.startsWith(route)
  )

  // If the route should exclude layout, render just the outlet
  if (shouldExcludeLayout) {
    return <Outlet />
  }

  // Otherwise, render with layout
  return (
    <Layout
      user={isAuthenticated ? {
        name: user?.name || 'User',
        email: user?.email || '',
        role: user?.role || 'USER'
      } : undefined}
      onLogout={handleLogout}
    >
      <Outlet />
    </Layout>
  )
}
