import React, { useState, useEffect, useRef } from 'react'
import api from '../../../api/api'
import Loader from '../../../components/UI/Loader'

const Support = () => {
  /* ----- STATE ----- */
  const messages = [
      {
        id:1,
        sender:{
          name:'Meshack Makumbane',
          role:'agent'
        },
        createdAt: new Date(),
        message: 'Hello i need help.'
      },
      {
        id:2,
        sender:{
          name:'Ayanda Zulu',
          role:'admin'
        },
        createdAt: new Date(),
        message: 'What can i help you with?'
      }
    ]
  const [tickets, setTickets] = useState([messages])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [conversation, setConversation] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [sending, setSending] = useState(false)
  const [description, setDescription] = useState({
      message:''
  })
  const messagesEndRef =useRef(null)

  /* ----- OPEN A TICKET ----- */
  const [form, setForm] = useState({
    subject: '',
    priority:'',
    description:'',
    attachments:''
  })

  const handleChange = (e)=>{
    setForm({...form, [e.target.name]:e.target.value})
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/users/tickets', form)
      const message = res.data?.newTicket?.message
      setConversation(prev =>(
        [...prev, message]
      ))
      alert("Ticket created")
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching conversation")
    }
  }

  /* ----- ACTIVE CONVERSATION ----- */

  useEffect(()=>{
    const fetchTickets = async()=>{
      setLoading(true)
      try{
        const res = await api.get('/users/ticket')
        setTickets(res.data.tickets)
      }catch(err){
        setError(err.response?.data?.message || "Error fetching tickets")
      }finally{
        setLoading(false)
      }
    }
    fetchTickets()
  },[])

  const sendMessage = async()=>{
      if(!description) return alert("Message is empty")
      setSending(true)
      try{
        const { data } = await api.post(`/users/ticket/${id}`, { description }) 
        setConversation(prev =>(
          [...prev, data.message]
        ))
        setDescription({
          message:''
        })

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

  return (
    <div>
      <div>
        <h2 className='text-xl font-bold text-gray-900 mb-4'>Support</h2>
      </div>
      <section className='md:flex items-start justify-between gap-4'>

        {/* Open ticket */}
        <div className={`w-100  p-6 rounded-xl shadow  ${tickets.length > 0 ? 'bg-green-100 h-110 flex flex-col items-center justify-center' : 'bg-white h-110 max-h-110'}`}>
          {tickets?.length > 0
          ? <>
            <Loader size={20} color={'#14532d'} screen={'h-full'}/>
            <h1 className="font-bold">Conversation ongoing</h1>
            <p>Ticket open - awaiting response</p>
            </>
          : <form onSubmit={handleSubmit} className=" space-y-4">
              <p>Open New Ticket</p>
              <input type='text' name="subject" value={form.subject} placeholder="Subject" onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"/>
              <select name="priority" value={form.priority} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600">
                <option>Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                placeholder="Description"
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
              >
              </textarea>
              <input type='file' name="attachments" value={form.attachments} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"/>
              <button 
                onClick={handleSubmit}
                className=" bg-green-600 text-white rounded-lg px-3 py-2 cursor-pointer w-full disabled:bg-gray-500 disabled:cursor-not-allowed"
              >Open New Ticket
              </button>
            </form>}
        </div>

        <div className='md:flex items-start justify-start gap-4 px-4 flex-1'>
          <div className="w-full bg-white rounded-xl border border-gray-100 p-5">
            {/* HEADER */}
            <div className="mb-4">
              <h3 className={`text-lg font-semibold text-gray-900 ${tickets?.length < 0 ? 'text-center' : null}`}>
                {tickets?.length > 0 ? 'Active Conversation' : 'Open a ticket'}
              </h3>
              <p className="text-sm text-gray-500">
                {tickets?.length > 0 ? "Tickets will be marked close, if there's no response in 24 hours." : "Open a ticket to communicate any issues with admin live."}
              </p>
            </div>

            {tickets?.length > 0 
            ? <>
                <div className="h-65 max-h-65 overflow-y-auto rounded-xl border border-gray-200 bg-white p-4">
                  <div className="space-y-4">
                    {tickets?.messages?.map((message) => {
                      const isAgent = message.sender.role === "agent";

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
                                {message.sender.name}
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
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-2 py-2 shadow-sm">
                  <input
                    type="text"
                    name="message"
                    disabled={sending}
                    value={description.message}
                    onChange={(e)=> setDescription(e.target.value)}
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
                      active:scale-95 cursor-pointer
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
              </>
            : null
            } 
          </div>
        </div>

      </section> 
    </div>
  )
}

export default Support




           