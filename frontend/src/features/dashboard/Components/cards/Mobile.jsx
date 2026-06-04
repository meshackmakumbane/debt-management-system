import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { logoutUser } from '../../auth/services/authSlice'

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
        svg: `<svg width="20px" height="20px" stroke-width="1.5" viewBox="0 0 24 24" fill="none"><path d="M8 6L20 6" stroke="#000"/><path d="M4 6.01L4.01 5.99889" stroke="#000"/><path d="M4 12.01L4.01 11.9989" stroke="#000"/><path d="M4 18.01L4.01 17.9989" stroke="#000"/><path d="M8 12L20 12" stroke="#000"/><path d="M8 18L20 18" stroke="#000"/></svg>`
      },
      {
        id: 2,
        link: '/account/payments',
        title: 'Make Payment',
        color: 'bg-green-200',
        svg: `<svg width="20px" height="20px" stroke-width="1.5" viewBox="0 0 24 24" fill="none"><path d="M8 12H12M16 12H12M12 12V8M12 12V16" stroke="#000"></path><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#000"></path></svg>`
      },
      {
        id: 3,
        link: '/account/profile',
        title: 'Profile',
        color: 'bg-pink-200',
        svg: `<svg width="20px" height="20px" viewBox="0 0 24 24" stroke-width="1.5" fill="none"><circle cx="12" cy="8" r="4" stroke="#000"/><path d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20" stroke="#000"/></svg>`
      },
      {
        id: 4,
        link: '/account/transactions',
        title: 'Transactions',
        color: 'bg-yellow-200',
        svg: `<svg width="20px" stroke-width="1.5" height="20px" viewBox="0 0 24 24" fill="none"><path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" stroke="#000"></path><path d="M3 15H9.4C9.73137 15 10.0053 15.2783 10.1504 15.5762C10.3564 15.9991 10.8442 16.5 12 16.5C13.1558 16.5 13.6436 15.9991 13.8496 15.5762C13.9947 15.2783 14.2686 15 14.6 15H21" stroke="#000"></path><path d="M3 7H21" stroke="#000"></path><path d="M3 11H21" stroke="#000"></path></svg>`
      },
      {
        id: 5,
        link: '/account/support',
        title: 'Contact Support',
        color: 'bg-purple-200',
        svg: `<svg width="20px" height="20px" viewBox="0 0 24 24" stroke-width="1.5" fill="none"><path d="M4 11.4998L3.51493 11.6211C2.62459 11.8437 2 12.6436 2 13.5614V15.4382C2 16.356 2.62459 17.1559 3.51493 17.3785L5.25448 17.8134C5.63317 17.9081 6 17.6217 6 17.2313V11.7683C6 11.3779 5.63317 11.0915 5.25448 11.1862L4 11.4998Z" stroke="#000"></path></svg>`
      }
    ],

    admin: [
      {
        id: 1,
        link: '/account',
        title: 'Dashboard',
        color: 'bg-blue-200',
        svg: `<svg width="20px" height="20px" stroke-width="1.5" viewBox="0 0 24 24" fill="none"><path d="M8 6L20 6" stroke="#000"/><path d="M4 6.01L4.01 5.99889" stroke="#000"/><path d="M4 12.01L4.01 11.9989" stroke="#000"/><path d="M4 18.01L4.01 17.9989" stroke="#000"/><path d="M8 12L20 12" stroke="#000"/><path d="M8 18L20 18" stroke="#000"/></svg>`
      },
      {
        id: 2,
        link: '/account/agents',
        title: 'Agents',
        color: 'bg-green-200',
        svg: `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#000"/><path d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20" stroke="#000"/></svg>`
      },
      {
        id: 3,
        link: '/account/debtors',
        title: 'Debtors',
        color: 'bg-pink-200',
        svg: `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#000"/><path d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20" stroke="#000"/></svg>`
      },
      {
        id: 4,
        link: '/account/debts',
        title: 'Debts',
        color: 'bg-yellow-200',
        svg: `<svg width="20px" stroke-width="1.5" height="20px" viewBox="0 0 24 24" fill="none"><path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" stroke="#000"></path></svg>`
      },
      {
        id: 5,
        link: '/account/activities',
        title: 'Activity Feed',
        color: 'bg-stone-200',
        svg: `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none"><circle cx="7" cy="12" r="1" fill="#000"/><circle cx="12" cy="12" r="1" fill="#000"/><circle cx="17" cy="12" r="1" fill="#000"/><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z" stroke="#000"/></svg>`
      },
      {
        id: 6,
        link: '/account/analytics',
        title: 'Reports',
        color: 'bg-indigo-200',
        svg: `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none"><path d="M5 12H9V20H5V12ZM10 4H14V20H10V4ZM15 8H19V20H15V8Z" stroke="#000"/></svg>`
      },
    ],

    agent: [
      {
        id: 1,
        link: '/account',
        title: 'Dashboard',
        color: 'bg-blue-200',
        svg: `<svg width="20px" height="20px" stroke-width="1.5" viewBox="0 0 24 24" fill="none"><path d="M8 6L20 6" stroke="#000"/><path d="M4 6.01L4.01 5.99889" stroke="#000"/><path d="M4 12.01L4.01 11.9989" stroke="#000"/><path d="M4 18.01L4.01 17.9989" stroke="#000"/><path d="M8 12L20 12" stroke="#000"/><path d="M8 18L20 18" stroke="#000"/></svg>`
      },
      {
        id: 2,
        link: '/account/debtors',
        title: 'Debtors',
        color: 'bg-amber-200',
        svg: `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#000"/><path d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20" stroke="#000"/></svg>`
      },
      {
        id: 3,
        link: '/account/debts',
        title: 'Debts',
        color: 'bg-green-200',
        svg: `<svg width="20px" stroke-width="1.5" height="20px" viewBox="0 0 24 24" fill="none"><path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" stroke="#000"></path></svg>`
      },
      {
        id: 4,
        link: '/account/transactions',
        title: 'Transactions',
        color: 'bg-gray-300',
        svg: `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none"><path d="M11 9L22 9" stroke="#000"></path><path d="M2 19.5L7.5 19.5L11.5 16.5" stroke="#000"></path></svg>`
      },
      {
        id: 5,
        link: '/account/analytics',
        title: 'Reports',
        color: 'bg-purple-200',
        svg: `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none"><path d="M5 12H9V20H5V12ZM10 4H14V20H10V4ZM15 8H19V20H15V8Z" stroke="#000"/></svg>`
      },
      {
        id: 6,
        link: '/account/support',
        title: 'Support',
        color: 'bg-gray-200',
        svg: `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none"><path d="M4 11.4998L3.51493 11.6211C2.62459 11.8437 2 12.6436 2 13.5614V15.4382C2 16.356 2.62459 17.1559 3.51493 17.3785L5.25448 17.8134C5.63317 17.9081 6 17.6217 6 17.2313V11.7683C6 11.3779 5.63317 11.0915 5.25448 11.1862L4 11.4998Z" stroke="#000"></path></svg>`
      }
    ]
  }

  const links = mobileLinks[user?.role] || []

  if (!isAuthenticated) return null

  return (
    <div className={`z-500 top-17 bg-white right-0 left-0 h-screen`}>
      <nav className="p-4 space-y-2 text-sm">
        {links.map(item => (
          <Link
            key={item.id}
            to={item.link}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-gray-100 bg-gray-50 my-2"
          >
            <span className={`${item.color} p-1 rounded-full -ml-2`}>
              <span dangerouslySetInnerHTML={{ __html: item.svg }} />
            </span>

            <span className='text-[15px] font-medium'>
              {item.title}
            </span>
          </Link>
        ))}
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