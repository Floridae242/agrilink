import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from './components/ui/button'
import { useAuth } from './lib/auth'

export default function App(){
  const { i18n, t } = useTranslation()
  const nav = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  
  const switchLang = () => i18n.changeLanguage(i18n.language==='th'?'en':'th')
  
  const handleLogout = async () => {
    await logout()
    nav('/')
  }
  
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span aria-hidden className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-white" style={{backgroundImage:'linear-gradient(135deg,#10b981,#059669)'}}>A</span>
            {t('brand')}
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/marketplace" className="hover:text-brand-700">{t('nav.marketplace')}</Link>
            <Link to="/logistics" className="hover:text-brand-700">{t('nav.logistics')}</Link>
            <Link to="/support" className="hover:text-brand-700">{t('nav.support')}</Link>
            <Link to="/dash" className="hover:text-brand-700">{t('nav.dashboards')}</Link>
            <Link to="/pilot"><Button>{t('nav.pilot')}</Button></Link>
          </nav>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:inline">
                  {user?.name} ({user?.role})
                </span>
                <Button variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
            )}
            <Button variant="ghost" aria-label="toggle language" onClick={switchLang}>
              {i18n.language==='th'?t('cta.switchToEN'):t('cta.switchToTH')}
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet/>
      </main>
      <footer className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600 flex justify-between">
          <span>© {new Date().getFullYear()} AgriLink</span>
          <a href="/pilot" className="text-brand-700 hover:underline">{t('nav.pilot')}</a>
        </div>
      </footer>
    </div>
  )
}
