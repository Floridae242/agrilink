import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { User, LogOut, Menu, X, Home, TrendingUp, Package, Truck, Shield, HelpCircle } from 'lucide-react'
import Button from './button'

interface NavigationProps {
  user?: {
    name: string
    email: string
    role: string
  }
  onLogout?: () => void
}

const navigationItems = [
  { name: 'หน้าหลัก', href: '/', icon: Home, description: 'ภาพรวมระบบ' },
  { name: 'แดชบอร์ด', href: '/dash', icon: TrendingUp, description: 'สถิติและข้อมูล' },
  { name: 'ตลาดกลาง', href: '/marketplace', icon: Package, description: 'ซื้อขายผลผลิต' },
  { name: 'โลจิสติกส์', href: '/logistics', icon: Truck, description: 'จัดการขนส่ง' },
  { name: 'ควบคุมคุณภาพ', href: '/support', icon: Shield, description: 'QA Analytics' },
  { name: 'ช่วยเหลือ', href: '/pilot', icon: HelpCircle, description: 'บริการสนับสนุน' }
]

export function Navigation({ user, onLogout }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">AgriLink</h1>
                <p className="text-xs text-gray-500">Smart Farm Marketplace</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = isActiveRoute(item.href)
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-brand-100 text-brand-700 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                  title={item.description}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-brand-600" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  leftIcon={<LogOut className="w-4 h-4" />}
                  className="hidden sm:flex"
                >
                  ออกจากระบบ
                </Button>
              </div>
            ) : (
              <div className="space-x-2">
                <Button variant="ghost" size="sm">เข้าสู่ระบบ</Button>
                <Button variant="primary" size="sm">สมัครสมาชิก</Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = isActiveRoute(item.href)
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-brand-100 text-brand-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              )
            })}
            
            {user && (
              <div className="pt-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    onLogout?.()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center w-full px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation