import { Sub } from "../../common/interfaces/sub";
import cfAxios from "./cfAxios";
import { Submission as CfSubmission } from "./data";
import { contestProblemId } from "./problems";

const convertToSub = (cfSub: CfSubmission): Sub => {
  return {
    problemId: contestProblemId(cfSub.problem),
    platform: "cf",
    subId: cfSub.id.toString(),
    forUser: cfSub.author.members[0].handle,
    verdict: "WA",
    memory: cfSub.memoryConsumedBytes,
    runningTime: cfSub.timeConsumedMillis,
    // unix time is in seconds
    date: new Date(cfSub.creationTimeSeconds * 1000),
  };
};

export const fetchSubs = async (handle: string): Promise<Sub[]> => {
  const res = await cfAxios.get("/user.status", { params: { handle } });
  if (res.data.status != "OK") {
    throw new Error(`Codeforces API returned error: ${res.data.comment}`);
  }
  const cfSubs: CfSubmission[] = res.data.result;
  return cfSubs.map<Sub>((cfSub) => convertToSub(cfSub));
};
