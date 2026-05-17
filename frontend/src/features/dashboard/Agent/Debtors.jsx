import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchDebtors } from '../../service/debtorSlice'

const Debtors = () => {
  const dispatch = useDispatch()
  const { debtors, loading, errorMessage } = useSelector(state => state.debtor)

  useEffect(()=>{
    dispatch(fetchDebtors())
  },[dispatch])

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Debtors</h2>
        <span className="text-sm text-gray-500">{debtors?.length} total</span>  
      </div>
    
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Debt</th>
              <th>Status</th>
              <th>Assigned</th>
            </tr>
          </thead>

          <tbody>
            {debtors?.length > 0 ? (
              debtors?.map((debtor) => (
                <tr key={debtor._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium text-black">
                    <Link to={`/admin/debtors/${debtor._id}`}>{debtor.fullName}</Link>
                  </td>
                  <td>{debtor.email}</td>
                  <td>{debtor.phoneNumber || '-'}</td>
                  <td>{`ZAR ${debtor.balance?.toFixed(2) || '-'}`}</td>
                  <td>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      debtor.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {debtor.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-400">
                  No debtors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Debtors
