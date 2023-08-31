import dotenv from "dotenv";
import express, { json } from "express";
import "express-async-errors";
import cors from "cors";
import cookieParser from "cookie-parser";
import pool from "./database/pool.js";
import corsOptions from "./config/corsOptions.js";
import router from "./routes/index.routes.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
app.use(json());
app.use(cors(corsOptions));
app.use(cookieParser());

await pool.query("SELECT 1 + 1;");
console.log("Succesfully connected to database");

app.use(router);
app.use(errorHandler);

const port = process.env.PORT ?? 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
