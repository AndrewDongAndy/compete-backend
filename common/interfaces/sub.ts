import { ProblemMetadata } from "./problem";

export type Sub = {
  problem: ProblemMetadata;
  subId: string;
  forUser: string;
  verdict: "AC" | "WA" | "RTE" | "CE";
  // memory: number;
  // time: number;
};
