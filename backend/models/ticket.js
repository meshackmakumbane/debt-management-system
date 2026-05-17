import mongoose from 'mongoose'

const ticketSchema = mongoose.Schema({
  ticketNumber:{
    type: String,
    required: true
  },
  submittedBy:{
    agentId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
    },
    fullName:String,
    email:String,
    phoneNumber:String
  },
  subject:String,
  priority:{
    type:String,
    enum:['low', 'medium', "high"],
    default: 'Low'
  },
  clientAccountId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  description:{
    type: String
  },
  status:{ 
    type:String,
    enum:['open', 'close', 'In Progress'],
    default: "open"
  },
  attachments:{
    type: String
  },
  assignedTo:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  messages:[
    {
      sender:{
        userId:{
          type: mongoose.Schema.Types.ObjectId,
          ref:"User"
        },
        name:{
          type: String,
          required: true
        },
        role:{ 
          type:String,
          required: true
        }
      },
      message:String,
      createdAt: Date
    }
  ]
},{timestamps:true})

export const Ticket = new mongoose.model("Ticket", ticketSchema)