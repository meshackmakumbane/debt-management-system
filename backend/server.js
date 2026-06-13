import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

import errorMiddleware from './middleware/errorMiddleware.js'

/* ADMIN ROUTES -------------------------------- */
import adminRouter from './routes/adminRoutes.js'

/* USER ROUTES -------------------------------- */
import overviewRouter from './routes/overviewRoutes.js'
import analyticsRouter from './routes/analyticsRoutes.js'
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'
import ticketRouter from './routes/ticketRoutes.js'
import paymentRouter from './routes/paymentRoutes.js'
import notificationRouter from './routes/notificationRoutes.js'
import debtRouter from './routes/debtRoutes.js'
import interactionRouter from './routes/interactionRoutes.js'
import chatRouter from './routes/chatbotRoutes.js'

/* DATABASE -------------------------------- */
import connectDb from './DB/connectDB.js' 

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

/* ---------------- MIDDLEWARE ---------------- */
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'https://debthero.netlify.app/',
    credentials: true,
  })
)

app.use(express.json())
app.use(cookieParser())

/* ---------------- LOGGING (optional) ---------------- */

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

/* ---------------- ROUTE ---------------- */
app.use('/v1/api/overview', overviewRouter)
app.use('/v1/api/data', analyticsRouter)
app.use('/v1/api/admin', adminRouter)

app.use('/v1/api/auth', authRouter)
app.use('/v1/api/user', userRouter)

app.use('/v1/api/ticket', ticketRouter)

app.use('/v1/api/payment', paymentRouter)

app.use('/v1/api/notification', notificationRouter)

app.use('/v1/api/debt', debtRouter)
app.use('/v1/api/interaction', interactionRouter)

app.use('/v1/api/chat', chatRouter)


/* ---------------- GLOBAL ERROR HANDLER ---------------- */
app.use(errorMiddleware)

const startServer = async () => {
  try {
    await connectDb()

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
