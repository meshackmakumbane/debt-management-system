import { Interaction } from '../models/Interaction.js'


/* ----------------------- INTERACTION CONTROLLER(ROLE-BASED) ----------------------*/

/* RECORD INTERACTION -------------------------------------------*/
export const recordInteractions = async (
   req,
   res,
   next
) => {
   const userId = req.user._id
   const { id } = req.params

   try {
      const {
         method,
         notes,
         outcome,
         interactionType,
         durationMinutes,
         promisedAmount,
         promisedPaymentDate,
         nextActionDate,
         debt,
         sentiment,
      } = req.body

      const [agent, debtor] =
         await Promise.all([
            User.findById(userId),
            User.findById(id),
         ])

      if (!agent) {
         return res.status(404).json({
            success: false,
            message: 'Agent not found',
         })
      }

      if (!debtor) {
         return res.status(404).json({
            success: false,
            message: 'Debtor not found',
         })
      }

      const interaction =
         await Interaction.create({
            relatedDebtor: debtor._id,
            agent: agent._id,
            debt,

            method,
            notes,
            outcome,

            interactionType,
            durationMinutes,
            promisedAmount,
            promisedPaymentDate,
            nextActionDate,
            sentiment,

            status: 'completed',
         })

      const admin =
         await User.findOne({
            role: 'admin',
            isActive: true,
         })

      if (admin) {
         await Notification.create({
            recipient: admin._id,
            type: 'interaction_made',
            message:
               `${agent.fullName} contacted ` +
               `${debtor.fullName} via ${method}`,

            relatedDebtor: debtor._id,
         })
      }

      res.status(201).json({
         success: true,
         interaction,
      })

   } catch (err) {
      next(err)
   }
}