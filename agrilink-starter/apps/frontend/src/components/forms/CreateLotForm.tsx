import React, { useState } from 'react'
import { FormField, Input, Textarea, Select, Checkbox, FileUpload } from '../forms/FormComponents'
import { LotInput, validateLotInput } from '../../schemas/lot'
import { gradeOptions } from '../../schemas/shared'

interface CreateLotFormProps {
  onSubmit: (data: LotInput) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export const CreateLotForm: React.FC<CreateLotFormProps> = ({
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<LotInput>({
    crop: '',
    variety: '',
    quantity: 0,
    harvestDate: '',
    expectedDelivery: '',
    temperature: 20,
    humidity: 60,
    grade: 'A',
    defects: 0,
    qualityNotes: '',
    organic: false,
    gmp: false,
    certifications: [],
    certificationFiles: [],
    farmLocation: {
      district: '',
      province: '',
      postalCode: '',
      country: 'Thailand'
    },
    images: [],
    documents: []
  })

  const [errors, setErrors] = useState<string[]>([])
  const [step, setStep] = useState(1)

  const cropOptions = [
    { value: 'rice', label: 'Rice' },
    { value: 'corn', label: 'Corn' },
    { value: 'sugarcane', label: 'Sugarcane' },
    { value: 'cassava', label: 'Cassava' },
    { value: 'mango', label: 'Mango' },
    { value: 'durian', label: 'Durian' },
    { value: 'coconut', label: 'Coconut' },
    { value: 'rubber', label: 'Rubber' },
    { value: 'palm_oil', label: 'Palm Oil' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'herbs', label: 'Herbs' },
    { value: 'other', label: 'Other' }
  ]

  const gradeOptionsForSelect = gradeOptions.map(grade => ({
    value: grade,
    label: `Grade ${grade}`
  }))

  const provinceOptions = [
    { value: 'bangkok', label: 'Bangkok' },
    { value: 'chiang_mai', label: 'Chiang Mai' },
    { value: 'chiang_rai', label: 'Chiang Rai' },
    { value: 'khon_kaen', label: 'Khon Kaen' },
    { value: 'nakhon_ratchasima', label: 'Nakhon Ratchasima' },
    { value: 'ubon_ratchathani', label: 'Ubon Ratchathani' },
    { value: 'surat_thani', label: 'Surat Thani' },
    { value: 'phuket', label: 'Phuket' },
    { value: 'songkhla', label: 'Songkhla' },
    { value: 'rayong', label: 'Rayong' }
  ]

  const certificationOptions = [
    'Organic Thailand',
    'Good Agricultural Practice (GAP)',
    'Global Good Agricultural Practice (GlobalGAP)',
    'Fair Trade',
    'Rainforest Alliance',
    'UTZ Certified',
    'ISO 22000',
    'HACCP',
    'BRC Global Standard',
    'SQF (Safe Quality Food)'
  ]

  const handleInputChange = (field: keyof LotInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLocationChange = (field: keyof LotInput['farmLocation'], value: string) => {
    setFormData(prev => ({
      ...prev,
      farmLocation: {
        ...prev.farmLocation,
        [field]: value
      }
    }))
  }

  const handleCertificationToggle = (certification: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(certification)
        ? prev.certifications.filter(c => c !== certification)
        : [...prev.certifications, certification]
    }))
  }

