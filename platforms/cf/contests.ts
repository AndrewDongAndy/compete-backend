import cfAxios from "./cfAxios";
import { Contest } from "./data";

type Division = "1" | "2" | "1 + 2" | "3" | "4";
const DIVISIONS: [string, Division][] = [
  ["Div. 1 + Div. 2", "1 + 2"], // order matters
  ["Div. 1", "1"],
  ["Div. 2", "2"],
  ["Div. 3", "3"],
  ["Div. 4", "4"],
];

// Map from contest id to
const contestMap = new Map<string, Division>();

export const fetchContests = async (): Promise<Contest[]> => {
  const res = await cfAxios.get("/contest.list");
  if (res.data.status != "OK") {
    throw new Error(`Codeforces API returned error: ${res.data.comment}`);
  }
  const contests: Contest[] = res.data.result;
  for (const contest of contests) {
    const { name } = contest;
    for (const [keyword, division] of DIVISIONS) {
      if (name?.includes(keyword)) {
        contestMap.set(contest.id.toString(), division);
        break;
      }
    }
  }
  console.log("fetched CF contests");
  return contests;
};

export const getContestDivision = (id: string): string => {
  const d = contestMap.get(id);
  if (!d) {
    return "";
  }
  return d;
};
