import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import debtLogo from '../assets/Debtlogo.png';
import HeroImage from '../assets/DebtImage.png';
import Loader from '../components/UI/Loader'

import api from '../api/axios'


const CreateAccount = () => {
  

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    phone: '',
    organizationName: '',
  })

  /*  HANDLE INPUT -------------------------------------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /*  SUBMIT ---------------------------------------------------------- */
  const handleSubmit = async(e) => {
    e.preventDefault()
    setError(null)
    if (!formValue.name || !formValue.email || !formValue.phone || !formValue.organizationName) {
      setError('Provide all your details')
      return;
    }
    try {
      setLoading(true)
      const { data } = await api.post('/admin/register', formValue)
      return data
    } catch (error) {
      setError(error?.response?.data?.message || "Error creating account")
    } finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* LEFT — BRAND / VALUE */}
      <section className="relative w-full lg:w-1/2 overflow-hidden bg-gradient-to-br from-green-900 via-green-950 to-black text-white">

        <div className="h-full flex flex-col justify-center px-8 lg:px-20 py-14">

          <div className="max-w-lg">

            <span className="inline-flex px-4 py-2 rounded-full bg-green-950 text-green-400 text-xs font-medium">
              COMPANY ONBOARDING
            </span>

            <h1 className="text-5xl max-sm:text-3xl font-semibold leading-none mt-6">
              Create your
              <span className="block bg-gradient-to-r from-green-400 to-green-200 bg-clip-text text-transparent">
              Workspace
              </span>
            </h1>

            <p className="mt-5 text-green-100 leading-7">
              Set up your organization, invite your team, and start managing debt recovery operations from a single platform.
            </p>

            

            {/* Image */}
            <div className="mt-10 overflow-hidden rounded-lg border border-white/10">

              <img
                src={HeroImage}
                className="
                  w-full
                "
              />

            </div>

          </div>

        </div>

      </section>

      {/* RIGHT — FORM */}
      <section className="w-full lg:w-1/2 bg-white flex items-center justify-center px-15 py-2">

        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="flex justify-center">

            <img
              src={debtLogo}
              className="h-24"
              alt=""
            />

          </div>

          {/* Header */}
          <div className="text-center mt-2">

            <h2 className="text-3xl font-semibold">
              Create Account
            </h2>

            <p className="text-gray-500 mt-2">
              Start your company onboarding journey
            </p>

          </div>

          {/* Form */}
          <div className="mt-8">

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <input
                className="w-full border border-gray-200 rounded-2xl p-3 focus:ring-2 focus:ring-green-600 outline-none"
                placeholder="Full Name"
                name="name"
                value={formValue.name}
                onChange={handleChange}
              />

              <input
                className="w-full border border-gray-200 rounded-2xl p-3 focus:ring-2 focus:ring-green-600 outline-none"
                placeholder="Email Address"
                type="email"
                name="email"
                value={formValue.email}
                onChange={handleChange}
              />

              <input
                className="w-full border border-gray-200 rounded-2xl p-3 focus:ring-2 focus:ring-green-600 outline-none"
                placeholder="Phone Number"
                name="phone"
                value={formValue.phone}
                onChange={handleChange}
              />

              <input
                className="w-full border border-gray-200 rounded-2xl p-3 focus:ring-2 focus:ring-green-600 outline-none"
                placeholder="Organization Name"
                name="organizationName"
                value={formValue.organizationName}
                onChange={handleChange}
              />

              {error && (
                <p className="text-red-500 text-sm text-center">
                  {error}
                </p>
              )}

              <button
                disabled={loading}
                className="
                  w-full
                  rounded-2xl
                  bg-green-600
                  hover:bg-green-700
                  text-white
                  h-12
                  font-medium
                  transition
                  cursor-pointer
                "
              >
                {loading ? (
                  <Loader />
                ) : (
                  "Continue to Verification"
                )}
              </button>

            </form>

          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Secure onboarding • Company workspace setup
          </p>

        </div>

      </section>

      

    </div>
  )
}

export default CreateAccount
// px-1 py-16