/*
The HTML format is:
*/

import axios from "axios";

axios.defaults.baseURL = "https://open.kattis.com";

(async () => {
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
