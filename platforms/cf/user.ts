import cfAxios from "./cfAxios";

import { Submission } from "../../common/interfaces/cf/data";
import { contestProblemId } from "./problems";

export const fetchUserSolves = async (cfId: string): Promise<Set<string>> => {
  console.log("fetching user solves for", cfId);
  try {
    const res = await cfAxios.get("/user.status", {
      params: { handle: cfId },
    });
    if (res.data.status != "OK") {
      throw new Error(`Codeforces API returned error: ${res.data.comment}`);
    }
    const subs: Submission[] = res.data.result;
    const solved = new Set<string>();
    for (const sub of subs) {
      if (sub.verdict == "OK") {
        solved.add(contestProblemId(sub.problem));
      }
    }
    return solved;
  } catch (err) {
    return new Set<string>();
  }
};
