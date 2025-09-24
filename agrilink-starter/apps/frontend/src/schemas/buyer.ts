import { Grade, Address, User, validateEmail } from './shared'

// Buyer profile data
export interface BuyerProfile {
  id: string
  companyName: string
  email: string
  phone: string
  businessLicense: string
  taxId: string
  address: Address
  preferredCrops: string[]
  certificationRequirements: string[]
  paymentTerms: 'CASH' | 'CREDIT_30' | 'CREDIT_60' | 'CREDIT_90'
  minOrderQuantity?: number
  maxOrderQuantity?: number
  qualityStandards: {
    minGrade: Grade
    maxDefects: number
    organicRequired: boolean
    gmpRequired: boolean
  }
}

// Bid creation data
export interface BidInput {
  lotId: string
  pricePerUnit: number
  quantity: number
  notes?: string
  deliveryDate: string
  paymentTerms: 'CASH' | 'CREDIT_30' | 'CREDIT_60' | 'CREDIT_90'
  qualityRequirements?: {
    inspectionRequired: boolean
    customRequirements?: string
  }
}

// Purchase order data
export interface PurchaseOrder {
  id: string
  bidId: string
  lotId: string
  buyerId: string
  farmerId: string
  status: 'PENDING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED'
  totalAmount: number
  paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE'
  deliveryDate: string
  actualDeliveryDate?: string
  qualityInspection?: {
    inspectorId: string
    grade: Grade
    defects: number
    notes: string
    passedInspection: boolean
    inspectionDate: string
  }
  createdAt: string
  updatedAt: string
}

// Validation functions
export const validateBuyerProfile = (data: BuyerProfile): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!data.companyName || data.companyName.length < 2) {
    errors.push('Company name must be at least 2 characters')
  }
  
  if (!validateEmail(data.email)) {
    errors.push('Valid email address is required')
  }
  
  if (!data.phone || data.phone.length < 10) {
    errors.push('Valid phone number is required')
  }
  
  if (!data.businessLicense || data.businessLicense.length < 5) {
    errors.push('Business license number is required')
  }
  
  if (!data.taxId || data.taxId.length < 5) {
    errors.push('Tax ID is required')
  }
  
  if (!data.address.district || !data.address.province) {
    errors.push('Complete address is required')
  }
  
  if (data.preferredCrops.length === 0) {
    errors.push('At least one preferred crop must be selected')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateBidInput = (data: BidInput): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!data.lotId) {
    errors.push('Lot ID is required')
  }
  
  if (!data.pricePerUnit || data.pricePerUnit <= 0) {
    errors.push('Price per unit must be greater than 0')
  }
  
  if (!data.quantity || data.quantity <= 0) {
    errors.push('Quantity must be greater than 0')
  }
  
  if (!data.deliveryDate) {
    errors.push('Delivery date is required')
  }
  
  const deliveryDateObj = new Date(data.deliveryDate)
  if (deliveryDateObj <= new Date()) {
    errors.push('Delivery date must be in the future')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Buyer dashboard summary data
export interface BuyerDashboard {
  totalOrders: number
  activeOrders: number
  pendingPayments: number
  totalSpent: number
  averageOrderValue: number
  recentOrders: PurchaseOrder[]
  preferredSuppliers: Array<{
    farmerId: string
    farmerName: string
    orderCount: number
    totalValue: number
    averageGrade: Grade
  }>
}