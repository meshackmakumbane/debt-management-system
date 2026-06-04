import React, { useState } from 'react'
import api from '../../../api/api'

const Notifications = ({
  notifications,
  isOpen,
  setNotifications
}) => {

  const [errorMessage, setErrorMessage] = useState('')
  const [activeId, setActiveId] = useState(null)

  const markAsRead = async (id) => {

    setActiveId(id)

    try {

      await api.post(`/notification/notifications/${id}`)

      setNotifications(prev =>
        prev.map(notification =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      )

    } catch (err) {

      setErrorMessage(
        err.response?.data?.message ||
        'Error reading notification'
      )

    } finally {

      setActiveId(null)

    }
  }

  return (
    <section
      className={`
        absolute right-4 top-17 z-100
        h-[32rem] max-h-[32rem] w-[24rem] lg:w-[28rem]
        max-sm:right-0
        overflow-hidden rounded-2xl
        border border-gray-200 bg-white
        shadow-[0_10px_40px_rgba(0,0,0,0.08)]
        ${isOpen ? 'block' : 'hidden'}
      `}
    >

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Notifications
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Stay updated with activity
          </p>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-xs font-semibold text-gray-700">
          {notifications.length || 0}
        </div>

      </div>

      {/* BODY */}
      <div className="h-[calc(32rem-73px)] overflow-y-auto p-2">

        {errorMessage && (
          <div className="mb-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
            {errorMessage}
          </div>
        )}

        {notifications.length > 0 ? (

          <div className="space-y-2">

            {notifications?.map((notification) => (

              <div
                key={notification._id}
                className={`
                  rounded-2xl border p-4 transition-all duration-200
                  hover:bg-gray-50
                  ${
                    notification.read === false
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
                            notification.read === false
                              ? "bg-green-600"
                              : "bg-gray-300"
                          }
                        `}
                      />

                      <span
                        className={`
                          text-xs font-medium
                          ${
                            notification.read === false
                              ? "text-green-700"
                              : "text-gray-500"
                          }
                        `}
                      >
                        {notification.read === false
                          ? "New"
                          : "Read"
                        }
                      </span>

                    </div>

                    {/* MESSAGE */}
                    <p className="text-sm leading-relaxed text-gray-800">
                      {notification.message}
                    </p>

                    {/* DATE */}
                    <p className="mt-3 text-xs text-gray-400">
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>
                </div>

                {/* ACTION */}
                {notification.read === false && (

                  <button
                    onClick={() =>
                      markAsRead(notification._id)
                    }
                    disabled={activeId === notification._id}
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

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-6 w-6 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0018 9.75v-.7V9A6 6 0 006 9v.05-.001v.7a8.967 8.967 0 00-2.312 6.022c1.733.64 3.56 1.08 5.454 1.31m5.715 0a24.255 24.255 0 01-5.715 0m5.715 0a3 3 0 11-5.715 0"
                />
              </svg>

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
    </section>
  )
}

export default Notifications