import React from 'react'

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'flat'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const cardVariants = {
  default: 'bg-white border border-gray-200 shadow-sm',
  elevated: 'bg-white border-0 shadow-lg',
  outlined: 'bg-white border-2 border-gray-200 shadow-none',
  flat: 'bg-gray-50 border-0 shadow-none'
}

const paddingVariants = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8'
}

const roundedVariants = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full'
}

export function Card({ 
  variant = 'default', 
  padding = 'md', 
  rounded = 'lg',
  className, 
  children, 
  ...props 
}: CardProps) {
  return (
    <div
      className={cn(
        'transition-all duration-200',
        cardVariants[variant],
        paddingVariants[padding],
        roundedVariants[rounded],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
}

export function CardHeader({ title, subtitle, actions, className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between space-y-1.5 mb-4', className)} {...props}>
      <div className="space-y-1">
        {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        {children}
      </div>
      {actions && <div className="flex items-center space-x-2">{actions}</div>}
    </div>
  )
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {children}
    </div>
  )
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={cn('flex items-center justify-between pt-4 mt-4 border-t border-gray-200', className)} {...props}>
      {children}
    </div>
  )
}

export default Card
