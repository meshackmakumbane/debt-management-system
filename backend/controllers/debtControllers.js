import { Debt } from '../models/debt.js'

/* --------------------------- DEBTOR CONTROLLERS ---------------------------*/

/* DEBTS CONTROLLER(ROLE-BASED) --------------------------------------------------*/
export const getDebtsController = async (req, res, next) => {
  try {
    const { _id: userId, role } = req.user

    let query = {}

    if (role === 'debtor') {
      query = { debtorId: userId }
    } else if (role === 'agent') {
      query = { agentId: userId }
    } else if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      })
    }

    const debts = await Debt.find(query)
      .sort({ createdAt: -1 })
      .populate('debtorId', 'firstName lastName email')
      .populate('agentId', 'firstName lastName email')

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