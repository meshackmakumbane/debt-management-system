import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchData } from '../../service/overviewSlice'
import PageLoader from '../../../components/UI/PageLoader'

const Agents = () => {
  const dispatch = useDispatch()
    const { overviewData, status, error } = useSelector((state) => state.overview)
    const [agentData, setAgentData] = useState([])

    useEffect(() => {
      if (overviewData?.agents) {
        setAgentData(overviewData.agents)
      }
    }, [overviewData])

    if (status === 'loading') return <PageLoader />

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

  {/* HEADER */}
  <div className="flex items-center justify-between mb-5">
    <div>
      <h2 className="text-lg font-semibold text-gray-900">Agents</h2>
      <p className="text-sm text-gray-500">
        Manage and monitor all field agents
      </p>
    </div>

    <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
      {agentData.length} total
    </span>
  </div>

  {/* LIST HEADER (table replacement) */}
  <div className="hidden md:grid grid-cols-5 text-xs text-gray-500 px-3 pb-2 border-b">
    <span>Name</span>
    <span>Email</span>
    <span>Phone</span>
    <span>Status</span>
    <span>Assigned Debtors</span>
  </div>

  {/* LIST */}
  <div className="space-y-2 mt-3">

    {agentData.length > 0 ? (
      agentData.map((agent) => (
        <div
          key={agent._id}
          className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-0 items-center px-3 py-3 rounded-lg hover:bg-gray-50 transition"
        >

          {/* NAME */}
          <div className="font-medium text-gray-900">
            <Link
              to={`/admin/agents/${agent._id}`}
              className="hover:text-green-700 transition"
            >
              {agent.fullName}
            </Link>
          </div>

          {/* EMAIL */}
          <div className="text-sm text-gray-600 truncate">
            {agent.email}
          </div>

          {/* PHONE */}
          <div className="text-sm text-gray-600">
            {agent.phoneNumber || '-'}
          </div>

          {/* STATUS */}
          <div>
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                agent.isActive
                  ? 'bg-green-50 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {agent.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* ASSIGNED */}
          <div className="text-sm font-medium text-gray-800">
            {agent.assignedDebtors?.length || 0}
          </div>

        </div>
      ))
    ) : (
      <div className="text-center py-10 text-gray-400">
        No agents found
      </div>
    )}

  </div>

  {/* ACTION */}
  <div className="pt-6">
    <Link
      to="/admin/agents/add"
      className="inline-flex items-center bg-green-950 px-4 py-2 text-white text-sm rounded-full hover:bg-green-800 transition"
    >
      + Add Agent
    </Link>
  </div>

</div>
  )
}

export default Agents
