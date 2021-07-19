/*
Caching the problem data using Redis.
*/

import { problemsRedis } from "./redisClients";

import { ProblemMetadata } from "../../common/interfaces/problem";
import { PlatformName } from "../../common/interfaces/platforms";

const PROBLEM_TTL = 7 * 24 * 60 * 60; // one week, in seconds

// const isValidProblemId = (id: string) => {
//   return /^[1-9][0-9]{3,}$/.test(id);
// };

export const getProblem = async (
  platform: PlatformName,
  id: string
): Promise<ProblemMetadata | null> => {
  const key = `${platform}:${id}`;
  if (!(await problemsRedis.exists(key))) {
    return null;
  }
  const p: unknown = await problemsRedis.hgetall(key);
  return p as ProblemMetadata;
};

export const cacheProblems = async (
  ...problems: ProblemMetadata[]
): Promise<void> => {
  let multi = problemsRedis.multi();
  for (const p of problems) {
    const key = `${p.platform}:${p.id}`;
    multi = multi.hset(key, p).expire(key, PROBLEM_TTL);
  }
  await multi.exec();
};
