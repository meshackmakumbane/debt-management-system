import mongoose from 'mongoose'

const messageItemSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ['debtor', 'chatbot', 'agent'],
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    intent: {
      type: String,
      enum: [
        'greeting',
        'profile_lookup',
        'balance_lookup',
        'payment_history',
        'payment_options',
        'support',
        'unknown',
      ],
      default: 'unknown',
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
)

const messageSchema = new mongoose.Schema(
  {
    // conversation owner
    debtor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // optional linked debt
    debt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Debt',
      default: null,
    },

    // conversation state
    currentIntent: {
      type: String,
      enum: [
        'greeting',
        'profile_lookup',
        'balance_lookup',
        'payment_history',
        'payment_options',
        'support',
        'unknown',
      ],
      default: null,
    },

    currentStep: {
      type: String,
      enum: [
        'idle',
        'awaiting_identity',
        'awaiting_confirmation',
        'verified',
        'processing',
        'completed',
      ],
      default: 'idle',
    },

    // identity verification
    verification: {
      verified: {
        type: Boolean,
        default: false,
      },

      verifiedAt: {
        type: Date,
        default: null,
      },

      referenceNumber: {
        type: String,
        default: null,
      },
    },

    // full conversation
    messages: {
      type: [messageItemSchema],
      default: [],
    },

    // human handoff
    escalatedToAgent: {
      type: Boolean,
      default: false,
    },

    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // chat lifecycle
    status: {
      type: String,
      enum: [
        'active',
        'closed',
        'escalated',
      ],
      default: 'active',
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    closedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// one active conversation per debtor
messageSchema.index(
  {
    debtor: 1,
    status: 1,
  },
  {
    partialFilterExpression: {
      status: 'active',
    },
  }
)

export const Message = mongoose.model(
  'Message',
  messageSchema
)