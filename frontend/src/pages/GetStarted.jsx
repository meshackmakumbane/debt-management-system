import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const GetStarted = () => {

  const techStack = ['Nodejs', 'Express', 'MongoDB', 'JWT Auth', 'Rest API', 'React', 'Tailwind CSS', 'Redux']
  const sections = [
      {
         id:1,
         title: "Admin",
         desc: "Oversee the entire operation with full visibility. Manage agents, monitor debtor activity, track performance, and generate reports to keep everything running efficiently.",
         link: "/auth/admin"
      },
      {
         id:2,
         title: 'Agents',
         desc: 'Stay organized and productive with access to assigned accounts. Track payments, update balances, log interactions, and follow ups.',
         link:"/auth/agent"
      },
      {
         id:3,
         title:'Clients',
         desc:'Easily view your debt details, monitor your payment history, and follow a clear repayment plan. Stay informed and in control every step of the way.',
         link:"/auth/debtor"
      }
  ]
  
  return (
    <>
      <section className=" text-center py-10 px-6">
          <h2 className="text-4xl font-bold mb-4">
            Manage Debt. Recover Faster.
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            A Debt Management system for admins, agents, and clients to track, manage, and settle debts—efficiently.
          </p>
      </section>

      <section className="grid md:grid-cols-3 gap-6 px-8 pb-20 lg:px-10">

          {sections.map(item =>(
            <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
                <button className='bg-black p-2 rounded-md text-white mt-2 px-5 hover:bg-gray-800 cursor-pointer'><Link to={item.link}>Explore</Link></button>
            </div>
          ))}

      </section>

      <section className="text-center px-8 pb-20">
          <h3 className="text-sm text-gray-500 mb-6 uppercase tracking-wide">
            Built with modern technology
          </h3>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
            {techStack.map(item =>(
                <span key={item} className="bg-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 hover:cursor-pointer">{item}</span>
            ))}
          </div>
      </section>
    </>
  )
}

export default GetStarted
