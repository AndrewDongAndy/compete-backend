import cfAxios from "./cfAxios";

import { Submission } from "../../common/interfaces/cf/data";
import { contestProblemId } from "./problems";

export const fetchUserSolves = async (
  cfId: string,
  count?: number
): Promise<Set<string> | null> => {
  // console.log(`fetching Codeforces user solves for ${cfId}, ${count} entries`);
  try {
    const res = await cfAxios.get("/user.status", {
      // if count == undefined then it will get removed
      params: { handle: cfId, count },
    });
    if (res.data.status != "OK") {
      return null;
      // throw new Error(`Codeforces API returned error: ${res.data.comment}`);
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
    return null;
  }
};
