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

export const fetchProblemsFromSolvedAc = async (
  query: string,
  sort: "id" | "level" | "solved" | "average_try" = "level",
  direction: "desc" | "asc" = "desc",
  page = 1
): Promise<ProblemMetadata[]> => {
  const res = await axios.get("https://solved.ac/api/v3/search/problem", {
    params: { query, page, sort, direction },
  });

  const items: SolvedProblem[] = res.data.items;

  // console.log("fetched from solved.ac API:", query);
  const count: number = res.data.count;
  console.log(`total count: ${count}; fetched: ${items.length}`);

  return items.map((p) => getMetadata(p));
  // return [count, items.map((p) => getMetadata(p))];
};
