import { Sub } from "../../common/interfaces/sub";
import cfAxios from "./cfAxios";
import { Submission as CfSubmission } from "./data";
import { getMetadata } from "./problems";

export const fetchSubs = async (handle: string): Promise<Sub[]> => {
  const res = await cfAxios.get("/user.status", { params: { handle } });
  if (res.data.status != "OK") {
    throw new Error(`Codeforces API returned error: ${res.data.comment}`);
  }
  const cfSubs: CfSubmission[] = res.data.result;
  return cfSubs.map<Sub>((sub) => {
    return {
      problem: getMetadata(sub.problem),
      subId: sub.id.toString(),
      forUser: handle,
      verdict: "WA",
    };
  });
};
