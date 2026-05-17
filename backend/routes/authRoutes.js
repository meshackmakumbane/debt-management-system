import express from 'express'
const router = express.Router()

import { protect } from '../middleware/protect.js'
import { 
        loginController, 
        logoutController, 
        profileController 
} from '../controllers/authControllers.js'

/* Login --------------------------------------------------*/
router.post("/login", loginController) 

/* Logout --------------------------------------------------*/
router.get("/logout", logoutController) 

/* Dashboard --------------------------------------------------*/
router.get("/profile", protect, profileController) 

export default router