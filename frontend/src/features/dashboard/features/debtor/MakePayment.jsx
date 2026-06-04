import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchDebts } from '../../service/debtSlice'
import api from '../../../api/api'

const MakePayment = () => {
  const dispatch = useDispatch()
  const { debts, status, errorMessage} = useSelector(state=>state.debt)
  const { user } = useSelector(state=>state.auth)

  const debt = debts.map(item => item.id )

  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  const totalDebt = debts?.reduce((sum, debt)=>{
    return sum + debt.amount
  },0)

  const handlePayment = async () => {
    setError(null)
    setSuccess(null)

    if (!amount || Number(amount) <= 0) {
      setError('Enter a valid amount')
      return
    }

    if (Number(amount) > debt.balance) {
      setError('Amount cannot exceed remaining debt')
      return
    }

    try {
      setLoading(true)

      const res = await api.post('/api/payments/make',
        {
          amount: Number(amount),
          debtId: debt._id
        }
      )

      setSuccess(res.data.message)
      setAmount('')

    } catch (err) {
      setError(
        err?.response?.data?.message || 'Payment failed'
      )
    } finally {
      setLoading(false)
    }
  }
  useEffect(()=>{
    dispatch(fetchDebts())
  },[])



  return (
    <div className="max-w-2xl mx-auto p-6">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Make Payment
        </h1>
        <p className="text-gray-500 text-sm">
          Settle your outstanding debt securely
        </p>
      </div>

      {/* Debt Card */}
      <div className="border rounded-xl p-4 mb-6 bg-gray-50">
        <p className="text-sm text-gray-500">Debt ID</p>
        <p className="font-medium">{debt?._id}</p>

        <div className="grid grid-cols-2 mt-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">
              Remaining
            </p>
            <p className="font-bold text-red-600">
              R {debt?.balance}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Status
            </p>
            <p className="font-bold">
              {debt?.status}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="border rounded-xl p-4">
        <label className="text-sm font-medium">
          Enter Payment Amount
        </label>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 500"
          className="w-full border p-3 rounded mt-2"
        />

        {/* Buttons */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full mt-4 bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>

        {/* Messages */}
        {error && (
          <p className="text-red-500 mt-3 text-sm">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-600 mt-3 text-sm">
            {success}
          </p>
        )}
      </div>
    </div>
  )
}

export default MakePayment
