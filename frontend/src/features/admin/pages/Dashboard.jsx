import React, { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

import { logoutUser } from '../../shared/auth/authSlice'
import { useSelector, useDispatch } from 'react-redux'

import Header from '../Components/Header'
import PageLoader from '../../../components/UI/PageLoader'
import Mobile from './components/Mobile'
import Sidebar from '../../shared/sidebar/Sidebar'

const AdminDashboard = () => {
  const { user, loading, error, isAuthenticated, role }  = useSelector(state=> state.auth)
  const dispatch = useDispatch()

  useEffect(()=>{
    if(!isAuthenticated){
      dispatch(logoutUser())
    }
  },[isAuthenticated, dispatch])

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <div>
      <Header />
      <section className='pt-17 '>
        <Sidebar />
        <main className="min-h-screen ml-0 md:ml-65 p-4 max-sm:w-full">
          <Outlet />
        </main>
      </section>
    </div>
  )
}

export default AdminDashboard