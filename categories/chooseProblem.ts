// TODO: put in proper directory

import assert from "assert";
import { ProblemMetadata } from "../common/interfaces/problem";
import { getPlatform } from "../platforms/base/platforms";
import { randInt } from "../util/random";

export const chooseProblem = (
  problems: ProblemMetadata[]
): ProblemMetadata | null => {
  const count = problems.length;
  if (count == 0) {
    return null;
  }
  const platform = getPlatform(problems[0].platform);
  const scores = problems.map((p) => platform.evaluateProblem(p));
  const indices = Array<number>(count);
  for (let i = 0; i < count; i++) indices[i] = i;
  const maxScore = Math.max(...scores);
  const isMax = indices.filter((i) => scores[i] == maxScore);
  assert(isMax.length > 0);
  const i = isMax[randInt(0, isMax.length - 1)];
  const chosen = problems[i];
  return chosen;
};
