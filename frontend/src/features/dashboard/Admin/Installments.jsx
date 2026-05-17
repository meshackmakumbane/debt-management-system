import React, { useEffect, useState } from 'react'
import api from '../../../api/api'

const ActiveInstallments = () => {
  const [installments, setInstallments] = useState([])
  const [loading, setLoading] = useState(true)

  const InstallmentSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 animate-pulse">
    
    <div className="space-y-2 mb-4">
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
      <div className="h-3 w-24 bg-gray-200 rounded"></div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="space-y-2">
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </div>
    </div>

    <div className="h-2 bg-gray-200 rounded mb-4"></div>

    <div className="flex justify-between">
      <div className="h-5 w-16 bg-gray-200 rounded"></div>
      <div className="h-8 w-24 bg-gray-200 rounded"></div>
    </div>

  </div>
  )

  const InstallmentCard = ({ item }) => {
  const progress = (item.amountPaid / item.originalBalance) * 100

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">

      {/* Top */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {item.relatedDebtor?.fullName || 'Unknown'}
        </h3>
        <p className="text-sm text-gray-400">
          Next Due: {new Date(item.nextDueDate).toLocaleDateString()}
        </p>
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-400">Remaining</p>
          <p className="font-semibold text-gray-800">
            {new Intl.NumberFormat('en-ZA', {
              style: 'currency',
              currency: 'ZAR'
            }).format(item.remainingBalance)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Installment</p>
          <p className="font-semibold text-gray-800">
            {new Intl.NumberFormat('en-ZA', {
              style: 'currency',
              currency: 'ZAR'
            }).format(item.installmentAmount)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {Math.round(progress)}% paid
        </p>
      </div>

      {/* Bottom */}
      <div className="flex justify-between items-center">
        <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-600">
          {item.frequency}
        </span>

        <button className="bg-indigo-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-indigo-700">
          Record Payment
        </button>
      </div>

    </div>
  )
  }

  useEffect(() => {
    const fetchInstallments = async () => {
      try {
        const { data } = await api.get('/admin/installments')
        setInstallments(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchInstallments()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1,2,3,4].map(i => <InstallmentSkeleton key={i} />)}
      </div>
    )
  }

  if (!installments.length) {
    return <p className="text-gray-500">No active installments</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {installments.map(item => (
        <InstallmentCard key={item._id} item={item} />
      ))}
    </div>
  )
}

export default ActiveInstallments