import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      brand: "AgriLink",
      nav: { home: "Home", marketplace: "Marketplace", logistics: "Logistics", support: "Farm Support", dashboards: "Dashboards", pilot: "Request Pilot" },
      hero: { title: "Smart Farm Marketplace & AI Cold Chain", subtitle: "Transparent, traceable, and efficient farm-to-table logistics." },
      cta: { getStarted: "Get Started", scanQR: "Scan QR", switchToTH: "ไทย", switchToEN: "EN" }
    }
  },
  th: {
    translation: {
      brand: "AgriLink",
      nav: { home: "หน้าแรก", marketplace: "ตลาดฟาร์ม", logistics: "โลจิสติกส์", support: "สนับสนุนฟาร์ม", dashboards: "แดชบอร์ด", pilot: "ขอเข้าร่วมทดลอง" },
      hero: { title: "ตลาดเกษตรอัจฉริยะ & ห่วงโซ่ความเย็นด้วย AI", subtitle: "โปร่งใส ตรวจสอบย้อนกลับได้ และมีประสิทธิภาพจากฟาร์มสู่โต๊ะอาหาร" },
      cta: { getStarted: "เริ่มต้น", scanQR: "สแกน QR", switchToTH: "ไทย", switchToEN: "EN" }
    }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'th',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n
