import { Debt } from '../models/debt.js'

/* --------------------------- DEBTOR CONTROLLERS ---------------------------*/

/* DEBTS CONTROLLER(ROLE-BASED) --------------------------------------------------*/
export const getDebtsController = async (
  req,
  res,
  next
) => {
  const userId = req.user._id
  const role = req.user.role

  try {
    let filter = {}

    if (role === 'admin') {
      filter = {}
    }

    else if (role === 'agent') { filter = { 'agent.agentId': userId, }
    }

    else if (role === 'debtor') { filter = {'debtorInfo.debtor': userId,}
    }

    else {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      })
    }

    const debts = await Debt.find(filter)
      .sort({ createdAt: -1 }).populate(['debtorId', 'agentId'])

    res.status(200).json({
      success: true,
      count: debts.length,
      debts,
    })
  } catch (error) {
    next(error)
  }
}

/* EACH DEBT --------------------------------------------------*/
export const getDebtController = async (
  req,
  res,
  next
) => {
  const { id } = req.params

  try {
    const debt = await Debt.findById(id)

    if (!debt) {
      return res.status(404).json({
        success: false,
        message: 'Debt not found',
      })
    }

    res.status(200).json({
      success: true,
      debt,
    })
  } catch (error) {
    next(error)
  }
}

/* UPDATE DEBT CONTROLLER --------------------------------------------------*/
export const updateDebtController = async (
  req,
  res,
  next
) => {
  const { id } = req.params
  const {
    amount,
    amountPaid,
    balance,
    dueDate,
    status,
    description,
  } = req.body

  try {
    const debt = await Debt.findById(id)

    if (!debt) {
      return res.status(404).json({
        success: false,
        message: 'Debt not found',
      })
    }

    if (amount !== undefined)
      debt.amount = amount

    if (amountPaid !== undefined)
      debt.amountPaid = amountPaid

    if (balance !== undefined)
      debt.balance = balance

    if (dueDate) debt.dueDate = dueDate

    if (status) debt.status = status

    if (description)
      debt.description = description

    await debt.save()

    res.status(200).json({
      success: true,
      message: 'Debt updated successfully',
      debt,
    })
  } catch (error) {
    next(error)
  }
}

/* DELETE(SOFT) DEBT CONTROLLER --------------------------------------------------*/
export const deleteDebtController = async (
  req,
  res,
  next
) => {
  const { id } = req.params

  try {
    const debt = await Debt.findById(id)

    if (!debt) {
      return res.status(404).json({
        success: false,
        message: 'Debt not found',
      })
    }

    debt.isActive = false
    await debt.save()

    res.status(200).json({
      success: true,
      message: 'Debt deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}