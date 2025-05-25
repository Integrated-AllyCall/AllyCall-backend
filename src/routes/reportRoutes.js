import express from "express";
import * as reportController from "../controllers/reportController.js";
// import { verifyFirebaseToken } from "../middlewares/auth.js";

const reportRoute = express.Router();

reportRoute.get("/tags", reportController.getReportTags);
reportRoute.get("/", reportController.getReport);
reportRoute.get("/nearby", reportController.getNearbyReports);
reportRoute.post("/", reportController.createReport);
reportRoute.put("/:id", reportController.updateReport);
// reportRoute.post("/", verifyFirebaseToken, reportController.createReport);
// reportRoute.put("/:id", verifyFirebaseToken, reportController.updateReport);

export default reportRoute;


/**
 * @swagger
 * /api/reports/tags:
 *   get:
 *     summary: Get available report tags
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: List of report tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get all reports
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: A list of reports
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
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *                   shortAddress:
 *                     type: string
 *                   longAddress:
 *                     type: string
 *                   user_id:
 *                     type: string
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/reports/nearby:
 *   get:
 *     summary: Get reports within 40 km of user's location
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         description: User's latitude
 *         schema:
 *           type: number
 *           example: 13.7563
 *       - in: query
 *         name: lng
 *         required: true
 *         description: User's longitude
 *         schema:
 *           type: number
 *           example: 100.5018
 *     responses:
 *       200:
 *         description: A list of nearby reports
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
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *                   shortAddress:
 *                     type: string
 *                   longAddress:
 *                     type: string
 *                   user_id:
 *                     type: string
 *                   distance:
 *                     type: number
 *                     description: Distance from the user's location (in km)
 *       400:
 *         description: Latitude and longitude are required and must be numbers
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Create a new report
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tag, latitude, longitude, user_id]
 *             properties:
 *               tag:
 *                 type: string
 *               title:
 *                     type: string
 *               description:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               shortAddress:
 *                 type: string
 *               longAddress:
 *                 type: string
 *               user_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Report created successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/reports/{id}:
 *   put:
 *     summary: Update a report by ID
 *     tags: [Reports]
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
 *             required: [id]
 *             properties:
 *               tag:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               shortAddress:
 *                 type: string
 *               longAddress:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report updated successfully
 *       404:
 *         description: Report not found
 *       500:
 *         description: Server error
 */