const solvedUrl = (query: string) => {
  return `https://solved.ac/search?query=${encodeURIComponent(query)}`;
};

// console.log(solvedUrl("!solved_by:admathnoob"));

interface Problem {
  problemId: number;
  titleKo: string;
  isSolvable: boolean;
  isPartial: boolean;
  acceptedUserCount: number;
  level: number;
  votedUserCount: number;
  isLevelLocked: boolean;
  averageTries: number;
}

/**
 * A query on solved.ac/search
 * Syntax: & for and, | for or, ! for not
 */
interface SolvedQuery {
  tier?: { low?: string; high?: string };
  tag?: string;
  notSolvedBy?: string[];
}

const getQueryString = ({ tier, tag, notSolvedBy }: SolvedQuery) => {
  const strings: string[] = [];
  if (tier && (tier.low || tier.high)) {
    strings.push(`tier:${tier.low}..${tier.high}`);
  }
  if (tag) {
    strings.push(`tag:${tag}`);
  }
  if (notSolvedBy) {
    for (const username in notSolvedBy) {
      strings.push(`!solved_by`);
    }
  }
  return strings.join(" ");
};

// interface Tag {
//   key: string;
//   isMeta: boolean;
//   bojTagId: number;
//   problemCount: number;
//   displayNames: {
//     language: string;
//     name: string;
//     short: string;
//   }[];
//   aliases: { alias: string }[];
// }

const getPageProps = async (url: string) => {
  const res = await axios.get(url);
  const parsedHtml = parseHtml(res.data);
  const stringData = parsedHtml.querySelector("#__NEXT_DATA__").innerText;
  const parsed = JSON.parse(stringData);
  return parsed.props.pageProps;
};

const getProblems = async (url: string) => {
  const props = await getPageProps(url);
  try {
    return props.problems.items as Problem[];
  } catch (err) {
    return [];
  }
};

const tagHelper = async () => {
  const tags = await getTags();
  for (const [tagId, name, numProblems] of tags) {
    delay(1000);
    const solvedTag = name.replace(" ", "_").toLowerCase();
    const problems = await getProblems(solvedUrl(`tag:${solvedTag}`));
    if (!problems) {
      continue;
    }
    if (problems.length == 0) {
      console.log("failed tag:", tagId, solvedTag, name);
    } else {
      if (problems.length != numProblems) {
        console.log("different number of problems:", tagId, solvedTag, name);
      }
    }
  }
};
