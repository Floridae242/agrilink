import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function Home(){
  const { t } = useTranslation()
  return (
    <section aria-labelledby="hero" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-brand-gradient opacity-10" />
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 items-center gap-10">
          <div>
            <h1 id="hero" className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
              {t('hero.title')}
            </h1>
            <p className="mt-4 text-gray-700">{t('hero.subtitle')}</p>
            <div className="mt-6 flex gap-3">
              <Link to="/marketplace"><Button>{t('cta.getStarted')}</Button></Link>
              <Link to="/qr/DEMO123"><Button variant="ghost">{t('cta.scanQR')}</Button></Link>
            </div>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop" alt="AgriLink logistics" className="rounded-2xl shadow-md object-cover aspect-video"/>
          </div>
        </div>
      </div>
    </section>
  )
}
