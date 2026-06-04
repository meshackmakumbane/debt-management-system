import React, { useState} from 'react'

const Message = ({ messages, error, messageOpen }) => {
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)

  const sendMessage = () => {

  }
  return (
    <section
      className={`
        absolute right-5 top-17 z-100
        h-[calc(100vh-90px)] max-h-[calc(100vh-70px)] w-[24rem] lg:w-[70%]
        max-sm:right-0
        overflow-hidden rounded-2xl
        border border-gray-200 bg-white
        shadow-[0_10px_40px_rgba(0,0,0,0.08)]
        ${messageOpen ? 'block' : 'hidden'}
      `}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Active Conversation
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Get help fast!
          </p>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-xs font-semibold text-gray-700">
          {messages.length || 0}
        </div>

      </div>

      {/* BODY */}
      <div className="h-[calc(32rem-130px)] overflow-y-auto p-2">

        {error && (
          <div className="mb-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}

        {messages.length > 0 ? (

          <div className="space-y-2">

            {messages?.map((message) => (

              <div
                key={message._id}
                className={`
                  rounded-2xl border p-4 transition-all duration-200
                  hover:bg-gray-50
                  ${
                    message.read === false
                      ? "border-indigo-100 bg-indigo-50/40"
                      : "border-gray-100 bg-white"
                  }
                `}
              >

                {/* TOP */}
                <div className="flex items-start justify-between gap-3">

                  <div className="flex-1">

                    <div className="mb-2 flex items-center gap-2">

                      {/* STATUS DOT */}
                      <div
                        className={`
                          h-2 w-2 rounded-full
                          ${
                            message.read === false
                              ? "bg-green-600"
                              : "bg-gray-300"
                          }
                        `}
                      />

                      <span
                        className={`
                          text-xs font-medium
                          ${
                            message.read === false
                              ? "text-green-700"
                              : "text-gray-500"
                          }
                        `}
                      >
                        {message.read === false
                          ? "New"
                          : "Read"
                        }
                      </span>

                    </div>

                    {/* MESSAGE */}
                    <p className="text-sm leading-relaxed text-gray-800">
                      {message.text}
                    </p>

                    {/* DATE */}
                    <p className="mt-3 text-xs text-gray-400">
                      {new Date(
                        message.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>
                </div>

                {/* ACTION */}
                {message.read === false && (

                  <button
                    onClick={() =>
                      markAsRead(message._id)
                    }
                    disabled={activeId === message._id}
                    className="
                      mt-4 rounded-xl border border-gray-200
                      bg-white px-4 py-2 text-xs font-medium
                      text-gray-700 transition-all duration-200
                      hover:bg-gray-100
                      cursor-pointer
                      disabled:cursor-not-allowed
                      disabled:opacity-70
                    "
                  >

                    {activeId === notification._id
                      ? 'Updating...'
                      : 'Mark as read'
                    }

                  </button>
                )}

              </div>
            ))}
          </div>

        ) : (

          <div className="flex h-full flex-col items-center justify-center px-6 text-center">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">

               <svg width="30px" height="30px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M8 10L12 10L16 10" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 14L10 14L12 14" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>


            </div>

            <h3 className="text-sm font-semibold text-gray-800">
              You're all caught up
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              No new notifications right now.
            </p>

          </div>
        )}
      </div>
      {/* SEND MESSAGE */}
              <div className="mt-3 mx-7 flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-2 py-2 shadow-sm">
      
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
    </section>
  )
}

export default Message
