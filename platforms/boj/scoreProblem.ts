import { Problem } from "../../common/interfaces/data";

export const evaluateProblem = (p: Problem): number => {
  let res = 0;
  if (/^[a-z ]*$/i.test(p.title)) {
    // keep only the problems whose titles are entirely
    // alphanumeric to increase the chance of English
    res += 1;
    // TODO: query problems from acmicpc.net and use ML to check if it's in English!
  }

  return res;
};
