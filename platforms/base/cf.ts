import { ProblemMetadata } from "../../common/interfaces/problem";
import { fetchContests, getContestDivision } from "../cf/contests";
import { fetchAllCfProblems, getProblemsCf } from "../cf/problems";
import { fetchSubs } from "../cf/subs";
import { fetchUserSolves } from "../cf/user";
import { Platform } from "./Platform";

const cf: Platform = {
  name: "cf",
  displayName: "Codeforces",

  loadData: async () => {
    await fetchAllCfProblems();
    await fetchContests();
  },

  getSolvedIds: async (handle: string) => {
    try {
      const solves = await fetchUserSolves(handle);
      return solves;
    } catch (err) {
      return null;
    }
  },

  getProblems: (categoryId: number, level: number) => {
    const forCategory = getProblemsCf(categoryId);
    return forCategory.filter((p) => p.difficulty == level);
  },

  getSubs: async (cfId: string) => {
    return await fetchSubs(cfId);
  },

  levels: (userLevel: number) => {
    const res: number[] = [];
    for (let i = userLevel - 200; i <= userLevel + 200; i += 100) {
      res.push(i);
    }
    return res;
  },

  evaluateProblem: (problem: ProblemMetadata) => {
    const matches = problem.id.match(/^[0-9]+/);
    if (!matches) {
      return -100;
    }
    const contestId = matches[0];
    const d = getContestDivision(contestId);
    if (d == "1") {
      return +5;
    }
    if (d == "1 + 2") {
      return +4;
    }
    if (d == "2") {
      return +3;
    }
    return 0;
  },
};

export default cf;
