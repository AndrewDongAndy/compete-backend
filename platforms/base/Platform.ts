import { ProblemMetadata } from "../../common/interfaces/data";
import { PlatformName } from "../../common/interfaces/platforms";

export type Platform = {
  name: PlatformName;
  displayName: string;
  fetchProblems: () => Promise<void>;
  getSolvedIds: (handle: string) => Promise<string[] | null>;
  getProblems: (categoryId: number, level: number) => ProblemMetadata[];
  levels: (userLevel: number) => number[];
};
