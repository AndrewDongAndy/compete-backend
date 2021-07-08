/*
GET /cf/problem/:id

query parameters:
id: the id of the problem data to get
*/

import assert from "assert";
import { Request, Response } from "express";
import CATEGORIES from "../../categories/categories";
import { chooseProblem } from "../../categories/chooseProblem";

import { getTagsForDay } from "../../categories/getCategoriesForDay";
import { ProblemForUser, ProblemMetadata } from "../../common/interfaces/data";
import { getList, setList } from "../../models/redis/lists";
import { cacheProblems, getProblem } from "../../models/redis/problems";
import { User } from "../../models/User";
import { fetchProblems } from "../../platforms/cf/problems";
import { fetchUserSolves } from "../../platforms/cf/user";

const getIdsForTag = async (
  username: string,
  tagId: number,
  // bojId: string,
  level: number,
  solved: Set<string>
) => {
  const ids = await getList(username, "cf", tagId);
  if (ids.length == 0) {
    let problems = await fetchProblems(tagId);
    problems = problems.filter((problem) => {
      // do newer problems
      const id = problem.id;
      const contestId = id.match(/^[0-9]+/)![0];
      assert(contestId);
      return +contestId >= 1300;
    });
    await cacheProblems(...problems); // cache everything

    // sort by rating and cache all problems
    const byRating = new Map<number, ProblemMetadata[]>();
    for (const problem of problems) {
      const d = problem.difficulty;
      if (!byRating.has(d)) {
        byRating.set(d, []);
      }
      byRating.get(d)!.push(problem);
    }

    // TODO: don't hard code this
    for (let d = 2300; d <= 2700; d++) {
      const unsolved = byRating.get(d)?.filter((p) => !solved.has(p.id)) ?? [];
      const chosen = chooseProblem(unsolved);
      if (chosen) {
        ids.push(chosen.id);
      }
    }
    await setList(username, "cf", tagId, ids);
  }
  return ids;
};

export const recommendationsGet = async (
  req: Request,
  res: Response
): Promise<void> => {
  // console.log("getting CF recommendations");
  const username = req.query.username as string;

  const user = await User.findOne({ username });
  assert(user);
  // console.log(user);
  if (!user.cf.userId) {
    res.status(401).send({ message: "Codeforces handle not set" });
    return;
  }

  const solved = await fetchUserSolves(user.cf.userId);

  const tags = await getTagsForDay(username);
  const promises: Promise<string[]>[] = [];
  for (const tag of tags) {
    promises.push(getIdsForTag(username, tag, user.boj.levels[tag], solved));
  }
  const idsByTag = await Promise.all(promises);

  const problemSets: (readonly [string, ProblemForUser[]])[] =
    await Promise.all(
      tags.map(async (tag, index) => {
        const ids = idsByTag[index];
        const problemPromises = ids.map(async (id: string) => {
          const problem = await getProblem("cf", id);
          assert(problem);
          const p: ProblemForUser = {
            problem,
            forUser: username,
            solved: solved.has(id),
          };
          return p;
        });
        return [
          CATEGORIES[tag].displayName,
          await Promise.all(problemPromises),
        ] as const;
      })
    );

  res.status(200).send(problemSets);
};
