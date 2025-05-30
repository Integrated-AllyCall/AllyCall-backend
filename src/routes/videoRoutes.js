import express from "express";
import * as videoController from "../controllers/videoController.js";
import multer from "multer";
// import { verifyFirebaseToken } from "../middlewares/auth.js";

const upload = multer({ dest: "uploads/" });
const videoRoute = express.Router();

videoRoute.get("/tags", videoController.getVideoTags);
videoRoute.get("/:id", videoController.getVideoById);
videoRoute.get("/user/:id", videoController.getVideoByUserId);
videoRoute.get("/", videoController.getVideo);
videoRoute.post("/", upload.fields([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
]), videoController.uploadVideo);
videoRoute.put("/:id", videoController.updateVideoDetails);
// videoRoute.post("/", verifyFirebaseToken, upload.single("video"), videoController.uploadVideo);
// videoRoute.put("/:id", verifyFirebaseToken, videoController.updateVideoDetails);

export default videoRoute;

/**
 * @swagger
 * /api/videos/{id}:
 *   get:
 *     summary: Get video by ID
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The video ID
 *     responses:
 *       200:
 *         description: The video data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 users:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *       400:
 *         description: Missing video ID
 *       404:
 *         description: Video not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/videos/tags:
 *   get:
 *     summary: Get available video tags
 *     tags: [Videos]
 *     responses:
 *       200:
 *         description: List of video tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */

/**
 * @swagger
 * /api/videos/user/{id}:
 *   get:
 *     summary: Get videos uploaded by a specific user
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *       - in: query
 *         name: num
 *         required: false
 *         schema:
 *           type: integer
 *         description: Limit the number of returned videos
 *     responses:
 *       200:
 *         description: List of videos uploaded by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   url:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   users:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *       400:
 *         description: Missing or invalid user ID
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/videos:
 *   get:
 *     summary: Get videos with optional tag and search query
 *     tags: [Videos]
 *     parameters:
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by video tag (e.g. Friend, Police, etc.)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Keyword search in title or description
 *     responses:
 *       200:
 *         description: A list of matching videos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   tag:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   video_url:
 *                     type: string
*                   thumbnail_url:
 *                     type: string
 *                   user_id:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/videos:
 *   post:
 *     summary: Upload a video
 *     tags: [Videos]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [video, tag, title, user_id]
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *               tag:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               user_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Video uploaded successfully
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Upload failed
 */

/**
 * @swagger
 * /api/videos/{id}:
 *   put:
 *     summary: Update video details by ID
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the video to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tag:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Video details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 tag:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Video not found
 *       500:
 *         description: Internal server error
 */
