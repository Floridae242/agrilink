import { Grade, Address, User, validateTemp, validateHumidity, validateLotId, gradeOptions } from './shared'

// Farmer lot creation data structure
export interface LotInput {
  // Basic info
  crop: string
  variety: string
  quantity: number
  harvestDate: string
  expectedDelivery: string
  
  // Quality data
  temperature: number
  humidity: number
  grade: Grade
  defects: number
  qualityNotes?: string
  
  // Certifications
  organic: boolean
  gmp: boolean
  certifications: string[]
  certificationFiles: File[]
  
  // Location
  farmLocation: Address
  
  // Images
  images: File[]
  documents: File[]
}

// Validation functions for lot input
export const validateLotInput = (data: LotInput): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  // Basic validations
  if (!data.crop || data.crop.length < 2) {
    errors.push('Crop name must be at least 2 characters')
  }
  
  if (!data.variety || data.variety.length < 2) {
    errors.push('Variety must be at least 2 characters')
  }
  
  if (!data.quantity || data.quantity <= 0) {
    errors.push('Quantity must be greater than 0')
  }
  
  if (!data.harvestDate) {
    errors.push('Harvest date is required')
  }
  
  if (!data.expectedDelivery) {
    errors.push('Expected delivery date is required')
  }
  
  // Quality validations
  if (!validateTemp(data.temperature)) {
    errors.push('Temperature must be between -30°C and 50°C')
  }
  
  if (!validateHumidity(data.humidity)) {
    errors.push('Humidity must be between 0% and 100%')
  }
  
  if (!gradeOptions.includes(data.grade)) {
    errors.push('Invalid grade selected')
  }
  
  if (data.defects < 0) {
    errors.push('Defects cannot be negative')
  }
  
  // Location validation
  if (!data.farmLocation.district || !data.farmLocation.province) {
    errors.push('Farm location district and province are required')
  }
  
  // File validations
  if (data.images.length === 0) {
    errors.push('At least one image is required')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Lot display data for farmer dashboard
export interface LotSummary {
  id: string
  publicId: string
  crop: string
  variety: string
  quantity: number
  grade: Grade
  status: 'DRAFT' | 'PUBLISHED' | 'BIDDING' | 'SOLD' | 'DELIVERED'
  createdAt: string
  bidsCount: number
  highestBid?: number
  farmer: Pick<User, 'id' | 'name' | 'company'>
}

// Lot detail view
export interface LotDetail extends LotSummary {
  harvestDate: string
  expectedDelivery: string
  temperature: number
  humidity: number
  defects: number
  qualityNotes?: string
  organic: boolean
  gmp: boolean
  certifications: string[]
  farmLocation: Address
  images: string[]
  documents: string[]
  qrCode: string
  blockchain?: {
    txHash: string
    blockNumber: number
  }
}