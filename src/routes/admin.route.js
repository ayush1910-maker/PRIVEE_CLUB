import express from "express"
import Joi from "joi"
import { validate } from "../utils/validate.js"
import verifyAdminJWT from "../middlewares/adminAuth.middleware.js"

import { create_category, give_category_to_user, login, register_admin } from "../controller/admin.controller.js"

const router = express.Router()

/**
 * @swagger
 * /api/v1/admin/register-admin:
 *   post:
 *     summary: Register a new admin
 *     description: Create a new admin account using name, email, and password.
 *     tags:
 *       - Admin
 *     security: []   # Public endpoint (no JWT required)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Super Admin
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Admin@123
 *     responses:
 *       200:
 *         description: Admin registered successfully
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
 *                   example: Admin registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Super Admin
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *       400:
 *         description: Admin already exists
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
 *                   example: Admin already existed
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

router.post("/register-admin" ,validate(Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(30).required()
})) , register_admin)


/**
 * @swagger
 * /api/v1/admin/login:
 *   post:
 *     summary: Admin login
 *     description: Authenticate an admin using email and password. Returns an access token and admin details.
 *     tags:
 *       - Admin
 *     security: []   # Public endpoint (no JWT required)
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
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Admin@123
 *     responses:
 *       201:
 *         description: Admin logged in successfully
 *         headers:
 *           Set-Cookie:
 *             description: Access token stored as cookie
 *             schema:
 *               type: string
 *               example: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9; HttpOnly
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
 *                   example: user LoggedIn successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     admin:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: Super Admin
 *                         email:
 *                           type: string
 *                           example: admin@example.com
 *       400:
 *         description: Invalid credentials
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
 *                   example: password invalid
 *       404:
 *         description: Admin not found
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
 *                   example: Admin not found
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

router.post("/login" , validate(Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
})) , login)


/**
 * @swagger
 * /api/v1/admin/create-category:
 *   post:
 *     summary: Create a new category
 *     description: Allows an authenticated admin to create a new category.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []   # Admin JWT required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *             properties:
 *               category:
 *                 type: string
 *                 example: Electronics
 *     responses:
 *       200:
 *         description: Category created successfully
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
 *                   example: Category created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     category:
 *                       type: string
 *                       example: Electronics
 *       400:
 *         description: Category already exists
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
 *                   example: Category already exists
 *       401:
 *         description: Unauthorized (Admin JWT missing or invalid)
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
 *                   example: Unauthorized
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

router.post("/create-category",
    verifyAdminJWT,
    validate(Joi.object({
        category: Joi.string().required()
    })),
    create_category
)

/**
 * @swagger
 * /api/v1/admin/give-category-to-user:
 *   post:
 *     summary: Assign a category to a user
 *     description: Allows an authenticated admin to assign a category to a specific user.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []   # Admin JWT required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - category_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *                 description: ID of the user to assign the category to
 *               category_id:
 *                 type: integer
 *                 example: 2
 *                 description: ID of the category to assign
 *     responses:
 *       200:
 *         description: Category assigned successfully
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
 *                   example: Category assigned to user successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     category_id:
 *                       type: integer
 *                       example: 2
 *                     id:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Invalid input or already assigned
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
 *                   example: Category already assigned to user
 *       404:
 *         description: User or category not found
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
 *                   example: User not found
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

router.post("/give-category-to-user",
    validate(Joi.object({
        user_id: Joi.number().required(),
        category_id: Joi.number().required()
    })),
    verifyAdminJWT,
    give_category_to_user
)


export default router