import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchData } from './overviewSlice'

const Overview = () => {
  const dispatch = useDispatch()
  const { overviewData, status, error } = useSelector((state) => state.overview)
  const [overviews, setOverviews] = useState([
    {
      id: 1,
      title: 'Total Debts',
      desc: 'Total number of debts',
      value: overviewData ? overviewData.totalDebts : 0,
    },
    {
      id: 2,
      title: 'Total Owed',
      desc: 'Total amount owed by all debtors', 
      value: overviewData ? overviewData.totalOwed : 0,
    },
    {
      id: 3,
      title: 'Total Agents',
      desc: 'Total number of active agents',
      value: overviewData ? overviewData.totalAgents : 0,
    },
    {
      id: 4,
      title: 'Total Debtors',
      desc: 'Total number of active debtors',
      value: overviewData ? overviewData.totalDebtors : 0,
    }
  ])

  useEffect(() => {
    dispatch(fetchData())
  }, [])
  
  return (
    <div>
      <div>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Overview</h2>
      </div>
      <div className='grid  lg:grid-cols-4 md:grid-cols-2 gap-4'>
        {overviews.map((item) => (
          <div key={item.id} className={`p-4 rounded-lg flex justify-between items-center ${item.backColor} cursor-pointer  transition duration-300 ease-in-out`}>
              <div>
                <h3 className='text-xl text-gray-900'>{item.title}</h3>
                <p className='text-sm text-gray-500'>{item.desc}</p>
                <p className='text-2xl font-bold'>{item.value.toLocaleString()}</p>
              </div>
              <span className={`${item.backColor} p-2 rounded-full`}>
                <span dangerouslySetInnerHTML={{ __html: item.svg }} />
              </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Overview
