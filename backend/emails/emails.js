import { transporter } from "./transport.js"
import { agentWelcomeEmail } from "./templates.js"

export const sendWelcomeEmail = async (fullName, email, accessId, password) => {
   try {
      const html = agentWelcomeEmail(fullName, accessId, password)

      await transporter.sendMail({
         from: `Debt Hero <${process.env.EMAIL_USER}>`,
         to: email,
         subject: "Welcome to the team",
         html
      })

   } catch (err) {
      console.error("Email failed:", err.message)
   }
}