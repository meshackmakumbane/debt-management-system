import { Debt } from '../models/debt.js'

/* DEBT ANALYTICS --------------------------------------------------*/
export const getDebtAnalyticsController = async ( req, res, next ) => {
  const userId = req.user._id
  const role = req.user.role

  try {
    let match = {}

    // ROLE-BASED SCOPING
    if (role === 'admin') {
      match = {}
    }

    else if (role === 'agent') {
      match = {
        'agent.agentId': userId,
      }
    }

    else if (role === 'debtor') {
      match = {
        'debtorInfo.debtor': userId,
      }
    }

    else {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      })
    }

    // AGGREGATION PIPELINE
    const stats = await Debt.aggregate([
      { $match: match },

      {
        $group: {
          _id: null,

          totalDebt: {
            $sum: '$amount',
          },

          totalPaid: {
            $sum: '$amountPaid',
          },

          totalBalance: {
            $sum: '$balance',
          },

          totalDebts: {
            $sum: 1,
          },

          overdueCount: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'overdue'] },
                1,
                0,
              ],
            },
          },

          paidCount: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'paid'] },
                1,
                0,
              ],
            },
          },

          partialCount: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'partial'] },
                1,
                0,
              ],
            },
          },

          pendingCount: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'pending'] },
                1,
                0,
              ],
            },
          },
        },
      },
    ])

    const result =
      stats.length > 0
        ? stats[0]
        : {
            totalDebt: 0,
            totalPaid: 0,
            totalBalance: 0,
            totalDebts: 0,
            overdueCount: 0,
            paidCount: 0,
            partialCount: 0,
            pendingCount: 0,
          }

    res.status(200).json({
      success: true,
      analytics: result,
    })
  } catch (error) {
    next(error)
  }
}