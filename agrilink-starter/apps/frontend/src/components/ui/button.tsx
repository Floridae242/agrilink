import React from 'react'
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'solid'|'ghost' }
export const Button: React.FC<Props> = ({ className = '', variant='solid', ...rest }) => {
  const base = 'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-offset-2'
  const solid = 'bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500'
  const ghost = 'bg-transparent text-brand-700 hover:bg-brand-50 focus-visible:ring-brand-500'
  const cls = [base, variant==='solid'?solid:ghost, className].join(' ')
  return <button className={cls} {...rest} />
}
export default Button
