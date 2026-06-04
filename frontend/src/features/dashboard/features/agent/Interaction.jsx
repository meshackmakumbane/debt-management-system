import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import api from '../../../api/api'

const Record = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    amount: '',
    method:'',
    status: '',
    paidAt: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post(`/finance/record-payment/${id}`, form)

      alert('Payment added successfully')

      setForm({
        amount: '',
        method:'',
        status: '',
        paidAt: '',
      })

      navigate('/agent/transactions')

    } catch (err) {
      setError(err.response?.data?.message || 'Error creating payment')
    } finally {
      setLoading(false)
    }
  }

  if(error) return <p className='text-center text-red-500'>{error}</p>

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">

      <h2 className="text-lg font-semibold">Record a payment</h2>

      <input type='number' name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" required className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600" />

      <select name="method" value={form.method} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600">
        <option>SELECT PAYMENT METHOD</option>
        <option value="debit_order">DEBIT ORDER</option>
        <option value="eft">EFT</option>
        <option value="cash">CASH</option>
      </select>

      <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600">
        <option>SELECT PAYMENT STATUS</option>
        <option value="paid">PAID</option>
        <option value="pending">PENDING</option>
        <option value="overdue">OVERDUE</option>
      </select>

      <input type='date' name="paidAt" value={form.paidAt} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"/>

      <button disabled={loading} className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800">
        {loading ? 'Please wait...' : 'Record Payment'}
      </button>
    </form>
  )
}

export default Record
