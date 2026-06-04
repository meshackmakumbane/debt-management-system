import React, { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

import { logoutUser } from '../../auth/authSlice'
import { useSelector, useDispatch } from 'react-redux'

import Header from '../Components/Header'
import PageLoader from '../../../components/UI/PageLoader'
import Sidebar from '../components/Sidebar'


const DashboardLayout = () => {
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
      <Header 
        loading={loading} 
        isAuthenticated={isAuthenticated} 
        role={role}
        error={error}
      />
      <section className='pt-17 '>
        <Sidebar handleLogout={handleLogout} />
        <main className="min-h-screen ml-0 md:ml-65 p-4 max-sm:w-full">
          <Outlet />
        </main>
      </section>
    </div>
  )
}

export default DashboardLayout
