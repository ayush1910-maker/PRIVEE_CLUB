import express from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { validate } from "../utils/validate.js"
import Joi from "joi";
import edituserInfoSchema from "../utils/schemas/editUserInfoSchemas.js";


import { editAboutMe,  editLookingFor,  editPerfectMatch, editUserInfo, getAccountDetail, getUserDetail, giveShoutOut, UploadPhotos, UploadPrivatePhotos } from "../controller/editProfile.controller.js";
import { upload } from "../utils/multer.js";

const router = express.Router()


/**
 * @swagger
 * /api/v1/editProfile/getUserDetail:
 *   get:
 *     tags:
 *       - Edit Profile
 *     summary: Get full user details
 *     description: Fetches the authenticated user's details excluding sensitive information like password and OTP.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details fetched successfully
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
 *                   example: "User details fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     first_name:
 *                       type: string
 *                       example: "Ayush"
 *                     last_name:
 *                       type: string
 *                       example: "Sharma"
 *                     profile_name:
 *                       type: string
 *                       example: "ayush_dev"
 *                     email:
 *                       type: string
 *                       example: "ayush@gmail.com"
 *                     mobile_number:
 *                       type: string
 *                       example: "9876543210"
 *                     gender:
 *                       type: string
 *                       example: "male"
 *                     about_me:
 *                       type: string
 *                       example: "I love coding and music."
 */

router.get("/getUserDetail" ,verifyJWT , getUserDetail)


/**
 * @swagger
 * /api/v1/editProfile/getAccountDetail:
 *   get:
 *     tags:
 *       - Edit Profile
 *     summary: Get basic account information
 *     description: Fetches account-related details like name, email, mobile number, date of birth, and gender.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account details fetched successfully
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
 *                   example: "Account Detail Fetched!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     first_name:
 *                       type: string
 *                       example: "Ayush"
 *                     last_name:
 *                       type: string
 *                       example: "Sharma"
 *                     profile_name:
 *                       type: string
 *                       example: "ayush_dev"
 *                     email:
 *                       type: string
 *                       example: "ayush@gmail.com"
 *                     mobile_number:
 *                       type: string
 *                       example: "9876543210"
 *                     date_of_birth:
 *                       type: string
 *                       example: "1995-05-12"
 *                     gender:
 *                       type: string
 *                       example: "male"
 */

router.get("/getAccountDetail" , verifyJWT , getAccountDetail)



/**
 * @swagger
 * /api/v1/editProfile/editAboutMe:
 *   patch:
 *     tags:
 *       - Edit Profile
 *     summary: Edit "About Me" section
 *     description: Allows the authenticated user to update their "About Me" information.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - about_me
 *             properties:
 *               about_me:
 *                 type: string
 *                 maxLength: 150
 *                 example: "I love coding, hiking, and music."
 *     responses:
 *       200:
 *         description: About Me updated successfully
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
 *                   example: "About edited!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     about_me:
 *                       type: string
 *                       example: "I love coding, hiking, and music."
 */

router.patch("/editAboutMe" , verifyJWT ,validate(Joi.object({
    about_me: Joi.string().required().max(150)
})), editAboutMe)


/**
 * @swagger
 * /api/v1/editProfile/editPerfectMatch:
 *   patch:
 *     tags:
 *       - Edit Profile
 *     summary: Edit "About Your Perfect Match"
 *     description: Allows the authenticated user to update their "About Your Perfect Match" description.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - about_your_perfect_match
 *             properties:
 *               about_your_perfect_match:
 *                 type: string
 *                 maxLength: 50
 *                 example: "Someone kind, funny, and adventurous"
 *     responses:
 *       200:
 *         description: Perfect match information updated successfully
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
 *                   example: "perfect match edited"
 *                 data:
 *                   type: object
 *                   properties:
 *                     about_your_perfect_match:
 *                       type: string
 *                       example: "Someone kind, funny, and adventurous"
 */

router.patch("/editPerfectMatch" , verifyJWT ,validate(Joi.object({
    about_your_perfect_match: Joi.string().required().max(50)
})) ,editPerfectMatch)



