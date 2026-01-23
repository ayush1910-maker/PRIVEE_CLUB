import express from "express";
import Joi from "joi"
import { validate } from "../utils/validate.js"
import {upload} from "../utils/multer.js"
import verifyJWT from "../middlewares/auth.middleware.js"
import userInfoSchema from "../utils/schemas/userInfoSchemas.js"


import { choose_looking_for, forget_password, get_lookingfor_list, get_user_looking_for, hear_about, intrested_in, login, register_user, reset_password, select_gender,  upload_selfie, user_info, verify_otp } from "../controller/user.controller.js";


const router = express.Router()


/**
 * @swagger
 * /api/v1/users/register-user:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user
 *     description: Creates a new user after validating input and hashing the password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - email
 *               - mobile_number
 *               - password
 *               - confirm_password
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "Ayush"
 *               last_name:
 *                 type: string
 *                 example: "Sharma"
 *               profile_name:
 *                 type: string
 *                 example: "ayush_dev"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "ayush@gmail.com"
 *               mobile_number:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               confirm_password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */

router.post("/register-user" ,validate(Joi.object({
    first_name: Joi.string().min(3).max(30).required(),
    last_name: Joi.string().optional(),
    profile_name: Joi.string().optional(),
    email: Joi.string().email().required(),
    mobile_number: Joi.string().required(),
    password: Joi.string().min(6).required(),
    confirm_password: Joi.string().min(6).required()
})), register_user)


/**
 * @swagger
 * /api/v1/users/login-user:
 *   post:
 *     tags:
 *       - User
 *     summary: Login user
 *     description: Authenticates the user using email and password, generates an access token, and returns the user details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "ayush@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: User logged in successfully
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
 *                   example: "user LoggedIn successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         first_name:
 *                           type: string
 *                           example: "Ayush"
 *                         last_name:
 *                           type: string
 *                           example: "Sharma"
 *                         email:
 *                           type: string
 *                           example: "ayush@gmail.com"
 *                         mobile_number:
 *                           type: string
 *                           example: "9876543210"
 *       400:
 *         description: Invalid credentials or validation error
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
 *                   example: "password invalid"
 */

router.post("/login-user" ,validate(Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})) ,  login)


/**
 * @swagger
 * /api/v1/users/upload-selfie:
 *   post:
 *     tags:
 *       - User
 *     summary: Upload user selfie
 *     description: Allows an authenticated user to upload a selfie image. The image is stored on the server and linked to the user's profile.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - upload_selfie
 *             properties:
 *               upload_selfie:
 *                 type: string
 *                 format: binary
 *                 description: Selfie image file
 *     responses:
 *       200:
 *         description: Selfie uploaded successfully
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
 *                   example: "picture submitted"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     upload_selfie:
 *                       type: string
 *                       example: "public/temp/selfies/1733855543434.png"
 *       400:
 *         description: Error uploading selfie
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
 *                   example: "user not found"
 */

router.post("/upload-selfie" ,
    verifyJWT, 
    upload.single("upload_selfie"),
    upload_selfie
)


/**
 * @swagger
 * /api/v1/users/choose-gender:
 *   post:
 *     tags:
 *       - User
 *     summary: Select user gender
 *     description: Allows an authenticated user to choose their gender (male or female).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gender
 *             properties:
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *                 example: "male"
 *     responses:
 *       200:
 *         description: Gender updated successfully
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
 *                   example: "chooses male"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     gender:
 *                       type: string
 *                       example: "male"
 *       400:
 *         description: Validation or update error
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
 *                   example: "user not found"
 */

router.post("/choose-gender" ,validate(Joi.object({
    gender: Joi.string().valid("male" , "female").required()
})),verifyJWT, select_gender)


/**
 * @swagger
 * /api/v1/users/getLookingForList:
 *   get:
 *     tags:
 *       - User
 *     summary: Get list of "looking for" options
 *     description: Retrieves all available "looking for" titles.
 *     responses:
 *       200:
 *         description: List retrieved successfully
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
 *                   example: "looking for list"
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
 *       500:
 *         description: Error fetching the list
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
 *                   example: "Error fetching the list"
 */

router.get("/getLookingForList" , get_lookingfor_list)


/**
 * @swagger
 * /api/v1/users/chooseLookingFor:
 *   post:
 *     tags:
 *       - User
 *     summary: Choose "looking for" options
 *     description: Allows an authenticated user to select one or more "looking for" titles.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - looking_for
 *             properties:
 *               looking_for:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of "looking for" IDs selected by the user
 *                 example: [1, 3]
 *     responses:
 *       200:
 *         description: Response submitted successfully
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
 *                   example: "response submitted!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: integer
 *                         example: 1
 *                       looking_for_id:
 *                         type: integer
 *                         example: 3
 *       400:
 *         description: Validation or selection error
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
 *                   example: "select between given titles"
 */

