import React from 'react'
import { Link } from 'react-router-dom'

import Logo from '../assets/Debtlogo.png'

const Onboarding = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  return (
    <section className="relative h-screen flex flex-col items-center bg-gray-100 text-white text-sm pb-10  bg-top bg-no-repeat">

      <div className='mt-15'>
        <img src={Logo} /> 
      </div>

      <a
        href="#"
        className="flex items-center gap-2 rounded-full bg-green-950 p-2 pr-4"
      >
        <span className="bg-green-600 text-xs px-3 py-1 rounded-full">
          NEW
        </span>

        <div className="flex items-center text-green-600 text-sm">
          <span>New onboarding flow for Debt Hero companies</span>
        </div>
      </a>

      <h1 className="text-center text-green-950 text-2xl leading-noen md:text-5xl mt-3 font-semibold max-w-2xl px-1">
        Set up your Debt Hero workspace in minutes
      </h1>

      <p className="text-center text-black text-sm md:text-base/7 max-w-md mt-2 px-4">
        Create your company account, invite your team, and start managing debt recovery operations with full visibility and control.
      </p>

      <div className="flex items-center gap-4 mt-8">

        <Link to='/create-account' className="bg-green-600 hover:bg-green-700 text-slate-50 rounded-full px-7 py-3 cursor-pointer">
          Start onboarding
        </Link>

      </div>
    </section>

  )
}

export default Onboarding


  

  