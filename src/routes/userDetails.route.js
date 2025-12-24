import express from "express"
import Joi from "joi"
import { validate } from "../utils/validate.js"
import { AddRatingsTitles, blockUser, getNewApplicants, getNewestBeautifulMembers, getPopularMembers, getReadyToInteract, getShoutOut, getUploadedPhotos, getUploadedPrivatePhotos, getUserRatings, giveRating, HomeScreen, reportUser, unBlockUser } from "../controller/userDetails.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js"


const router = express.Router()


/**
 * @swagger
 * /api/v1/userDetails/getShoutOut:
 *   get:
 *     tags:
 *       - User Details
 *     summary: Get all shoutouts
 *     description: Deletes shoutouts older than 24 hours and fetches all recent shoutouts along with user info.
 *     responses:
 *       200:
 *         description: Shoutouts fetched successfully
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
 *                   example: "all shoutouts fetched"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       content:
 *                         type: string
 *                         example: "Hello!"
 *                       usersshoutout:
 *                         type: object
 *                         properties:
 *                           profile_name:
 *                             type: string
 *                             example: "ayush_dev"
 *                           upload_selfie:
 *                             type: string
 *                             example: "/uploads/abc.jpg"
 */

router.get("/getShoutOut" , getShoutOut)


/**
 * @swagger
 * /api/v1/userDetails/homeScreen:
 *   get:
 *     summary: Home screen data
 *     description: Fetches categorized user lists for the home screen
 *     tags:
 *       - Home
 *     responses:
 *       200:
 *         description: Home screen data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     newestBeautifulMembers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           first_name:
 *                             type: string
 *                             example: Ayush
 *                           last_name:
 *                             type: string
 *                             example: Sharma
 *                           date_of_birth:
 *                             type: string
 *                             format: date
 *                             example: "1999-08-15"
 *                           upload_selfie:
 *                             type: string
 *                             example: "https://example.com/selfie.jpg"
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-01-01T10:30:00Z"
 *
 *                     newApplicants:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 2
 *                           first_name:
 *                             type: string
 *                           last_name:
 *                             type: string
 *                           date_of_birth:
 *                             type: string
 *                           upload_selfie:
 *                             type: string
 *                           created_at:
 *                             type: string
 *
 *                     popularMembers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           first_name:
 *                             type: string
 *                           last_name:
 *                             type: string
 *                           date_of_birth:
 *                             type: string
 *                           upload_selfie:
 *                             type: string
 *                           created_at:
 *                             type: string
 *
 *                     readyToInteract:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           first_name:
 *                             type: string
 *                           last_name:
 *                             type: string
 *                           date_of_birth:
 *                             type: string
 *                           upload_selfie:
 *                             type: string
 *
 *       500:
 *         description: Server error
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
 *                   example: Internal server error
 */

router.get("/homeScreen", HomeScreen);


/**
 * @swagger
 * /api/v1/userDetails/NewestBeautifulMembers:
 *   get:
 *     summary: Get newest beautiful members
 *     description: Fetch all users who belong to the "newest beautiful members" category, ordered by newest first.
 *     tags:
 *       - Home
 *     responses:
 *       200:
 *         description: Newest beautiful members fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       first_name:
 *                         type: string
 *                         example: Ayush
 *                       last_name:
 *                         type: string
 *                         example: Sharma
 *                       date_of_birth:
 *                         type: string
 *                         format: date
 *                         example: 1998-05-20
 *                       upload_selfie:
 *                         type: string
 *                         example: uploads/selfie123.jpg
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-12-10T10:30:00Z
 *       500:
 *         description: Server error
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
 *                   example: Internal server error
 */

router.get("/NewestBeautifulMembers" , getNewestBeautifulMembers)

