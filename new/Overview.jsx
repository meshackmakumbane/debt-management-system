import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

import AdminOverview from './Admin/Overview'
import AgentOverview from './agent/Overview'
import DebtorOverview from './debtor/Overview'

const Overview = () => {
  const { isAuthenticated, role } = useSelector(state => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/get-started" replace />
  }

  if (role === "admin") return <AdminOverview />
  if (role === "agent") return <AgentOverview />
  if (role === "debtor") return <DebtorOverview />

  return <Navigate to="/get-started" replace />
}

export default Overview