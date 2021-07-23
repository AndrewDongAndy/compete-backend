import { PlatformName } from "./platformName";

export type Verdict = "AC" | "WA" | "TLE" | "MLE" | "RTE" | "CE" | "other";

export type Sub = {
  problemId: string; // not enough data to get Metadata
  platform: PlatformName;
  subId: string;
  forUser: string;
  verdict: Verdict;
  unixDate: number;
  memory: number; // in bytes
  runningTime: number; // in milliseconds
};
