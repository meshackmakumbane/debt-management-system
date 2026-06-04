import React, { useEffect, useState, useMemo } from 'react'

import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'
import { TbMoneybag } from "react-icons/tb";
import { TbMoneybagMove } from "react-icons/tb";
import { FaCheckCircle } from "react-icons/fa";
import { IoHourglassOutline } from "react-icons/io5";
import { BsExclamationTriangle } from "react-icons/bs";

import { formatZAR } from '../../../../utils/formatCurrency'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'
import PageLoader from '../../../../components/UI/PageLoader'
import api from '../../../../api/axios'

const Reports = () => {
  const [analytics, setAnalytics] = useState(null)

  const previousAnalytics = {
    totalDebt: analytics?.totalDebt || 0,
    totalBalance: analytics?.totalBalance || 0,
    paidCount: analytics?.paidCount || 0,
    pendingCount: analytics?.pendingCount || 0,
    overdueCount: analytics?.overdueCount || 0,
    partialCount: analytics?.partialCount || 0,
  }

  const data = useMemo(() => [
  {
    title: 'Total Debt',
    value: formatZAR(analytics?.totalDebt ?? 0),
    icon: TbMoneybag,
    trend: calcTrend(
      analytics?.totalDebt,
      previousAnalytics.totalDebt
    ),
  },
  {
    title: 'Total Balance',
    value: formatZAR(analytics?.totalBalance ?? 0),
    icon: TbMoneybagMove,
    trend: calcTrend(
      analytics?.totalBalance,
      previousAnalytics.totalBalance
    ),
  },
  {
    title: 'Paid Accounts',
    value: analytics?.paidCount ?? 0,
    icon: FaCheckCircle,
    trend: calcTrend(
      analytics?.paidCount,
      previousAnalytics.paidCount
    ),
  },
  {
    title: 'Pending Accounts',
    value: analytics?.pendingCount ?? 0,
    icon: IoHourglassOutline,
    trend: calcTrend(
      analytics?.pendingCount,
      previousAnalytics.pendingCount
    ),
  },
  {
    title: 'Overdue',
    value: analytics?.overdueCount ?? 0,
    icon: BsExclamationTriangle,
    trend: calcTrend(
      analytics?.overdueCount,
      previousAnalytics.overdueCount
    ),
  },
], [analytics])

  

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(()=>{
    const fetchAnalytics = async()=>{
      try{
        setLoading(true)
        const { data } = await api.get('/data/analytics')
        setAnalytics(data.analytics)
      }catch(error){
        setError(error.response?.data?.message || "Error fetching data")
      }finally{
        setLoading(false)
      }
    }
    fetchAnalytics()
  },[])

  if (loading) return <PageLoader />

  return (
    <div className="p-4 space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((card, i) => (
        <Card
          key={i}
          title={card.title}
          value={card.value}
          icon={card.icon}
        />
      ))}
      </div>
    </div>
  )
}

const Card = ({ title, value, icon: Icon, trend, subtitle }) => {
  const isPositive = trend >= 0

  return (
    <div className="
      group relative overflow-hidden
      rounded-2xl border border-gray-100
      bg-white p-6
      shadow-sm
      transition-all duration-300
      hover:-translate-y-1 hover:shadow-xl
    ">
      {/* soft background accent */}
      <div className="
        absolute inset-0 opacity-0
        bg-gradient-to-br from-indigo-50 via-transparent to-transparent
        transition group-hover:opacity-100
      " />

      <div className="relative flex items-start justify-between">
        {/* Left content */}
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-1 text-xs text-gray-400">
              {subtitle}
            </p>
          )}

          {trend !== undefined && (
            <div className="mt-4 flex items-center gap-2">
              <span className={`
                flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full
                ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}
              `}>
                {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
                {isPositive ? '+' : ''}{trend}%
              </span>

              <span className="text-xs text-gray-400">
                vs last period
              </span>
            </div>
          )}
        </div>

        {/* Icon */}
        {Icon && (
          <div className="
            flex h-12 w-12 items-center justify-center
            rounded-xl bg-gray-50 text-gray-600
            group-hover:bg-green-50 group-hover:text-green-600
            transition
          ">
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  )
}

const calcTrend = (current, previous) => {
  if (!previous || previous === 0) return 0
  return Number((((current - previous) / previous) * 100).toFixed(1))
}

export default Reports