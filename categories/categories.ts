import { Platform } from "../common/interfaces/platforms";

type Category = {
  displayName: string;
  tags: {
    [key in Platform]: string[];
    // the `boj` key contains the tags used on solved.ac
  };
};

const CATEGORIES: Category[] = [
  {
    displayName: "Math",
    tags: {
      boj: ["math", "combinatorics", "primality_test"],
      cf: [
        "math",
        "fft",
        "matrices",
        "combinatorics",
        "chinese remainder theorem",
      ],
    },
  },
  {
    displayName: "Strings",
    tags: {
      boj: ["string", "hashing"],
      cf: ["strings", "string suffix structures", "hashing"],
    },
  },
  {
    displayName: "Dynamic Programming",
    tags: {
      boj: ["dp", "dp_tree", "dp_bitfield"],
      cf: ["dp"],
    },
  },
  {
    displayName: "Graph Theory",
    tags: {
      boj: ["graphs", "scc", "biconnected_component", "dijkstra"],
      cf: ["graphs", "dfs and similar"],
    },
  },
  {
    displayName: "Data Structures",
    tags: {
      boj: ["data_structures", "segtree", "lazyprop"],
      cf: ["data structures"],
    },
  },
  {
    displayName: "Flows",
    tags: {
      boj: ["flow", "mcmf", "mfmc", "bipartite_matching"],
      cf: ["flows", "graph matchings"],
    },
  },
  {
    displayName: "Divide and Conquer",
    tags: {
      boj: ["divide_and_conquer"],
      cf: ["divide and conquer"],
    },
  },
  {
    displayName: "Greedy Algorithms",
    tags: {
      boj: ["greedy"],
      cf: ["greedy"],
    },
  },
  {
    displayName: "Geometry",
    tags: {
      boj: ["geometry"],
      cf: ["geometry"],
    },
  },
];

export default CATEGORIES;
