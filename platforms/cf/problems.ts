import cfAxios from "./cfAxios";

import { Problem } from "./data";
import CATEGORIES from "../../categories/categories";
import { ProblemMetadata } from "../../common/interfaces/data";
import { cacheProblems } from "../../models/redis/problems";

export const contestProblemId = (p: Problem): string => {
  return p.contestId + p.index;
};

const getMetadata = (p: Problem): ProblemMetadata => {
  return {
    id: contestProblemId(p),
    title: p.name,
    platform: "cf",
    difficulty: p.rating ?? -1,
  };
};

const matchesTag = (p: Problem, tagId: number): boolean => {
  // checks if there is any intersection between the two arrays
  return p.tags.some((tag) => CATEGORIES[tagId].tags.cf.includes(tag));
};

// TODO: put this in a Redis database? or is this ok?
const byCategory: ProblemMetadata[][] = CATEGORIES.map(() => []);

export const fetchAllCfProblems = async (): Promise<void> => {
  // should only be called once: when the server starts
  console.log("fetching all CF problems");

  const res = await cfAxios.get("/problemset.problems");
  if (res.data.status != "OK") {
    throw new Error(`Codeforces API returned error: ${res.data.comment}`);
  }

  // the other field is result.problemStatistics
  const allProblems: Problem[] = res.data.result.problems;

  // only consider newer problems
  const newerProblems = allProblems.filter(
    (p) => p.contestId && p.contestId >= 1000
  );

  // no caching required because CF is more lenient with API calls
  const metadatas: ProblemMetadata[] = [];
  for (const p of newerProblems) {
    const metadata = getMetadata(p);
    metadatas.push(metadata);
    for (let i = 0; i < CATEGORIES.length; i++) {
      if (matchesTag(p, i)) {
        byCategory[i].push(metadata);
      }
    }
  }

  await cacheProblems(...metadatas);

  for (let i = 0; i < CATEGORIES.length; i++) {
    console.log(`category ${i}: fetched ${byCategory[i].length} problems`);
  }
};

export const getProblemsCf = (tagId: number): ProblemMetadata[] => {
  return byCategory[tagId];
};
