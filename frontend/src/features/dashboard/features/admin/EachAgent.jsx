import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import api from '../../../../api/axios'
import { CiAlignCenterH } from 'react-icons/ci'

import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";

import Button from '../../components/UI/Button'

const EachAgent = () => {
  const { id } = useParams()
  const [agent, setAgent] = useState(null)
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  
  useEffect(() => {
      const fetchAgent = async () => {
        try{
          const { data } = await api.get(`/user/agents/${id}`)
          setAgent(data.agent)
          setList(data.debtors)
        }catch(err){
          setErrorMessage(err.response?.data?.message || "Failed to fetch agent details")
        }finally{
          setLoading(false)
        }
      }
      fetchAgent()
  }, [id])

  const amountPending = useMemo(()=>{
    return list.reduce((sum, debtor) =>{
      return sum + debtor.debtId.amount
    },0)
  },[list])

  const totalCollected = useMemo(()=>{
    return list.reduce((sum, debtor) =>{
      return sum + debtor.debtId.amountPaid
    },0)   
  },[list])

  console.log(amountPending)

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 animate-pulse">
        
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
          </div>
          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Agent not found
      </div>
    )
  }

  return (
    <>
      <div className='flex items-center justify-between pr-4'>
        <Button />
        <h1 className='text-lg font-semibold text-gray-900'>{agent?.name}</h1>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-6">

          {/* PROFILE */}
          <div className="flex items-center gap-4">

            {/* AVATAR */}
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-green-700 font-bold text-sm shadow-sm">
              {agent.name?.charAt(0)}
            </div>

            {/* INFO */}
            <div>

              <h3 className="text-base font-semibold text-gray-900 tracking-tight">
                {agent.name}
              </h3>

              <p className="text-sm text-gray-500">
                {agent.email}
              </p>

            </div>

          </div>

          {/* STATUS */}
          <div>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                agent.isActive === true
                  ? 'bg-green-50 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >

              <span
                className={`w-2 h-2 rounded-full ${
                  agent.isActive === true
                    ? 'bg-green-500'
                    : 'bg-gray-400'
                }`}
              />

              {agent.isActive}

            </span>
          </div>

        </div>

        {/* METRICS */}
        <div className="grid grid-cols-3 gap-3 mb-6">

          {/* DEBTORS */}
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">
              Debtors
            </p>

            <p className="text-lg font-semibold text-gray-900">
              {list.length || 0}
            </p>
          </div>

          {/* COLLECTED */}
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">
              Collected
            </p>

            <p className="text-sm font-semibold text-gray-900">
              {new Intl.NumberFormat('en-ZA', {
                style: 'currency',
                currency: 'ZAR',
              }).format(totalCollected || 0)}
            </p>
          </div>

          {/* PENDING */}
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">
              Pending
            </p>

            <p className="text-sm font-semibold text-gray-900">
              {new Intl.NumberFormat('en-ZA', {
                style: 'currency',
                currency: 'ZAR',
              }).format(amountPending || 0)}
            </p>
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">

        

          <Link to='/account/debtors' className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-xl transition shadow-sm">
            Assign Debtor
          </Link>

        </div>

      </div>
    </>
  )
}

export default EachAgent
