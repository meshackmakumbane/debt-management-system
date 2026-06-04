import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    type: {
      type: String,
      enum: [
        'debtor_added',
        'balance_update',
        'debtor_assigned',
        'payment_made',
        'installment_plan',
        'interaction_made',
        'new_ticket',
        'system_alert',
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    relatedDebtor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    relatedDebt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Debt',
    },

    relatedPayment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    read: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

export const Notification = mongoose.model('Notification', notificationSchema) 