import React from 'react'

// Form field wrapper component
interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  helpText?: string
  children: React.ReactNode
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  helpText,
  children,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {children}
      
      {helpText && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
      
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// Input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input: React.FC<InputProps> = ({
  error = false,
  className = '',
  ...props
}) => {
  return (
    <input
      className={`
        block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
        placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
        ${className}
      `}
      {...props}
    />
  )
}

// Textarea component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const Textarea: React.FC<TextareaProps> = ({
  error = false,
  className = '',
  ...props
}) => {
  return (
    <textarea
      className={`
        block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
        placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
        ${className}
      `}
      {...props}
    />
  )
}

// Select component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
  options: Array<{ value: string; label: string }>
  placeholder?: string
}

export const Select: React.FC<SelectProps> = ({
  error = false,
  options,
  placeholder,
  className = '',
  ...props
}) => {
  return (
    <select
      className={`
        block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
        ${className}
      `}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

// Checkbox component
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  className = '',
  ...props
}) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        className={`
          h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded
          ${className}
        `}
        {...props}
      />
      <label className="ml-2 block text-sm text-gray-900">
        {label}
      </label>
    </div>
  )
}

// Radio group component
interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  name: string
  options: RadioOption[]
  value?: string
  onChange: (value: string) => void
  error?: boolean
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  error = false
}) => {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <div key={option.value} className="flex items-start">
          <input
            type="radio"
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className={`
              h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300
              ${error ? 'border-red-300' : ''}
            `}
          />
          <label
            htmlFor={`${name}-${option.value}`}
            className="ml-2 block text-sm text-gray-900"
          >
            <span className="font-medium">{option.label}</span>
            {option.description && (
              <span className="block text-gray-500 text-xs">
                {option.description}
              </span>
            )}
          </label>
        </div>
      ))}
    </div>
  )
}

// File upload component
interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number
  onFileSelect: (files: File[]) => void
  error?: string
  currentFiles?: File[]
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  onFileSelect,
  error,
  currentFiles = []
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Validate file size
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`)
        return false
      }
      return true
    })
    
    onFileSelect(validFiles)
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-gray-600">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
              <span>Upload files</span>
              <input
                type="file"
                className="sr-only"
                accept={accept}
                multiple={multiple}
                onChange={handleFileChange}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">
            {accept || 'Any file type'} up to {maxSize / (1024 * 1024)}MB
          </p>
        </div>
      </div>

      {currentFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected files:</h4>
          {currentFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">{file.name}</span>
              <span className="text-xs text-gray-400">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}