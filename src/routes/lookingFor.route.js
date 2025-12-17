import express from "express"
import Joi from "joi"
import { validate } from "../utils/validate.js"


import { addlookingForTitle, editlookingForTitle } from "../controller/lookingFor.controller.js"

const router = express.Router()


/**
 * @swagger
 * /api/v1/lookingFor/addLookingforTitle:
 *   post:
 *     tags:
 *       - LookingFor
 *     summary: Add new "looking for" titles
 *     description: Allows adding one or multiple "looking for" titles to the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required:
 *                   - title
 *                 properties:
 *                   title:
 *                     type: string
 *                     maxLength: 60
 *                     example: "Friend"
 *               - type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - title
 *                   properties:
 *                     title:
 *                       type: string
 *                       maxLength: 60
 *                       example: "Relationship"
 *     responses:
 *       200:
 *         description: Titles added successfully
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
 *                   example: "titles added successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "Friend"
 *       400:
 *         description: Validation or error
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
 *                   example: "Error message"
 */

router.post("/addLookingforTitle" , validate(Joi.object({
    title: Joi.string().max(60).required()
})), addlookingForTitle)


/**
 * @swagger
 * /api/v1/lookingFor/editlookingforTitle/{id}:
 *   patch:
 *     tags:
 *       - LookingFor
 *     summary: Edit an existing "looking for" title
 *     description: Updates the title of an existing "looking for" entry by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the "looking for" title to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 60
 *                 example: "Friendship"
 *     responses:
 *       200:
 *         description: Title updated successfully
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
 *                   example: "edited successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "Friendship"
 *       400:
 *         description: Title not found or validation error
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
 *                   example: "title not found"
 */

router.patch("/editlookingforTitle/:id" , editlookingForTitle)

export default router


