import cfAxios from "./cfAxios";

import { Submission, User } from "./data";
import { contestProblemId } from "./problems";

export const fetchUser = async (cfId: string): Promise<User> => {
  const res = await cfAxios.get("/user.info", {
    // if count == undefined then it will get removed
    params: { handles: cfId },
  });
  if (res.data.status != "OK") {
    throw new Error(`Codeforces API returned error: ${res.data.comment}`);
  }
  const users: User[] = res.data.result;
  return users[0];
};

export const fetchUserSolves = async (
  cfId: string,
  count?: number
): Promise<string[]> => {
  // console.log(`fetching Codeforces user solves for ${cfId}, ${count} entries`);
  const res = await cfAxios.get("/user.status", {
    // if count == undefined then it will get removed
    params: { handle: cfId, count },
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
  return Array.from(solved.values());
};