router.post("/chooseLookingFor", verifyJWT , choose_looking_for)


/**
 * @swagger
 * /api/v1/users/getchoosesLookingFor:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user's selected "looking for" options
 *     description: Retrieves the "looking for" options chosen by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's selected options retrieved successfully
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
 *                       title:
 *                         type: string
 *                         example: "Friend"
 *       400:
 *         description: User not found or error fetching data
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
 *                   example: "User not found"
 */

router.get("/getchoosesLookingFor", verifyJWT , get_user_looking_for)


/**
 * @swagger
 * /api/v1/users/user-info:
 *   post:
 *     tags:
 *       - User
 *     summary: Update user profile information
 *     description: Allows an authenticated user to update their profile details including personal, physical, and lifestyle information.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: "1995-06-15"
 *               body_type:
 *                 type: string
 *                 example: "Athletic"
 *               height:
 *                 type: number
 *                 example: 175
 *               weight:
 *                 type: number
 *                 example: 70
 *               eye_color:
 *                 type: string
 *                 example: "Brown"
 *               hair_color:
 *                 type: string
 *                 example: "Black"
 *               region:
 *                 type: string
 *                 example: "North"
 *               nationality:
 *                 type: string
 *                 example: "Indian"
 *               sexual_orientation:
 *                 type: string
 *                 example: "Heterosexual"
 *               city:
 *                 type: string
 *                 example: "Mumbai"
 *               field_of_work:
 *                 type: string
 *                 example: "Software Engineer"
 *               education:
 *                 type: string
 *                 example: "Bachelor's"
 *               zodiac_sign:
 *                 type: string
 *                 example: "Gemini"
 *               relationship_status:
 *                 type: string
 *                 example: "Single"
 *               drinking:
 *                 type: string
 *                 example: "Occasionally"
 *               smoking:
 *                 type: string
 *                 example: "No"
 *               piercing:
 *                 type: boolean
 *                 example: false
 *               tattoos:
 *                 type: boolean
 *                 example: true
 *               about_your_perfect_match:
 *                 type: string
 *                 example: "Someone kind and adventurous"
 *               about_me:
 *                 type: string
 *                 example: "I love coding and traveling."
 *     responses:
 *       200:
 *         description: User information updated successfully
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
 *                   example: "user information added successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     update_user_info:
 *                       type: object
 *                       properties:
 *                         date_of_birth:
 *                           type: string
 *                           example: "1995-06-15"
 *                         body_type:
 *                           type: string
 *                           example: "Athletic"
 *                         height:
 *                           type: number
 *                           example: 175
 *                         weight:
 *                           type: number
 *                           example: 70
 *                         eye_color:
 *                           type: string
 *                           example: "Brown"
 *                         hair_color:
 *                           type: string
 *                           example: "Black"
 *                         region:
 *                           type: string
 *                           example: "North"
 *                         nationality:
 *                           type: string
 *                           example: "Indian"
 *                         sexual_orientation:
 *                           type: string
 *                           example: "Heterosexual"
 *                         city:
 *                           type: string
 *                           example: "Mumbai"
 *                         field_of_work:
 *                           type: string
 *                           example: "Software Engineer"
 *                         education:
 *                           type: string
 *                           example: "Bachelor's"
 *                         zodiac_sign:
 *                           type: string
 *                           example: "Gemini"
 *                         relationship_status:
 *                           type: string
 *                           example: "Single"
 *                         drinking:
 *                           type: string
 *                           example: "Occasionally"
 *                         smoking:
 *                           type: string
 *                           example: "No"
 *                         piercing:
 *                           type: boolean
 *                           example: false
 *                         tattoos:
 *                           type: boolean
 *                           example: true
 *                         about_your_perfect_match:
 *                           type: string
 *                           example: "Someone kind and adventurous"
 *                         about_me:
 *                           type: string
 *                           example: "I love coding and traveling."
 *       400:
 *         description: Validation or user not found error
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
 *                   example: "User Not found"
 */

router.post("/user-info" , verifyJWT ,validate(userInfoSchema),  user_info)


