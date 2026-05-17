import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../Components/Header'
import { Outlet } from 'react-router-dom'
import { logoutUser } from '../../auth/services/authSlice'
import { useSelector, useDispatch } from 'react-redux'

const AgentDashboard = () => {
  const { user, loading, error, isAuthenticated, role } = useSelector(state=> state.auth)
  const dispatch = useDispatch()

  const sideBar = [
        {
          id:1,
          link:'/agent',
          svg:'<svg width="20px" height="20px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M8 6L20 6" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 6.01L4.01 5.99889" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 12.01L4.01 11.9989" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 18.01L4.01 17.9989" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 12L20 12" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 18L20 18" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
          title:'Dashboard',
          color:'bg-blue-200'
        },
        {
          id:2,
          link:'/agent/debtors',
          svg:'<svg width="20px" height="20px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M1 20V19C1 15.134 4.13401 12 8 12V12C11.866 12 15 15.134 15 19V20" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path><path d="M13 14V14C13 11.2386 15.2386 9 18 9V9C20.7614 9 23 11.2386 23 14V14.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path><path d="M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18 9C19.6569 9 21 7.65685 21 6C21 4.34315 19.6569 3 18 3C16.3431 3 15 4.34315 15 6C15 7.65685 16.3431 9 18 9Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
          title:'Debtors',
          color:'bg-amber-200'
        },
        {
          id:4,
          link:'/agent/debts',
          svg:'<svg width="20px" stroke-width="1.5" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" stroke="#000000" stroke-width="1.5"></path><path d="M3 15H9.4C9.73137 15 10.0053 15.2783 10.1504 15.5762C10.3564 15.9991 10.8442 16.5 12 16.5C13.1558 16.5 13.6436 15.9991 13.8496 15.5762C13.9947 15.2783 14.2686 15 14.6 15H21" stroke="#000000" stroke-width="1.5"></path><path d="M3 7H21" stroke="#000000" stroke-width="1.5"></path><path d="M3 11H21" stroke="#000000" stroke-width="1.5"></path></svg>',
          title:'Debts',
          color:'bg-green-200'
        },
        {
          id:3,
          link:'/agent/transactions',
          svg:'<svg width="20px" height="20px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M11 9L22 9" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2 11L4.80662 7.84255C5.5657 6.98859 6.65372 6.5 7.79627 6.5L8 6.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2 19.5003L7.5 19.5L11.5 16.5003C11.5 16.5003 12.3091 15.9528 13.5 15.0001C16 13.0002 13.5 9.83352 11 11.4997C8.96409 12.8565 7 14.0003 7 14.0003" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 13.5V7C8 5.89543 8.89543 5 10 5H20C21.1046 5 22 5.89543 22 7V13C22 14.1046 21.1046 15 20 15H13.5" stroke="#000000" stroke-width="1.5"></path></svg>',
          title:'Transactions',
          color:'bg-gray-300'
        },
        {
          id:5,
          link:'/agent/reports',
          svg:'<svg width="20px" height="20px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M9 21H15M9 21V16M9 21H3.6C3.26863 21 3 20.7314 3 20.4V16.6C3 16.2686 3.26863 16 3.6 16H9M15 21V9M15 21H20.4C20.7314 21 21 20.7314 21 20.4V3.6C21 3.26863 20.7314 3 20.4 3H15.6C15.2686 3 15 3.26863 15 3.6V9M15 9H9.6C9.26863 9 9 9.26863 9 9.6V16" stroke="#000000" stroke-width="1.5"></path></svg>',
          title:'Reports',
          color:'bg-purple-200'
        },
        ,
        {
          id:6,
          link:'/agent/support',
          svg:'<svg width="20px" height="20px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M4 11.4998L3.51493 11.6211C2.62459 11.8437 2 12.6436 2 13.5614V15.4382C2 16.356 2.62459 17.1559 3.51493 17.3785L5.25448 17.8134C5.63317 17.9081 6 17.6217 6 17.2313V11.7683C6 11.3779 5.63317 11.0915 5.25448 11.1862L4 11.4998ZM4 11.4998V11C4 6.58172 7.58172 3 12 3C16.4183 3 20 6.58172 20 11V11.4998M20 11.4998L20.4851 11.6211C21.3754 11.8437 22 12.6436 22 13.5614V15.4382C22 16.356 21.3754 17.1559 20.4851 17.3785L20 17.4998M20 11.4998L18.7455 11.1862C18.3668 11.0915 18 11.3779 18 11.7683V17.2313C18 17.6217 18.3668 17.9081 18.7455 17.8134L20 17.4998M15 20.5H18C19.1046 20.5 20 19.6046 20 18.5V18V17.4998M15 20.5C15 19.6716 14.3284 19 13.5 19H10.5C9.67157 19 9 19.6716 9 20.5C9 21.3284 9.67157 22 10.5 22H13.5C14.3284 22 15 21.3284 15 20.5Z" stroke="#000000" stroke-width="1.5"></path></svg>',
          title:'Support',
          color:'bg-gray-200'
        }
  ]

  useEffect(()=>{
    if(!isAuthenticated){
      dispatch(logoutUser())
    }
  },[isAuthenticated, dispatch])

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <Header />
      <section className='pt-17'>
        <aside className='fixed w-65 min-h-[calc(100vh-4.25rem)] bg-white hidden md:flex flex-col justify-between shadow-md'>
          <div className=''>
            <nav className="p-4 space-y-2 text-sm">
              { sideBar.map(item =>(
                <Link key={item.id} to={item.link} className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-gray-100 bg-gray-50 my-2">
                    <span className={`${item.color} p-1 rounded-full -ml-2`}>
                        <span dangerouslySetInnerHTML={{__html:item.svg}} />
                    </span>
                    <span className='text-[15px] font-medium'>{item.title}</span>
                </Link> 
              ))
              }
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
        <main className="min-h-screen ml-0 md:ml-65 p-4 max-sm:w-full">
          <Outlet />
        </main>
      </section>
    </div>
  )
}

export default AgentDashboard
