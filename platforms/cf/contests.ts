import cfAxios from "./cfAxios";
import { Contest } from "./data";

export const fetchContests = async (): Promise<Contest[]> => {
  const res = await cfAxios.get("/contest.list");
  if (res.data.status != "OK") {
    throw new Error(`Codeforces API returned error: ${res.data.comment}`);
  }
  return res.data.result;
};
