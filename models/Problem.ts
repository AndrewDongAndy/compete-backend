import mongoose, { Schema } from "mongoose";

import { Problem as ProblemData } from "../common/interfaces";

export interface IProblem extends ProblemData {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

const isValidProblemId = (id: string) => {
  return /^[1-9][0-9]{3,}$/.test(id);
};

const problemSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      validate: isValidProblemId,
    },
    title: {
      type: String,
      required: true,
    },
    numSolved: {
      type: Number,
      required: true,
      min: 0,
    },
    numSubs: {
      type: Number,
      required: true,
      min: 0,
    },
    fractionSolved: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "1d",
    },
  },
  { timestamps: true }
);

export const Problem = mongoose.model<IProblem>("Problem", problemSchema);
