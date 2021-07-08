// TODO: put in proper directory

import assert from "assert";
import { ProblemMetadata } from "../common/interfaces/data";
import { randInt } from "../util/random";

export const evaluateProblem = (p: ProblemMetadata): number => {
  let res = 0;
  if (/^[a-z ]*$/i.test(p.title)) {
    // keep only the problems whose titles are entirely
    // alphanumeric to increase the chance of English
    res += 1;
    // TODO: query problems from acmicpc.net and use ML to check if it's in English!
  }

  return res;
};

export const chooseProblem = (
  problems: ProblemMetadata[]
): ProblemMetadata | null => {
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
