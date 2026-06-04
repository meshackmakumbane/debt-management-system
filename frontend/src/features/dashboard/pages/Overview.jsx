import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

import AdminOverview from '../features/admin/AdminOverview'
import AgentOverview from '../features/agent/AgentOverview'
import DebtorOverview from '../features/debtor/DebtorOverview'

const Overview = () => {
  const { isAuthenticated, role, loading } = useSelector(state => state.auth)

  if (!isAuthenticated) {
     return <Navigate to="/start" replace />
  }

  if (role === "agent") return <AgentOverview />
  if (role === "debtor") return <DebtorOverview />

  return <AdminOverview />
}

export default Overview