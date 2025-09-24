// Shared field validators as TypeScript types and validation rules
export const tempRange = { min: -30, max: 50 }
export const humidityRange = { min: 0, max: 100 }
export const defectsMin = 0
export const gradeOptions = ['A', 'B', 'C', 'REJECT'] as const
export const lotPublicIdPattern = /^[A-Z0-9]{6,10}$/
export const maxFileSize = 10 * 1024 * 1024 // 10MB
export const allowedFileTypes = ['pdf', 'jpg', 'jpeg', 'png'] as const

// Validation functions
export const validateTemp = (temp: number): boolean => 
  temp >= tempRange.min && temp <= tempRange.max

export const validateHumidity = (humidity: number): boolean => 
  humidity >= humidityRange.min && humidity <= humidityRange.max

export const validateLotId = (lotId: string): boolean => 
  lotPublicIdPattern.test(lotId)

export const validateEmail = (email: string): boolean => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const validateFileSize = (file: File): boolean => 
  file.size <= maxFileSize

export const validateFileType = (file: File): boolean => {
  const extension = file.name.split('.').pop()?.toLowerCase()
  return extension ? allowedFileTypes.includes(extension as any) : false
}

// TypeScript types
export type Grade = typeof gradeOptions[number]
export type FileType = typeof allowedFileTypes[number]

export interface User {
  id: string
  email: string
  name: string
  role: 'FARMER' | 'BUYER' | 'INSPECTOR' | 'ADMIN'
  phone?: string
  company?: string
  createdAt: string
}

export interface Address {
  district: string
  province: string
  postalCode: string
  country: string
  coordinates?: {
    lat: number
    lng: number
  }
}