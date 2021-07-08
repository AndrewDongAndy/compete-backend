import { Platform } from "./platforms";

export interface User {
  username: string;
  bojId: string;
}

// change this to metadata?
export type ProblemMetadata = {
  id: string;
  title: string;
  platform: Platform;
  difficulty: number;
  // numSolved: number;
  // numSubs: number;
  // fractionSolved: number;
};

export type ProblemForUser = {
  problem: ProblemMetadata;
  forUser: string; // username
  solved: boolean;
};

export interface FullProblem extends ProblemMetadata {
  statementHtml: string; // use base64 encoding for compression?
  inputSpecHtml: string;
  outputSpecHtml: string;
  // TODO: figure out what happens if one of these sections doesn't exist
  // in the acmicpc.net problem statement, e.g. return an empty string?
}
