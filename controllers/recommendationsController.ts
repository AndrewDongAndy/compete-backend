/*
GET /problems

query parameters:
username (required): the username to fetch the problems for
*/

import assert from "assert";
import { Request, Response } from "express";

import { ProblemMetadata, ProblemForUser } from "../common/interfaces/data";
import { CATEGORIES } from "../categories";
import { User } from "../models/User";
import { fetchProblemsSolvedAc } from "../platforms/boj/fetchProblemsFromSolved";
import { randChoice, randInt } from "../util/random";

import { getUserTags, setUserTags } from "../models/redis/categories";
import { getList, setList } from "../models/redis/lists";
import { getProblem, cacheProblem } from "../models/redis/problems";

import { evaluateProblem } from "../platforms/boj/scoreProblem";
import { getUserSolves } from "../platforms/boj/user";

const TAGS_PER_DAY = 4;

const chooseProblem = (problems: ProblemMetadata[]): ProblemMetadata | null => {
  const count = problems.length;
  if (count == 0) {
    return null;
  }
  const scores = problems.map((p) => evaluateProblem(p));
  const indices = Array<number>(count);
  for (let i = 0; i < count; i++) indices[i] = i;
  const maxScore = Math.max(...scores);
  const isMax = indices.filter((i) => scores[i] == maxScore);
  assert(isMax.length > 0);
  const i = isMax[randInt(0, isMax.length - 1)];
  const chosen = problems[i];
  return chosen;
};

const getTagsForDay = async (username: string) => {
  let tags = await getUserTags(username);
  if (tags.length == 0) {
    const indices = Array<number>(CATEGORIES.length);
    for (let i = 0; i < CATEGORIES.length; i++) {
      indices[i] = i;
    }
    tags = randChoice(indices, TAGS_PER_DAY);
    await setUserTags(username, tags);
  }
  // send tags in alphabetical order
  tags.sort((x, y) => {
    const nameX = CATEGORIES[x].displayName;
    const nameY = CATEGORIES[y].displayName;
    return nameX < nameY ? -1 : +1;
  });
  return tags;
};

const getIdsForTag = async (
  username: string,
  tag: number,
  bojId: string,
  level: number
) => {
  const ids = await getList(username, tag);
  if (ids.length == 0) {
    const promises: Promise<ProblemMetadata[]>[] = [];
    for (let tier = level - 2; tier <= level + 2; tier++) {
      const tagNames = CATEGORIES[tag].tags.map((t) => t.solvedName);
      const queryParts = [
        tagNames.map((name) => `tag:${name}`).join("|"),
        `tier:${tier}`,
        `!solved_by:${bojId}`,
        "solvable:true",
        "average_try:..5", // not too many tries needed to solve
        "solved:25..", // at least 25 people solved
      ];
      // put brackets around each part for safety;
      // brackets are required when & or | are used in the query?
      const query = queryParts.map((s) => `(${s})`).join(" ");
      promises.push(fetchProblemsSolvedAc(query));
    }
    const byTier = await Promise.all(promises);
    const cachePromises: Promise<void>[] = [];
    for (const forTier of byTier) {
      for (const problem of forTier) {
        // cache everything
        cachePromises.push(cacheProblem(problem));
      }
      const chosen = chooseProblem(forTier);
      if (chosen) {
        ids.push(chosen.id);
      }
    }
    cachePromises.push(setList(username, tag, ids));
    await Promise.all(cachePromises);
  }
  return ids;
};

export const recommendationsGet = async (
  req: Request,
  res: Response
): Promise<void> => {
  // console.log("fetched recommendations");
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

  // TODO: do this more concurrently
  const tags = await getTagsForDay(username);
  const promises: Promise<string[]>[] = [];
  for (const tag of tags) {
    promises.push(
      getIdsForTag(username, tag, user.boj.userId, user.boj.levels[tag])
    );
  }
  const idsByTag = await Promise.all(promises);

  const problemSets: (readonly [string, ProblemForUser[]])[] =
    await Promise.all(
      tags.map(async (tag, index) => {
        const ids = idsByTag[index];
        const problemPromises = ids.map(async (id: string) => {
          const problem = await getProblem(id);
          assert(problem);
          const p: ProblemForUser = {
            problem,
            forUser: username,
            solved: userSolves.accepted.includes(id),
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
