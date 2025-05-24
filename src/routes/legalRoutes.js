import express from "express";
import * as legalController from "../controllers/legalController.js";

const legalRoute = express.Router();

legalRoute.get("/", legalController.getLegal);
legalRoute.get("/here", legalController.getLegalByCoordinates);

export default legalRoute;

/**
 * @swagger
 * /api/legals/here:
 *   get:
 *     summary: Get legal guides by GPS coordinates
 *     tags: [Legal]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         description: Latitude of the user's location
 *         schema:
 *           type: number
 *           example: 13.7563
 *       - in: query
 *         name: lng
 *         required: true
 *         description: Longitude of the user's location
 *         schema:
 *           type: number
 *           example: 100.5018
 *     responses:
 *       200:
 *         description: Legal guide information for the detected country
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 name:
 *                   type: string
 *                 legal_guide:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *       400:
 *         description: Missing latitude or longitude
 *       404:
 *         description: Country not found for given coordinates
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/legals:
 *   get:
 *     summary: Get all countries and their legal guides
 *     tags: [Legal]
 *     responses:
 *       200:
 *         description: A list of countries with legal guides
 *       500:
 *         description: Internal server error
 */
