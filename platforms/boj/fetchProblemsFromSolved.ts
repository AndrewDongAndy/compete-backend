import axios from "axios";
import { ProblemMetadata } from "../../common/interfaces/data";

type SolvedProblem = {
  problemId: number;
  titleKo: string;
  isSolvable: boolean;
  isPartial: boolean;
  acceptedUserCount: number;
  level: number;
  votedUserCount: number;
  isLevelLocked: boolean;
  averageTries: number; // float
};

export const fetchProblemsSolvedAc = async (
  query: string,
  sort: "id" | "level" | "solved" | "average_try" = "level",
  direction: "desc" | "asc" = "desc",
  page = 1
): Promise<ProblemMetadata[]> => {
  console.log("fetching from solved.ac API:", query);
  try {
    const res = await axios.get("https://solved.ac/api/v3/search/problem", {
      params: { query, page, sort, direction },
    });
    // const count: number = res.data.count;
    const items: SolvedProblem[] = res.data.items;
    return items.map<ProblemMetadata>((sp) => {
      return {
        id: sp.problemId.toString(),
        title: sp.titleKo,
        platform: "boj",
        difficulty: sp.level,
      };
    });
  } catch (err) {
    console.error(err);
    return [];
  }
};
