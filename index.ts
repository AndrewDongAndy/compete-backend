import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { exit } from "process";

import config from "./config";

import authRoutes from "./routes/authRoutes";
import bojRecsRoutes from "./routes/boj/recsRoutes";
import cfRecsRoutes from "./routes/cf/recsRoutes";
import problemRoutes from "./routes/boj/problemRoutes";
import userRoutes from "./routes/userRoutes";

import dotenv from "dotenv";
import { fetchAllCfProblems } from "./platforms/cf/problems";
dotenv.config();

const app = express();

const corsOptions = {
  origin: config.ORIGIN,
  credentials: true,
};

// middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// routes
app.use(authRoutes);
app.use(bojRecsRoutes);
app.use(cfRecsRoutes);
app.use(problemRoutes);
app.use(userRoutes);

mongoose.set("useFindAndModify", false); // suppress the DeprecationWarning

// TODO: remove this "hack" and make top-level await work
(async () => {
  const promises: Promise<any>[] = [];

  // connect to MongoDB
  promises.push(
    mongoose.connect(process.env.DATABASE_URI, {
      useCreateIndex: true, // suppress the DeprecationWarning
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  );

  // fetch CF problems
  promises.push(fetchAllCfProblems());

  try {
    await Promise.all(promises);
  } catch (err) {
    console.error("server startup error:", err);
    exit(1);
  }

  app.listen(process.env.PORT);
  console.log("listening on port", process.env.PORT);
})();
