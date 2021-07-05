// ========== FOR SHORTER CODE ==========

// [tag name on solved.ac, tag ID on BOJ]
const math = ["math", "124"] as const;
const combo = ["combinatorics", "6"] as const;
const string = ["string", "158"] as const;
const dp = ["dp", "25"] as const;
const graphs = ["graphs", "7"] as const;
const ds = ["data_structures", "175"] as const;
const flow = ["flow", "45"] as const;
const dnc = ["divide_and_conquer", "24"] as const;
const greedy = ["greedy", "33"] as const;
const geom = ["geometry", "100"] as const;

// [display name for frontend, list of tags]
const buckets: [string, (readonly [string, string])[]][] = [
  ["Math", [math, combo]],
  ["Strings", [string]],
  ["Dynamic Programming", [dp]],
  ["Graph Theory", [graphs]],
  ["Data Structures", [ds]],
  ["Flows", [flow]],
  ["Divide and Conquer", [dnc]],
  ["Greedy Algorithms", [greedy]],
  ["Geometry", [geom]],
];

// ========== END STUFF FOR SHORTER CODE ==========

type Tag = {
  solvedName: string;
  bojId: string; // from 1 to ~175
};

// for this web app
type Category = {
  displayName: string;
  tags: Tag[];
};

export const CATEGORIES: Category[] = buckets.map(
  ([displayName, tagTuples]) => {
    return {
      displayName,
      tags: tagTuples.map(([solvedName, bojId]) => {
        return {
          solvedName,
          bojId,
        };
      }),
    };
  }
);
