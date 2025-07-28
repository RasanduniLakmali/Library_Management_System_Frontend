import React from "react"

interface DialogProps {
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
  children: React.ReactNode
  title?: string
}

const Dialog = ({ isOpen, onCancel, onConfirm, children, title }: DialogProps) => {
  if (!isOpen) return null

  return (
      <div className='fixed inset-0 bg-gray-500 bg-opacity-30 flex items-center justify-center z-50'>


      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col'>
        {title && (
          <div className='mb-4 flex-shrink-0'>
            <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
          </div>
        )}
        <div className='mb-6 flex-1 overflow-y-auto max-h-96 min-h-0'>{children}</div>
        <div className="flex space-x-3 pt-4">
          <button
              type="button"
              onClick={onConfirm}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
          >
            Confirm
          </button>
          <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dialog
