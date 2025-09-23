import React from 'react'
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className='', ...rest }) => (
  <div className={['rounded-2xl shadow-sm border border-gray-200 bg-white', className].join(' ')} {...rest} />
)
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({className='', ...rest}) => (
  <div className={['p-4 border-b border-gray-100', className].join(' ')} {...rest} />
)
export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({className='', ...rest}) => (
  <div className={['p-4', className].join(' ')} {...rest} />
)
export default Card
