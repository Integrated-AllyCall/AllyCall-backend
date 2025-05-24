import express from "express";
import * as countryController from "../controllers/countryController.js";

const countryRoute = express.Router();

countryRoute.get("/", countryController.getAllCountries);
countryRoute.get("/with-legal", countryController.getCountriesWithLegals);

export default countryRoute

/**
 * @swagger
 * /api/countries:
 *   get:
 *     summary: Get all countries
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: List of all countries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                   name:
 *                     type: string
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/countries/with-legal:
 *   get:
 *     summary: Get countries that have legal guides
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: List of countries with legal guides
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                   name:
 *                     type: string
 *       500:
 *         description: Server error
 */