/**
 * @swagger
 * /api/v1/editProfile/editUserInfo:
 *   put:
 *     tags:
 *       - Edit Profile
 *     summary: Edit user information
 *     description: Update multiple user profile fields such as height, weight, body type, hair color, eye color, and preferences.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               height:
 *                 type: number
 *                 example: 175
 *               weight:
 *                 type: number
 *                 example: 70
 *               body_type:
 *                 type: string
 *                 example: "Athletic"
 *               hair_color:
 *                 type: string
 *                 example: "Black"
 *               eye_color:
 *                 type: string
 *                 example: "Brown"
 *               nationality:
 *                 type: string
 *                 example: "Indian"
 *               region:
 *                 type: string
 *                 example: "North"
 *               city:
 *                 type: string
 *                 example: "Delhi"
 *               sexual_orientation:
 *                 type: string
 *                 example: "Heterosexual"
 *               education:
 *                 type: string
 *                 example: "Bachelor's"
 *               feild_of_work:
 *                 type: string
 *                 example: "Software Engineer"
 *               relationship_status:
 *                 type: string
 *                 example: "Single"
 *               zodiac_sign:
 *                 type: string
 *                 example: "Gemini"
 *               smoking:
 *                 type: string
 *                 example: "No"
 *               drinking:
 *                 type: string
 *                 example: "Occasionally"
 *               tattoos:
 *                 type: string
 *                 example: "None"
 *               piericing:
 *                 type: string
 *                 example: "Ears"
 *               favourite_music:
 *                 type: string
 *                 example: "Rock"
 *               favourite_tv_show:
 *                 type: string
 *                 example: "Friends"
 *               favourite_movie:
 *                 type: string
 *                 example: "Inception"
 *               favourite_book:
 *                 type: string
 *                 example: "Harry Potter"
 *               favourite_sport:
 *                 type: string
 *                 example: "Cricket"
 *     responses:
 *       200:
 *         description: User info updated successfully
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
 *                   example: "saved"
 *                 updated_info:
 *                   type: object
 */

router.put("/editUserInfo" , verifyJWT ,validate(edituserInfoSchema) ,editUserInfo)


/**
 * @swagger
 * /api/v1/editProfile/addphotos:
 *   post:
 *     tags:
 *       - Edit Profile
 *     summary: Upload public photos
 *     description: Upload one or multiple photos for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               UploadPhotos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Photos uploaded successfully
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
 *                   example: "photos added successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: integer
 *                       photo_url:
 *                         type: string
 */

router.post("/addphotos" , verifyJWT ,upload.array("UploadPhotos") ,  UploadPhotos)


/**
 * @swagger
 * /api/v1/editProfile/addprivatephotos:
 *   post:
 *     tags:
 *       - Edit Profile
 *     summary: Upload private photos
 *     description: Upload one or multiple private photos for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               UploadPrivatePhotos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Private photos uploaded successfully
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
 *                   example: "Private Photos uploaded successfully!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: integer
 *                       photo_url:
 *                         type: string
 */

router.post("/addprivatephotos" , verifyJWT , upload.array("UploadPrivatePhotos") , UploadPrivatePhotos)


/**
 * @swagger
 * /api/v1/editProfile/edituserlookingfor:
 *   put:
 *     tags:
 *       - Edit Profile
 *     summary: Edit user's "Looking For" preferences
 *     description: Update the authenticated user's "looking for" preferences by merging new selections with existing ones.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               looking_for:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Preferences updated successfully
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
 *                   example: "edited successfully!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: integer
 *                       looking_for_id:
 *                         type: integer
 */

router.put("/edituserlookingfor" , verifyJWT , editLookingFor)


/**
 * @swagger
 * /api/v1/editProfile/post_shoutOut:
 *   post:
 *     tags:
 *       - Edit Profile
 *     summary: Post a shoutout
 *     description: Allows the user to post a shoutout with optional image.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               shout_out:
 *                 type: string
 *                 maxLength: 140
 *                 example: "Hello everyone!"
 *               PostImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: ShoutOut posted successfully
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
 *                   example: "ShoutOut Posted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     user_id:
 *                       type: integer
 *                     shout_out:
 *                       type: string
 *                     shout_out_image:
 *                       type: string
 */

router.post("/post_shoutOut" , verifyJWT , upload.single("PostImage") , validate(Joi.object({
    user_id: Joi.number(),
    shout_out: Joi.string().max(140).required(),
    shout_out_image: Joi.string()
})), giveShoutOut)

export default router