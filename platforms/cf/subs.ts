import { Sub, Verdict } from "../../common/interfaces/sub";
import cfAxios from "./cfAxios";
import { Verdict as CfVerdict, Submission as CfSubmission } from "./data";
import { contestProblemId } from "./problems";

const VERDICT_CONVERTER: [Verdict, string[]][] = [
  ["AC", ["OK"]],
  ["WA", ["WRONG_ANSWER", "PRESENTATION_ERROR"]],
  ["TLE", ["TIME_LIMIT_EXCEEDED", "IDLENESS_LIMIT_EXCEEDED"]],
  ["MLE", ["MEMORY_LIMIT_EXCEEDED"]],
  ["RTE", ["RUNTIME_ERROR"]],
  ["CE", ["COMPILATION_ERROR"]],
];

const getVerdict = (v: CfVerdict): Verdict => {
  for (const [verdict, strings] of VERDICT_CONVERTER) {
    if (strings.includes(v)) {
      return verdict;
    }
  }
  return "other";
};

const convertToSub = (cfSub: CfSubmission): Sub => {
  return {
    problemId: contestProblemId(cfSub.problem),
    platform: "cf",
    subId: cfSub.id.toString(),
    forUser: cfSub.author.members[0].handle,
    verdict: getVerdict(cfSub.verdict),
    memory: cfSub.memoryConsumedBytes,
    runningTime: cfSub.timeConsumedMillis,
    // unix time is in seconds
    unixDate: cfSub.creationTimeSeconds,
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
