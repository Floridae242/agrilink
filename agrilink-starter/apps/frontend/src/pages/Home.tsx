import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Shield, TrendingUp, Users, Package, Truck, BarChart3, Award, CheckCircle } from 'lucide-react'
import Button from '../components/ui/button'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import StatusBadge from '../components/ui/status-badge'

export default function Home() {
  const { t } = useTranslation()

  const features = [
    {
      icon: Package,
      title: 'ตลาดกลางออนไลน์',
      description: 'เชื่อมโยงเกษตรกรและผู้ซื้อโดยตรง ราคายุติธรรม โปร่งใส',
      color: 'text-green-600'
    },
    {
      icon: Truck,
      title: 'โลจิสติกส์อัจฉริยะ',
      description: 'ระบบจัดการขนส่งแบบครบวงจร ติดตามสินค้าแบบเรียลไทม์',
      color: 'text-blue-600'
    },
    {
      icon: Shield,
      title: 'ควบคุมคุณภาพ',
      description: 'มาตรฐาน QA Analytics ครบถ้วน ออกใบรับรองคุณภาพ',
      color: 'text-purple-600'
    },
    {
      icon: BarChart3,
      title: 'IoT Monitoring',
      description: 'เซ็นเซอร์ติดตามสภาพแวดล้อม แจ้งเตือนแบบอัตโนมัติ',
      color: 'text-orange-600'
    }
  ]

  const stats = [
    { label: 'เกษตรกรที่เชื่อมต่อ', value: '2,500+', icon: Users },
    { label: 'ผลผลิตที่จัดการ', value: '50K+ ตัน', icon: Package },
    { label: 'การขนส่งสำเร็จ', value: '98.5%', icon: Truck },
    { label: 'คะแนนความพึงพอใจ', value: '4.9/5', icon: Award }
  ]

  const testimonials = [
    {
      name: 'นายสมชาย เกษตรกรรม',
      role: 'เกษตรกร - จังหวัดลพบุรี',
      content: 'AgriLink ช่วยให้ผมขายข้าวได้ราคาดีขึ้น และไม่ต้องผ่านพ่อค้าคนกลางอีกต่อไป',
      avatar: '👨‍🌾'
    },
    {
      name: 'บริษัท ไทยฟูดส์ จำกัด',
      role: 'ผู้ซื้อ - กรุงเทพฯ',
      content: 'ระบบติดตามคุณภาพทำให้เรามั่นใจในผลผลิตที่สั่งซื้อ การส่งมอบตรงเวลาทุกครั้ง',
      avatar: '🏢'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-green-50">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-green-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <StatusBadge status="success" size="sm">
                  🚀 เปิดใช้งานแล้ว
                </StatusBadge>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  {t('hero.title')}
                  <span className="block text-brand-600">Smart Farm</span>
                  <span className="block">Marketplace</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-lg">
                  {t('hero.subtitle')} เชื่อมโยงเกษตรกร ผู้ซื้อ และโลจิสติกส์ 
                  ด้วยเทคโนโลยี IoT และ AI
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/marketplace">
                  <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    {t('cta.getStarted')}
                  </Button>
                </Link>
                <Link to="/qr/DEMO123">
                  <Button variant="outline" size="lg">
                    {t('cta.scanQR')}
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="text-center">
                      <Icon className="w-6 h-6 text-brand-600 mx-auto mb-2" />
                      <div className="font-bold text-lg text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-green-400 rounded-3xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop"
                alt="AgriLink Smart Farm Technology"
                className="relative rounded-3xl shadow-2xl object-cover aspect-[4/3] w-full"
              />
              <div className="absolute bottom-4 left-4 right-4">
                <Card variant="elevated" padding="sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Live Monitoring Active</span>
                    <Zap className="w-4 h-4 text-yellow-500" />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ระบบครบวงจรสำหรับเกษตรกรรมยุคใหม่
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              เทคโนโลยี IoT, AI และ Blockchain มาช่วยเพิ่มประสิทธิภาพและความโปร่งใสในทุกขั้นตอน
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} variant="elevated" className="group hover:scale-105 transition-transform duration-300">
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-8 h-8 ${feature.color}`} />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              เสียงจากผู้ใช้งานจริง
            </h2>
            <p className="text-xl text-gray-600">
              ความไว้วางใจจากเกษตรกรและผู้ประกอบการมากกว่า 2,500 ราย
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} variant="elevated">
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-lg">⭐</span>
                      ))}
                    </div>
                    <blockquote className="text-gray-700 text-lg italic">
                      "{testimonial.content}"
                    </blockquote>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{testimonial.avatar}</span>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              พร้อมเริ่มต้นการเกษตรแบบอัจฉริยะแล้วหรือยัง?
            </h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              เข้าร่วมกับเกษตรกรหลายพันรายที่เปลี่ยนวิธีการทำเกษตรด้วย AgriLink
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/marketplace">
                <Button variant="secondary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  เริ่มใช้งานฟรี
                </Button>
              </Link>
              <Link to="/support">
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  ติดต่อทีมขาย
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
