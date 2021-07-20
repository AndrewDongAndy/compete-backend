import assert from "assert";
import { Request, Response } from "express";

import CATEGORIES from "../categories/categories";
import { chooseProblem } from "../categories/chooseProblem";
import { getCategoriesForDay } from "../categories/getCategoriesForDay";
import { ProblemForUser, ProblemSets } from "../common/interfaces/problem";
import { PlatformName } from "../common/interfaces/platforms";
import { getList, setList } from "../models/redis/lists";
import { getProblem } from "../models/redis/problems";

import { User } from "../models/User";
import { getPlatform } from "../platforms/base/platforms";

// GET /:platform/recs?username=<Compete username>
export const recsGet = async (req: Request, res: Response): Promise<void> => {
  const platformName = req.params.platform as PlatformName;
  const username = req.query.username as string;

  // console.log(platformName, username);

  const user = await User.findOne({ username });
  if (!user) {
    res.status(401).send({ message: `Compete user ${username} not found` });
    return;
  }
  if (!user[platformName].userId) {
    const message = `${platformName} handle of user ${username} not set`;
    res.status(401).send({ message });
    return;
  }

  const handle = user[platformName].userId;
  const platform = getPlatform(platformName);

  const solved = await platform.getSolvedIds(handle);
  if (!solved) {
    const message = `unable to fetch solved ${platformName} problems`;
    res.status(400).send({ message });
    return;
  }
  const solvedSet = new Set(solved);

  const tags = await getCategoriesForDay(username);

  const problemSets: ProblemSets = [];
  for (const categoryId of tags) {
    const problemIds = await getList(username, platformName, categoryId);
    if (problemIds.length == 0) {
      // TODO: do we need mutexes?
      const userLevel = user[platformName].levels[categoryId];
      const levels = platform.levels(userLevel);
      for (const level of levels) {
        const list = platform.getProblems(categoryId, level);
        const unsolved = list.filter((p) => !solvedSet.has(p.id));
        const problem = chooseProblem(unsolved);
        if (problem) {
          problemIds.push(problem.id);
        }
      }
      await setList(username, platformName, categoryId, problemIds);
    }
    const forCategory = await Promise.all(
      problemIds.map(async (id) => {
        const problem = await getProblem(platformName, id);
        assert(problem);
        return problem;
      })
    );
    const problemsForUser = forCategory.map<ProblemForUser>((problem) => {
      return {
        problem,
        forUser: username,
        solved: solvedSet.has(problem.id),
      };
    });
    problemSets.push([CATEGORIES[categoryId].displayName, problemsForUser]);
  }

  res.status(200).send(problemSets);
};
