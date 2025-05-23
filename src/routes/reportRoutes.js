import express from "express";
import * as reportController from "../controllers/reportController.js";

const reportRoute = express.Router();

reportRoute.get("/", reportController.getReport);
reportRoute.post("/", reportController.createReport);
reportRoute.put("/", reportController.updateReport);

export default reportRoute;
