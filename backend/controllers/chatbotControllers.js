import { Message } from '../models/message.js'

/* ----------------------------- CHATBOT CONTROLLER  -----------------------------*/
/* Detect Intent -------------------------------------------------- */

const detectIntent = (text = '') => {
   const msg = text.toLowerCase()

   if (msg.includes('hi') || msg.includes('hello')) return 'greeting'
   if (msg.includes('profile')) return 'profile_lookup'
   if (msg.includes('balance')) return 'balance_lookup'
   if (msg.includes('payment')) return 'payment_options'

   return 'unknown'
}
/* Chatbox -------------------------------------------------- */
export const chatMessageController = async (req, res, next) => {
  try {
    const debtorId = req.user._id
    const { message } = req.body

   let session = await Message.findOne({
      debtor: debtorId,
      status: 'active',
   }) 

     
   /* CREATE SESSION IF NONE EXISTS --------------------------------------- */

    if (!session) {
        session = await Message.create({
          debtor: debtorId,
          messages: [],
          currentStep: 'idle',
        })
    }

    /* SAVE USER MESSAGE --------------------------------------- */

    const intent = detectIntent(message)

    session.messages.push({
        sender: 'debtor',
        message,
        intent,
    })

    session.lastMessageAt = new Date()

    /* BOT LOGIC --------------------------------------- */
    let botReply = ''

    /* 1. GREETING LOGIC --------------------------------------- */
    if (intent === 'greeting') {
        session.currentIntent = 'greeting'
        session.currentStep = 'idle'

        botReply =
          'Hello 👋 I can help you check your profile, balance, or payment options. What do you need?'
    }

    /* 2. PROFILE LOOKUP FLOW --------------------------------------- */
      else if (intent === 'profile_lookup') {
         session.currentIntent = 'profile_lookup'
         session.currentStep = 'awaiting_identity'

         botReply =
            'Please enter your Reference Number or ID Number to continue.'
      }

    /* 3. HANDLE ID / REFERENCE INPUT --------------------------------------- */
      else if (session.currentStep === 'awaiting_identity') {
         const debtor = await User.findOne({
            $or: [
               { referenceNumber: message },
               { idNumber: message },
            ],
         })

         if (!debtor) {
            botReply =
               "I couldn't find your account. Please check your details and try again."
         } else {
            session.verification = {
               verified: true,
               verifiedAt: new Date(),
               referenceNumber: message,
            }

            session.currentStep = 'verified'

            botReply = `Profile Found 👇
            Name: ${debtor.fullName}
            Status: ${debtor.status}
            Balance: R${debtor.balance || 0}`
          }
      }  

    /* 4. BALANCE LOOKUP (ONLY IF VERIFIED) HANDLE ID / REFERENCE INPUT --------------------------------------- */
      else if (intent === 'balance_lookup') {
         if (!session.verification?.verified) {
            session.currentStep = 'awaiting_identity'

            botReply =
               'Please provide your Reference Number or ID Number first.'
         } else {
            const debtor = await User.findById(debtorId)

            botReply = `Your current balance is R${debtor.balance || 0}`
         }
      } 

    /* 5. FALLBACK --------------------------------------- */
      else {
         botReply =
            "Sorry, I didn't understand that. Try asking for your profile, balance, or payment options."
      }

     /* SAVE BOT MESSAGE --------------------------------------- */ 
      session.messages.push({
         sender: 'chatbot',
         message: botReply,
         intent: session.currentIntent,
      })

      await session.save()

      return res.status(200).json({
         success: true,
         reply: botReply,
         session,
      })
  } catch (error) {
    next(error)
  }
}