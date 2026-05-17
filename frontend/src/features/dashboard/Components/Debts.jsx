import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchDebts } from '../../service/debtSlice'
import PageLoader from '../../../components/UI/PageLoader'

const Debts = () => {
  const dispatch = useDispatch()
  const { user, loading, error, isAuthenticated, role } = useSelector(state=> state.auth)
  const { debts, status, errorMessage } = useSelector((state) => state.debt)

  useEffect(() => {
    dispatch(fetchDebts())
  }, [])

  let servedTitle;
  if(user && role === 'admin'){
    servedTitle = "All debts in the system."
  }else if(user && role === 'agent'){
     servedTitle = "All debts in the system assigned to you."
  }else if(user && role === 'debtor'){
    servedTitle = "All debts in the system assigned to you."
  }else{
    servedTitle = "All debts in the system"
  }

  if (status === 'loading') return <PageLoader />

  return (
    <section className='md:flex items-start justify-start gap-4 px-4 pt-5'>
      <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm p-5">

        {/* HEADER */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Debts
          </h3>
          <p className="text-sm text-gray-500">
            {servedTitle}
          </p>
        </div>

        {/* LIST */}
        <div className="space-y-2">

          {debts.length > 0 ? (
            debts.map((debt) => (
              <div
                key={debt.id}
                className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-50 transition border border-transparent hover:border-gray-100"
              >

                {/* LEFT SIDE */}
                <div className="space-y-1">

                  <p className="text-sm font-medium text-gray-900">
                    {debt.debtorInfo.fullName} • {debt.primaryLender}
                  </p>

                  <p className="text-xs text-gray-500">
                    R {debt.amount.toFixed(2).toLocaleString()}
                  </p>

                </div>

                {/* RIGHT SIDE */}
                <div className="text-right space-y-1">

                  <p className="text-sm font-semibold text-gray-900">
                    R {Number(debt.amount).toLocaleString()}
                  </p>

                  <span
                    className={`inline-flex px-3 py-1 text-xs rounded-full font-medium ${
                      debt.status === 'paid'
                        ? 'bg-green-50 text-green-700'
                        : debt.status === 'pending'
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {debt.status}
                  </span>

                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              No transactions found
            </div>
          )}

        </div>

</div>
      </section>
  )
}

export default Debts