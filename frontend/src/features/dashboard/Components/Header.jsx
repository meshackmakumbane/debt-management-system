import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import Logo from '../../../assets/Debtlogo.png'
import api from '../../../api/axios'
import Notifications from './cards/Notification'
import Message from './cards/Message'
import Mobile from './cards/Mobile'

import { useSelector, useDispatch } from 'react-redux'
import { getProfile } from '../../auth/authSlice'

const Header = () => {
  const dispatch = useDispatch()

  /* AUTH --------------------------------------------------- */

  const { user, loading, isAuthenticated, role, } = useSelector((state) => state.auth)

  /* UI ----------------------------------------------------- */

  const [mobileOpen, setMobileOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [messageOpen, setMessageOpen] = useState(false)

  /* NOTIFICATION ------------------------------------------- */

  const [notifications, setNotifications] = useState([])
  const [notificationLoading, setNotificationLoading] = useState(false)

  const [errorMessage, setErrorMessage] = useState(null)
  const [reloading, setReloading] = useState(false)

  /* MESSAGE ------------------------------------------------ */

  const [messages, setMessages] = useState([])
  const [error, setError] = useState('')

  /* PROFILE ------------------------------------------------ */

  useEffect(() => {
    if (!user && isAuthenticated) {
      dispatch(getProfile()) 
    }
  }, [dispatch, user, isAuthenticated])

  /* FETCH NOTIFICATION ------------------------------------- */

  useEffect(() => {
    if (!isAuthenticated) return
    const fetchNotifications = async () => {
      try {
        setReloading(true)

        const { data } = await api.get('/notification/notifications')

        setNotifications(data?.notifications || [])
      } catch (error) {
        setNotifications([])

        setErrorMessage(
          error?.response?.data?.message ||
          'Error fetching notifications'
        )
      } finally {
        setReloading(false)
      }
    }
    fetchNotifications()
  }, [isAuthenticated])

  /* FETCH MESSAGES ------------------------------------- */  

  useEffect(() => {
      if (!isAuthenticated) return
  
      const fetchMessages = async () => {
        try {
          setReloading(true)
  
          const { data } = await api.get('/users/messages')
          setMessages(data?.messages || [])
        } catch (error) {
          setMessages([])
  
          setError(
            error?.response?.data?.message ||
            'Error fetching message'
          )
        } finally {
          setReloading(false)
        }
      }
  
      fetchMessages()
  }, [isAuthenticated])

  const displayName = user?.name?.split(" ")[0].toUpperCase() || "USER"
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U'
  const canSearch = role !== 'debtor'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[68px] bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 md:px-8 flex items-center justify-between">
    
          {/* LEFT */}
          <div className="flex items-center gap-3">
    
            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden cursor-pointer z-50"
            >
              {mobileOpen ? (
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    d="M6 6L18 18M6 18L18 6"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    d="M3 5H21M3 12H21M3 19H21"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
    
            {/* Logo */}
            <img
              src={Logo}
              alt="Debt Hero"
              className="h-20 object-contain md:mt-3 max-sm:-ml-10 overflow-hidden"
            />
          </div>       

          <div className="flex flex-col max-sm:hidden">
            <h1 className="text-sm md:text-[15px] font-medium text-black leading-tight">
              Welcome back, {displayName}
            </h1>

            <p className="text-sm text-gray-500 mt-0.5">
              Here's what's happening today.
            </p>
          </div>
    
          {/* CENTER SEARCH */}
          <div className="hidden lg:flex items-center flex-1 max-w-[700px] mx-6 border border-gray-300 rounded-full h-[46px] overflow-hidden pl-4">
  
            <svg width="24px" height="25px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M17 17L21 21" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
  
            <input
              type="text"
              placeholder={role === 'debtor' ? "Search" : "Search for transactions and more"}
              className="w-full h-full px-3 outline-none text-sm"
            />
  
            <button
              className="bg-gradient-to-br from-green-800 to-green-600 text-white rounded-full px-5 h-9 mr-1"
            >
              Search
            </button>
          </div>
    
          {/* RIGHT */}
          <div className="flex items-center gap-4 md:gap-6">
    
            {/* Notifications */}
            {isAuthenticated && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
              >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="h-5 w-5 text-black"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0018 9.75v-.7V9A6 6 0 006 9v.05-.001v.7a8.967 8.967 0 00-2.312 6.022c1.733.64 3.56 1.08 5.454 1.31m5.715 0a24.255 24.255 0 01-5.715 0m5.715 0a3 3 0 11-5.715 0"
                    />
                  </svg>
    
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                  {reloading ? '…' : notifications.length}
                </span>
              </button>
            )}
    
            <div className="hidden md:block h-6 w-px bg-gray-200" />
    
            {/* USER */}
            <div className="flex items-center gap-3">
    
              <Link to='/account/profile' className="cursor-pointer h-9 w-9 rounded-full bg-gradient-to-br from-green-800 to-green-600 text-white flex items-center justify-center font-semibold">
                {loading ? '...' : initial}
              </Link>
    
              <div className="hidden md:flex flex-col leading-tight">
    
                <span className="cursor-pointer text-sm font-bold text-gray-800">
                  {displayName}
                </span>
    
                <span className="text-xs text-gray-500">
                  {role?.toUpperCase() || 'ACCOUNT'}
                </span>
    
              </div>
    
            </div>
    
          </div>
    
          <Notifications
            notifications={notifications}
            isOpen={isOpen}
            error={errorMessage}
          />
    
          <Message 
            messages={messages} 
            error={error}
            messageOpen={messageOpen}
          />

          {mobileOpen && (
            <Mobile
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
            />
          )}
    
    </header>
  )
}

export default Header