  const handleNext = () => {
    const validation = validateLotInput(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }
    setErrors([])
    setStep(step + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validation = validateLotInput(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      setErrors(['Failed to create lot. Please try again.'])
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Crop Type" required>
          <Select
            value={formData.crop}
            onChange={(e) => handleInputChange('crop', e.target.value)}
            options={cropOptions}
            placeholder="Select crop type"
          />
        </FormField>

        <FormField label="Variety" required>
          <Input
            value={formData.variety}
            onChange={(e) => handleInputChange('variety', e.target.value)}
            placeholder="e.g., Jasmine Rice, Hom Mali"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="Quantity (kg)" required>
          <Input
            type="number"
            value={formData.quantity}
            onChange={(e) => handleInputChange('quantity', parseFloat(e.target.value))}
            placeholder="0"
            min="0"
            step="0.01"
          />
        </FormField>

        <FormField label="Harvest Date" required>
          <Input
            type="date"
            value={formData.harvestDate}
            onChange={(e) => handleInputChange('harvestDate', e.target.value)}
          />
        </FormField>

        <FormField label="Expected Delivery" required>
          <Input
            type="date"
            value={formData.expectedDelivery}
            onChange={(e) => handleInputChange('expectedDelivery', e.target.value)}
            min={formData.harvestDate || undefined}
          />
        </FormField>
      </div>

      <FormField label="Quality Notes" helpText="Additional information about the produce quality">
        <Textarea
          value={formData.qualityNotes || ''}
          onChange={(e) => handleInputChange('qualityNotes', e.target.value)}
          placeholder="Describe any special qualities, handling, or notes about this lot..."
          rows={3}
        />
      </FormField>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Quality Assessment</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormField label="Temperature (°C)" required>
          <Input
            type="number"
            value={formData.temperature}
            onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
            placeholder="20"
            min="-30"
            max="50"
            step="0.1"
          />
        </FormField>

        <FormField label="Humidity (%)" required>
          <Input
            type="number"
            value={formData.humidity}
            onChange={(e) => handleInputChange('humidity', parseFloat(e.target.value))}
            placeholder="60"
            min="0"
            max="100"
            step="0.1"
          />
        </FormField>

        <FormField label="Grade" required>
          <Select
            value={formData.grade}
            onChange={(e) => handleInputChange('grade', e.target.value)}
            options={gradeOptionsForSelect}
          />
        </FormField>

        <FormField label="Defects Count" required>
          <Input
            type="number"
            value={formData.defects}
            onChange={(e) => handleInputChange('defects', parseInt(e.target.value))}
            placeholder="0"
            min="0"
          />
        </FormField>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Certifications</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Checkbox
            label="Organic Certified"
            checked={formData.organic}
            onChange={(e) => handleInputChange('organic', e.target.checked)}
          />
          
          <Checkbox
            label="Good Manufacturing Practice (GMP)"
            checked={formData.gmp}
            onChange={(e) => handleInputChange('gmp', e.target.checked)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Additional Certifications
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {certificationOptions.map((cert) => (
              <Checkbox
                key={cert}
                label={cert}
                checked={formData.certifications.includes(cert)}
                onChange={() => handleCertificationToggle(cert)}
              />
            ))}
          </div>
        </div>
      </div>

      <FormField label="Certification Documents" helpText="Upload relevant certification documents">
        <FileUpload
          accept=".pdf,.jpg,.jpeg,.png"
          multiple={true}
          onFileSelect={(files) => handleInputChange('certificationFiles', files)}
          currentFiles={formData.certificationFiles}
        />
      </FormField>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Location & Documentation</h3>
      
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Farm Location</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="District" required>
            <Input
              value={formData.farmLocation.district}
              onChange={(e) => handleLocationChange('district', e.target.value)}
              placeholder="Enter district"
            />
          </FormField>

          <FormField label="Province" required>
            <Select
              value={formData.farmLocation.province}
              onChange={(e) => handleLocationChange('province', e.target.value)}
              options={provinceOptions}
              placeholder="Select province"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Postal Code" required>
            <Input
              value={formData.farmLocation.postalCode}
              onChange={(e) => handleLocationChange('postalCode', e.target.value)}
              placeholder="e.g., 10100"
              pattern="[0-9]{5}"
            />
          </FormField>

          <FormField label="Country">
            <Input
              value={formData.farmLocation.country}
              onChange={(e) => handleLocationChange('country', e.target.value)}
              placeholder="Thailand"
              disabled
            />
          </FormField>
        </div>
      </div>

      <FormField label="Product Images" required helpText="Upload clear photos of your produce">
        <FileUpload
          accept=".jpg,.jpeg,.png"
          multiple={true}
          onFileSelect={(files) => handleInputChange('images', files)}
          currentFiles={formData.images}
        />
      </FormField>

      <FormField label="Additional Documents" helpText="Upload any additional documents (contracts, analysis reports, etc.)">
        <FileUpload
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          multiple={true}
          onFileSelect={(files) => handleInputChange('documents', files)}
          currentFiles={formData.documents}
        />
      </FormField>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow">
      {/* Progress Bar */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">Create New Lot</h2>
          <span className="text-sm text-gray-500">Step {step} of 3</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Please correct the following errors:
                </h3>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Form Steps */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Previous
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Lot'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}