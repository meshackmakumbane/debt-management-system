import React, {useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { formatDistanceToNow, format } from 'date-fns'

import Button from '../../components/UI/Button'
import api from '../../../../api/axios'

const Ticket = () => {
  const { id } = useParams()
  const [tickets, setTickets] = useState([])
  const [conversation, setConversation] = useState([])

  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  const [message, setMessage] = useState('')
  const ticket = tickets?.find(item => item._id === id)

  const sendMessage = async()=>{
    setSending(true)
    try{
      const { data } = await api.patch(`/ticket/tickets/${id}/reply`, { message }) 
      setConversation(prev =>(
        [...prev, data.message]
      ))
      setMessage('')

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);

    }catch(err){
      setErrorMessage(err.response?.data?.message || "Error sending message")
    }finally{
      setSending(false)
    }
  }

  useEffect(()=>{
    const fetchTickets = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/ticket/tickets')
        setTickets(data.tickets)

        const selectedTicket = data.tickets.find(item => item._id === id)

        if(selectedTicket){
          setConversation(selectedTicket.messages)
        }else{
          setConversation([])
        }

      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Error fetching tickets')
      } finally{
        setLoading(false)
      }
    }
    fetchTickets()
  },[message])

  const messagesEndRef = useRef(null);

  return(
    <>
      <Button />
      <section className='md:flex items-start justify-start gap-4 px-4 pt-5'>
        <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          {/* HEADER */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {ticket?.ticketNumber}
            </h3>
            <p className="text-sm text-gray-500">
              Submitted by: {ticket?.submittedBy?.name}
            </p>

            <span
              className={`inline-flex px-4 py-2 text-xs rounded-full font-medium ${
                ticket?.status === 'open'
                  ? 'bg-green-50 text-green-700'
                  : ticket?.status === 'In Progress'
                  ? 'bg-yellow-50 text-yellow-700'
                  : 'bg-gray-50 text-gray-700'
              }`}
            >
              {ticket?.status}
            </span>
          </div>

          <div className="h-[22rem] max-h-[22rem] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4">
            <div className="space-y-4">
              {ticket?.messages?.map((message) => {
                const isAgent = message.role === "agent";

                return (
                  <div
                    key={message._id}
                    className={`flex ${isAgent ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-[75%]">
                      
                      {/* Header */}
                      <div
                        className={`mb-1 flex items-center gap-2 text-xs text-gray-500
                        ${isAgent ? "justify-end" : "justify-start"}
                        `}
                      >
                        <span className="font-medium text-gray-700">
                          {message?.sender?.name}
                        </span>

                        <span>•</span>

                        <span>
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {/* Bubble */}
                      <div
                        className={`
                          rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm
                          ${
                            isAgent
                              ? `
                                bg-green-600 text-white 
                                rounded-br-md
                              `
                              : `
                                border border-gray-200 
                                bg-gray-50 text-gray-800
                                rounded-bl-md
                              `
                          }
                        `}
                      >
                        {message.message}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* SEND MESSAGE */}
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-2 py-2 shadow-sm">

            <input
              type="text"
              name="message"
              disabled={sending}
              value={message}
              onChange={(e)=> setMessage(e.target.value)}
              placeholder={sending ? "Sending message..." : "Type your reply..."}
              className="
                flex-1 bg-transparent px-3 py-2 text-sm text-gray-700
                placeholder:text-gray-400
                outline-none disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />

            <button
              onClick={sendMessage}
              disabled={sending}
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl bg-green-600 text-white
                transition-all duration-200
                hover:bg-green-700
                active:scale-95
                disabled:cursor-not-allowed
                disabled:opacity-70
              "
            >
              {sending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                >
                  <path
                    d="M22 2L11 13"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 2L15 22L11 13L2 9L22 2Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Ticket
