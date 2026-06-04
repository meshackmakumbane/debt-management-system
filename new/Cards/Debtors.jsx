import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchDebtors, selectDebtors } from '../../service/debtorSlice'

const Debtors = () => {
  const dispatch = useDispatch()
  const { loading, errorMessage } = useSelector(state => state.debtor)
  const debtors = useSelector(selectDebtors)

  useEffect(()=>{
    dispatch(fetchDebtors())
  },[dispatch])

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
    
            {/* HEADER */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Debtors
                </h2>
                <p className="text-sm text-gray-500">
                  Manage all debtor accounts and balances
                </p>
              </div>
    
              <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                {debtors.length} total
              </span>
            </div>
    
            {/* LIST HEADER (desktop only) */}
            <div className="hidden md:grid grid-cols-6 text-xs text-gray-500 px-3 pb-2 border-b">
              <span>Name</span>
              <span>Email</span>
              <span>Phone</span>
              <span>Debt</span>
              <span>Status</span>
              <span>Assigned Agent</span>
            </div>
    
            {/* LIST */}
            <div className="space-y-2 mt-3">
    
              {debtors.length > 0 ? (
                debtors.map((debtor) => (
                  <div
                    key={debtor._id}
                    className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-0 items-center px-3 py-3 rounded-lg hover:bg-gray-50 transition"
                  >
    
                    {/* NAME */}
                    <div className="font-medium text-gray-900">
                      <Link
                        to={`/agent/debtors/${debtor._id}`}
                        className="hover:text-green-700 transition"
                      >
                        {debtor.fullName}
                      </Link>
                    </div>
    
                    {/* EMAIL */}
                    <div className="text-sm text-gray-600 truncate">
                      {debtor.email}
                    </div>
    
                    {/* PHONE */}
                    <div className="text-sm text-gray-600">
                      {debtor.phoneNumber || '-'}
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
    
                    {/* ASSIGNED */}
                    <div className="text-sm text-gray-800 font-medium">
                      {debtor.agentName || '-'}
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
  )
}

export default Debtors
