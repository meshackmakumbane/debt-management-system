import React from 'react'

const Installments = ({ installments, status, errorMessage }) => {

  if(status === 'loading'){
    return(
      <div className='md:flex-1 animate-pulse'>
      <div className='my-2 pl-2 h-2 w-20 bg-gray-100 rounded-sm'></div>
      <div className='flex items-center justify-between bg-gray-300 px-2 rounded-lg shadow'>
        <div className='mx-auto w-10 flex items-center justify-center p-3 mr-2 rounded-full bg-gray-200'></div>
        <div className='bg-white rounded-lg flex-1'>
          <div className='mx-2 my-3'>
            <div className='p-1.5 h-2 w-20 bg-gray-100 rounded-sm mb-1'></div>
            <div className='p-1.5 h-2 w-30 bg-gray-100 rounded-sm'></div>
          </div>
          <hr className='mx-2 my-1 border border-gray-100'/>
          <div className='my-3 '>
              <div className='flex items-center justify-between m-2'>
                  <div className='p-1.5 h-2 w-30 bg-gray-100 rounded-sm'></div>
                  <div className='p-1.5 h-2 w-30 bg-gray-100 rounded-sm'></div>
              </div>
          </div>
        </div>
      </div>
    </div>
    )
  }

  if(errorMessage) return <p>{errorMessage}</p>

  const renderedInstallments = installments?.map(installment =>(
    <div key={installment?._id} className='bg-white rounded-lg flex-1'>
      <div className='mx-2 my-3'>
        <p className='font-bold text-md'>Active installment</p>
        <p className='text-sm'>Next due date {installment?.nextDueDate.toLocaleString()}</p>
      </div>
      <hr className='mx-2 my-1'/>
      <div className='my-3 '>
          <div className='flex items-center justify-between m-2'>
              <span className='font-semibold'>Installment Amount</span>
              <p className='text-gray-950 text-md font-bold'>R{installment?.installmentAmount.toFixed(2).toLocaleString()}</p>
          </div>
      </div>
    </div>
  ))

  return (
    <div className='md:flex-1'>
      <p className='font-medium text-black my-2 pl-2'>Installment</p>
      <div className='flex items-center justify-between bg-green-600 rounded-lg shadow'>
        <div className='mx-auto w-10 flex items-center justify-center'>
          <svg width="30px" height="30px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ffffff"><path d="M11 6H21" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11 12H21" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11 18H21" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 19V5M5 19L3 16.5M5 19L7 16.5M5 5L3 7M5 5L7 7" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </div>
        { installments?.length > 0 ? renderedInstallments : <p>No Active Installment</p>}
      </div>
    </div>
  )
}

export default Installments
