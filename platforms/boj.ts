import assert from "assert";
import axios from "axios";
import { HTMLElement, parse as parseHtml } from "node-html-parser";
import translate from "translate";

const bojUrl = (problemId: string) => {
  return `https://www.acmicpc.net/problem/${problemId}`;
};

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

const solvedUrl = (query: string) => {
  return `https://solved.ac/search?query=${encodeURIComponent(query)}`;
};

// console.log(solvedUrl("!solved_by:admathnoob"));

const getProblem = (tag: string) => {
  const url = solvedUrl;
};

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

interface Tag {
  key: string;
  isMeta: boolean;
  bojTagId: number;
  problemCount: number;
  displayNames: {
    language: string;
    name: string;
    short: string;
  }[];
  aliases: { alias: string }[];
}

const getPageProps = async (url: string) => {
  const res = await axios.get(url);
  const parsedHtml = parseHtml(res.data);
  const stringData = parsedHtml.querySelector("#__NEXT_DATA__").innerText;
  const parsed = JSON.parse(stringData);
  return parsed.props.pageProps;
};

const getProblems = async (url: string) => {
  const props = await getPageProps(url);
  return props.problems.items as Problem[];
};

export const getTags = async (): Promise<[string, string, number][]> => {
  const html = await axios.get("https://www.acmicpc.net/problem/tags");
  const rows = parseHtml(html.data).querySelectorAll("tbody > tr");
  // console.log("number of tags found:", rows.length);
  const tags: [string, string, number][] = [];
  for (const row of rows) {
    const cells = row.querySelectorAll("td");
    const problems = cells[2].innerText;
    const cell = cells[1];
    const aTag = cell.querySelector("a");
    const url = aTag.getAttribute("href");
    assert(url);
    const text = aTag.innerHTML;
    const tagId = url.split("/")[3];
    tags.push([tagId, text, +problems]);
  }
  return tags;
};

(async () => {
  const tags = await getTags();
  for (const [tagId, name, problems] of tags) {
    console.log(tagId, name, problems);
  }
  return;
  const url = solvedUrl("!solved_by:admathnoob");
  const problems = await getProblems(url);
  // console.log(problems.length);
  const easier = problems.filter((problem: Problem) => {
    // return problem.acceptedUserCount >= 40;
    return problem.votedUserCount > 0;
  });
  // console.log(easier);
  // const url = solvedUrl("!solved_by:admathnoob tier:24..25");
  const res = await axios.get(url);
})();