/**
 * @swagger
 * /api/v1/userDetails/NewApplicants:
 *   get:
 *     summary: Get new applicants
 *     description: Fetch the latest users who belong to the "new applicants" category.
 *     tags:
 *       - Home
 *     responses:
 *       200:
 *         description: New applicants fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       first_name:
 *                         type: string
 *                         example: Ayush
 *                       last_name:
 *                         type: string
 *                         example: Sharma
 *                       date_of_birth:
 *                         type: string
 *                         format: date
 *                         example: 1999-08-15
 *                       upload_selfie:
 *                         type: string
 *                         example: uploads/selfie456.jpg
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-12-12T09:45:00Z
 *       500:
 *         description: Server error
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
 *                   example: Internal server error
 */

router.get("NewApplicants" , getNewApplicants)


/**
 * @swagger
 * /api/v1/userDetails/PopularMembers:
 *   get:
 *     summary: Get popular members
 *     description: Fetch users who belong to the "popular member" category.
 *     tags:
 *       - Home
 *     responses:
 *       200:
 *         description: Popular members fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       first_name:
 *                         type: string
 *                         example: Ayush
 *                       last_name:
 *                         type: string
 *                         example: Sharma
 *                       date_of_birth:
 *                         type: string
 *                         format: date
 *                         example: 1997-03-10
 *                       upload_selfie:
 *                         type: string
 *                         example: uploads/selfie789.jpg
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-12-05T14:20:00Z
 *       500:
 *         description: Server error
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
 *                   example: Internal server error
 */

router.get("/PopularMembers" , getPopularMembers)


/**
 * @swagger
 * /api/v1/userDetails/ReadyToInteract:
 *   get:
 *     summary: Get ready to interact users
 *     description: Fetch users who belong to the "ready to interact" category.
 *     tags:
 *       - Home
 *     responses:
 *       200:
 *         description: Ready to interact users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       first_name:
 *                         type: string
 *                         example: Ayush
 *                       last_name:
 *                         type: string
 *                         example: Sharma
 *                       date_of_birth:
 *                         type: string
 *                         format: date
 *                         example: 1998-04-15
 *                       upload_selfie:
 *                         type: string
 *                         example: uploads/selfie123.jpg
 *       500:
 *         description: Server error
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
 *                   example: Internal server error
 */

router.get("/ReadyToInteract" , getReadyToInteract)


/**
 * @swagger
 * /api/v1/userDetails/addRatingTitles:
 *   post:
 *     tags:
 *       - User Details
 *     summary: Add rating titles
 *     description: Adds new rating titles (single or array)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required:
 *                   - title
 *                   - score
 *                 properties:
 *                   title:
 *                     type: string
 *                     maxLength: 10
 *                     example: "Friendly"
 *                   score:
 *                     type: number
 *                     example: 5
 *               - type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - title
 *                     - score
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Friendly"
 *                     score:
 *                       type: number
 *                       example: 5
 *     responses:
 *       200:
 *         description: Rating titles added successfully
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
 *                   example: "Rating Titles added successfully"
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
 *                         example: "Friendly"
 *                       score:
 *                         type: number
 *                         example: 5
 */

router.post("/addRatingTitles" , validate(Joi.object({
    title: Joi.string().max(10).required(),
    score: Joi.number().required()
})) ,AddRatingsTitles)


/**
 * @swagger
 * /api/v1/userDetails/giverating:
 *   post:
 *     tags:
 *       - User Details
 *     summary: Give rating to a user
 *     description: Allows an authenticated user to rate another user within 48 hours of their account creation.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - target_user_id
 *               - rating_titles_id
 *               - rating
 *             properties:
 *               target_user_id:
 *                 type: number
 *                 example: 2
 *               rating_titles_id:
 *                 type: number
 *                 example: 1
 *               rating:
 *                 type: number
 *                 example: 5
 *     responses:
 *       200:
 *         description: Rating saved successfully
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
 *                   example: "Rating saved successfully"
 *                 rating_score:
 *                   type: number
 *                   example: 10
 *                 rating_count:
 *                   type: number
 *                   example: 2
 */

