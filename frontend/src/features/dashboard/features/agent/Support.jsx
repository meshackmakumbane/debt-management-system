import React, { useState, useEffect, useRef, useMemo } from 'react'
import api from '../../../../api/axios'
import Loader from '../../../../components/UI/Loader'
import PageLoader from '../../../../components/UI/PageLoader'

const Support = () => {

  /* ---------------- STATE ---------------- */

  const [tickets, setTickets] = useState([])
  const [activeTicket, setActiveTicket] = useState(null)

  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [fetchTickets, setFetchTickets] = useState(false)

  const [error, setError] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const [message, setMessage] = useState('')

  const messagesEndRef = useRef(null)

  /* ---------------- FORM ---------------- */

  const [form, setForm] = useState({
    subject: '',
    priority: '',
    description: '',
    attachments: null,
  })

  /* ---------------- HELPERS ---------------- */

  const hasActiveTicket = useMemo(() => {
    return tickets?.length > 0
  }, [tickets])

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
      })
    }, 100)
  }

  /* ---------------- FETCH TICKETS ---------------- */

  useEffect(() => {

    const fetchTickets = async () => {
      setFetchTickets(true)

      try {
        const res = await api.get('/ticket/tickets')

        const fetchedTickets = res.data?.tickets || []
        setTickets(fetchedTickets)

        if (fetchedTickets.length > 0) {
          setActiveTicket(fetchedTickets[0])
        }

      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching tickets')
      } finally {
        setFetchTickets(false)
      }
    }

    fetchTickets()

  }, [message]) // Refetch tickets when a new message is sent to get the latest status

  /* ---------------- AUTO SCROLL ---------------- */

  useEffect(() => {
    scrollToBottom()
  }, [activeTicket])

  /* ---------------- HANDLE CHANGE ---------------- */

  const handleChange = (e) => {

    const { name, value, files } = e.target

    if (name === 'attachments') {
      setForm(prev => ({
        ...prev,
        attachments: files[0]
      }))
      return
    }

    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  /* ---------------- OPEN TICKET ---------------- */

  const handleSubmit = async (e) => {

    e.preventDefault()

    setLoading(true)
    setError(null)

    try {

      const res = await api.post('ticket/tickets', form,)

      const newTicket = res.data?.newTicket

      setTickets(prev => [newTicket, ...prev])
      setActiveTicket(newTicket)

      setForm({
        subject: '',
        priority: '',
        description: '',
        attachments: null,
      })

    } catch (err) {

      setError(err.response?.data?.message || 'Error creating ticket')

    } finally {
      setLoading(false)
    }
  }

  /* ---------------- SEND MESSAGE ---------------- */

  const sendMessage = async () => {

    if (!message.trim()) return

    if (!activeTicket?._id) return

    setSending(true)
    setErrorMessage(null)

    try {

      const { data } = await api.patch(`/ticket/tickets/${activeTicket._id}/reply`,{message}
      )

      setActiveTicket(prev => ({
        ...prev,
        messages: [...prev.messages, data.message]
      }))

      setMessage('')

      scrollToBottom()

    } catch (err) {

      setErrorMessage(
        err.response?.data?.message ||
        'Error sending message'
      )

    } finally {
      setSending(false) 
    }
  }

  /* ---------------- UI ---------------- */

 

  return (
    <div>

      <div className='mb-4'>
        <h2 className='text-xl font-bold text-gray-900'>
          Support
        </h2>
      </div>

      <section className='md:flex items-start justify-between gap-4'>

        {/* ---------------- LEFT PANEL ---------------- */}

        <div
          className={`
            w-full md:w-[400px]
            rounded-xl shadow p-6
            ${hasActiveTicket
              ? 'bg-green-50 h-[440px]'
              : 'bg-white'
            }
          `}
        >

          {hasActiveTicket ? (

            <div className='h-full flex flex-col items-center justify-center text-center'>

              <Loader
                size={20}
                color={'#14532d'}
                screen={'h-full'}
              />

              <h1 className='font-semibold text-gray-900 mt-4'>
                Conversation ongoing
              </h1>

              <p className='text-sm text-gray-500 mt-1'>
                Ticket open — awaiting support response
              </p>

            </div>

          ) : (

            <form
              onSubmit={handleSubmit}
              className='space-y-4'
            >

              <p className='font-medium text-gray-900'>
                Open New Ticket
              </p>

              <input
                type='text'
                name='subject'
                value={form.subject}
                onChange={handleChange}
                placeholder='Subject'
                required
                className='w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600'
              />

              <select
                name='priority'
                value={form.priority}
                onChange={handleChange}
                required
                className='w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600'
              >
                <option value=''>Priority</option>
                <option value='low'>Low</option>
                <option value='medium'>Medium</option>
                <option value='high'>High</option>
              </select>

              <textarea
                name='description'
                value={form.description}
                onChange={handleChange}
                placeholder='Describe your issue...'
                rows={5}
                required
                className='w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600 resize-none'
              />

              <input
                type='file'
                name='attachments'
                onChange={handleChange}
                className='w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600'
              />

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-green-600 text-white rounded-lg px-3 py-2 hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed'
              >
                {loading ? 'Creating Ticket...' : 'Open New Ticket'}
              </button>

            </form>
          )}
        </div>

        {/* ---------------- CHAT PANEL ---------------- */}

        <div className='flex-1'>

          <div className='bg-white rounded-xl border border-gray-100 p-5'>

            {/* HEADER */}

            <div className='mb-4'>

              <h3 className='text-lg font-semibold text-gray-900'>
                {hasActiveTicket
                  ? 'Active Conversation'
                  : 'Open a ticket'
                }
              </h3>

              <p className='text-sm text-gray-500'>
                {hasActiveTicket
                  ? "Tickets may close automatically after inactivity."
                  : "Open a ticket to communicate with support."
                }
              </p>

            </div>

            {/* ERRORS */}

            {error && (
              <div className='mb-3 text-sm text-red-500'>
                {error}
              </div>
            )}

            {errorMessage && (
              <div className='mb-3 text-sm text-red-500'>
                {errorMessage}
              </div>
            )}

            {/* CHAT */}

            {hasActiveTicket && activeTicket && (

              <>
                <div className='h-[350px] overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 space-y-4'>

                  {activeTicket?.messages?.map((msg) => {

                    const isAgent = msg?.role === 'agent'

                    return (
                      <div
                        key={msg._id}
                        className={`flex ${
                          isAgent
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >

                        <div className='max-w-[75%]'>

                          {/* META */}

                          <div
                            className={`
                              mb-1 flex items-center gap-2 text-xs text-gray-500
                              ${isAgent
                                ? 'justify-end'
                                : 'justify-start'
                              }
                            `}
                          >
                            <span className='font-medium text-gray-700'>
                              {msg?.sender?.name}
                            </span>

                            <span>•</span>

                            <span>
                              {new Date(
                                msg.createdAt
                              ).toLocaleString()}
                            </span>
                          </div>

                          {/* BUBBLE */}

                          <div
                            className={`
                              rounded-2xl px-4 py-3 text-sm shadow-sm
                              ${
                                isAgent
                                  ? 'bg-green-600 text-white rounded-br-md'
                                  : 'bg-gray-50 border border-gray-200 text-gray-800 rounded-bl-md'
                              }
                            `}
                          >
                            {msg.message}
                          </div>

                        </div>

                      </div>
                    )
                  })}

                  <div ref={messagesEndRef} />

                </div>

                {/* SEND MESSAGE */}

                <div className='mt-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-2 py-2 shadow-sm'>

                  <input
                    type='text'
                    disabled={sending}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      sending
                        ? 'Sending...'
                        : 'Type your message...'
                    }
                    className='flex-1 bg-transparent px-3 py-2 text-sm outline-none'
                  />

                  <button
                    onClick={sendMessage}
                    disabled={sending}
                    className='flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white hover:bg-green-700 transition active:scale-95 disabled:opacity-70'
                  >

                    {sending ? (

                      <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />

                    ) : (

                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        className='h-4 w-4'
                      >
                        <path d='M22 2L11 13' />
                        <path d='M22 2L15 22L11 13L2 9L22 2Z' />
                      </svg>

                    )}

                  </button>

                </div>
              </>
            )}

          </div>

        </div>

      </section>
    </div>
  )
}

export default Support




           