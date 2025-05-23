import express from "express";
import * as videoController from "../controllers/videoController.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const videoRoute = express.Router();

videoRoute.get("/", videoController.getVideo);
videoRoute.post("/", upload.single("video"), videoController.uploadVideo);
videoRoute.put("/", videoController.updateVideo);

export default videoRoute;
