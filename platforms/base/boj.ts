import assert from "assert";
import CATEGORIES from "../../categories/categories";
import { ProblemMetadata } from "../../common/interfaces/data";
import {
  cacheCategoryIds,
  getCategoryIds,
} from "../../models/redis/categories";
import { cacheProblems, getProblem } from "../../models/redis/problems";
import { fetchProblemsFromSolvedAc } from "../boj/fetchProblemsFromSolved";
import { getUserSolves } from "../boj/user";
import { Platform } from "./Platform";

const sleep = async (milliseconds: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

const fetchProblemsForCategory = async (categoryId: number) => {
  const tagNames = CATEGORIES[categoryId].tags.boj;
  const queryParts = [
    tagNames.map((name) => `tag:${name}`).join("|"),
    // `tier:${tier}`,
    // `!solved_by:${bojId}`, // solved.ac doesn't update very quickly?
    "solvable:true",
    "average_try:..5", // not too many tries needed to solve
    "solved:15..", // at least 15 people solved
  ];
  // put brackets around each part for safety;
  // brackets are required when & or | are used in the query?
  const query = queryParts.map((s) => `(${s})`).join(" ");
  const all: ProblemMetadata[] = [];
  let page = 1;
  while (true) {
    const problems = await fetchProblemsFromSolvedAc(
      query,
      undefined,
      undefined,
      page
    );
    await sleep(500);
    all.push(...problems);
    if (problems.length < 100) {
      break;
    }
    ++page;
  }
  return all;
};

const problemsByTier = CATEGORIES.map(() => {
  const a: ProblemMetadata[][] = [];
  for (let i = 0; i <= 30; i++) {
    a.push([]);
  }
  return a;
});

const boj: Platform = {
  name: "boj",
  displayName: "Baekjoon Online Judge",

  loadProblems: async () => {
    for (let c = 0; c < CATEGORIES.length; c++) {
      const ids = await getCategoryIds(c, "boj");
      if (ids.length == 0) {
        const problems = await fetchProblemsForCategory(c); // expensive
        for (const p of problems) {
          ids.push(p.id);
        }
        await cacheProblems(...problems);
        await cacheCategoryIds(c, "boj", ids);
      }
      const promises: Promise<ProblemMetadata | null>[] = [];
      for (const id of ids) {
        promises.push(getProblem("boj", id));
      }
      const problems = await Promise.all(promises);
      for (const problem of problems) {
        assert(problem);
        problemsByTier[c][problem.difficulty].push(problem);
      }
    }
  },

  getSolvedIds: async (handle: string) => {
    const solves = await getUserSolves(handle);
    return solves.accepted;
  },

  getProblems: (categoryId: number, level: number) => {
    return problemsByTier[categoryId][level];
  },

  levels: (userLevel: number) => {
    const res: number[] = [];
    for (let i = userLevel - 2; i <= userLevel + 2; i++) {
      res.push(i);
    }
    return res;
  },
};

export default boj;
