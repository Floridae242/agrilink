import { Grade, Address, User, validateTemp, validateHumidity } from './shared'

// Inspector profile data
export interface InspectorProfile {
  id: string
  name: string
  email: string
  phone: string
  licenseNumber: string
  certifications: string[]
  specializations: string[]
  address: Address
  operatingAreas: string[] // provinces or districts
  availabilitySchedule: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
  ratePerInspection: number
}

// Quality inspection input data
export interface QualityInspectionInput {
  lotId: string
  orderId?: string
  inspectionType: 'PRE_HARVEST' | 'POST_HARVEST' | 'PRE_DELIVERY' | 'QUALITY_ASSURANCE'
  location: Address
  inspectionDate: string
  
  // Quality measurements
  temperature: number
  humidity: number
  grade: Grade
  defects: number
  moistureContent?: number
  contamination?: boolean
  pestResidues?: boolean
  
  // Detailed findings
  visualInspection: {
    color: string
    texture: string
    size: string
    uniformity: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
  }
  
  // Documentation
  notes: string
  recommendations?: string
  passedInspection: boolean
  images: File[]
  documents: File[]
  
  // Certifications verified
  organicCertified?: boolean
  gmpCertified?: boolean
  otherCertifications: string[]
}

// Completed inspection data
export interface QualityInspection {
  id: string
  lotId: string
  inspectorId: string
  inspector: Pick<User, 'id' | 'name' | 'email'>
  orderId?: string
  inspectionType: 'PRE_HARVEST' | 'POST_HARVEST' | 'PRE_DELIVERY' | 'QUALITY_ASSURANCE'
  location: Address
  inspectionDate: string
  
  // Quality measurements
  temperature: number
  humidity: number
  grade: Grade
  defects: number
  moistureContent?: number
  contamination?: boolean
  pestResidues?: boolean
  
  // Detailed findings
  visualInspection: {
    color: string
    texture: string
    size: string
    uniformity: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
  }
  
  // Documentation
  notes: string
  recommendations?: string
  passedInspection: boolean
  images: string[]
  documents: string[]
  
  // Certifications verified
  organicCertified?: boolean
  gmpCertified?: boolean
  otherCertifications: string[]
  
  // Report metadata
  reportGenerated: boolean
  reportUrl?: string
  digitalSignature?: string
  createdAt: string
  updatedAt: string
}

// Validation functions
export const validateInspectorProfile = (data: InspectorProfile): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!data.name || data.name.length < 2) {
    errors.push('Name must be at least 2 characters')
  }
  
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email address is required')
  }
  
  if (!data.phone || data.phone.length < 10) {
    errors.push('Valid phone number is required')
  }
  
  if (!data.licenseNumber || data.licenseNumber.length < 5) {
    errors.push('Inspector license number is required')
  }
  
  if (data.certifications.length === 0) {
    errors.push('At least one certification is required')
  }
  
  if (data.operatingAreas.length === 0) {
    errors.push('At least one operating area must be specified')
  }
  
  if (!data.ratePerInspection || data.ratePerInspection <= 0) {
    errors.push('Valid inspection rate is required')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateQualityInspection = (data: QualityInspectionInput): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!data.lotId) {
    errors.push('Lot ID is required')
  }
  
  if (!data.inspectionDate) {
    errors.push('Inspection date is required')
  }
  
  if (!validateTemp(data.temperature)) {
    errors.push('Temperature must be between -30°C and 50°C')
  }
  
  if (!validateHumidity(data.humidity)) {
    errors.push('Humidity must be between 0% and 100%')
  }
  
  if (data.defects < 0) {
    errors.push('Defects count cannot be negative')
  }
  
  if (!data.notes || data.notes.length < 10) {
    errors.push('Inspection notes must be at least 10 characters')
  }
  
  if (!data.visualInspection.color || !data.visualInspection.texture) {
    errors.push('Visual inspection details are required')
  }
  
  if (data.images.length === 0) {
    errors.push('At least one image is required for documentation')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Inspector dashboard data
export interface InspectorDashboard {
  totalInspections: number
  pendingInspections: number
  completedThisMonth: number
  averageRating: number
  totalEarnings: number
  upcomingInspections: Array<{
    id: string
    lotId: string
    farmName: string
    crop: string
    scheduledDate: string
    location: string
    fee: number
  }>
  recentInspections: QualityInspection[]
}