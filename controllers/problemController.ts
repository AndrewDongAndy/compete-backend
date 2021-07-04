/*
GET /problems

query parameters:
username (required): the username to fetch the problems for
*/

import assert from "assert";
import { Request, Response } from "express";

import { Problem } from "../common/interfaces/data";
import { TAGS } from "../tags";
import { User } from "../models/User";
import { fetchProblemsSolvedAc } from "../platforms/boj/fetchProblemsFromSolved";
import { randInt } from "../util/random";
import {
  getList,
  getUserTags,
  setList,
  setUserTags,
} from "../models/redis/tagsAndLists";
import { getProblem, cacheProblem } from "../models/redis/problems";

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

  // make sure each problem appears in <= 1 set
  const usedIds = new Set<string>();
  const problemSets: [string, Problem[]][] = [];

  let tags = await getUserTags(username);
  const promises: Promise<void>[] = [];
  if (!tags) {
    // generate tags
    tags = [0, 1, 2, 3];
    promises.push(setUserTags(username, tags));
  }
  for (const tag of tags) {
    let ids = await getList(username, tag);
    console.log("ids for tag", tag, ids);
    if (!ids) {
      // need to do solved.ac API calls
      const mid = user.boj.levels[tag];
      ids = [];
      for (let tier = mid - 2; tier <= mid + 2; tier++) {
        const queryParts = [
          `tag:${TAGS[tag].solvedName}`,
          `tier:${tier}`,
          `!solved_by:${user.boj.userId}`,
          "solvable:true",
          "average_try:..5", // not too many tries needed to solve
          "solved:25..", // at least 25 people solved
        ];
        const query = queryParts.join(" ");
        let problemsFromSolved: Problem[];
        try {
          problemsFromSolved = await fetchProblemsSolvedAc(query);
        } catch (err) {
          res.status(404).send({ message: "too many requests?" });
          return;
        }

        // TODO: assign a score for each problem?
        const english = problemsFromSolved.filter((problem) => {
          // keep only the problems whose titles are entirely
          // alphanumeric to increase the chance of English
          return /^[a-z ]*$/i.test(problem.title);
          // TODO: query problems from acmicpc.net and use ML to check if it's in English!
        });
        const newProblems = english.filter((problem) => {
          return !usedIds.has(problem.id);
        });
        for (const problem of newProblems) {
          cacheProblem(problem);
        }
        const count = newProblems.length;

        if (count > 0) {
          const chosen = newProblems[randInt(0, count - 1)];
          ids.push(chosen.id);
          usedIds.add(chosen.id);
        } else {
          // no suitable problem
          console.log("no suitable problem for", query);
        }
      }
      promises.push(setList(username, tag, ids));
    }
    const problems = ids.map(async (id: string) => {
      const p = await getProblem(id);
      assert(p);
      return p;
    });
    problemSets.push([TAGS[tag].displayName, await Promise.all(problems)]);
  }

  console.log(problemSets);
  res.status(200).send({ problemSets });
  await Promise.all(promises);
};
