import { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import debtLogo from '../../../assets/Debtlogo.png'
import { useSelector, useDispatch } from 'react-redux'
import { loginUser, clearError, setError } from '../services/authSlice'
import Loader from '../../../components/UI/Loader'

const AgentLogin = () => {
   const { user, status, error, isAuthenticated, role } = useSelector(state=> state.auth)
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const [formValue, setFormValue] = useState({
      accessId:"",
      password:""
   })

   const handleChange = (e)=>{
      dispatch(clearError())
      const { name, value} = e.target
      setFormValue(prev =>({
         ...prev, [name]:value
      }))
   }

   const handleSubmit = (e)=>{
      e.preventDefault()
      dispatch(clearError())

      if(!formValue.accessId || !formValue.password){
         return dispatch(setError("Provide login credentials"))
      }

      dispatch(loginUser(formValue))
   }

   useEffect(()=>{
      if(isAuthenticated && user && role === 'agent'){
         navigate('/agent-profile', { replace: true })
      }
   },[user, isAuthenticated, role, navigate])
  
    return (
          <div className="min-h-screen flex flex-col lg:flex-row">

  {/* LEFT - LOGIN */}
  <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12">

    <div className="w-full max-w-sm">

      <div className="flex justify-center mb-6">
        <img src={debtLogo} alt="Debt Solution Logo" className="h-16" />
      </div>

      <div className="bg-gray-50 p-6 rounded-xl shadow-md">

        <h2 className="text-xl font-bold text-gray-800 mb-1">
          Agent Portal
        </h2>

        <p className="text-sm text-gray-500 mb-5">
          Sign in to manage assigned debtors and track payments
        </p>

        <form onSubmit={handleSubmit}>

          <input
            className="border border-gray-300 p-3 rounded-lg w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Access ID"
            type="text"
            name="accessId"
            value={formValue.accessId}
            onChange={handleChange}
          />

          <input
            className="border border-gray-300 p-3 rounded-lg w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Password"
            type="password"
            name="password"
            value={formValue.password}
            onChange={handleChange}
          />

          {error && (
            <p className="text-red-500 text-sm mb-3 text-center font-medium">
              {error}
            </p>
          )}

          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold w-full p-3 rounded-lg transition cursor-pointer">
            {status === "loading" ? <Loader /> : "Login"}
          </button>

        </form>
      </div>

      <div className='bg-gray-50 p-4 max-sm:w-80 md:w-100 lg:w-80 rounded-xl mt-6 text-center text-[10px]'> 
         <p>Test credentials:</p> 
         <p>Identity Number: 0987654321</p> 
         <p>Reference Number: DH234147</p> 
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Version 0.1
      </p>

    </div>

  </div>

  {/* RIGHT - VALUE PROPOSITION */}
  <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-900 to-blue-950 text-white flex items-center justify-center px-10 py-16">

    <div className="max-w-md space-y-6">

      <h1 className="text-4xl font-bold leading-tight">
        Agent Control Center
      </h1>

      <p className="text-blue-100 text-sm">
        Manage your assigned debtors, track repayments, and stay on top of collections in real time.
      </p>

      <div className="space-y-3 text-sm">

        <div className="bg-white/10 p-4 rounded-lg">
          View assigned debtors instantly
        </div>

        <div className="bg-white/10 p-4 rounded-lg">
          Record and track payments
        </div>

        <div className="bg-white/10 p-4 rounded-lg">
          Monitor outstanding balances
        </div>

        <div className="bg-white/10 p-4 rounded-lg">
          Receive real-time updates & alerts
        </div>

      </div>

      <div className="text-xs text-blue-200 pt-4">
        Built for efficiency • Secure • Real-time operations
      </div>

    </div>

  </div>

</div>
    )
}

export default AgentLogin