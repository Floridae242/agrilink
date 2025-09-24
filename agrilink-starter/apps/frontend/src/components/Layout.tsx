import React from 'react'
import Navigation from './ui/navigation'

interface LayoutProps {
  children: React.ReactNode
  user?: {
    name: string
    email: string
    role: string
  }
  onLogout?: () => void
  title?: string
  subtitle?: string
  actions?: React.ReactNode
}

export function Layout({ children, user, onLogout, title, subtitle, actions }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onLogout={onLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(title || subtitle || actions) && (
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                {title && (
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                )}
                {subtitle && (
                  <p className="text-lg text-gray-600">{subtitle}</p>
                )}
              </div>
              {actions && (
                <div className="flex items-center space-x-3">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}
        
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">AgriLink</h2>
                  <p className="text-sm text-gray-500">Smart Farm Marketplace</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                แพลตฟอร์มเชื่อมโยงเกษตรกรและผู้ซื้อ พร้อมระบบ IoT และการควบคุมคุณภาพแบบครบวงจร
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-brand-600 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-brand-600 transition-colors">
                  <span className="sr-only">Line</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652.426.318.549.886.317 1.272l-.9 1.492c-.154.256-.069.571.191.683.073.031.154.031.229 0l2.212-.915c.203-.084.437-.084.64 0 1.829.763 3.853 1.158 5.839 1.158 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                บริการ
              </h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-brand-600 transition-colors">ตลาดกลาง</a></li>
                <li><a href="#" className="text-gray-600 hover:text-brand-600 transition-colors">โลจิสติกส์</a></li>
                <li><a href="#" className="text-gray-600 hover:text-brand-600 transition-colors">ควบคุมคุณภาพ</a></li>
                <li><a href="#" className="text-gray-600 hover:text-brand-600 transition-colors">IoT Monitoring</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                ติดต่อเรา
              </h3>
              <ul className="space-y-2">
                <li className="text-gray-600">
                  <span className="block">โทร: 02-xxx-xxxx</span>
                </li>
                <li className="text-gray-600">
                  <span className="block">อีเมล: info@agrilink.co.th</span>
                </li>
                <li className="text-gray-600">
                  <span className="block">เวลาทำการ: จ-ศ 8:00-17:00</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2024 AgriLink. สงวนลิขสิทธิ์.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-brand-600 text-sm transition-colors">
                นโยบายความเป็นส่วนตัว
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-600 text-sm transition-colors">
                ข้อกำหนดการใช้งาน
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout