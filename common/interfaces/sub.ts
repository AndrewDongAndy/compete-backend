import { PlatformName } from "./platformName";

export type Sub = {
  problemId: string; // not enough data to get Metadata
  platform: PlatformName;
  subId: string;
  forUser: string;
  verdict: "AC" | "WA" | "RTE" | "CE";
  // memory: number;
  // time: number;
};
