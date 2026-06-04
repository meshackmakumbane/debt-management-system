import mongoose from 'mongoose'

const installmentSchema = new mongoose.Schema(
  {
    // linked debt
    debt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Debt',
      required: true,
    },

    // debtor on arrangement
    debtor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // agent/admin who created arrangement
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // original debt amount at arrangement creation
    originalBalance: {
      type: Number,
      required: true,
      min: 0,
    },

    installmentAmount: {
      type: Number,
      required: true,
      min: 1,
    },

    frequency: {
      type: String,
      enum: ['weekly', 'monthly'],
      default: 'monthly',
      required: true,
    },

    totalInstallments: {
      type: Number,
      required: true,
    },

    installmentsPaid: {
      type: Number,
      default: 0,
    },

    amountPaid: {
      type: Number,
      default: 0,
    },

    remainingBalance: {
      type: Number,
      required: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    nextDueDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ['active', 'completed', 'defaulted', 'cancelled'],
      default: 'active',
    },

    notes: {
      type: String,
    },
  },
  { timestamps: true }
)

export const Installment = mongoose.model(
  'Installment',
  installmentSchema
)