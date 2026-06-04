import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../../api/axios'

const AddDebtor = () => {
  const navigate = useNavigate()
  const [agents, setAgents] = useState([]) // This should be populated with agents from the backend
  const [form, setForm] = useState({
    name: '',
    email:'',
    phone: '',
    idNumber: '',
    primaryLender: '',
    amount: '',
    notes: '',
    agentId: '',
    status: ''
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!form.name || !form.email || !form.phone || !form.idNumber || !form.amount || !form.primaryLender || !form.agentId){
          return alert("All fields are required")
        }

    setLoading(true)

    try {
      await api.post('/user/debtors', form)

      alert('Debtor created')

      setForm({
        name: '',
        email:'',
        phone: '',
        idNumber: '',
        amount:'',
        notes: '',
        agentId: '',
        status: ''
      })

      navigate('/account/debtors')

    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Error creating debtor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Fetch agents from backend to populate the dropdown
    const fetchAgents = async () => {
      try {
        const { data } = await api.get('/user/agents')
        setAgents(data.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchAgents()
  }, [])


  console.log(agents)
  return (
    <form
  onSubmit={handleSubmit}
  className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6"
>

  {/* HEADER */}
  <div>
    <h2 className="text-xl font-semibold text-gray-900">
      Add Debtor
    </h2>
    <p className="text-sm text-gray-500">
      Create a new debtor profile with initial financial details
    </p>
  </div>

  {/* GRID INPUTS */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    <input
      name="name"
      value={form.name}
      onChange={handleChange}
      placeholder="Full Name *"
      required
      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
    />

    <input
      name="phone"
      value={form.phone}
      required
      onChange={handleChange}
      placeholder="Phone Number *"
      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
    />

    <input
      name="email"
      value={form.email}
      required
      onChange={handleChange}
      placeholder="Email *"
      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
    />

    <input
      name="idNumber"
      value={form.idNumber}
      onChange={handleChange}
      placeholder="ID Number *"
      required
      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
    />

    <input
      name="amount"
      required
      value={form.amount}
      onChange={handleChange}
      placeholder="Initial Balance *"
      type="number"
      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
    />

    <input
      name="primaryLender"
      value={form.primaryLender}
      required
      onChange={handleChange}
      placeholder="Primary Lender *"
      type="text"
      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
    />

    <select
      name="agentId"
      value={form.agentId}
      onChange={handleChange}
      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
    >
      <option value="">Assign to Agent</option>
        {/* This will be populated with agents from the backend */}
        {agents.length > 0 && agents.map(agent => (
          <option key={agent._id} value={agent._id}>
            {agent.name}
          </option>
        ))}
    </select>

    <select
      name="status"
      value={form.status}
      onChange={handleChange}
      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
    >
      <option value="">STATUS</option>
        <option value='pending'>PENDING</option>
        <option value='overdue'>OVERDUE</option>
        <option value='paid'>PAID</option>
        <option value='arrangement'>ARRANGEMENT</option>
    </select>


  </div>

  {/* FULL WIDTH FIELD */}
  <div>
    <textarea
      name="notes"
      value={form.notes}
      onChange={handleChange}
      placeholder="Notes (optional)"
      rows={4}
      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
    />
  </div>

  {/* ACTION SECTION */}
  <div className="flex items-center justify-between pt-2">

    <p className="text-xs text-gray-400">
      Fields marked * are required
    </p>

    <button
      disabled={loading}
      className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800 transition disabled:opacity-50 cursor-pointer"
    >
      {loading ? 'Creating...' : 'Create Debtor'}
    </button>

  </div>

</form>
  )
}

export default AddDebtor