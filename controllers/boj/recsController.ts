/*
GET /boj/recs

query parameters:
username (required): the username to fetch the problems for
*/

import assert from "assert";
import { Request, Response } from "express";

import {
  ProblemMetadata,
  ProblemForUser,
  ProblemSets,
} from "../../common/interfaces/data";
import CATEGORIES from "../../categories/categories";
import { User } from "../../models/User";
import { fetchProblemsSolvedAc } from "../../platforms/boj/fetchProblemsFromSolved";

import { getList, setList } from "../../models/redis/lists";
import { getProblem, cacheProblems } from "../../models/redis/problems";

import { getUserSolves } from "../../platforms/boj/user";
import { getTagsForDay } from "../../categories/getCategoriesForDay";
import { chooseProblem } from "../../categories/chooseProblem";

const getIdsForTag = async (
  username: string,
  tag: number,
  // bojId: string,
  level: number,
  solved: Set<string>
) => {
  const ids = await getList(username, "boj", tag);
  if (ids.length == 0) {
    const promises: Promise<ProblemMetadata[]>[] = [];
    for (let tier = level - 2; tier <= level + 2; tier++) {
      const tagNames = CATEGORIES[tag].tags.boj;
      const queryParts = [
        tagNames.map((name) => `tag:${name}`).join("|"),
        `tier:${tier}`,
        // `!solved_by:${bojId}`, // solved.ac doesn't update very quickly?
        "solvable:true",
        "average_try:..5", // not too many tries needed to solve
        "solved:15..", // at least 15 people solved
      ];
      // put brackets around each part for safety;
      // brackets are required when & or | are used in the query?
      const query = queryParts.map((s) => `(${s})`).join(" ");
      promises.push(fetchProblemsSolvedAc(query));
    }
    const byTier = await Promise.all(promises);
    const cachePromises: Promise<void>[] = [];
    for (const forTier of byTier) {
      // cache everything
      cachePromises.push(cacheProblems(...forTier));
      const unsolved = forTier.filter((p) => !solved.has(p.id));
      const chosen = chooseProblem(unsolved);
      if (chosen) {
        ids.push(chosen.id);
      }
    }
    cachePromises.push(setList(username, "boj", tag, ids));
    await Promise.all(cachePromises);
  }
  return ids;
};

export const recsGet = async (req: Request, res: Response): Promise<void> => {
  const username = req.query.username as string;

  const user = await User.findOne({ username });
  assert(user);
  // console.log(user);
  if (!user.boj.userId) {
    res.status(401).send({ message: "BOJ handle not set" });
    return;
  }

  const userSolves = await getUserSolves(user.boj.userId);
  if (!userSolves) {
    res.status(404).send({ message: "unable to get user solves" });
    return;
  }
  const setSolved = new Set(userSolves.accepted);

  // TODO: do this more concurrently
  const tags = await getTagsForDay(username);
  const promises: Promise<string[]>[] = [];
  for (const tag of tags) {
    promises.push(getIdsForTag(username, tag, user.boj.levels[tag], setSolved));
  }
  const idsByTag = await Promise.all(promises);

  const problemSets: ProblemSets = await Promise.all(
    tags.map(async (tag, index) => {
      const ids = idsByTag[index];
      const problemPromises = ids.map(async (id: string) => {
        const problem = await getProblem("boj", id);
        assert(problem);
        const p: ProblemForUser = {
          problem,
          forUser: username,
          solved: setSolved.has(id),
        };
        return p;
      });
      return [
        CATEGORIES[tag].displayName,
        await Promise.all(problemPromises),
      ] as const;
    })
  );

  // console.log(problemSets);
  res.status(200).send(problemSets);
};
