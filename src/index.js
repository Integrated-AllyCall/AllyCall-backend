import express from "express";
import cors from "cors";
import reportRoute from "./routes/reportRoutes.js";
import userRoute from "./routes/userRoutes.js";
import legalRoute from "./routes/legalRoutes.js";
import videoRoute from "./routes/videoRoutes.js";

const app = express();
const port = 3000;

await ensureBucket();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/report", reportRoute);
app.use("/api/legal", legalRoute);
app.use("/api/video", videoRoute);


app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
