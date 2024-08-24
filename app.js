import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import userRouter from "./routes/user.routes.js";
import { errorMiddleware } from "./utils/errorMiddleware.js";

// Routes declaration
app.use("/api/v1/user", userRouter);
app.use(errorMiddleware);
export { app };
