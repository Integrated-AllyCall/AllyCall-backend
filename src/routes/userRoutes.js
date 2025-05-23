import express from "express";
import * as userController from "../controllers/userController.js";

const userRoute = express.Router();

userRoute.get("/", userController.getUser);
userRoute.post("/", userController.createUser);

export default userRoute;
