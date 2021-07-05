/*
GET /problems

query parameters:
username (required): the username to fetch the problems for
*/

import assert from "assert";
import { Request, Response } from "express";

import { Problem, ProblemForUser } from "../common/interfaces/data";
import { CATEGORIES } from "../categories";
import { User } from "../models/User";
import { fetchProblemsSolvedAc } from "../platforms/boj/fetchProblemsFromSolved";
import { randChoice, randInt } from "../util/random";
import {
  getList,
  getUserTags,
  setList,
  setUserTags,
} from "../models/redis/tagsAndLists";
import { getProblem, cacheProblem } from "../models/redis/problems";
import { evaluateProblem } from "../platforms/boj/scoreProblem";
import { getUserSolves } from "../platforms/boj/user";

const TAGS_PER_DAY = 4;

export const problemsGet = async (
  req: Request,
  res: Response
): Promise<void> => {
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

  const problemSets: [string, ProblemForUser[]][] = [];

  // TODO: do this more concurrently
  let tags = await getUserTags(username);
  const promises: Promise<void>[] = [];
  if (tags.length == 0) {
    // generate tags
    const indices = Array<number>(CATEGORIES.length);
    for (let i = 0; i < CATEGORIES.length; i++) {
      indices[i] = i;
    }
    tags = randChoice(indices, TAGS_PER_DAY);
    promises.push(setUserTags(username, tags));
  }
  for (const tag of tags) {
    let ids = await getList(username, tag);
    // console.log("ids for tag", tag, ids);
    if (!ids) {
      // make sure each problem appears in <= 1 set
      const usedIds = new Set<string>();
      // need to do solved.ac API calls
      const mid = user.boj.levels[tag];
      ids = [];
      for (let tier = mid - 2; tier <= mid + 2; tier++) {
        const tagNames = CATEGORIES[tag].tags.map((t) => t.solvedName);
        const queryParts = [
          tagNames.map((name) => `tag:${name}`).join("|"),
          `tier:${tier}`,
          `!solved_by:${user.boj.userId}`,
          "solvable:true",
          "average_try:..5", // not too many tries needed to solve
          "solved:25..", // at least 25 people solved
        ];
        const query = queryParts.join(" ");
        let allProblems: Problem[];
        try {
          allProblems = await fetchProblemsSolvedAc(query);
        } catch (err) {
          res.status(404).send({ message: "too many requests?" });
          return;
        }

        // cache everything
        for (const problem of allProblems) {
          promises.push(cacheProblem(problem));
        }

        const unused = allProblems.filter((problem) => {
          return !usedIds.has(problem.id);
        });
        const count = unused.length;
        const scores = unused.map((p) => evaluateProblem(p));

        const order = Array<number>(count);
        for (let i = 0; i < count; i++) {
          order[i] = i;
        }
        order.sort((i, j) => scores[j] - scores[i]); // by decreasing score

        if (count > 0) {
          const chosen = unused[randInt(0, count - 1)];
          ids.push(chosen.id);
          usedIds.add(chosen.id);
        } else {
          // no suitable problem
          console.log("no suitable problem for", query);
        }
      }
      promises.push(setList(username, tag, ids));
    }
    const problemsForUser = ids.map(async (id: string) => {
      const problem = await getProblem(id);
      assert(problem);
      const p: ProblemForUser = {
        problem,
        forUser: username,
        solved: userSolves.accepted.includes(id),
      };
      return p;
    });
    problemSets.push([
      CATEGORIES[tag].displayName,
      await Promise.all(problemsForUser),
    ]);
  }

  // console.log(problemSets);
  res.status(200).send({ problemSets });
  await Promise.all(promises);
};
