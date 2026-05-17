import React from 'react'

const PageLoader = () => {
  return (
    <div className='h-[calc(100vh-10rem)] flex items-center justify-center p-2'>
      <div className='flex space-x-2 bg-gray-200 rounded-full p-3'>
        <span className='animate-spin bg-white rounded-full p-1'><svg width="35px" height="35px" stroke-width="5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#14532d"><path d="M21.8883 13.5C21.1645 18.3113 17.013 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C16.1006 2 19.6248 4.46819 21.1679 8" stroke="#14532d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3" stroke="#14532d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
      </div>
    </div>
  )
}

export default PageLoader
