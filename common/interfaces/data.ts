export interface User {
  username: string;
  bojId: string;
}

// change this to metadata?
export type ProblemMetadata = {
  id: string;
  title: string;
  tier: number;
  // numSolved: number;
  // numSubs: number;
  // fractionSolved: number;
};

export type ProblemForUser = {
  problem: ProblemMetadata;
  forUser: string;
  solved: boolean;
};

export interface FullProblem extends ProblemMetadata {
  statementHtml: string; // use base64 encoding for compression?
}
