import mongoose from 'mongoose'

const interactionSchema = mongoose.Schema({
  relatedDebtor:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  agent:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  method:{
    type: String,
    enum:['sms', 'email', 'phone_call']
  },
  date:{
    type: Date,
    required: true
  },
  outcome:{
    type:String,
    enum:['No Answer','Should call later','Spoke', 'Wrong Number'],
    required: true
  },
  notes:{
    type:String,
    required: true
  }
},{timestamps:true})

export const Interaction = new mongoose.model('Interaction', interactionSchema)