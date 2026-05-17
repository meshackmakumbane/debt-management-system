import React, { useState, useEffect } from 'react'
import Logo from '../../../assets/Debtlogo.png'
import Notifications from './Notifications'
import Mobile from './Mobile'
import { useSelector, useDispatch } from 'react-redux'
import { getProfile } from '../../auth/services/authSlice'

import api from '../../../api/api'

const Header = () => {
  //Notifications
  const [ notifications, setNotifications ] = useState({})  
  const [ errorMessage, setErrorMessage ] = useState(null)
  const [ reloading, setReloading ] = useState(false)
  //Auth
  const dispatch = useDispatch()
  const { user, loading, error, isAuthenticated, role } = useSelector(state=> state.auth)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : "G"

  useEffect(()=>{
    dispatch(getProfile())
  },[dispatch])
  
  //Notifications
  useEffect(()=>{
    const fetchNotifications = async () =>{
      setReloading(true)
      try{
        const { data } = await api.get('/users/notifications')
          setNotifications(data?.notifications)
      }catch(error){
        setErrorMessage(error.response?.data?.message || 'Error fetching notifications')
      }finally{
        setReloading(false)
      }
    }
    fetchNotifications()
  },[])


  return (
    <header className='flex items-center justify-between h-17 bg-white px-4 md:px-8 border-b border-gray-200 fixed right-0 left-0 z-50 backdrop-blur-sm bg-white/90'>
      {/* Mobile menu */}
      <span className='sm:hidden cursor-pointer z-10' onClick={()=> setMobileOpen(!mobileOpen)}>
      {mobileOpen
        ?  <svg width="20px" height="20px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
              <path d="M6 6L18 18" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 18L18 6" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

          : <svg width="20px" height="20px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M3 5H21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3 12H21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3 19H21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        } 
      </span>

      {/* Logo (mobile only) */}
      <div className=" flex items-center -ml-20 md:-ml-10">
        <img 
        src={Logo} 
        alt="Logo" 
        className="h-17 object-contain"
        />
      </div>

      <Mobile mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>

      {/* CENTER - SEARCH */}
      <div className="hidden lg:flex flex-1 max-w-xl mx-6 flex items-center border pl-4 gap-2 bg-white border-gray-500/30 h-[46px] rounded-full overflow-hidden max-w-md w-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="#6B7280">
          <path d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8"/>
          </svg>
          <input type="text" placeholder="Search for transactions and more" className="w-full h-full outline-none placeholder-gray-500 text-gray-500 bg-transparent text-sm" />
          <button type="submit" className="bg-green-900 w-32 h-9 rounded-full text-sm text-white mr-1">Search</button>
      </div>

      {/* RIGHT */}
      <div className='flex items-center gap-5 md:gap-6'>

        {/* Notifications */}
      <button 
        onClick={()=>setIsOpen(!isOpen)}
        className='bg-gray-100 relative p-2 rounded-full hover:bg-gray-300 transition cursor-pointer'>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 8.4C18 6.7 17.3 5.1 16.2 3.9C15.1 2.7 13.6 2 12 2C10.4 2 8.9 2.7 7.8 3.9C6.7 5.1 6 6.7 6 8.4C6 15.9 3 18 3 18H21C21 18 18 15.9 18 8.4Z"/>
        <path d="M10.3 21C10.5 21.3 10.7 21.6 11 21.7C11.3 21.9 11.6 22 12 22C12.4 22 12.7 21.9 13 21.7C13.3 21.6 13.5 21.3 13.7 21"/>
        </svg>
        {/* Notification badge */}
        <span className='absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-semibold'>
        {notifications.length || 0}
        </span>
      </button>

      
      <div className="hidden md:block h-6 w-px bg-gray-200" />
        {/* User */}
          <div className='flex items-center gap-3 cursor-pointer group'>
            
            <div className='h-9 w-9 flex items-center justify-center rounded-full bg-gradient-to-br from-green-800 to-green-600 text-white font-semibold text-sm shadow-sm'>
            {loading ? null : user?.fullName?.charAt(0).toUpperCase() || "U"}
            </div>

            {/* Name (desktop only) */}
            <div className="hidden md:flex flex-col leading-tight">
            <span className="text-sm font-bold text-gray-800">
                {user?.fullName.toUpperCase() || "USER"}
            </span>
            <span className="text-xs text-gray-500">
                {role ? role.toUpperCase() : "ACCOUNT"}
            </span>
            </div>

          </div>
      </div>
      <Notifications 
        notifications={notifications} 
        isOpen={isOpen} 
      />
    </header>
  )
}

export default Header
