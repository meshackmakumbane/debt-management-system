import React from 'react'
import { useSelector } from 'react-redux';

import AdminAnalytics from '../features/admin/AdminAnalytics'
import AgentAnalytics from '../features/agent/AgentAnalytics'

const Analytics = () => {
  const { user, loading, error, role } = useSelector((state) => state.auth)

  if(role === "agent") return <AgentAnalytics />
  return <AdminAnalytics />

}

export default Analytics
