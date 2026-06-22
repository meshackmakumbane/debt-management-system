import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { fetchData } from '../../services/overviewSlice'

const AdminOverview = () => {
  const dispatch = useDispatch()
  const { data, counts, organization, loading, error } = useSelector((state) => state.overview)

  const totalOwed = useMemo(() =>
    (data?.debts || []).reduce(
      (sum, debt) => sum + (debt.balance || 0),
      0
    ),
  [data?.debts]);

  const overviews = [
    {
      id: 1,
      title: 'Total Debts',
      desc: 'Total number of active debts',
      value: counts?.debts || 0,
      svg: '<svg width="20px" height="20px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M8 6L20 6" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 6.01L4.01 5.99889" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 12.01L4.01 11.9989" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 18.01L4.01 17.9989" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 12L20 12" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 18L20 18" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
    },
    {
      id: 2,
      title: 'Total Owed',
      desc: 'Total amount owed by all debtors',
      value: `R ${totalOwed.toLocaleString() || 0}`,
      svg: '<svg width="20px" stroke-width="1.5" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" stroke="#000000" stroke-width="1.5"></path><path d="M3 15H9.4C9.73137 15 10.0053 15.2783 10.1504 15.5762C10.3564 15.9991 10.8442 16.5 12 16.5C13.1558 16.5 13.6436 15.9991 13.8496 15.5762C13.9947 15.2783 14.2686 15 14.6 15H21" stroke="#000000" stroke-width="1.5"></path><path d="M3 7H21" stroke="#000000" stroke-width="1.5"></path><path d="M3 11H21" stroke="#000000" stroke-width="1.5"></path></svg>'
    },
    {
      id: 3,
      title: 'Total Agents',
      desc: 'Total number of active agents',
      value: counts?.agents || 0,
      svg: '<svg width="20px" height="20px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M2 20V19C2 15.134 5.13401 12 9 12V12" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.8038 12.3135C16.4456 11.6088 17.5544 11.6088 18.1962 12.3135V12.3135C18.5206 12.6697 18.9868 12.8628 19.468 12.8403V12.8403C20.4201 12.7958 21.2042 13.5799 21.1597 14.532V14.532C21.1372 15.0132 21.3303 15.4794 21.6865 15.8038V15.8038C22.3912 16.4456 22.3912 17.5544 21.6865 18.1962V18.1962C21.3303 18.5206 21.1372 18.9868 21.1597 19.468V19.468C21.2042 20.4201 20.4201 21.2042 19.468 21.1597V21.1597C18.9868 21.1372 18.5206 21.3303 18.1962 21.6865V21.6865C17.5544 22.3912 16.4456 22.3912 15.8038 21.6865V21.6865C15.4794 21.3303 15.0132 21.1372 14.532 21.1597V21.1597C13.5799 21.2042 12.7958 20.4201 12.8403 19.468V19.468C12.8628 18.9868 12.6697 18.5206 12.3135 18.1962V18.1962C11.6088 17.5544 11.6088 16.4456 12.3135 15.8038V15.8038C12.6697 15.4794 12.8628 15.0132 12.8403 14.532V14.532C12.7958 13.5799 13.5799 12.7958 14.532 12.8403V12.8403C15.0132 12.8628 15.4794 12.6697 15.8038 12.3135V12.3135Z" stroke="#000000" stroke-width="1.5"></path><path d="M15.3636 17L16.4546 18.0909L18.6364 15.9091" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9 12C11.2091 12 13 10.2091 13 8C13 5.79086 11.2091 4 9 4C6.79086 4 5 5.79086 5 8C5 10.2091 6.79086 12 9 12Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
    },
    {
      id: 4,
      title: 'Total Debtors',
      desc: 'Total number of active debtors',
      value: counts?.debtors || 0,
      svg: '<svg width="20px" height="20px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M1 20V19C1 15.134 4.13401 12 8 12V12C11.866 12 15 15.134 15 19V20" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path><path d="M13 14V14C13 11.2386 15.2386 9 18 9V9C20.7614 9 23 11.2386 23 14V14.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path><path d="M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18 9C19.6569 9 21 7.65685 21 6C21 4.34315 19.6569 3 18 3C16.3431 3 15 4.34315 15 6C15 7.65685 16.3431 9 18 9Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
    }
  ]

  


  const chartData = [
    { name: 'Debts', value: counts?.debts || 0 },
    { name: 'Owed', value: totalOwed || 0 },
    { name: 'Agents', value: counts?.agents || 0 },
    { name: 'Debtors', value: counts?.debtors || 0 },
  ] 

  useEffect(() => {
    dispatch(fetchData())
  }, [dispatch])
  


  return (
    <div className="p-5 space-y-6">

      {/* HEADER */}
      <div>
        <p className="text-sm text-gray-500">
          Key system metrics and performance snapshot
        </p>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4">

        {overviews.map((item) => (
          <div
            key={item.id}
            className="border border-gray-100 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >

            <div className="flex justify-between items-start">

              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-400 mb-2">
                  {item.desc}
                </p>

                <p className="text-2xl font-bold text-gray-900">
                  {item.value.toLocaleString()}
                </p>
              </div>

              <div className="p-3 rounded-full bg-gray-50">
                <span dangerouslySetInnerHTML={{ __html: item.svg }} />
              </div>

            </div>

          </div>
        ))}

      </div>

      {/* CHART SECTION */}
      <div className="w-full  gap-4">

        <div className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm">

          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Debt Overview
          </h2>

          <p className="text-sm text-gray-500 mb-4">
            Total debt distribution and movement trends
          </p>

          <AreaChart
            style={{ width: '100%',  maxHeight: '30vh', aspectRatio: 1.618 }}
            responsive
            data={chartData}
            margin={{
              top: 20,
              right: 0,
              left: 0,
              bottom: 0,
            }}
            onContextMenu={(_, e) => e.preventDefault()}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" niceTicks="snap125" />
            <YAxis width="auto" niceTicks="snap125" />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#007a0a" fill="#458d42" />

          </AreaChart>

        </div>

      </div>

    </div>
  )
}

export default AdminOverview