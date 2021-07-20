import { ProblemMetadata } from "../../common/interfaces/problem";
import { PlatformName } from "../../common/interfaces/platforms";
import { Sub } from "../../common/interfaces/sub";

export type Platform = {
  name: PlatformName;
  displayName: string;
  loadData: () => Promise<void>;
  calculateLevels: (handle: string) => Promise<number[]>;
  getSolvedIds: (handle: string) => Promise<string[] | null>;
  getProblems: (categoryId: number, level: number) => ProblemMetadata[];
  getSubs: (handle: string) => Promise<Sub[] | null>;
  levels: (userLevel: number) => number[];
  evaluateProblem: (problem: ProblemMetadata) => number;
};
