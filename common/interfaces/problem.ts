import { PlatformName } from "./platforms";

export type ProblemMetadata = {
  id: string;
  title: string;
  platform: PlatformName;
  difficulty: number;
  // numSolved: number;
  // numSubs: number;
  // fractionSolved: number;
};

export type ProblemForUser = {
  problem: ProblemMetadata;
  forUser: string; // Compete username
  solved: boolean;
};

export type ProblemSets = (readonly [string, ProblemForUser[]])[];

export interface FullProblem extends ProblemMetadata {
  statementHtml: string; // use base64 encoding for compression?
  inputSpecHtml: string;
  outputSpecHtml: string;
  // TODO: figure out what happens if one of these sections doesn't exist
  // in the acmicpc.net problem statement, e.g. return an empty string?
}
