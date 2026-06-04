import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import api from '../../../api/api'
import PageLoader from '../../../components/UI/PageLoader'

const EachDebtor = () => {
  const { id } = useParams()
  const [debtor, setDebtor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    const fetchDebtor = async () => {
      try{
        const response = await api.get(`/users/debtor/${id}`)
        setDebtor(response.data.debtor)
      }catch(err){
        setErrorMessage(err.response?.data?.message || "Failed to fetch debtor details")
      }finally{
      setLoading(false)
      }
    }
    fetchDebtor()
  }, [id])

  if (loading) return <PageLoader />

  if (!debtor) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Debtor not found
      </div>
    )
  }

  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all duration-200">
            {/* TOP SECTION */}
            <div className="flex items-start justify-between mb-6">

              {/* IDENTITY */}
              <div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {debtor.fullName}
                </h3>

                <p className="text-sm text-gray-500">
                  Debtor Profile Overview
                </p>

              </div>

              {/* STATUS */}
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  debtor.status === 'paid'
                    ? 'bg-green-50 text-green-700'
                    : debtor.status === 'pending'
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {debtor.status}
              </span>

            </div>

            {/* INFORMATION GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">

              <div className="space-y-2">

                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-gray-800">{debtor.email}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-gray-800">{debtor.phoneNumber || '-'}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Reference Number</p>
                  <p className="text-gray-800">{debtor.refNumber}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Assigned Agent</p>
                  <p className="text-gray-800">
                    {debtor.agentName || '-'}
                  </p>
                </div>

              </div>

              <div className="space-y-2">

                <div>
                  <p className="text-xs text-gray-400">ID / Passport</p>
                  <p className="text-gray-800">{debtor.idNumber}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Last Login</p>
                  <p className="text-gray-800">
                    {new Date(debtor.lastLogin).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Created</p>
                  <p className="text-gray-800">
                    {new Date(debtor.createdAt).toLocaleString()}
                  </p>
                </div>

              </div>

            </div>

            {/* FINANCIAL HIGHLIGHT */}
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">

              <div>
                <p className="text-xs text-gray-400">Outstanding Debt</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Intl.NumberFormat('en-ZA', {
                    style: 'currency',
                    currency: 'ZAR',
                  }).format(debtor.balance)}
                </p>
              </div>

            </div>

      </div>

            <div className='flex items-center justify-center gap-5 mt-4 px-5'>
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