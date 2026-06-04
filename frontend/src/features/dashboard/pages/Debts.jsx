import React from 'react'
import { useSelector } from 'react-redux'

import AdminDebts from '../features/admin/AdminDebts'
import AgentDebts from '../features/agent/AgentDebts'

const Debts = () => {
  const { role, loading } = useSelector(state=> state.auth)

  if(role === 'admin') return <AdminDebts /> 

  return <AgentDebts /> 

}

export default Debts
