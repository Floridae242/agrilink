import React, { useState } from 'react'
import { CreateLotForm } from '../../components/forms/CreateLotForm'
import { LotInput } from '../../schemas/lot'
import { api } from '../../utils/api'

export default function CreateLotView({ onDone }: { onDone?: () => void }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: LotInput) => {
    setLoading(true)
    setMessage(null)
    setError(null)
    try {
      await api.createLot({ farmId: 'demo-farm', produce: data.crop })
      setMessage('Saved successfully')
      onDone?.()
    } catch (e: any) {
      setError(e?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {message && (
        <div className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-700" role="status">{message}</div>
      )}
      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</div>
      )}
      <CreateLotForm onSubmit={handleSubmit} onCancel={onDone || (()=>{})} loading={loading} />
    </div>
  )
}
