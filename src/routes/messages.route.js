import express from "express"
import Joi from "joi"
import { validate } from "../utils/validate.js"
import verifyJWT from "../middlewares/auth.middleware.js"
import {upload} from "../utils/multer.js"
import { MarkMessageAsRead, SendMessages } from "../controller/messages.controller.js"

const router = express.Router()
/**
 * @swagger
 * /api/v1/messages/sendMessage:
 *   post:
 *     tags:
 *       - Messages
 *     summary: Send a message
 *     description: >
 *       Sends a text or media message to another user.
 *       Supports file uploads (images, videos, documents).
 *       If the receiver is online, the message is emitted via socket.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - receiver_id
 *               - message_type
 *             properties:
 *               receiver_id:
 *                 type: integer
 *                 example: 2
 *               message_type:
 *                 type: string
 *                 enum: [text, image, video, file]
 *                 example: text
 *               content:
 *                 type: string
 *                 example: "Hello! How are you?"
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *           examples:
 *             textMessage:
 *               summary: Text message example
 *               value:
 *                 receiver_id: 2
 *                 message_type: text
 *                 content: "Hello! How are you?"
 *             imageMessage:
 *               summary: Image upload example
 *               value:
 *                 receiver_id: 2
 *                 message_type: image
 *                 files:
 *                   - file: "path/to/image.png"
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "message sent successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     sender_id:
 *                       type: integer
 *                       example: 1
 *                     receiver_id:
 *                       type: integer
 *                       example: 2
 *                     message_type:
 *                       type: string
 *                       example: "text"
 *                     content:
 *                       type: string
 *                       example: "Hello! How are you?"
 *                     file_name:
 *                       type: string
 *                       example: "image.png"
 *                     file_size:
 *                       type: integer
 *                       example: 204800
 *                     mime_type:
 *                       type: string
 *                       example: "image/png"
 *                     is_read:
 *                       type: boolean
 *                       example: false
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid request data"
 */

router.post("/sendMessage" , upload.array("files" , 5), validate(Joi.object({
    receiver_id: Joi.number().required(),
    content: Joi.string().allow(""), 
    message_type: Joi.string().valid("text", "file").required(),
    is_read: Joi.boolean().optional()
})) , verifyJWT ,  SendMessages)


/**
 * @swagger
 * /api/v1/messages/markMessageAsRead:
 *   post:
 *     tags:
 *       - Messages
 *     summary: Mark messages as read
 *     description: Marks all unread messages from a specific sender as read for the logged-in user and notifies the sender via socket if online.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sender_id
 *               - receiver_id
 *             properties:
 *               sender_id:
 *                 type: integer
 *                 example: 1
 *               receiver_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Message marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "message Read"
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid request data"
 */

router.post("/markMessageAsRead" ,validate(Joi.object({
    receiver_id: Joi.number().required(),
    sender_id: Joi.number().required()
})), verifyJWT , MarkMessageAsRead)

export default router