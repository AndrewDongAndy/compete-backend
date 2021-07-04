/*
Redis caching.
*/

import { problemsRedis } from "./redisClients";

import { Problem } from "../../common/interfaces/data";

// const isValidProblemId = (id: string) => {
//   return /^[1-9][0-9]{3,}$/.test(id);
// };

export const getProblem = async (id: string): Promise<Problem | null> => {
  if (!(await problemsRedis.exists(id))) {
    return null;
  }
  const p: unknown = await problemsRedis.hgetall(id);
  return p as Problem;
};

export const cacheProblem = async (p: Problem): Promise<void> => {
  console.log("caching problem", p.id);
  await problemsRedis.hset(p.id, p);
};
