import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import config from "./config";
import problemRoutes from "./routes/problems";

import dotenv from "dotenv";
dotenv.config();

const app = express();

const corsOptions = {
  origin: config.ORIGIN,
};

// middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use(problemRoutes);
