import React from 'react'
import { Link } from 'react-router-dom'
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../../auth/authSlice'

import { TfiMenuAlt } from "react-icons/tfi";
import { TbUsersGroup } from "react-icons/tb";
import { PiUsersFourBold } from "react-icons/pi";
import { CiViewList } from "react-icons/ci";
import { BsMenuUp } from "react-icons/bs";
import { BsGraphUpArrow } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";
import { PiListNumbers } from "react-icons/pi";
import { GrTransaction } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa6";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { BiSupport } from "react-icons/bi";

const Sidebar = () => {
  const { isAuthenticated, role } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const SideLinks = {
    debtor: [
      {
        id: 1,
        link: '/account',
        title: 'Overview',
        color: 'bg-blue-200',
        svg: <TfiMenuAlt size={17}/>
      },
      {
        id: 2,
        link: '/account/payment',
        title: 'Make Payment',
        color: 'bg-green-200',
        svg: <GrTransaction size={19}/>
      },
      {
        id: 3,
        link: '/account/profile',
        title: 'Profile',
        color: 'bg-pink-200',
        svg: < FaRegUser size={19}/>
      },
      {
        id: 4,
        link: '/account/transactions',
        title: 'Transactions',
        color: 'bg-yellow-200',
        svg: <PiListNumbers size={19} />
      },
      {
        id: 5,
        link: '/account/support',
        title: 'Contact Support',
        color: 'bg-purple-200',
        svg: <IoMdHelpCircleOutline size={20}/>
      }
    ],

    admin: [
      {
        id: 1,
        link: '/account',
        title: 'Dashboard',
        color: 'bg-blue-200',
        svg: <TfiMenuAlt size={17}/>
      },
      {
        id: 2,
        link: '/account/agents',
        title: 'Agents',
        color: 'bg-green-200',
        svg: < TbUsersGroup size={17}/>
      },
      {
        id: 3,
        link: '/account/debtors',
        title: 'Debtors',
        color: 'bg-pink-200',
        svg: <PiUsersFourBold size={17}/>
      },
      {
        id: 4,
        link: '/account/debts',
        title: 'Debts',
        color: 'bg-yellow-200',
        svg: <  CiViewList size={19}/>
      },
      {
        id: 5,
        link: '/account/transactions',
        title: 'Transactions',
        color: 'bg-emerald-200',
        svg: <  PiListNumbers size={19}/>
      },
      {
        id: 6,
        link: '/account/activities',
        title: 'Activity Feed',
        color: 'bg-stone-200',
        svg: < BsMenuUp size={16} />
      },
      {
        id: 7,
        link: '/account/analytics',
        title: 'Analytics',
        color: 'bg-indigo-200',
        svg: < BsGraphUpArrow size={14} />
      }
    ],

    agent: [
      {
        id: 1,
        link: '/account',
        title: 'Dashboard',
        color: 'bg-blue-200',
        svg: <TfiMenuAlt size={17}/>
      },
      {
        id: 2,
        link: '/account/debtors',
        title: 'Debtors',
        color: 'bg-amber-200',
        svg: <PiUsersFourBold size={17}/>
      },
      {
        id: 3,
        link: '/account/debts',
        title: 'Debts',
        color: 'bg-green-200',
        svg: < CiViewList size={19}/>
      },
      {
        id: 4,
        link: '/account/transactions',
        title: 'Transactions',
        color: 'bg-gray-300',
        svg: <  PiListNumbers size={19}/>
      },
      {
        id: 5,
        link: '/account/analytics',
        title: 'Reports',
        color: 'bg-purple-200',
        svg: < BsGraphUpArrow size={17} />
      },
      {
        id: 6,
        link: '/account/support',
        title: 'Support',
        color: 'bg-gray-200',
        svg: < BiSupport size={17} />
      }
    ]
  }

  let links;
  /* ADMIN NAVIGATION LINKS -------------------------- */
  if(isAuthenticated && role === 'admin'){
    links = SideLinks.admin;

  }

  /* AGENTS NAVIGATION LINKS ------------------------- */
  if(isAuthenticated && role === 'agent'){
    links = SideLinks.agent;
  }

  /* DEBTOR NAVIGATION LINKS --------------------------*/
  if(isAuthenticated && role === 'debtor'){
    links = SideLinks.debtor;
  }

  /* LOGOUT CLICK ------------------------------------- */
  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <aside className='fixed w-65 min-h-[calc(100vh-4.25rem)] bg-white hidden md:flex flex-col justify-between shadow-md'>

      <div>
        <nav className="p-4 space-y-2 text-sm">
          {links?.map((item) => (
            <NavLink
              key={item.id}
              to={item.link}
              end={item.link === '/account'}
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-4 py-1.5 rounded-full my-2 transition bg-gray-50
                ${isActive ? "bg-gray-100" : "hover:bg-gray-100"}
                `
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`
                      p-1.5 rounded-full -ml-2 transition
                      ${isActive ? item.color : "bg-gray-300"}
                    `}
                  >
                    {item.svg}
                  </span>

                  <span className="text-[15px] font-medium">
                    {item.title}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
      <button 
          onClick={handleLogout}
          className="text-white flex gap-3 w-full text-left px-4 py-2 rounded-full hover:bg-red-900 text-sm cursor-pointer text-[15px] font-medium bg-red-500">
          <svg width="20px" height="20px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ffffff"><path d="M12 12H19M19 12L16 15M19 12L16 9" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19 6V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V18" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg> Logout
      </button>
      </div>
    </aside>
  )
}

export default Sidebar
