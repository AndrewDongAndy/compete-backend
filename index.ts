import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { exit } from "process";

import config from "./config";
import problemRoutes from "./routes/problemRoutes";

import dotenv from "dotenv";
import { sendReminder } from "./mailer/mailer";
dotenv.config();

const app = express();

const corsOptions = {
  origin: config.ORIGIN,
};

// middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// routes
app.use(problemRoutes);

// connect to Mongoose
mongoose.set("useFindAndModify", false); // suppress the DeprecationWarning
// TODO: remove this "hack" and make top-level await work
(async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useCreateIndex: true, // suppress the DeprecationWarning
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to MongoDB");
  } catch (err) {
    console.error("MongoDB database connection error:", err);
    exit(1);
  }
  // only start server when the database is connected
  app.listen(process.env.PORT);
  console.log("listening on port", process.env.PORT);

  // sendReminder("andon9612@ugcloud.ca");
  // sendReminder("dongandrew99@gmail.com");
})();
