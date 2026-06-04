import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { fetchDebts, selectDebts } from '../../service/debtSlice'
import { fetchDebtors, selectDebtors } from '../../service/debtorSlice'

const Overview = () => {
  /* ---- SLICE ---- */
  const { status, errorMessage } = useSelector(state => state.debt)
  const debts = useSelector(selectDebts)
  const debtors = useSelector(selectDebtors)
  const dispatch = useDispatch()

  const totalAmount = useMemo(()=>{
    return debts?.reduce((sum, debt)=>{
      return sum + debt.balance
       },0)
  },[debts])

  const totalCollected = useMemo(()=>{
    return debts?.reduce((sum, debt)=>{
      return sum + debt.amountPaid
    },0)
  },[debts])

  const agentData = [
    {
      id:1,
      title: "Total debts",
      desc: 'Total number of active debts',
      value: debts?.length || 0,
      svg: '<svg width="20px" stroke-width="1.5" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" stroke="#000000" stroke-width="1.5"></path><path d="M3 15H9.4C9.73137 15 10.0053 15.2783 10.1504 15.5762C10.3564 15.9991 10.8442 16.5 12 16.5C13.1558 16.5 13.6436 15.9991 13.8496 15.5762C13.9947 15.2783 14.2686 15 14.6 15H21" stroke="#000000" stroke-width="1.5"></path><path d="M3 7H21" stroke="#000000" stroke-width="1.5"></path><path d="M3 11H21" stroke="#000000" stroke-width="1.5"></path></svg>',
      backColor: 'bg-gray-100'
    },
    {
      id:2,
      title: "Total debtors",
      desc: 'Total number of active debtors assigned to you',
      value: debtors?.length || 0,
      svg: '<svg width="20px" height="20px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M1 20V19C1 15.134 4.13401 12 8 12V12C11.866 12 15 15.134 15 19V20" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path><path d="M13 14V14C13 11.2386 15.2386 9 18 9V9C20.7614 9 23 11.2386 23 14V14.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path><path d="M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18 9C19.6569 9 21 7.65685 21 6C21 4.34315 19.6569 3 18 3C16.3431 3 15 4.34315 15 6C15 7.65685 16.3431 9 18 9Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
      backColor: 'bg-gray-100'
    },
    {
      id:3,
      title: "Total Amount",
      desc: 'Total owed by all debtors assigned to you',
      value: totalAmount || 0,
      svg: '<svg width="20px" height="20px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M11 9L22 9" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2 11L4.80662 7.84255C5.5657 6.98859 6.65372 6.5 7.79627 6.5L8 6.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2 19.5003L7.5 19.5L11.5 16.5003C11.5 16.5003 12.3091 15.9528 13.5 15.0001C16 13.0002 13.5 9.83352 11 11.4997C8.96409 12.8565 7 14.0003 7 14.0003" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 13.5V7C8 5.89543 8.89543 5 10 5H20C21.1046 5 22 5.89543 22 7V13C22 14.1046 21.1046 15 20 15H13.5" stroke="#000000" stroke-width="1.5"></path></svg>',
      backColor: 'bg-gray-100'
    },
    {
      id:4,
      title: "Total Collected",
      desc: 'Total collected from all debtors assigned to you',
      value: totalCollected || 0,
      svg: '<svg width="20px" height="20px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M11 9L22 9" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2 11L4.80662 7.84255C5.5657 6.98859 6.65372 6.5 7.79627 6.5L8 6.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2 19.5003L7.5 19.5L11.5 16.5003C11.5 16.5003 12.3091 15.9528 13.5 15.0001C16 13.0002 13.5 9.83352 11 11.4997C8.96409 12.8565 7 14.0003 7 14.0003" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 13.5V7C8 5.89543 8.89543 5 10 5H20C21.1046 5 22 5.89543 22 7V13C22 14.1046 21.1046 15 20 15H13.5" stroke="#000000" stroke-width="1.5"></path></svg>',
      backColor: 'bg-gray-100'
    }
  ]

  const chartData = [
    { name: 'Debts', value: debts?.length || 0 },
    { name: 'Owed', value: totalAmount || 0 },
    { name: 'Debtors', value: debtors?.length || 0 },
    { name: 'Collected', value: totalCollected || 0 },
  ] 

  useEffect(()=>{
    dispatch(fetchDebts())
    dispatch(fetchDebtors())
  },[dispatch])

  return (
    <div className='px-4 py-2 '>
      <div>
        <h2 className='text-xl font-bold text-gray-900 mb-4'>Overview</h2>
      </div>

      <div className='grid grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-1 gap-4'>
        {agentData.map((item) => (
          <div key={item.id} className={`border border-gray-100 p-2 rounded-lg flex justify-between items-center  cursor-pointer transition duration-300 ease-in-out shadow-sm`}>
              <div>
                <h3 className='text-md text-gray-900 font-bold'>{item.title}</h3>
                <p className='text-sm text-gray-500'>{item.desc}</p>
                <p className='text-[20px] font-bold'>{item.value.toLocaleString()}</p>
              </div>
              <span className={`${item.backColor} p-2 rounded-full`}>
                <span dangerouslySetInnerHTML={{ __html: item.svg }} />
              </span>
          </div>
        ))}
      </div>

      {/* CHART SECTION */}
      <div className="w-full  gap-4 mt-4">

        <div className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm">

          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Overview
          </h2>

          <p className="text-sm text-gray-500 mb-4">
            Your debts distribution and movement trends
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

export default Overview
