import assert from "assert";
import CATEGORIES from "../../categories/categories";
import { ProblemMetadata } from "../../common/interfaces/problem";
import {
  cacheCategoryIds,
  getCategoryIds,
} from "../../models/redis/categories";
import { cacheProblems, getProblem } from "../../models/redis/problems";
import { fetchProblemsFromSolvedAc } from "../boj/fetchProblemsFromSolved";
import { getSubs } from "../boj/subs";
import { fetchUserSolves } from "../boj/user";
import { Platform } from "./Platform";

// const sleep = async (milliseconds: number) => {
//   return new Promise((resolve) => {
//     setTimeout(resolve, milliseconds);
//   });
// };

// the number of problems on each page from the solved.ac API
const PROBLEMS_PER_PAGE = 100;

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
    // await sleep(500);
    all.push(...problems);
    if (problems.length < PROBLEMS_PER_PAGE) {
      break; // it's the last page
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

  loadData: async () => {
    const test = await getCategoryIds(0, "boj");
    if (test.length == 0) {
      // make many expensive calls to solved.ac/api
      const promises: Promise<ProblemMetadata[]>[] = [];
      for (let c = 0; c < CATEGORIES.length; c++) {
        promises.push(fetchProblemsForCategory(c));
      }
      const byCategory = await Promise.all(promises);
      const cachePromises: Promise<void>[] = [];
      for (let c = 0; c < CATEGORIES.length; c++) {
        const problems = byCategory[c];
        const ids = problems.map((p) => p.id);
        cachePromises.push(
          cacheProblems(...problems),
          cacheCategoryIds(c, "boj", ids)
        );
      }
      await Promise.all(cachePromises);
    }
    for (let c = 0; c < CATEGORIES.length; c++) {
      const promises: Promise<ProblemMetadata | null>[] = [];
      const ids = await getCategoryIds(c, "boj");
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

  calculateLevels: async (handle: string) => {
    if (handle == "") {
      return undefined;
    }
    const queryParts = [`solved_by:${handle}`];
    const query = queryParts.map((s) => `(${s})`).join(" ");
    let problems: ProblemMetadata[];
    try {
      problems = await fetchProblemsFromSolvedAc(query, "level", "desc");
    } catch (err) {
      return undefined;
    }

    let level: number;
    if (problems.length < 20) {
      level = 5;
    } else {
      // consider at most top 100 problems
      let sum = 0;
      for (const problem of problems) {
        sum += problem.difficulty;
      }
      level = Math.round(sum / problems.length);
      level = Math.max(level, 3);
      level = Math.min(level, 28);
    }
    return CATEGORIES.map(() => level);
  },

  getSolvedIds: async (handle: string) => {
    try {
      const solves = await fetchUserSolves(handle);
      return solves.accepted;
    } catch (err) {
      return null;
    }
  },

  getProblems: (categoryId: number, level: number) => {
    return problemsByTier[categoryId][level];
  },

  getSubs: async (bojId: string) => {
    console.log(`getting BOJ subs for user ${bojId}`);
    const subs = await getSubs(bojId);
    return subs;
  },

  levels: (userLevel: number) => {
    const res: number[] = [];
    for (let i = userLevel - 2; i <= userLevel + 2; i++) {
      res.push(i);
    }
    return res;
  },

  evaluateProblem: (problem: ProblemMetadata) => {
    let res = 0;
    if (/^[a-z ]*$/i.test(problem.title)) {
      // keep only the problems whose titles are entirely
      // alphanumeric to increase the chance of English
      res += 1;
      // TODO: query problems from acmicpc.net and use ML to check if it's in English!
    }
    return res;
  },
};

export default boj;
