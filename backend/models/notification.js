import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
   recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },

   type: {
      type: String,
      enum: ['debtor_added','balance_update', 'debtor_assigned', 'payment_made', 'installment_plan', 'interaction_made', 'new_ticket'],
      required: true
   },

   message: {
      type: String,
      required: true
   },

   relatedDebtor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   },

   metadata: {
      type: Object
   },

   read: {
      type: Boolean,
      default: false
   }

}, { timestamps: true })

export const Notification = mongoose.model("Notification", notificationSchema)