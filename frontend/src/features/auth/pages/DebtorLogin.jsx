import React, { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { loginUser, setError, clearError, resetAuth } from '../authSlice'

import debtLogo from '../../../assets/Debtlogo.png';
import Loader from '../../../components/UI/Loader'

const DebtorLogin = () => {
  const { loading, user, status, error, isAuthenticated, role } = useSelector(state=> state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formValue, setFormValue] = useState({
      idNumber:"",
      refNumber:""
  })

  const handleChange = (e)=>{
    dispatch(clearError())
    const { name, value} = e.target
    setFormValue(prev =>({
      ...prev, [name]: value
    }))
  }

  const handleSubmit = (e)=>{
      e.preventDefault()
      dispatch(clearError())

      if(!formValue.idNumber || !formValue.refNumber){
        return dispatch(setError("Provide login credentials"))
      }

      dispatch(loginUser(formValue))
  } 
   
  /*  REDIRECT LOGIC ------------------------------------------------------ */
  
  if (isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* LEFT SIDE - LOGIN */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8">

        <img src={debtLogo} alt="Logo" className="h-25 mb-6" />

        <div className="w-full max-w-sm bg-gray-50 p-6 rounded-xl shadow-md">

          <p className="text-sm text-gray-500 mb-5">
            Access your account using your ID and reference number
          </p>

          <form onSubmit={handleSubmit}>

            <input
              className="border border-gray-300 p-3 rounded-lg w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Identity Number"
              type="text"
              name="idNumber"
              value={formValue.idNumber}
              onChange={handleChange}
            />

            <input
              className="border border-gray-300 p-3 rounded-lg w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Reference Number"
              type="text"
              name="refNumber"
              value={formValue.refNumber}
              onChange={handleChange}
            />

            {error && (
              <p className="text-red-500 text-sm mb-3 text-center font-medium">
                {error}
              </p>
            )}

            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold w-full p-3 rounded-lg transition cursor-pointer"
            >
              {loading ? <Loader /> : "Login"}
            </button>

          </form>
        </div>

        <div className='bg-gray-50 p-4 max-sm:w-80 md:w-100 lg:w-80 rounded-xl mt-6 text-center text-[10px]'> 
          <p>Test credentials:</p> 
          <p>Identity Number: 0987654321</p> 
          <p>Reference Number: DH234147</p> 
        </div>

        <p className="text-xs text-gray-400 mt-4">Version 0.1</p>

      </div>

      {/* RIGHT SIDE - VALUE PROPOSITION */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-green-700 to-green-900 text-white items-center justify-center p-12">

        <div className="max-w-md space-y-6">

          <h1 className="text-3xl font-bold leading-tight">
            Control of your debt journey
          </h1>

          <p className="text-green-100 text-sm">
            View your balance, track payments, and stay informed about your repayment progress in real time.
          </p>

          <div className="space-y-3 text-sm">

            <div className="bg-white/10 p-4 rounded-lg">
              Track your outstanding balance instantly
            </div>

            <div className="bg-white/10 p-4 rounded-lg">
              View repayment history and updates
            </div>

            <div className="bg-white/10 p-4 rounded-lg">
              Stay connected with your assigned agent
            </div>

          </div>

          <div className="mt-6 text-xs text-green-100">
            Secure   •   Transparent   •   Real-time updates
          </div>

        </div>

      </div>
    </div>
  )
}

export default DebtorLogin