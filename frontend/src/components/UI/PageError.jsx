import React from 'react'
import { FiAlertTriangle } from 'react-icons/fi'

const PageError = ({
  title = "Something went wrong",
  message = "We couldn't load this page. Please try again.",
  onRetry,
}) => {
  return (
    <div className="h-[calc(100vh-10rem)] flex items-center justify-center p-2">

      <div className="bg-red-50 border border-red-100 rounded-3xl p-8 max-w-md w-full text-center">

        {/* Icon */}
        <div className="w-fit mx-auto bg-red-100 rounded-full p-4 mb-5">
          <FiAlertTriangle
            className="text-red-700"
            size={34}
          />
        </div>

        {/* Content */}
        <h2 className="text-xl font-semibold text-gray-900">
          {title}
        </h2>

        <p className="text-gray-500 mt-2 text-sm">
          {message}
        </p>

        {/* Action */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-6 bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-full transition"
          >
            Try Again
          </button>
        )}

      </div>

    </div>
  )
}

export default PageError