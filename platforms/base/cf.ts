import CATEGORIES from "../../categories/categories";
import { ProblemMetadata } from "../../common/interfaces/problem";
import { fetchContests, getContestDivision } from "../cf/contests";
import { User } from "../cf/data";
import { fetchAllCfProblems, getProblemsCf } from "../cf/problems";
import { fetchSubs } from "../cf/subs";
import { fetchUser, fetchUserSolves } from "../cf/user";
import { Platform } from "./Platform";

const cf: Platform = {
  name: "cf",
  displayName: "Codeforces",

  loadData: async () => {
    await fetchAllCfProblems();
    await fetchContests();
  },

  calculateLevels: async (handle: string) => {
    let user: User;
    try {
      user = await fetchUser(handle);
    } catch (err) {
      return undefined;
    }
    const level = Math.round(user.maxRating / 100) * 100;
    return CATEGORIES.map(() => level);
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
    const subs = await fetchSubs(cfId);
    return subs;
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
