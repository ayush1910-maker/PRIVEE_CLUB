import express from "express"
import Joi from "joi"
import { validate } from "../utils/validate.js"
import { saveFcmToken,  sendTestPushNotification } from "../controller/notification.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/save-fcm-token" ,verifyJWT,  saveFcmToken)

router.get("/send-test-notification" , sendTestPushNotification)

export default router