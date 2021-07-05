export interface User {
  username: string;
  bojId: string;
}

export type Problem = {
  id: string;
  title: string;
  tier: number;
  // numSolved: number;
  // numSubs: number;
  // fractionSolved: number;
};

export type ProblemForUser = {
  problem: Problem;
  forUser: string;
  solved: boolean;
};
