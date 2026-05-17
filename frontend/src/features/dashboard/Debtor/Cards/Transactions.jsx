import React from 'react'

const Transactions = ({ payments }) => {
  return (
    <div className='items-start justify-start gap-4 px-4 pt-5 w-full'>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Transactions
        </h3>
        <p className="text-sm text-gray-500">
          Payment history and settlement activity
        </p>
      </div>

      <div className="space-y-2">

        {payments?.length > 0 ? (
          payments?.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-50 transition border border-transparent hover:border-gray-100"
            >

              {/* LEFT SIDE */}
              <div className="space-y-1">

                <p className="text-sm font-medium text-gray-900">
                  {transaction.relatedDebtor} • {transaction.refNumber}
                </p>

                <p className="text-xs text-gray-500">
                  {new Date(transaction.paidAt).toLocaleDateString()}
                </p>

              </div>

              {/* RIGHT SIDE */}
              <div className="text-right space-y-1">

                <p className="text-sm font-semibold text-gray-900">
                  R {Number(transaction.amount).toLocaleString()}
                </p>

                <span
                  className={`inline-flex px-3 py-1 text-xs rounded-full font-medium ${
                    transaction.status === 'paid'
                      ? 'bg-green-50 text-green-700'
                      : transaction.status === 'pending'
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {transaction.status}
                </span>

              </div>

            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400 text-sm">
            No transactions found
          </div>
        )}

      </div>

    </div>
  )
}

export default Transactions
