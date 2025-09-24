import React from 'react'

interface ModalProps {
  title: string
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ title, open, onClose, children }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button aria-label="Close" onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
