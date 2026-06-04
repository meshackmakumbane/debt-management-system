import { transporter } from "./transport.js"
import { VerificationEmail, debtorDebtAlertTemplate } from "./templates.js"

export const sendVerificationEmail = async(email, name, code) =>{
   try {
      const html = VerificationEmail(name, code)

      await transporter.sendMail({
         from: `Debt Hero <${process.env.EMAIL_USER}>`,
         to: email,
         subject: "Verification Code", 
         html
      })

   } catch (err) {
      console.error("Email failed:", err.message)
   }
}




export const sendWelcomeEmail = async (name, email, employeeId, password) => {
   try {
      const html = WelcomeEmail(name, employeeId, password)

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

export const sendInstallmentCreatedEmail = async (
  fullName, email,
  installmentAmount,
  frequency,
  totalInstallments,
  nextDueDate,
  startDate) => {
   try {
      const html = installmentCreated(fullName,
                                    installmentAmount,
                                    frequency,
                                    totalInstallments,
                                    nextDueDate,
                                    startDate)

      await transporter.sendMail({
         from: `Debt Hero <${process.env.EMAIL_USER}>`,
         to: email,
         subject: "Installment Plan",
         html
      })

   } catch (err) {
      console.error("Email failed:", err.message)
   }
}

export const sendDebtorAlert = async (
  email,
  name,
  refNumber,
  idNumber,
  amount,
  balance,
  dueDate,
  agentName,
  primaryLender,) =>{
   try {
      const html = debtorDebtAlertTemplate(
         name,
         refNumber,
         idNumber,
         amount,
         balance,
         dueDate,
         agentName,
         primaryLender,
      )

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