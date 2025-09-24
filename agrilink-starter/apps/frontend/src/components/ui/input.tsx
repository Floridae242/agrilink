import React from 'react'

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled' | 'outlined'
  inputSize?: 'sm' | 'md' | 'lg'
  state?: 'default' | 'error' | 'success' | 'warning'
  label?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const inputVariants = {
  default: 'border border-gray-300 bg-white focus:border-brand-500 focus:ring-brand-500',
  filled: 'border-0 bg-gray-100 focus:bg-white focus:ring-brand-500',
  outlined: 'border-2 border-gray-300 bg-white focus:border-brand-500 focus:ring-0'
}

const sizeVariants = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg'
}

const stateVariants = {
  default: '',
  error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
  success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
  warning: 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500'
}

export function Input({
  variant = 'default',
  inputSize = 'md',
  state = 'default',
  label,
  helperText,
  leftIcon,
  rightIcon,
  className,
  ...props
}: InputProps) {
  const id = React.useId()
  
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          id={id}
          className={cn(
            'w-full rounded-lg transition-colors duration-200 focus:outline-none focus:ring-1',
            inputVariants[variant],
            sizeVariants[inputSize],
            stateVariants[state],
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {helperText && (
        <p className={cn(
          'text-sm',
          state === 'error' && 'text-red-600',
          state === 'success' && 'text-green-600',
          state === 'warning' && 'text-yellow-600',
          state === 'default' && 'text-gray-600'
        )}>
          {helperText}
        </p>
      )}
    </div>
  )
}

export default Input