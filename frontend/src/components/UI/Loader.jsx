import React from 'react'
import { RiLoader2Fill } from "react-icons/ri";

const Loader = () => {
  return (
    <div className='flex items-center justify-center'>
      <div className='flex space-x-2'>
        <RiLoader2Fill
          size={25}
          className='text-white animate-spin'
        />
      </div>
    </div>
  )
}

export default Loader