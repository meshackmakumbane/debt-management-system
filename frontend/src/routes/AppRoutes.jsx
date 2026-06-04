import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

/* PAGES(STATIC) ------------------ */
import HomePage from '../pages/HomePage'
import NotFound from '../pages/NotFound'
import Features from '../pages/Features'
import GetStarted from '../pages/GetStarted'

/* ONBOARDING (NEW ADMIN + COMPANY) ------------------ */
import Onboarding from '../pages/Onboarding'
import CreateAccount from '../pages/CreateAccount'
import VerifyEmail from '../pages/VerifyEmail'

/* AUTH ------------------ */
import Login from '../features/auth/Login'

/* MIDDLEWARE ------------------ */
import ProtectedRoute from '../middleware/ProtectedRoute'


/* DASHBOARD ------------------ */
import DashboardLayout from '../features/dashboard/layout/DashboardLayout'

/* DASHBOARD (SHARED ROUTES) ------------------ */
import Overview from '../features/dashboard/pages/Overview'
import Profile from '../features/dashboard/pages/Profile'
import Transactions from '../features/dashboard/pages/Transactions'
import Debts from '../features/dashboard/pages/Debts'


/* DASHBOARD (ADMIN ROUTES) ------------------ */
import Agents from '../features/dashboard/features/admin/Agents'
import AddAgent from '../features/dashboard/features/admin/AddAgent'
import EachAgent from '../features/dashboard/features/admin/EachAgent'

import Debtors from '../features/dashboard/pages/Debtors'

import AddDebtor from '../features/dashboard/features/admin/AddDebtors'
import EachDebtor from '../features/dashboard/features/admin/EachDebtor'

import ActivityFeed from '../features/dashboard/features/admin/Feed'
import Activity from '../features/dashboard/features/admin/Ticket'
import Analytics from '../features/dashboard/features/admin/AdminAnalytics'


/* DASHBOARD (AGENT ROUTES) ------------------ */
import Support from '../features/dashboard/features/agent/Support'


const AppRoutes = () => {
  return (
    <Routes>
      {/* Pages links */}
      <Route index element={ <HomePage /> } />
      <Route path='/features' element={ <Features /> } />
      <Route path='/start' element={ <GetStarted /> } />

      <Route path='/onboarding' element={ <Onboarding /> } />
      <Route path='/create-account' element={ <CreateAccount /> } />
      <Route path='/verify' element={ <VerifyEmail /> } />

      {/* Catch all undefined url */}
      <Route path='*' element={ <NotFound /> } />

      {/* Login Route */}
      <Route path='/auth/admin' element={ <Login /> } />
      <Route path='/auth/agent' element={ <Login /> } />
      <Route path='/auth/debtor' element={ <Login/> } />

      {/* Dashboard Routes */}
      <Route path='/account' element={ 
        ProtectedRoute({ children: <DashboardLayout />, allowedRoles: ['admin', 'debtor', 'agent'] })
      }
      >
        <Route index element={ <Overview /> } />

        {/* DASHBOARD (ADMIN ROUTES) ------------------ */}
        <Route path='agents' element={ <Agents /> } />
        <Route path='agents/add' element={ <AddAgent /> } />
        <Route path='agents/:id' element={ <EachAgent /> } />

        <Route path='debtors' element={ <Debtors /> } />
        <Route path='debtors/add' element={ <AddDebtor /> } />
        <Route path='debtors/:id' element={ <EachDebtor /> } />

        <Route path='activities' element={ <ActivityFeed /> } />
        <Route path='ticket/:id' element={ <Activity /> } />

        <Route path='debts' element={ <Debts /> } />
        <Route path='analytics' element={ <Analytics /> } />
        <Route path='profile' element={ <Profile/> } />
        <Route path='transactions' element={ <Transactions /> } />

        
        <Route path='support' element={ <Support /> } />
      </Route>
    </Routes>
  )
}

export default AppRoutes
