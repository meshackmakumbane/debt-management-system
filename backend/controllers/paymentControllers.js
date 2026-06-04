import { User } from '../models/user.js'
import { Debt } from "../models/debt.js"
import { Installment } from "../models/installment.js"
import { Notification } from '../models/notification.js'
import { Payment }  from '../models/payment.js'

/* MAKE PAYMENT + UPDATE DEBT --------------------------------------------------*/
export const makePaymentController = async (
  req,
  res,
  next
) => {
  const { id } = req.params
  const { amount, method = 'eft' } = req.body

  try {

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount'
      })
    }

    // FIND DEBT
    const debt = await Debt.findOne({
      _id: id,
      isActive: true
    })

    if (!debt) {
      return res.status(404).json({
        success: false,
        message: 'Debt not found'
      })
    }

    // FIND DEBTOR
    const debtor = await User.findById(
      debt.debtorInfo.debtor
    )

    if (!debtor) {
      return res.status(404).json({
        success: false,
        message:
          'Debtor connected to this debt not found'
      })
    }

    // VALIDATE PAYMENT
    if (amount > debt.balance) {
      return res.status(400).json({
        success: false,
        message:
          'Payment exceeds remaining balance'
      })
    }

    // GENERATE TRANSACTION
    const transactionNumber =
      `PAY-${Date.now()}`

    // CREATE PAYMENT
    const payment =
      await Payment.create({
        debt: debt._id,
        debtor: debtor._id,

        agent:
          debt.agent.agentId,

        refNumber:
          debt.debtorInfo.refNumber,

        amount,

        method,

        status:
          'completed',

        transactionNumber,

        paidAt:
          new Date()
      })

    // UPDATE DEBT
    debt.amountPaid += amount

    debt.balance -= amount

    // UPDATE STATUS
    if (debt.balance <= 0) {
      debt.balance = 0
      debt.status = 'paid'
    }

    else {
      debt.status = 'partial'
    }

    // ADD HISTORY SNAPSHOT
    debt.paymentHistory.push({
      paymentId:
        payment._id,

      amount,

      method,

      transactionNumber,

      paidAt:
        payment.paidAt
    })

    await debt.save()

    // NOTIFY ADMIN
    const admin =
      await User.findOne({
        role: 'admin',
        isActive: true
      })

    if (admin) {
      await Notification.create({
        recipient:
          admin._id,

        type:
          'payment_made',

        message:
          `${debtor.name} paid R${amount}`,

        relatedDebtor:
          debtor._id,

        metadata: {
          debtId:
            debt._id,

          paymentId:
            payment._id,

          transactionNumber
        }
      })
    }

    res.status(200).json({
      success: true,

      message:
        'Payment successful',

      payment,

      debtSummary: {
        amount:
          debt.amount,

        amountPaid:
          debt.amountPaid,

        balance:
          debt.balance,

        status:
          debt.status
      }
    })

  } catch (error) {
    next(error)
  }
}

/* CREATE INSTALLMENT PLAN --------------------------------------------------*/
export const createInstallmentController = async (
  req,
  res,
  next
) => {
  const {
    debtId,
    installmentAmount,
    frequency,
    totalInstallments,
    startDate,
    nextDueDate,
    notes,
  } = req.body

  try {
    // VALIDATION
    if (
      !debtId ||
      !installmentAmount ||
      !frequency ||
      !totalInstallments ||
      !nextDueDate
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      })
    }

    // FIND DEBT
    const debt = await Debt.findById(debtId)

    if (!debt) {
      return res.status(404).json({
        success: false,
        message: 'Debt not found',
      })
    }

    // GET DEBTOR FROM DEBT
    const debtorId = debt.debtorInfo.debtor

    const debtor = await User.findById(debtorId)

    if (!debtor) {
      return res.status(404).json({
        success: false,
        message: 'Debtor not found',
      })
    }

    // PREVENT DUPLICATE ACTIVE INSTALLMENT
    const existing = await Installment.findOne({
      debt: debtId,
      status: 'active',
    })

    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          'Active installment plan already exists for this debt',
      })
    }

    // CALCULATIONS
    const remainingBalance = debt.balance

    const installmentsLeft =
      totalInstallments

    const endDate = new Date(nextDueDate)
    endDate.setMonth(endDate.getMonth() + totalInstallments)

    // CREATE INSTALLMENT
    const installment =
      await Installment.create({
        debt: debt._id,
        debtor: debtor._id,
        createdBy: req.user._id,

        originalBalance: debt.amount,
        installmentAmount,
        frequency,
        totalInstallments,

        installmentsPaid: 0,
        amountPaid: 0,
        remainingBalance,

        startDate:
          startDate || Date.now(),

        nextDueDate,

        endDate,

        status: 'active',
        notes,
      })

    // UPDATE DEBT STATUS
    debt.status = 'partial'
    await debt.save()

    res.status(201).json({
      success: true,
      message:
        'Installment plan created successfully',
      installment,
    })
  } catch (error) {
    next(error)
  }
}