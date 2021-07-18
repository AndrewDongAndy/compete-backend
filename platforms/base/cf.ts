import { fetchAllCfProblems, getProblemsCf } from "../cf/problems";
import { fetchUserSolves } from "../cf/user";
import { Platform } from "./Platform";

const cf: Platform = {
  name: "cf",
  displayName: "Codeforces",

  fetchProblems: async () => {
    await fetchAllCfProblems();
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

  levels: (userLevel: number) => {
    const res: number[] = [];
    for (let i = userLevel - 200; i <= userLevel + 200; i += 100) {
      res.push(i);
    }
    return res;
  },
};

export default cf;
