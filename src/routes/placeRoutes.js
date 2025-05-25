import express from "express";
import * as placeController from "../controllers/placeController.js";

const placeRoute = express.Router();

placeRoute.get("/autocomplete", placeController.getAutoComplete);
placeRoute.get("/details", placeController.getPlaceDetails);

export default placeRoute;

/**
 * @swagger
 * /api/places/autocomplete:
 *   get:
 *     summary: Get autocomplete predictions
 *     tags: [Places]
 *     parameters:
 *       - in: query
 *         name: input
 *         schema:
 *           type: string
 *         required: true
 *         description: The input text for location suggestions
 *     responses:
 *       200:
 *         description: A list of autocomplete predictions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 predictions:
 *                   type: array
 *                   items:
 *                     type: object
 *                 status:
 *                   type: string
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/places/details:
 *   get:
 *     summary: Get detailed place information
 *     tags: [Places]
 *     parameters:
 *       - in: query
 *         name: place_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Google Place ID
 *     responses:
 *       200:
 *         description: Detailed place info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                 status:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
