import React from 'react'
import { Link } from 'react-router-dom'

const Payoff = ({ discount, totalPayoff }) => {
    if(!discount){
        return(
         <div className='md:flex-1 animate-pulse'>
        <div className='my-2 pl-2 h-2 w-20 bg-gray-100 rounded-sm'></div>
        <div className='bg-gray-300 shadow rounded-lg'>
            <div className='flex items-center justify-between p-2  '>
                <div className='text-white'>
                    <div className='p-1.5 h-2 w-20 bg-gray-100 rounded-sm mb-1'></div>
                    <div className='p-1.5 h-2 w-30 bg-gray-100 rounded-sm'></div>
                </div>
            </div>
            <div className='my-2 p-1 bg-white rounded-lg  cursor-pointer'>
                <div className='flex items-center justify-between mx-2.5 my-2'>
                    <div className='p-1.5 h-3 w-10 bg-gray-100 rounded-sm'></div>
                    <div className='p-1.5 h-3 w-10 bg-gray-100 rounded-sm'></div>
                </div>
            </div>
        </div>

    </div>   
        )
    }

  return (
    <div className='md:flex-1'>
        <p className='font-medium text-black my-2 pl-2'>Pay once-off</p>

        <div className='bg-green-600 shadow rounded-lg'>
            <div className='flex items-center justify-between p-2  '>
                <div className='text-white'>
                    <p className='font-bold text-md'>Once-Off Payment</p>
                    <p className='text-sm'>Pay full amount and get 5% discount - <span className='font-bold'>R{discount.toFixed(2).toLocaleString() || 0}</span></p>
                </div>
            </div>
            <div className='my-2 p-1 bg-white rounded-lg shadow cursor-pointer'>
                <div className='flex items-center justify-between mx-2.5 my-2'>
                    <h1 className='text-gray-950 font-bold max-sm:text-[17px]'><Link to='/debtor/payments'>PAY NOW</Link></h1>
                    <h1 className='text-gray-950 text-md font-bold'>R{totalPayoff.toFixed(2).toLocaleString() || 0}</h1>
                </div>
            </div>
        </div>

    </div> 
  )
}

export default Payoff
