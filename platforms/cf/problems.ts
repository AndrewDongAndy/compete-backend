import cfAxios from "./cfAxios";

import { Problem } from "../../common/interfaces/cf/data";
import CATEGORIES from "../../categories/categories";
import { ProblemMetadata } from "../../common/interfaces/data";

export const contestProblemId = (p: Problem): string => {
  return p.contestId + p.index;
};

export const fetchProblems = async (
  tagId?: number
): Promise<ProblemMetadata[]> => {
  try {
    const params = {};
    if (tagId != undefined) {
      params["tags"] = CATEGORIES[tagId].tags.cf.join(";");
      console.log(params["tags"]);
    }
    const res = await cfAxios.get("/problemset.problems", {
      params,
    });
    console.log(res.data);
    if (res.data.status != "OK") {
      throw new Error(`Codeforces API returned error: ${res.data.comment}`);
    }
    const problems: Problem[] = res.data.result.problems;
    return problems.map<ProblemMetadata>((p) => {
      return {
        id: contestProblemId(p),
        title: p.name,
        platform: "cf",
        difficulty: p.rating ?? -1,
      };
    });
  } catch (err) {
    console.log("error occurred");
    return [];
  }
};
