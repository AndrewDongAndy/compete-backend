import axios from "axios";
import { Problem } from "../../common/interfaces/data";

interface SolvedProblem {
  problemId: number;
  titleKo: string;
  isSolvable: boolean;
  isPartial: boolean;
  acceptedUserCount: number;
  level: number;
  votedUserCount: number;
  isLevelLocked: boolean;
  averageTries: number; // float
}

export const fetchProblemsSolvedAc = async (
  query: string,
  page = 1
): Promise<Problem[]> => {
  console.log("fetching from solved.ac API:", query);
  try {
    const res = await axios.get("https://solved.ac/api/v3/search/problem", {
      params: { query, page },
    });
    // const count: number = res.data.count;
    const items: SolvedProblem[] = res.data.items;
    return items.map<Problem>((sp) => {
      return {
        id: sp.problemId.toString(),
        title: sp.titleKo,
        tier: sp.level,
      };
    });
  } catch (err) {
    console.error(err);
    return [];
  }
};
