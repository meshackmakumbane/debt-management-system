import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../api/api'

const AddAgent = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: ''
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/users/add-agent', form)

      alert('Agent created')
      setForm({
        fullName: '',
        email: '',
        phoneNumber: ''
      })

      navigate('/admin/agents')

    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Error creating agent')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
  onSubmit={handleSubmit}
  className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6"
>

  {/* HEADER */}
  <div>
    <h2 className="text-xl font-semibold text-gray-900">
      Add Agent
    </h2>
    <p className="text-sm text-gray-500">
      Create a new field agent with system access permissions
    </p>
  </div>

  {/* INPUT GRID */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    <input
      name="fullName"
      value={form.fullName}
      onChange={handleChange}
      placeholder="Full Name *"
      required
      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
    />

    <input
      name="email"
      value={form.email}
      onChange={handleChange}
      placeholder="Email *"
      required
      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
    />

    <input
      name="phoneNumber"
      value={form.phoneNumber}
      onChange={handleChange}
      placeholder="Phone Number *"
      required
      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600 md:col-span-2"
    />

  </div>

  {/* INFO NOTE */}
  <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs text-gray-500">
    Agents will receive access credentials after creation and can be assigned debtors by admins.
  </div>

  {/* ACTIONS */}
  <div className="flex items-center justify-between pt-2">

    <p className="text-xs text-gray-400">
      * Required fields must be completed
    </p>

    <button
      disabled={loading}
      className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800 transition disabled:opacity-50 cursor-pointer"
    >
      {loading ? 'Creating...' : 'Create Agent'}
    </button>

  </div>

</form>
  )
}

export default AddAgent