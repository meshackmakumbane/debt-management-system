import mongoose from 'mongoose'

const interactionSchema = new mongoose.Schema(
  {
    // debtor contacted
    relatedDebtor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // staff member who contacted debtor
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // optional debt account
    debt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Debt',
    },

    // channel
    method: {
      type: String,
      enum: ['sms', 'email', 'phone_call', 'whatsapp'],
      required: true,
    },

    interactionType: {
      type: String,
      enum: [
         'reminder',
         'follow_up',
         'negotiation',
         'payment_discussion',
         'promise_confirmation',
         'dispute_resolution'
      ],
      default: 'follow_up'
    },

    contactDate: {
      type: Date,
      default: Date.now,
    },

    durationMinutes: {
      type: Number,
      min: 0,
    },

    outcome: {
      type: String,
      enum: [
         'No Answer',
         'Should Call Later',
         'Spoke',
         'Wrong Number',
         'Promise To Pay',
         'Dispute',
         'Paid',
      ],
      required: true,
    },

    status: {
      type: String,
      enum: [
         'scheduled',
         'completed',
         'missed',
         'cancelled'
      ],
      default: 'completed',
    },

    notes: {
      type: String,
      required: true,
      trim: true,
    },

    promisedAmount: {
      type: Number,
      min: 0,
    },

    promisedPaymentDate: {
      type: Date,
    },

    nextActionDate: {
      type: Date,
    },

    attachmentUrl: String,

    // optional scoring
    sentiment: {
      type: String,
      enum: [
         'positive',
         'neutral',
         'negative'
      ]
    },
  },
  {
    timestamps: true,
  }
)

export const Interaction = mongoose.model(
   'Interaction',
   interactionSchema
)