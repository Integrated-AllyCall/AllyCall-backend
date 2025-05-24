import express from "express";
import cors from "cors";
import reportRoute from "./routes/reportRoutes.js";
import userRoute from "./routes/userRoutes.js";
import legalRoute from "./routes/legalRoutes.js";
import videoRoute from "./routes/videoRoutes.js";
import { ensureBucket } from "./configs/minio.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./configs/swagger.js";
import countryRoute from "./routes/countryRoutes.js";
import { logger } from "./middlewares/logger.js";

const app = express();
const port = 3000;

await ensureBucket();

app.use(logger);
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/users", userRoute);
app.use("/api/reports", reportRoute);
app.use("/api/countries", countryRoute);
app.use("/api/legals", legalRoute);
app.use("/api/videos", videoRoute);


app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
