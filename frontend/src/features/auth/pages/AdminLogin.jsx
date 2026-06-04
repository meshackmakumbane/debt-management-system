import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import debtLogo from '../../../assets/Debtlogo.png';
import Loader from '../../../components/UI/Loader';
import {
  loginUser,
  clearError,
  setError, 
} from '../authSlice'; 

const AdminLogin = () => {
  const { loading, error, isAuthenticated, role } = useSelector(
    (state) => state.auth
  )

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formValue, setFormValue] = useState({
    employeeId: '',
    password: '',
  })

  /*  HANDLE INPUT -------------------------------------------------------- */

  const handleChange = (e) => {
    dispatch(clearError())

    const { name, value } = e.target

    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /*  SUBMIT ---------------------------------------------------------- */

  const handleSubmit = (e) => {
    e.preventDefault()

    dispatch(clearError())

    if (!formValue.employeeId || !formValue.password) {
      dispatch(setError('Provide login credentials'))
      return;
    }

    dispatch(loginUser(formValue))
  }

  /*  REDIRECT LOGIC ------------------------------------------------------ */

  if (isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT - LOGIN */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-6">
            <img src={debtLogo} alt="Debt Solution Logo" className="h-25" />
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-md">
            <p className="text-sm text-gray-500 mb-5 text-center">
              Secure access to system management tools
            </p>

            <form onSubmit={handleSubmit}>
              <input
                className="border border-gray-300 p-3 rounded-lg w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Access ID"
                type="text"
                name="employeeId"
                value={formValue.employeeId}
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

              <button disabled={loading} className="bg-green-600 hover:bg-green-700 text-white font-semibold w-full p-3 rounded-lg transition cursor-pointer h-13">
                {loading ? <Loader /> : 'Login'}
              </button>
            </form>
          </div>

          <div className="bg-gray-50 text-center text-[10px] rounded-xl mt-6 p-4">
            <p>Test credentials:</p>
            <p>Employee ID: EMP-07160413</p>
            <p>Password: DH13396040</p>
          </div>

          <p className="text-xs text-gray-400 mt-4 text-center">
            Version 0.1
          </p>
        </div>
      </div>

      {/* RIGHT - CONTROL CENTER VALUE PROP */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-green-900 to-black text-white flex items-center justify-center px-10 py-16">
        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            System Control Center
          </h1>

          <p className="text-green-100 text-sm">
            Full administrative access to manage agents, debtors, financial
            records, and system-wide performance metrics.
          </p>

          <div className="space-y-3 text-sm">
            <div className="bg-white/10 p-4 rounded-lg">
              Manage all agents and assignments
            </div>

            <div className="bg-white/10 p-4 rounded-lg">
              Monitor debt and repayment activity
            </div>

            <div className="bg-white/10 p-4 rounded-lg">
              Generate financial and system reports
            </div>

            <div className="bg-white/10 p-4 rounded-lg">
              Oversee system security and access control
            </div>
          </div>

          <div className="text-xs text-green-200 pt-4">
            Highest level access • Audit control • Full system visibility
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;