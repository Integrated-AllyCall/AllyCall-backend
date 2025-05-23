import express from "express";
import * as legalController from "../controllers/legalController.js";

const legalRoute = express.Router();

legalRoute.get("/", legalController.getLegal);
legalRoute.get("/here", legalController.getLegalByCoordinates);

export default legalRoute;
