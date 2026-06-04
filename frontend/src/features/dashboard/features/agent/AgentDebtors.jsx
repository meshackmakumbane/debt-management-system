import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import Button from '../../components/UI/Button'
import { fetchData } from '../../services/overviewSlice'
import PageLoader from '../../../../components/UI/PageLoader'

const AgentDebtors = () => {
  const dispatch = useDispatch()
  const { data, counts, loading, error } = useSelector((state) => state.overview)
  const [ debtorData, setdebtorData ] = useState([])

  useEffect(() => {
    if (data?.debtors) {
      setdebtorData(data.debtors)
    }
  }, [data])

  if (status === 'loading') return <PageLoader />

  return (
    <>
      <div className='flex items-center justify-between pr-4'>
        <Button />
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Debtors
              </h2>
              <p className="text-sm text-gray-500">
                Manage all your debtor accounts and balances
              </p>
            </div>

            <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
              {debtorData.length} total
            </span>
          </div>

          {/* LIST HEADER (desktop only) */}
          <div className="hidden md:grid grid-cols-5 text-xs text-gray-500 px-3 pb-2 border-b">
            <span>Name</span>
            <span>Email</span>
            <span>Phone</span>
            <span>Debt</span>
            <span>Status</span>
          </div>

          {/* LIST */}
          <div className="space-y-2 mt-3">

            {debtorData.length > 0 ? (
              debtorData.map((debtor) => (
                <div
                  key={debtor._id}
                  className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-0 items-center px-3 py-3 rounded-lg hover:bg-gray-50 transition"
                >

                  {/* NAME */}
                  <div className="font-medium text-gray-900">
                    <Link
                      to={`/account/debtors/${debtor._id}`}
                      className="hover:text-green-700 transition"
                    >
                      {debtor.name}
                    </Link>
                  </div>

                  {/* EMAIL */}
                  <div className="text-sm text-gray-600 truncate">
                    {debtor.email}
                  </div>

                  {/* PHONE */}
                  <div className="text-sm text-gray-600">
                    {debtor.phone || '-'}
                  </div>

                  {/* DEBT */}
                  <div className="text-sm font-semibold text-gray-900">
                    {debtor.balance
                      ? `ZAR ${debtor.balance.toFixed(2)}`
                      : '-'}
                  </div>

                  {/* STATUS */}
                  <div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        debtor.isActive
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {debtor.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">
                No debtors found
              </div>
            )}

          </div>

      </div>
    </>
  )
}

export default AgentDebtors
