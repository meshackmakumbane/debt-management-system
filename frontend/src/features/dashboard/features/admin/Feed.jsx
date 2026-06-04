import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import Button from '../../components/UI/Button'
import api from '../../../../api/axios'
import PageLoader from '../../../../components/UI/PageLoader'

const Feed = () => {
  const [tickets, setTickets] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    const fetchTickets = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/ticket/tickets')
        setTickets(data.tickets)
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Error fetching tickets')
      } finally{
        setLoading(false)
      }
    }
    fetchTickets()
  },[])

  if (!tickets && loading) return <PageLoader />

  return (
    <>
      <Button />
      <section className='md:flex items-start justify-start gap-4 px-4 pt-5'>
        <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm p-5">

          {/* HEADER */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Activity Feed
            </h3>
            <p className="text-sm text-gray-500">
              All the interactions 
            </p>
          </div>

          {/* LIST */}
          <div className="space-y-2">

            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <Link to={`/account/ticket/${ticket._id}`}>
                  <div
                    key={ticket._id}
                    className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-50 transition border border-transparent hover:border-gray-100"
                  >

                    {/* LEFT SIDE */}
                    <div className="space-y-1">

                      <p className="text-xl font-medium text-gray-900">
                        {ticket.ticketNumber}
                      </p>

                      <p className="text-sm font-medium text-gray-900">
                        {ticket.submittedBy.name} • 
                      </p>

                      <p className="text-xs text-gray-500">
                        Priority {ticket.priority}
                      </p>

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="text-right space-y-1">

                      <p className="text-sm font-semibold text-gray-900">
                        {ticket.subject}
                      </p>

                      <span
                        className={`inline-flex px-3 py-1 text-xs rounded-full font-medium ${
                          ticket.status === 'open'
                            ? 'bg-green-50 text-green-700'
                            : ticket.status === 'In Progress'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {ticket.status}
                      </span>

                    </div>

                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">
                No activity yet!
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  )
}

export default Feed
