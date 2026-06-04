import React, { useState, useEffect } from 'react'
import api from '../../../api/axios'
import PageLoader from '../../../components/UI/PageLoader'
import PageError from '../../../components/UI/PageError'



const Transactions = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    const fetchPayments = async()=>{
      try{
        const res = await api.get('/users/payments')
        setPayments(res.data)
      }catch(error){
        setError(error.response?.data?.message || "Error fetching payments")
      }finally{
        setLoading(false)
      }
    }
    fetchPayments()
  },[])

  if(loading) return <PageLoader />
  if(error) return <PageError />

  return (
    <section className='md:flex items-start justify-start gap-4 px-4 pt-5'>
        {/* Transactions */}
        <div className='w-full'>
          <p className='font-medium text-black my-2 pl-2'>Transactions</p>           
          <div className='p-2 rounded-md mt-2'>
            {payments?.length > 0
            ?payments?.map(payment =>(
              <div key={payment.id} className='flex items-start justify-between border-b w-full py-2'>

                <div>
                  <p className='text-gray-350 font-bold max-sm:text-sm'>{payment.debtor.fullName} - {payment.debtor.refNumber}</p>
                  <p>{payment.paidAt}</p>
                </div>

                <div className='items-end'>
                  <p>R{payment.amount.toFixed(2).toLocaleString()}</p>
                  <span className={`px-4 pb-1 text-xs rounded-full font-medium
                    ${payment.status === 'paid' && 'bg-green-100 text-green-600'}
                    ${payment.status === 'pending' && 'bg-yellow-100 text-yellow-600'}
                    ${payment.status === 'overdue' && 'bg-red-100 text-red-600'}
                  `}>
                    {payment.status}
                  </span>
                </div>

              </div>
            ))
            : <p>No transactions</p>}
          </div>
        </div>
      </section>
  )
}

export default Transactions
