import express from "express";
import * as userController from "../controllers/userController.js";

const userRoute = express.Router();

userRoute.get("/", userController.getUser);
userRoute.get("/:id", userController.getUserById);
userRoute.get("/:id/image", userController.getUserImageById);
userRoute.post("/", userController.createUser);

export default userRoute;

/**
 * @swagger
 * /api/users/{id}/image:
 *   get:
 *     summary: Get user profile image by user ID
 *     description: Fetches and proxies the profile image of a user from their stored image URL.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *           example: clx9g1x6d0000s3b04y94jhd2
 *     responses:
 *       200:
 *         description: The proxied image
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Missing or invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User ID is required.
 *       404:
 *         description: User or image not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User or user image not found.
 *       502:
 *         description: Failed to fetch image from source
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch image. Status: 404"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   image_url:
 *                     type: string
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The user ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested user
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - username
 *               - email
 *             properties:
 *               id:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               image_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Server error
 */