/**
 * @swagger
 * /api/v1/users/intrested-in:
 *   post:
 *     tags:
 *       - User
 *     summary: Update user's interests
 *     description: Allows an authenticated user to submit their favorite music, TV shows, movies, books, sports, and other interests.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - favourite_music
 *               - favourite_tv_show
 *               - favourite_movie
 *               - favourite_book
 *               - favourite_sport
 *             properties:
 *               favourite_music:
 *                 type: string
 *                 maxLength: 50
 *                 example: "Rock"
 *               favourite_tv_show:
 *                 type: string
 *                 maxLength: 50
 *                 example: "Friends"
 *               favourite_movie:
 *                 type: string
 *                 maxLength: 50
 *                 example: "Inception"
 *               favourite_book:
 *                 type: string
 *                 maxLength: 50
 *                 example: "The Alchemist"
 *               favourite_sport:
 *                 type: string
 *                 maxLength: 50
 *                 example: "Football"
 *               other:
 *                 type: string
 *                 maxLength: 50
 *                 example: "Photography"
 *     responses:
 *       200:
 *         description: Interests submitted successfully
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
 *                   example: "submitted!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     intrest_in:
 *                       type: object
 *                       properties:
 *                         favourite_music:
 *                           type: string
 *                           example: "Rock"
 *                         favourite_tv_show:
 *                           type: string
 *                           example: "Friends"
 *                         favourite_movie:
 *                           type: string
 *                           example: "Inception"
 *                         favourite_book:
 *                           type: string
 *                           example: "The Alchemist"
 *                         favourite_sport:
 *                           type: string
 *                           example: "Football"
 *                         other:
 *                           type: string
 *                           example: "Photography"
 *       400:
 *         description: Validation or user not found error
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
 *                   example: "User not found"
 */

router.post("/intrested-in" , verifyJWT ,validate(Joi.object({
    favourite_music: Joi.string().max(50).optional(),
    favourite_tv_show: Joi.string().max(50).optional(),
    favourite_movie: Joi.string().max(50).optional(),
        favourite_book: Joi.string().max(50).optional(),
    favourite_sport: Joi.string().max(50).optional(),
    other: Joi.string().max(50).optional()
})) ,intrested_in)


/**
 * @swagger
 * /api/v1/users/hear-about:
 *   post:
 *     tags:
 *       - User
 *     summary: Submit how the user heard about the app
 *     description: Allows an authenticated user to indicate how they heard about the app. Options include Google, ChatGPT/AI, Instagram, Facebook, or Tik Tok.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hear_about
 *             properties:
 *               hear_about:
 *                 type: string
 *                 enum: [Google, ChatGPT/AI, Instagram, Facebook, Tik Tok]
 *                 example: "Instagram"
 *     responses:
 *       200:
 *         description: Submitted successfully
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
 *                   example: "submitted!"
 *                 data:
 *                   type: string
 *                   example: "Instagram"
 *       400:
 *         description: Validation or user not found error
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
 *                   example: "User not found"
 */

router.post("/hear-about" , verifyJWT ,validate(Joi.object({
    hear_about: Joi.string().valid("Google","ChatGPT/AI","Instagram","Facebook", "Tik Tok").required()
})), hear_about)



/**
 * @swagger
 * /api/v1/users/forgotpassword:
 *   post:
 *     tags:
 *       - User
 *     summary: Request password reset OTP
 *     description: Generates a 6-digit OTP for password reset and sends it via email to the user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "ayush@gmail.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully
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
 *                   example: "Please check your mail"
 *       400:
 *         description: User not found or validation error
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
 *                   example: "User not found"
 */

router.post("/forgotpassword", verifyJWT, validate(Joi.object({
    email: Joi.string().email()
})), forget_password);


/**
 * @swagger
 * /api/v1/users/verify-otp:
 *   post:
 *     tags:
 *       - User
 *     summary: Verify OTP for password reset
 *     description: Verifies the 6-digit OTP sent to the user's email. If valid, the user can proceed to reset their password.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "ayush@gmail.com"
 *               otp:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
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
 *                   example: "OTP verified. You can reset your password now."
 *       400:
 *         description: User not found, invalid OTP, or OTP expired
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
 *                   example: "OTP expired"
 */

router.post("/verify-otp", verifyJWT,validate(Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().min(6).max(6).required(),
})), verify_otp);


/**
 * @swagger
 * /api/v1/users/reset-password:
 *   post:
 *     tags:
 *       - User
 *     summary: Reset user password
 *     description: Allows an authenticated user to reset their password after OTP verification or login.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirmPassword
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 30
 *                 example: "newpassword123"
 *               confirmPassword:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 30
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully
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
 *                   example: "Password reset successful"
 *       400:
 *         description: Validation error or user not found
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
 *                   example: "Passwords do not match"
 */

router.post("/reset-password", verifyJWT, validate(Joi.object({
    password: Joi.string().min(6).max(30).required(),
    confirmPassword: Joi.string().min(6).max(30).required(),
})), reset_password);


export default router