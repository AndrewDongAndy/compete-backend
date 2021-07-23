import assert from "assert";
import { Sub } from "../../common/interfaces/sub";
import { getTable } from "../../util/table";

const subsUrl = (query: string) => {
  return `https://www.acmicpc.net/status?${query}`;
};

// interface SubQuery {
//   problemId?: string;
//   userId?: string;
// }

interface BojSub {
  subId: string;
  userId: string;
  problemId: string;
  result: string;
  memory: number; // in KB
  runningTime: number; // in ms
  date: Date;
}

const convertToSub = (sub: BojSub): Sub => {
  return {
    problemId: sub.problemId,
    platform: "boj",
    forUser: sub.userId,
    subId: sub.subId,
    verdict: "WA",
    memory: sub.memory * 1024, // convert to bytes
    runningTime: sub.runningTime,
    date: sub.date,
  };
};

export const getSubs = async (
  userId?: string,
  problemId?: string
): Promise<Sub[]> => {
  const query: string[] = [];
  if (problemId) query.push(`problem_id=${problemId}`);
  if (userId) query.push(`user_id=${userId}`);

  const url = subsUrl(query.join("&"));
  // console.log(url);

  const { rows } = await getTable(url, "#status-table");
  const subs: BojSub[] = [];
  for (const row of rows) {
    const dateAnchor = row.querySelector(".show-date");
    const unixTime = dateAnchor.getAttribute("data-timestamp");
    assert(unixTime);
    subs.push({
      subId: row.childNodes[0].innerText,
      userId: row.childNodes[1].childNodes[0].innerText,
      problemId: row.childNodes[2].childNodes[0].innerText,
      result: "none",
      // result: row.querySelector(".result>.result-text").firstChild.classNames[0],
      memory: +row.querySelector(".memory").innerText,
      runningTime: +row.querySelector(".time").innerText,
      date: new Date(unixTime),
    });
  }
  return subs.map((s) => convertToSub(s));
};
