import React, { useState, useRef } from 'react'
import { Navigate } from 'react-router-dom'

import api from '../api/axios'
import Loader from '../components/UI/Loader'

const VerifyEmail = () => {
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false) 
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const inputs = useRef([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      setLoading(true)
      const { data } = await api.post('/admin/verify', { code })
      setSuccess(data?.message)
      if(data.success === true){
        <Navigate to='/auth/admin' replace />
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error verififying")
    } finally {
      setLoading(false)
    }
  }

  const newCode = async (e)=>{
    e.preventDefault()
    setError(null)
    setSuccess(null)
    try{
      setLoading(true)
      const { data } = await api.post('/admin/resend', { email })
      setSuccess(data?.message)
      
      setTimeout(()=>{
        setShowModal(false)
      },5000)

    }catch(error){
      setError(error.response?.data?.message || "Error resending code")
    }finally{
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-black text-white flex items-center justify-center px-6 bg-gray-100 bg-top bg-no-repeat">

      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center">

          <span className="inline-flex px-4 py-2 rounded-full bg-green-950 text-green-500 text-xs">
            EMAIL VERIFICATION
          </span>

          <h1 className="text-4xl text-green-950 font-semibold mt-6">
            Verify your email
          </h1>



          <p className="text-gray-900 mt-3 text-sm max-w-md mx-auto">
            Enter the 6-digit verification code sent to your email to continue setting up your Debt Hero workspace.
          </p>

        </div>

        {/* Card */}
        <div className="mt-2 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8">

        {success 
            ?<div className='bg-green-500 w-full p-2 rounded-lg m-1'>
                <p>{success}</p>
              </div>
            : null
            }

            {error
            
            ?<div className='bg-red-500 w-full p-2 rounded-lg m-1 text-center m-1'>
                <p>{error}</p>
              </div>
            : null
            }
          {/* OTP */}
          <div className="flex justify-center gap-3">

            <input 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className='
                w-full h-16 tracking-widest
                bg-gray-400 rounded-2xl
                 border border-white/10
                text-center
                text-4xl
                font-semibold
                outline-none
                focus:border-green-500
                focus:bg-green-950/20
                transition
                max-sm:h-16 
              '
              type="text" 
            />
      

          </div>

          {/* Verify */}
          <button
            onClick={handleSubmit}
            className="
              mt-8
              w-full
              bg-green-600
              hover:bg-green-700
              rounded-2xl
              py-4
              font-medium
              transition
            "
          >
            Verify Email
          </button>

          {/* Footer */}
          <div className="text-center mt-6">

            <p className="text-slate-400 text-sm">
              Didn’t receive the code?
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="
                text-green-500
                hover:text-green-400
                mt-2
                font-medium
              "
            >
              Resend code
            </button>

          </div>

        </div>

      </div>

      {/* RESEND CODE MODAL */}
      <div className={` ${showModal ? 'block' : 'hidden'} fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4`}>

        <div className="bg-white rounded-3xl w-full max-w-md p-7">

          {/* Header */}
          <div>

            <h2 className="text-2xl text-gray-500 font-semibold">
              Resend verification code
            </h2>

            <p className="text-gray-500 mt-2">
              Enter the email used during onboarding.
            </p>

              {success 
              ?<div className='bg-green-500 w-full p-2 rounded-lg'>
                  <p>{success}</p>
                </div>
              : null
              }

              {error
               
              ?<div className='bg-red-500 w-full p-2 rounded-lg'>
                  <p>{error}</p>
                </div>
              : null
              }

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-8"
          >

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email address"
              className="
                w-full
                border
                border-gray-200
                rounded-2xl
                p-4
                outline-none
                focus:ring-2
                focus:ring-green-600
                text-gray-950
              "
            />

            <div className="flex gap-3 mt-6">

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="
                  bg-black
                  flex-1
                  border
                  rounded-2xl
                  py-3
                "
              >
                Close
              </button>

              <button
                disabled={loading}
                onClick={newCode}
                className="
                  flex-1
                  bg-green-600
                  hover:bg-green-700
                  text-white
                  rounded-2xl
                  py-3
                "
              >
                {loading
                  ? <Loader />
                  : 'Send code'}
              </button>

            </div>

          </form>

        </div>

      </div>

    </section>
  )
}

export default VerifyEmail