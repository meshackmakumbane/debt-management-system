import React from 'react'
import { useLocation } from 'react-router-dom'

/*  LOGIN ------------------------------------------------------ */

import AdminLogin from './pages/AdminLogin'
import AgentLogin from './pages/AgentLogin'
import DebtorLogin from './pages/DebtorLogin'

const Login = () => {
  const { pathname } = useLocation()

  if (pathname === '/auth/admin') return <AdminLogin />
  if (pathname === '/auth/agent') return <AgentLogin />
  if (pathname === '/auth/debtor') return <DebtorLogin />

}

export default Login