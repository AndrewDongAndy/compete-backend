import assert from "assert";
import { getParsedHtml } from "../../util/getHtml";
import { getTable, parseTable } from "../../util/table";

const problemUrl = (problemId: string) => {
  return `https://www.acmicpc.net/problem/${problemId}`;
};

const problemSetUrl = (query: string) => {
  return `https://www.acmicpc.net/problemset?${query}`;
};

class Problem {
  // englishTitle = "";

  // TODO: check these stats
  constructor(
    public id: string,
    public title: string,
    public numSolved: number,
    public numSubs: number,
    public fractionSolved: number
  ) {
    // translate(title, "en").then((text: string) => {
    //   this.englishTitle = text;
    // });
  }

  get url(): string {
    return problemUrl(this.id);
  }
}

interface ProblemQuery {
  tier?: number[];
  multilingual?: boolean;
  tags?: string[];
}

export const getProblem = async (id: string): Promise<Problem> => {
  const html = await getParsedHtml(problemUrl(id));
  const table = html.querySelector("table");
  const { rows } = parseTable(table);
  assert(rows.length == 1);
  const row = rows[0];
  const title = html.querySelector("#problem_title").innerText;

  const cells = row.querySelectorAll("td");
  const numSolved = +cells[4].innerText;
  const numSubs = +cells[2].innerText;
  const fractionSolved = parseFloat(cells[5].innerText) / 100;
  return new Problem(id, title, numSolved, numSubs, fractionSolved);
};

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
export const getProblems = async ({
  tier,
  multilingual,
  tags,
}: ProblemQuery): Promise<Problem[]> => {
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

  const problems: Problem[] = rows.map((row) => {
    const cells = row.querySelectorAll("td");
    const id = row.querySelector(".list_problem_id").innerText;
    const title = cells[1].childNodes[0].innerText;
    const numSolved = +cells[3].childNodes[0].innerText;
    const numSubs = +cells[4].childNodes[0].innerText;
    const fractionSolved = parseFloat(cells[5].innerText) / 100;
    return new Problem(id, title, numSolved, numSubs, fractionSolved);
  });
  return problems;
};
