import React from 'react'
import { useSelector } from 'react-redux'

import AdminDebtors from '../features/admin/Debtors'
import AgentDebtors from '../features/agent/AgentDebtors'

const Debtors = () => {
  const { isAuthenticated, role } = useSelector(state => state.auth)

  if(isAuthenticated && role ===  "admin") return <AdminDebtors />
  if(isAuthenticated && role ===  "agent") return <AgentDebtors />

}

export default Debtors
