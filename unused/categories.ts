// ========== FOR SHORTER CODE ==========

type BojTag = {
  solvedName: string;
  // bojId: string; // from 1 to ~175
};

// [tag name on solved.ac, tag ID on BOJ]
// currently BOJ tag ID isn't being used, so put anything there?
const math = ["math", "124"] as const;
const combo = ["combinatorics", "6"] as const;
const primality = ["primality_test", "-1"] as const;

const string = ["string", "158"] as const;
const hashing = ["hashing", "-1"] as const;

const dp = ["dp", "25"] as const;
const dpOnTrees = ["dp_tree", "-1"] as const;
const bitmaskDp = ["dp_bitfield", "-1"] as const;

const graphs = ["graphs", "7"] as const;
const scc = ["scc", "-1"] as const;
const dijkstra = ["dijkstra", "-1"] as const;

const ds = ["data_structures", "175"] as const;
const segTree = ["segtree", "-1"] as const;
const lazySegTree = ["lazyprop", "-1"] as const;

const flow = ["flow", "45"] as const;
const mcmf = ["mcmf", "-1"] as const;
const mfmc = ["mfmc", "-1"] as const;
const matching = ["bipartite_matching", "-1"] as const;

const dnc = ["divide_and_conquer", "24"] as const;
const greedy = ["greedy", "33"] as const;
const geom = ["geometry", "100"] as const;

// [display name for frontend, list of tags]
const buckets: [string, (readonly [string, string])[]][] = [
  ["Math", [math, combo, primality]],
  ["Strings", [string, hashing]],
  ["Dynamic Programming", [dp, dpOnTrees, bitmaskDp]],
  ["Graph Theory", [graphs, scc, dijkstra]],
  ["Data Structures", [ds, segTree, lazySegTree]],
  ["Flows", [flow, mcmf, mfmc, matching]],
  ["Divide and Conquer", [dnc]],
  ["Greedy Algorithms", [greedy]],
  ["Geometry", [geom]],
];

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
