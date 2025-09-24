import { Grade, Address, User } from './shared'

// Admin user management data
export interface AdminUserManagement {
  id: string
  email: string
  name: string
  role: 'FARMER' | 'BUYER' | 'INSPECTOR' | 'ADMIN'
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION'
  phone?: string
  company?: string
  verificationStatus: {
    emailVerified: boolean
    phoneVerified: boolean
    documentsVerified: boolean
    backgroundCheckComplete: boolean
  }
  registrationDate: string
  lastLoginDate?: string
  totalTransactions: number
  totalValue: number
}

// System analytics data
export interface SystemAnalytics {
  users: {
    total: number
    farmers: number
    buyers: number
    inspectors: number
    admins: number
    newThisMonth: number
  }
  lots: {
    total: number
    active: number
    completed: number
    averageGrade: Grade
    totalVolume: number
    averagePrice: number
  }
  transactions: {
    total: number
    totalValue: number
    averageOrderValue: number
    completionRate: number
    disputeRate: number
  }
  quality: {
    averageGrade: Grade
    inspectionRate: number
    passRate: number
    organicPercentage: number
  }
  geographic: {
    topProvinces: Array<{
      province: string
      farmerCount: number
      totalVolume: number
      averageGrade: Grade
    }>
  }
}

// Platform settings
export interface PlatformSettings {
  general: {
    platformName: string
    supportEmail: string
    supportPhone: string
    maintenanceMode: boolean
    registrationOpen: boolean
  }
  fees: {
    transactionFeePercentage: number
    inspectionFeeFixed: number
    listingFeeFixed: number
    minimumOrderValue: number
  }
  quality: {
    mandatoryInspectionThreshold: number // order value
    autoGradingEnabled: boolean
    blockchainIntegrationEnabled: boolean
  }
  notifications: {
    emailNotificationsEnabled: boolean
    smsNotificationsEnabled: boolean
    pushNotificationsEnabled: boolean
  }
  security: {
    twoFactorRequired: boolean
    sessionTimeoutMinutes: number
    passwordMinLength: number
    maxLoginAttempts: number
  }
}

// Content management
export interface ContentManagement {
  id: string
  type: 'ANNOUNCEMENT' | 'NEWS' | 'POLICY' | 'GUIDE' | 'FAQ'
  title: string
  content: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  targetAudience: ('FARMER' | 'BUYER' | 'INSPECTOR' | 'ALL')[]
  tags: string[]
  featuredImage?: string
  publishDate?: string
  expiryDate?: string
  author: string
  createdAt: string
  updatedAt: string
}

// Dispute management
export interface DisputeCase {
  id: string
  orderId: string
  reportedBy: string
  reportedAgainst: string
  type: 'QUALITY_ISSUE' | 'PAYMENT_ISSUE' | 'DELIVERY_ISSUE' | 'FRAUD' | 'OTHER'
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  description: string
  evidence: string[]
  assignedAdmin?: string
  resolution?: string
  resolutionDate?: string
  createdAt: string
  updatedAt: string
}

// Validation functions
export const validatePlatformSettings = (data: PlatformSettings): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!data.general.platformName || data.general.platformName.length < 2) {
    errors.push('Platform name is required')
  }
  
  if (!data.general.supportEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.general.supportEmail)) {
    errors.push('Valid support email is required')
  }
  
  if (data.fees.transactionFeePercentage < 0 || data.fees.transactionFeePercentage > 10) {
    errors.push('Transaction fee must be between 0% and 10%')
  }
  
  if (data.fees.minimumOrderValue < 0) {
    errors.push('Minimum order value cannot be negative')
  }
  
  if (data.security.passwordMinLength < 8) {
    errors.push('Password minimum length should be at least 8 characters')
  }
  
  if (data.security.sessionTimeoutMinutes < 15) {
    errors.push('Session timeout should be at least 15 minutes')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateContentManagement = (data: ContentManagement): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!data.title || data.title.length < 5) {
    errors.push('Title must be at least 5 characters')
  }
  
  if (!data.content || data.content.length < 20) {
    errors.push('Content must be at least 20 characters')
  }
  
  if (data.targetAudience.length === 0) {
    errors.push('At least one target audience must be selected')
  }
  
  if (!data.author || data.author.length < 2) {
    errors.push('Author name is required')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateDisputeCase = (data: Partial<DisputeCase>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!data.orderId) {
    errors.push('Order ID is required')
  }
  
  if (!data.reportedBy) {
    errors.push('Reporter ID is required')
  }
  
  if (!data.reportedAgainst) {
    errors.push('Reported party ID is required')
  }
  
  if (!data.description || data.description.length < 20) {
    errors.push('Description must be at least 20 characters')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Admin dashboard data
export interface AdminDashboard {
  analytics: SystemAnalytics
  recentActivity: Array<{
    id: string
    type: 'USER_REGISTRATION' | 'LOT_CREATED' | 'ORDER_COMPLETED' | 'DISPUTE_OPENED'
    description: string
    timestamp: string
    userId?: string
    orderId?: string
  }>
  systemHealth: {
    uptime: number
    responseTime: number
    errorRate: number
    activeUsers: number
  }
  pendingApprovals: {
    userVerifications: number
    contentReviews: number
    disputeAssignments: number
  }
}