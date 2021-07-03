import assert from "assert";
import axios from "axios";
import { getParsedHtml } from "../../util/getHtml";
import { getTable, parseTable } from "../../util/table";

const problemUrl = (problemId: string) => {
  return `https://www.acmicpc.net/problem/${problemId}`;
};

const problemSetUrl = (query: string) => {
  return `https://www.acmicpc.net/problemset?${query}`;
};

export type ProblemProps = {
  id: string;
  title: string;
  numSolved: number;
  numSubs: number;
  fractionSolved: number;
};

export class ProblemBoj implements ProblemProps {
  constructor(
    public id: string,
    public title: string,
    public numSolved: number,
    public numSubs: number,
    public fractionSolved: number
  ) {}

  get url(): string {
    return problemUrl(this.id);
  }

  get props(): ProblemProps {
    return Object.assign({}, this);
  }

  // TODO: check whether these (scraped) stats are what I think they are
  static async fromId(id: string): Promise<ProblemBoj> {
    const html = await getParsedHtml(problemUrl(id));
    const title = html.querySelector("#problem_title").innerText;

    const table = html.querySelector("table");
    const { rows } = parseTable(table);
    assert(rows.length == 1);
    const row = rows[0];

    const cells = row.querySelectorAll("td");
    const numSolved = +cells[4].innerText;
    const numSubs = +cells[2].innerText;
    const fractionSolved = 0.01 * parseFloat(cells[5].innerText);
    return new this(id, title, numSolved, numSubs, fractionSolved);
  }
}

interface ProblemQuery {
  tier?: number[];
  multilingual?: boolean;
  tags?: string[];
}

/**
 * Gets the problems for a BOJ query.
 * @param query the query to use
 */
/*
HTML format:
<tr>
  <td class="list_problem_id">1003</td>
  <td>
    <a href="/problem/1003">피보나치 함수</a>
  </td>
  <td><!-- cell for problem data, e.g. multilingual --></td>
  <td>
    <a href="/status?from_problem=1&problem_id=1003&amp;result_id=4">25413</a>
  </td>
  <td><a href="/status?from_problem=1&problem_id=1003">122410</a></td>
  <td>30.255%</td>
</tr>
*/
export const getProblemsBoj = async ({
  tier,
  multilingual,
  tags,
}: ProblemQuery): Promise<ProblemBoj[]> => {
  // query options
  const query: string[] = [];
  if (tier) query.push(`tier=${tier.join()}`);
  if (multilingual) query.push("etc=ml");
  // default is "algo_if=and"; TODO?: add more later
  if (tags) query.push(`algo=${tags.join()}`, "algo_if=and");

  // get the table
  const url = problemSetUrl(query.join("&"));
  // console.log(url);
  const { rows } = await getTable(url);

  const problems = rows.map(async (row) => {
    const id = row.querySelector(".list_problem_id").innerText;
    return ProblemBoj.fromId(id);
  });
  return Promise.all(problems);

  // const problems = rows.map((row) => {
  //   const cells = row.querySelectorAll("td");
  //   const id = row.querySelector(".list_problem_id").innerText;
  //   const title = cells[1].childNodes[0].innerText;
  //   const numSolved = +cells[3].childNodes[0].innerText;
  //   const numSubs = +cells[4].childNodes[0].innerText;
  //   const fractionSolved = parseFloat(cells[5].innerText) / 100;
  //   return new Problem(id, title, numSolved, numSubs, fractionSolved);
  // });
  // return problems;
};

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

export const getProblemsSolvedAc = async (
  query: string,
  page = 1
): Promise<SolvedProblem[]> => {
  console.log(query, page);
  try {
    const res = await axios.get("https://solved.ac/api/v3/search/problem", {
      params: { query, page },
    });
    // const count: number = res.data.count;
    const items: SolvedProblem[] = res.data.items;
    return items;
  } catch (err) {
    console.log(err);
    return [];
  }
};
