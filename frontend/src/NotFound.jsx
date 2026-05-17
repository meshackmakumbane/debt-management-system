import React from 'react'


const NotFound = () => {
  const goBack = ()=>{
    window.history.back()
  }
  return (
    <div className='h-screen flex items-center justify-center'>
      <div className='flex flex-col items-center justify-cente'>
        <h1 className='text-[100px] font-bold'>404</h1>
        <p className='text-center -mt-4'>Page not found</p>
        <button className='bg-green-900 text-white p-1 px-4 cursor-pointer rounded-xl my-5' onClick={goBack}>Go back</button>
      </div>
    </div>
  )
}

export default NotFound
