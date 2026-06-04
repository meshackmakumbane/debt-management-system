import React from 'react'

const PageLoader = () => {
  return (
    <div className="h-[calc(100vh-10rem)] flex items-center justify-center p-2">

      <div className="bg-green-50 border border-green-100 rounded-3xl p-8 w-full max-w-md text-center">

        {/* Loader */}
        <div className="w-fit mx-auto bg-green-100 rounded-full p-4 mb-5">

          <div className="w-10 h-10 border-[3px] border-green-700 border-t-transparent rounded-full animate-spin" />

        </div>

        {/* Content */}
        <h2 className="text-xl font-semibold text-gray-900">
          Loading...
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Please wait while we load your content
        </p>

      </div>

    </div>
  )
}

export default PageLoader