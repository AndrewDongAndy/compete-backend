import assert from "assert";
// import translate from "google-translate-api";

import { FullProblem } from "../../common/interfaces/data";

import { getParsedHtml } from "../../util/getHtml";
import { getTable, parseTable } from "../../util/table";

const problemUrl = (problemId: string) => {
  return `https://www.acmicpc.net/problem/${problemId}`;
};

const problemSetUrl = (query: string) => {
  return `https://www.acmicpc.net/problemset?${query}`;
};

type BojHtmlProblemData = {
  problem_id: string;
  problem_lang: string;
  title: string;
  description: string;
  input: string;
  output: string;
  hint: string;
  original: string;
  html_title: string;
  problem_lang_tcode: string;
};

export const fetchProblemBoj = async (id: string): Promise<FullProblem> => {
  const html = await getParsedHtml(problemUrl(id));
  const base64 = html.querySelectorAll("#problem-lang-base64");

  let title: string;
  let statement = "";
  let inputSpec = "";
  let outputSpec = "";
  if (base64.length == 0) {
    // detect if Korean?
    // const text = html.querySelector("#problem_title").innerText;
    // const res = await translate(text);
    // html.querySelector("#problem_title").set_content(res.text);
    title = html.querySelector("#problem_title").innerText;
    statement = html.querySelector("#problem_description").innerHTML;
    inputSpec = html.querySelector("#problem_input").innerHTML;
    outputSpec = html.querySelector("#problem_output").innerHTML;
    // console.log("innerText:", html.innerText);
  } else {
    const s = base64[0].innerText;
    const byLanguage: BojHtmlProblemData[] = JSON.parse(
      Buffer.from(s, "base64").toString()
    );
    let data = byLanguage.find((d) => d.problem_lang_tcode == "English");
    if (!data) {
      data = byLanguage[0];
    }
    title = data.title;
    statement = data.description;
    inputSpec = data.input;
    outputSpec = data.output;
  }

  const table = html.querySelector("table");
  const { rows } = parseTable(table);
  assert(rows.length == 1);

  // const row = rows[0];
  // const cells = row.querySelectorAll("td");
  // const numSolved = +cells[4].innerText;
  // const numSubs = +cells[2].innerText;
  // const fractionSolved = 0.01 * parseFloat(cells[5].innerText);
  return {
    id,
    title,
    platform: "boj",
    difficulty: -1, // TODO: something
    statementHtml: statement,
    inputSpecHtml: inputSpec,
    outputSpecHtml: outputSpec,
    // numSolved,
    // numSubs,
    // fractionSolved,
  };
  // TODO: check whether these (scraped) stats are what I think they are
};

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
}: ProblemQuery): Promise<FullProblem[]> => {
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
    return fetchProblemBoj(id);
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
