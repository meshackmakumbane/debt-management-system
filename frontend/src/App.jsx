import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom';

import HomePage from './features/home/HomePage'
import GetStarted from './layouts/GetStarted'
import Features from './layouts/Features'

// Auth pages
import AdminLogin from './features/auth/pages/AdminLogin'
import AgentLogin from './features/auth/pages/AgentLogin'
import DebtorLogin from './features/auth/pages/DebtorLogin'

// Admin Dashboard
import AdminDashboard from './features/dashboard/admin/AdminDashboard'
import AdminOverview from './features/dashboard/Admin/Overview'
import AdminDebtors from './features/dashboard/Admin/Debtors'
import AdminAgents from './features/dashboard/Admin/Agents'
import AdminEachDebtor from './features/dashboard/Admin/EachDebtor'
import AdminEachAgent from './features/dashboard/Admin/EachAgent'
import AdminPayments from './features/dashboard/Admin/Installments'
import AdminReports from './features/dashboard/Admin/Reports'
import AdminSettings from './features/dashboard/Admin/Settings'
import AdminAddDebtor from './features/dashboard/Admin/AddDebtors'
import AdminAddAgent from './features/dashboard/Admin/AddAgent'
import AdminDebts from './features/dashboard/Admin/Debts'
import AdminFeed from './features/dashboard/Admin/Feed'
import AdminTicket from './features/dashboard/Admin/Ticket'

//Debtor Dashboard
import DebtorDashboard from './features/dashboard/debtor/DebtorDashboard'
import DebtorOverview from './features/dashboard/debtor/Overview'
import DebtorPayment from './features/dashboard/debtor/MakePayment'
import DebtorProfile from './features/dashboard/debtor/Profile'
import DebtorTransactions from './features/dashboard/debtor/Transactions'
import DebtorSupport from './features/dashboard/debtor/Support'
import DebtorSettings from './features/dashboard/debtor/Settings'

//Agent Dashboard
import AgentDashboard from './features/dashboard/agent/AgentDashboard'
import AgentOverview from './features/dashboard/agent/Overview'
import AgentDebtors from './features/dashboard/agent/Debtors'
import AgentReports from './features/dashboard/agent/Reports'
import AgentTransactions from './features/dashboard/agent/Transactions'
import AgentSupport from './features/dashboard/agent/Support'
import AgentRecord from './features/dashboard/agent/Record'
import AgentInteractions from './features/dashboard/agent/Interaction'


//Reusable Cards
import Debts from './features/dashboard/Components/Debts'

//Pages
import NotFound from './NotFound'
import ProtectedRoute from './middleware/ProtectedRoute'
import Mobile from './features/dashboard/Admin/components/Mobile'

const App = () => {
  const { user, status, error, isAuthenticated, role } = useSelector(state=> state.auth)
  const ProtectedRoute = ({ children, allowedRoles = [] }) => {

    if(!isAuthenticated && !allowedRoles.includes(role)){
      return <Navigate to="/login/admin"  replace />
    } 
    return children
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/features" element={<Features />} />

      {/* Auth Routes */}
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route path="/login/agent" element={<AgentLogin />} />
      <Route path="/login/debtor" element={<DebtorLogin />} />

      {/* Admin Routes */}
      <Route path="/admin" element={
        //  ProtectedRoute({ children: <AdminDashboard />, allowedRoles: ['admin'] })
        <AdminDashboard />
      } >
         <Route index element={<AdminOverview />} />

         <Route path="debtors" element={<AdminDebtors />} />
         <Route path="debtors/:id" element={<AdminEachDebtor />} />
         <Route path="debtors/add" element={<AdminAddDebtor />} />

         <Route path="agents" element={<AdminAgents />} />
         <Route path="agents/:id" element={<AdminEachAgent />} />
         <Route path="agents/add" element={<AdminAddAgent />} />

         <Route path="debts" element={<Debts />} />
         <Route path="payments" element={<AdminPayments />} />
         <Route path="reports" element={<AdminReports />} />
         <Route path="settings" element={<AdminSettings />} />
         <Route path="feed" element={<AdminFeed />} />
         <Route path="feed/:id" element={<AdminTicket />} />
      </Route>

      {/* Debtor Routes */}
      <Route path="/debtor" element={
        <DebtorDashboard />
      }>
        <Route index element={<DebtorOverview />}/>
        <Route path='payments' element={<DebtorPayment />}/>
        <Route path='profile' element={<DebtorProfile />}/>
        <Route path='transactions' element={<DebtorTransactions />}/>
        <Route path='support' element={<DebtorSupport />}/>
        <Route path='settings' element={<DebtorSettings />}/>
      </Route>

      {/* Agent Routes */}
      <Route path='/agent' element={<AgentDashboard />} >
        <Route index element={<AgentOverview />}/>
        <Route path='debtors' element={<AgentDebtors />}/>
        <Route path='reports' element={<AgentReports />}/>
        <Route path='transactions' element={<AgentTransactions />}/>
        <Route path='support' element={<AgentSupport />}/>
        <Route path='record/:id' element={<AgentRecord />}/>
        <Route path='interaction/:id' element={<AgentInteractions />}/>
        <Route path="debts" element={<Debts />} />
      </Route>

      <Route path="*" element={<NotFound />} />
      <Route path="/mobile" element={<Mobile />} />
    </Routes>
  )
}

export default App

