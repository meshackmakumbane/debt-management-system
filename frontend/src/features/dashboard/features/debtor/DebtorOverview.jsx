import React, { useState, useEffect } from 'react'

import Debts from './Cards/Debts'
import Installments from './Cards/Installments' 
import Payoff from './Cards/Payoff'
import Transactions from './Cards/Transactions'
import Methods from './Cards/Methods'

import { fetchDebts } from '../../services/debtSlice'
import { fetchInstallments } from '../../services/installmentSlice'
import { fetchPayments } from '../../services/paymentSlice'

import { useSelector, useDispatch } from 'react-redux'

const DebtorOverview = () => {
  /* ---- SLICE ---- */
  const { user, loading, error, isAuthenticated, role } = useSelector(state=> state.auth)
  const { debts, installments, payments, status, errorMessage } = useSelector(state => state.debt)
  const dispatch = useDispatch()

  /* ---- STATE ---- */
  const [methods, setMethods] = useState([
  {
        id: 1,
        title: 'Pay by card',
        desc: 'Visa, Mastercard, Debit, Credit',
        svg: `<svg width="20px" height="20px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M22 11.4286V18C22 19.1046 21.1046 20 20 20H7C5.89543 20 5 19.1046 5 18V16.5M22 11.4286V10C22 8.89543 21.1046 8 20 8H19M22 11.4286H19" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19 8V14.5C19 15.6046 18.1046 16.5 17 16.5H4C2.89543 16.5 2 15.6046 2 14.5V6.5C2 5.39543 2.89543 4.5 4 4.5H17C18.1046 4.5 19 5.39543 19 6.5V8ZM19 8H5.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
        backColor: 'bg-pink-200'
      },
      {
        id: 2,
        title: 'Setup direct debit',
        desc: 'Explore our repayment plans',
        svg: '<svg width="20px" height="20px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M3 20L21 20" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6 17L6 4M6 4L2 8M6 4L10 8" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18 17V4M18 4L14 8M18 4L22 8" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        backColor: 'bg-green-200'
      },
      {
        id: 3,
        title: 'EFT Payment',
        desc: 'Easy transfer from your bank app',
        svg: '<svg width="20px" height="20px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M11 9L22 9" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2 11L4.80662 7.84255C5.5657 6.98859 6.65372 6.5 7.79627 6.5L8 6.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2 19.5003L7.5 19.5L11.5 16.5003C11.5 16.5003 12.3091 15.9528 13.5 15.0001C16 13.0002 13.5 9.83352 11 11.4997C8.96409 12.8565 7 14.0003 7 14.0003" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 13.5V7C8 5.89543 8.89543 5 10 5H20C21.1046 5 22 5.89543 22 7V13C22 14.1046 21.1046 15 20 15H13.5" stroke="#000000" stroke-width="1.5"></path></svg>',
        backColor: 'bg-amber-200'
      },
      {
        id: 4,
        title: 'Deposit at bank',
        desc: 'Cash can be deposited in bank',
        svg: '<svg width="20px" height="20px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M3 9.5L12 4L21 9.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 20H19" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10 9L14 9" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6 17L6 12" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10 17L10 12" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14 17L14 12" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18 17L18 12" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        backColor: 'bg-blue-200'
      }
  ])

  const totalOwed = debts?.reduce((sum, debt)=>{
    return sum + debt.balance
  }, 0)

  const discount = totalOwed * 5/100
  const totalPayoff = totalOwed - discount

  useEffect(()=>{
    if(!isAuthenticated){
      dispatch(logoutUser())
    }
  },[isAuthenticated, dispatch])

  useEffect(()=>{
    dispatch(fetchDebts())
    dispatch(fetchInstallments())
    dispatch(fetchPayments())
  },[dispatch])

  return (
    <>
      <section className='grid lg:grid-cols-3 gap-4 bg-gray-50 px-4 py-5'>
          {/* Debts section */}
          <Debts debts={debts} status={status} errorMessage={errorMessage}/>
          {/* Installments section */}
          <Installments installments={installments} status={status} errorMessage={errorMessage}/>
          {/* Pay once-off section */}
          <Payoff discount={discount} totalPayoff={totalPayoff} />
      </section>

      <section className='md:flex items-start justify-start gap-4 px-4 pt-5'>
        {/* Transactions */}  
        <Transactions payments={payments}/>
        {/* Payment methods */}
        <Methods methods={methods}/>
      </section>
    </>
  )
}

export default DebtorOverview