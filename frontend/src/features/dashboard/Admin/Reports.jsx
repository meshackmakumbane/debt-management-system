import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from '../../service/overviewSlice'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'
import PageLoader from '../../../components/UI/PageLoader'

const Reports = () => {
  const dispatch = useDispatch()
  const { overview, status, error } = useSelector((state) => state.overview)
  const debts = overview?.debts || []

  useEffect(() => {
    if (!overview && status !== 'loading') {
      dispatch(fetchData())
    }
  }, [dispatch, overview, status])

const {
    totalDebt,
    totalCollected,
    outstanding,
    recoveryRate,
    chartData,
    agentStats
  } = useMemo(() => {
    if (!debts || debts.length === 0) {
      return {
        totalDebt: 0,
        totalCollected: 0,
        outstanding: 0,
        recoveryRate: 0,
        chartData: [],
        agentStats: {}
      }
    }

    let totalDebt = 0
    let totalCollected = 0
    const monthlyMap = {}
    const agentMap = {}

    debts.forEach((debt) => {
      const amount = Number(debt.amount) || 0
      totalDebt += amount


      if (debt.status === 'paid') {
        totalCollected += amount
      }

      const date = new Date(debt.createdAt)
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`

      if (!monthlyMap[key]) {
        monthlyMap[key] = 0
      }
      if (debt.status === 'paid') {
        monthlyMap[key] += amount
      }

      if (debt.agent) {
        const agentName = debt.agent.fullName

        if (!agentMap[agentName]) {
          agentMap[agentName] = {
            assigned: 0,
            collected: 0
          }
        }

        agentMap[agentName].assigned += amount

        if (debt.status === 'paid') {
          agentMap[agentName].collected += amount
        }
      }
    })

    const outstanding = totalDebt - totalCollected
    const recoveryRate =
      totalDebt === 0 ? 0 : ((totalCollected / totalDebt) * 100).toFixed(1)

    const chartData = Object.keys(monthlyMap).map((key) => ({
      month: key,
      collected: monthlyMap[key]
    }))

    return {
      totalDebt,
      totalCollected,
      outstanding,
      recoveryRate,
      chartData,
      agentStats: agentMap
    }
  }, [debts])

  if (status === 'loading') {
    return <PageLoader />
  }

  return (
    <div className="p-4 space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total Debt" value={totalDebt} />
        <Card title="Collected" value={totalCollected} />
        <Card title="Outstanding" value={outstanding} />
        <Card title="Recovery Rate" value={`${recoveryRate}%`} />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-4">Collections Over Time</h3>

        {chartData.length === 0 ? (
          <p>No data</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="collected" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-4">Agent Performance</h3>

        {Object.keys(agentStats).length === 0 ? (
          <p>No agents</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Name</th>
                <th>Assigned</th>
                <th>Collected</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(agentStats).map(([name, data]) => {
                const rate =
                  data.assigned === 0
                    ? 0
                    : ((data.collected / data.assigned) * 100).toFixed(1)

                return (
                  <tr key={name}>
                    <td>{name.fullName}</td>
                    <td>{data.assigned}</td>
                    <td>{data.collected}</td>
                    <td>{rate}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-xl font-bold">{value}</h2>
  </div>
)

export default Reports