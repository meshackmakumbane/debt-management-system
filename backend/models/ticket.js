import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // who created the ticket
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    subject: { 
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },

    // optional related debtor/client
    relatedDebtor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // optional related debt
    relatedDebt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Debt',
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ['open', 'in progress', 'resolved', 'closed'],
      default: 'open',
    },

    attachments: [
      {
        type: String, // cloudinary/file URL
      },
    ],

    assignedTo: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },

        role: {
          type: String,
          enum: ['admin', 'agent', 'debtor'],
          required: true,
        },

        message: {
          type: String,
          required: true,
          trim: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

export const Ticket = mongoose.model('Ticket', ticketSchema)