router.post("/giverating" , validate(Joi.object({
    user_id: Joi.number(),
    target_user_id: Joi.number().required(),
    rating_titles_id: Joi.number().required(),
    rating: Joi.number().required()
})),  verifyJWT , giveRating)


/**
 * @swagger
 * /api/v1/userDetails/getUserRatings/{user_id}:
 *   get:
 *     tags:
 *       - User Details
 *     summary: Get ratings for a user
 *     description: Fetches all ratings given to a specific user.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to get ratings for
 *     responses:
 *       200:
 *         description: User ratings fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 ratings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rating_titles_id:
 *                         type: integer
 *                         example: 1
 *                       rating:
 *                         type: number
 *                         example: 5
 *                       rater:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 3
 *                           name:
 *                             type: string
 *                             example: "Ayush"
 */

router.get("/getUserRatings/:user_id" , getUserRatings)


/**
 * @swagger
 * /api/v1/userDetails/report:
 *   post:
 *     tags:
 *       - User Details
 *     summary: Report a user
 *     description: Allows a logged-in user to report another user for a specific reason. A user cannot report themselves or report the same user twice.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - target_user_id
 *               - reason
 *             properties:
 *               target_user_id:
 *                 type: integer
 *                 example: 2
 *               reason:
 *                 type: string
 *                 example: "Inappropriate behavior"
 *     responses:
 *       200:
 *         description: Report created successfully
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
 *                   example: "Reported Successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     target_user_id:
 *                       type: integer
 *                       example: 2
 *                     reason:
 *                       type: string
 *                       example: "Inappropriate behavior"
 */

router.post("/report" , validate(Joi.object({
    user_id: Joi.number(),
    target_user_id: Joi.number().required(),
    reason: Joi.string().required()
})), verifyJWT , reportUser)


/**
 * @swagger
 * /api/v1/userDetails/block:
 *   post:
 *     tags:
 *       - User Details
 *     summary: Block a user
 *     description: Allows a logged-in user to block another user. Cannot block a user twice.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - blocked_user_id
 *             properties:
 *               blocked_user_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: User blocked successfully
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
 *                   example: "User blocked successfully"
 */

router.post("/block" , verifyJWT , blockUser)

/**
 * @swagger
 * /api/v1/userBlocking/unblockUser:
 *   post:
 *     tags:
 *       - User Details
 *     summary: Unblock a user
 *     description: Allows a logged-in user to unblock a previously blocked user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - blocked_user_id
 *             properties:
 *               blocked_user_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: User unblocked successfully
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
 *                   example: "User Unblocked successfully"
 *       400:
 *         description: User was not blocked or request invalid
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
 *                   example: "User was not blocked"
 */

router.post("/unblockUser" ,verifyJWT, unBlockUser)


/**
 * @swagger
 * /api/v1/userDetails/getUploadedPhotos:
 *   get:
 *     tags:
 *       - User Details
 *     summary: Get user's uploaded photos
 *     description: Fetches all photos uploaded by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Photos fetched successfully
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
 *                   example: "photos fetched!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       photo_url:
 *                         type: string
 *                         example: "/uploads/photo1.jpg"
 *                       created_at:
 *                         type: string
 *                         example: "2025-12-10T07:00:00.000Z"
 */

router.get("/getUploadedPhotos" , verifyJWT , getUploadedPhotos)


/**
 * @swagger
 * /api/v1/userDetails/getUploadedPrivatePhotos:
 *   get:
 *     tags:
 *       - User Details
 *     summary: Get user's private photos
 *     description: Fetches all private photos associated with the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Private photos fetched successfully
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
 *                   example: "fetched PrivatePhotos"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       photo_url:
 *                         type: string
 *                         example: "/uploads/private1.jpg"
 *                       created_at:
 *                         type: string
 *                         example: "2025-12-10T07:00:00.000Z"
 */

router.get("/getUploadedPrivatePhotos" , verifyJWT , getUploadedPrivatePhotos)

export default router