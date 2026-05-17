import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import api from '../../../api/api'

const EachDebtor = () => {
  const { id } = useParams()
  const [debtor, setDebtor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

   useEffect(() => {
      const fetchDebtor = async () => {
        try{
          const response = await api.get(`/admin/debtor/${id}`)
          setDebtor(response.data.debtor)
        }catch(err){
          setErrorMessage(err.response?.data?.message || "Failed to fetch debtor details")
        }finally{
        setLoading(false)
        }
      }
      fetchDebtor()
    }, [id])

    if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 animate-pulse">
        
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
          </div>
          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!debtor) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Debtor not found
      </div>
    )
  }

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
        
        {/* Top Section */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {debtor.fullName}
            </h3>
            <p className="text-md text-gray-800">
              Email: {debtor.email}
            </p>

            <p className="text-md text-gray-800">
              Phone Number: {debtor.phoneNumber}
            </p>

            <p className="text-md text-gray-800">
              ID Number/Passport No: {debtor.idNumber}
            </p>

            <p className="text-md text-gray-800">
              Reference Number: {debtor.refNumber}
            </p>

            <p className="text-md text-gray-800">
              Last Login: {debtor.lastLogin.toLocaleString()}
            </p>

            <p className="text-md text-gray-800">
              Account Created at: {debtor.createdAt.toLocaleString()}
            </p>
          </div>

          <span className={`px-4 py-2 text-xs rounded-full font-medium
            ${debtor.status === 'paid' && 'bg-green-100 text-green-600'}
            ${debtor.status === 'pending' && 'bg-yellow-100 text-yellow-600'}
            ${debtor.status === 'overdue' && 'bg-red-100 text-red-600'}
          `}>
            {debtor.status}
          </span>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400">Debt</p>
            <p className="text-base font-semibold text-gray-800">
              {new Intl.NumberFormat('en-ZA', {
                style: 'currency',
                currency: 'ZAR'
              }).format(debtor.balance)}
            </p>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-center'>
        <Link 
          to={`/agent/record/${id}`}
          className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 w-full">
          Record Payment
        </Link>

        <Link 
          to={`/agent/interaction/${id}`} 
          className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 w-full">
          Record Interaction
        </Link>
      </div>
    </div>
  )
}

export default EachDebtor