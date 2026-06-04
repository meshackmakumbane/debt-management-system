import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../../api/api'

const Interaction = () => {
  const { id } = useParams()
  const [debtor, setDebtor] = useState(null)
  const [form, setForm] = useState({
    method:'',
    date: '',
    outcome: '',
    notes:''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e)=>{
    setForm({...form, [e.target.name]: e.target.value})
    console.log(form)
  }

  const handleSubmit = async (e) => {
      e.preventDefault()
      setLoading(true)
  
      try {
        await api.post(`/users/interaction/${id}`, form)
  
        alert('Interaction added successfully')
  
        setForm({ 
          method:'',
          date: '',
          outcome: '',
          notes:''
        })
  
        navigate(`/agent/debtors/${id}`)
  
      } catch (err) {
        setError(err.response?.data?.message || 'Error creating interaction')
      } finally {
        setLoading(false)
      }
    }
  
    if(error) return <p className='text-center text-red-500'>{error}</p>

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">

      <h2 className="text-lg font-semibold">Contant Attempt</h2>

      <select name="method" value={form.method} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600">
        <option>COMMUNICATION METHOD</option>
        <option value="phone_call">PHONE CALL</option>
        <option value="sms">SMS</option>
        <option value="Email">EMAIL</option>
      </select>

      <input type='date' name="date" value={form.date} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"/>

      <select name="outcome" value={form.outcome} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600">
        <option>OUTCOME</option>
        <option value="No Answer">NO ANSWER</option>
        <option value="Should call later">I SHOULD CALL BACK LATER</option>
        <option value="Spoke">SPOKE</option>
        <option value="Wrong Number">WRONG NUMBER</option>
      </select>

      <textarea 
        name="notes" 
        value={form.notes} 
        onChange={handleChange} 
        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
      >
      </textarea>

      <button disabled={loading} className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800">
        {loading ? 'Please wait...' : 'Record Interaction'}
      </button>
    </form>
  )
}

export default Interaction
