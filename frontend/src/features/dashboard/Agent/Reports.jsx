import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { fetchDebts, fetchDebtors } from './services/overviewSlice'

const Reports = () => {
  const dispatch = useDispatch()
  const { debts, debtors, loading, error } = useSelector(state=> state.agent)
  
  const totalAmount = debts?.reduce((sum, debt)=>{
    return sum + debt.balance
  },0)

  const [agentData, setAgentData] = useState([
      {
        id:1,
        title: "Total debts",
        desc: 'Total number of active debts',
        value: debts?.length || 0
      },
      {
        id:2,
        title: "Total debtors",
        desc: 'Total number of active debtors',
        value: debtors?.length || 0
      },
      {
        id:3,
        title: "Total Amount",
        desc: 'Total owed by all debtors',
        value: totalAmount || 0
      }
    ])
  
  const chartData = [
    { name: 'Debts', value: debts?.length || 0 },
    { name: 'Owed', value: totalAmount || 0 },
    { name: 'Debtors', value: debtors?.length || 0 },
  ] 

  useEffect(()=>{
      dispatch(fetchDebts())
      dispatch(fetchDebtors())
  },[dispatch])

  return (
    <div className='px-4 py-2 '>
          <div>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>Reports</h2>
          </div>
    
          <div className='grid grid-cols-3 max-md:grid-cols-3 max-sm:grid-cols-1 gap-4'>
            {agentData.map((item) => (
              <div key={item.id} className={`border border-gray-300 p-2 rounded-lg flex justify-between items-center ${item.backColor} cursor-pointer transition duration-300 ease-in-out`}>
                  <div>
                    <h3 className='text-md text-gray-900'>{item.title}</h3>
                    <p className='text-sm text-gray-500'>{item.desc}</p>
                    <p className='text-[20px] font-bold'>{item.value.toLocaleString()}</p>
                  </div>
                  <span className={`${item.backColor} p-2 rounded-full`}>
                    <span dangerouslySetInnerHTML={{ __html: item.svg }} />
                  </span>
              </div>
            ))}
          </div>
    
          <section className='flex mt-4 items-center gap-4'>
            <div className='border border-gray-300 rounded-md p-3 flex-1'>
              <ResponsiveContainer className='pt-3 -ml-10' width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
          
    </div>
  )
}


export default Reports
