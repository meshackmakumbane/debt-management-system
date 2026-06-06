import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { logoutUser } from '../../../auth/authSlice'

import {
  FaTachometerAlt,
  FaMoneyBillWave,
  FaUser,
  FaReceipt,
  FaHeadset,
  FaUsers,
  FaFileInvoiceDollar,
  FaClipboardList,
  FaChartBar,
  FaExchangeAlt
} from 'react-icons/fa'


const Mobile = ({ mobileOpen, setMobileOpen }) => {
  const dispatch = useDispatch()
  const location = useLocation()

  const { user, isAuthenticated } = useSelector(
    state => state.auth
  )

  const handleLogout = () => {
    dispatch(logoutUser())
    setMobileOpen(false)
  }

  const mobileLinks = {
  debtor: [
    {
      id: 1,
      link: '/account',
      title: 'Overview',
      color: 'bg-blue-200',
      icon: FaTachometerAlt
    },
    {
      id: 2,
      link: '/account/payments',
      title: 'Make Payment',
      color: 'bg-green-200',
      icon: FaMoneyBillWave
    },
    {
      id: 3,
      link: '/account/profile',
      title: 'Profile',
      color: 'bg-pink-200',
      icon: FaUser
    },
    {
      id: 4,
      link: '/account/transactions',
      title: 'Transactions',
      color: 'bg-yellow-200',
      icon: FaReceipt
    },
    {
      id: 5,
      link: '/account/support',
      title: 'Contact Support',
      color: 'bg-purple-200',
      icon: FaHeadset
    }
  ],

  admin: [
    {
      id: 1,
      link: '/account',
      title: 'Dashboard',
      color: 'bg-blue-200',
      icon: FaTachometerAlt
    },
    {
      id: 2,
      link: '/account/agents',
      title: 'Agents',
      color: 'bg-green-200',
      icon: FaUsers
    },
    {
      id: 3,
      link: '/account/debtors',
      title: 'Debtors',
      color: 'bg-pink-200',
      icon: FaUser
    },
    {
      id: 4,
      link: '/account/debts',
      title: 'Debts',
      color: 'bg-yellow-200',
      icon: FaFileInvoiceDollar
    },
    {
      id: 5,
      link: '/account/activities',
      title: 'Activity Feed',
      color: 'bg-stone-200',
      icon: FaClipboardList
    },
    {
      id: 6,
      link: '/account/analytics',
      title: 'Reports',
      color: 'bg-indigo-200',
      icon: FaChartBar
    }
  ],

  agent: [
    {
      id: 1,
      link: '/account',
      title: 'Dashboard',
      color: 'bg-blue-200',
      icon: FaTachometerAlt
    },
    {
      id: 2,
      link: '/account/debtors',
      title: 'Debtors',
      color: 'bg-amber-200',
      icon: FaUsers
    },
    {
      id: 3,
      link: '/account/debts',
      title: 'Debts',
      color: 'bg-green-200',
      icon: FaFileInvoiceDollar
    },
    {
      id: 4,
      link: '/account/transactions',
      title: 'Transactions',
      color: 'bg-gray-300',
      icon: FaExchangeAlt
    },
    {
      id: 5,
      link: '/account/analytics',
      title: 'Reports',
      color: 'bg-purple-200',
      icon: FaChartBar
    },
    {
      id: 6,
      link: '/account/support',
      title: 'Support',
      color: 'bg-gray-200',
      icon: FaHeadset
    }
  ]
  }

  const links = mobileLinks[user?.role] || []

  if (!isAuthenticated) return null
   
  return (
    <div className={`
        absolute top-17 z-100
        h-[32rem] max-h-[32rem] w-[24rem] lg:w-[28rem]
        max-sm:right-0
        overflow-hidden rounded-2xl
        border border-gray-200 bg-white`}
    >

<nav className="p-4 space-y-2 text-sm">
  {links.map(item => {
    const Icon = item.icon

    return (
      <Link
        key={item.id}
        to={item.link}
        onClick={() => setMobileOpen(!mobileOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-gray-100 bg-gray-50 my-2"
      >
        <span className={`${item.color} p-2 rounded-full -ml-2`}>
          <Icon className="text-gray-700 text-sm" />
        </span>

        <span className="text-[15px] font-medium">
          {item.title}
        </span>
      </Link>
    )
  })}
</nav>

<div className="p-4 border-t border-gray-200">
  <button
    onClick={handleLogout}
    className="text-white flex gap-3 w-full text-left px-4 py-2 rounded-full hover:bg-red-900 text-sm cursor-pointer text-[15px] font-medium bg-red-500"
  >
    <svg width="20px" height="20px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none">
      <path d="M12 12H19M19 12L16 15M19 12L16 9" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path>
      <path d="M19 6V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V18" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>

    Logout
  </button>
</div> 
      
    </div>
  )
}

export default Mobile

