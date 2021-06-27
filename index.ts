import axios from "axios";
import { HTMLElement, parse as parseHtml } from "node-html-parser";

import "./platforms/boj";

const base = "https://open.kattis.com";

(async () => {
  axios.defaults.baseURL = base;
  const res = await axios.get<string>("/problems?order=problem_difficulty");
  const root = parseHtml(res.data).removeWhitespace();
  const problems = root.querySelectorAll(".odd, .even");
  // console.log("number of problems found:", problems.length); // 100
  const problemRow = problems[0];
  const name = problemRow.firstChild as HTMLElement;
  const aTag = name.firstChild as HTMLElement;
  const link = aTag.getAttribute("href");
  // console.log(`${base}${link}`);
  const difficulty = +problemRow.childNodes[8].innerText;
  // console.log("difficulty:", difficulty);
})();
