import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import connectDB from "./db/db";

import helloRoute from "./routes/helloRoute";
import seedRoute from "./routes/seedRoute";
import transactionsRoute from "./routes/transactionsRoute";
import statisticRoute from "./routes/statisticRoute";
import barchartRoute from "./routes/barchartRoute";
import piechartRoute from "./routes/piechartRoute";
// CONFIG
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* DATABASE */
connectDB();

/* ROUTES */
app.use("/", helloRoute)
// seeding api route
app.use("/api", seedRoute);
app.use("/api", transactionsRoute)
app.use("/api", statisticRoute)
app.use("/api", barchartRoute)
app.use("/api", piechartRoute)

/* SERVER */
const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});