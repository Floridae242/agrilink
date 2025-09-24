import React from 'react'

interface KpiCardProps {
  label: string
  value: string | number
  delta?: number
  tooltip?: string
}

export const KpiCard: React.FC<KpiCardProps> = ({ label, value, delta, tooltip }) => {
  const deltaColor = delta && delta !== 0 ? (delta > 0 ? 'text-green-600' : 'text-red-600') : 'text-gray-400'
  const deltaSign = delta && delta !== 0 ? (delta > 0 ? '+' : '') : ''
  return (
    <div className="rounded-xl border p-4 bg-white" aria-label={tooltip || label}>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {typeof delta === 'number' && (
        <div className={`mt-1 text-sm ${deltaColor}`}>{deltaSign}{delta}%</div>
      )}
    </div>
  )
}

export default KpiCard
