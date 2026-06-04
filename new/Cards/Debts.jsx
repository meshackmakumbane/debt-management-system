import React from 'react'
import Loader from '../../../../components/UI/Loader'

const Debts = ({ debts, status, errorMessage }) => {

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

  return (
    <div className='md:flex-1'>
      <p className='font-medium text-black my-2 pl-2'>Accounts</p>
      <div className='flex items-center justify-between bg-blue-600 rounded-lg shadow'>
        <div className='mx-auto w-10 flex items-center justify-center'>
          <svg  width="30px" height="30px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ffffff"><path d="M11 9L22 9" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2 11L4.80662 7.84255C5.5657 6.98859 6.65372 6.5 7.79627 6.5L8 6.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2 19.5003L7.5 19.5L11.5 16.5003C11.5 16.5003 12.3091 15.9528 13.5 15.0001C16 13.0002 13.5 9.83352 11 11.4997C8.96409 12.8565 7 14.0003 7 14.0003" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 13.5V7C8 5.89543 8.89543 5 10 5H20C21.1046 5 22 5.89543 22 7V13C22 14.1046 21.1046 15 20 15H13.5" stroke="#ffffff" stroke-width="1.5"></path></svg>
        </div>
        <div className='bg-white rounded-lg flex-1'>
          <div className='mx-2 my-3'>
            <p className='font-bold text-md'>These are all your accounts!</p>
            <p className='text-sm'>Arrange a repayment plan to cover all</p>
          </div>
          <hr className='mx-2 my-1'/>
          <div className='my-3 '>
            {debts?.length > 0 
            ? debts.map(debt =>(
              <div key={debt.id} className='flex items-center justify-between m-2'>
                  <span className='font-semibold'>{debt.primaryLender }</span>
                  <p className='text-gray-950 text-md font-bold'>R{debt.balance.toFixed(2).toLocaleString()}</p>
              </div>
              ))
            : <p className='font-bold text-md'>These are all your accounts!</p>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Debts
