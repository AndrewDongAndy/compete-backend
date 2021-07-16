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

const getMetadata = (p: SolvedProblem): ProblemMetadata => {
  return {
    id: p.problemId.toString(),
    title: p.titleKo,
    platform: "boj",
    difficulty: p.level,
  };
};

// TODO: cache these queries somehow

export const fetchProblemsSolvedAc = async (
  query: string,
  sort: "id" | "level" | "solved" | "average_try" = "level",
  direction: "desc" | "asc" = "desc",
  page = 1
): Promise<ProblemMetadata[]> => {
  console.log("fetching from solved.ac API:", query);
  let count: number;
  let items: SolvedProblem[];
  try {
    const res = await axios.get("https://solved.ac/api/v3/search/problem", {
      params: { query, page, sort, direction },
    });
    count = res.data.count;
    items = res.data.items;
  } catch (err) {
    console.error(err);
    return [];
  }
  console.log(`total count: ${count}; fetched: ${items.length}`);
  return items.map((p) => getMetadata(p));
};
