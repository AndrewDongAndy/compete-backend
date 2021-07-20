import { Sub } from "../../common/interfaces/sub";
import { getTable } from "../../util/table";

const subsUrl = (query: string) => {
  return `https://www.acmicpc.net/status?${query}`;
};

interface SubQuery {
  problemId?: string;
  userId?: string;
}

interface BojSub {
  subId: string;
  userId: string;
  problemId: string;
  result: string;
  memory: number; // in KB
  time: number; // in ms
}

const convertToSub = (sub: BojSub): Sub => {
  return {
    problemId: sub.problemId,
    platform: "boj",
    forUser: sub.userId,
    subId: sub.subId,
    verdict: "WA",
  };
};

export const getSubs = async ({
  problemId,
  userId,
}: SubQuery): Promise<Sub[]> => {
  const query: string[] = [];
  if (problemId) query.push(`problem_id=${problemId}`);
  if (userId) query.push(`user_id=${userId}`);

  const url = subsUrl(query.join("&"));
  // console.log(url);

  const { rows } = await getTable(url, "#status-table");
  const subs: BojSub[] = [];
  for (const row of rows) {
    subs.push({
      subId: row.childNodes[0].innerText,
      userId: row.childNodes[1].childNodes[0].innerText,
      problemId: row.childNodes[2].childNodes[0].innerText,
      result: row.querySelector(".result").innerText,
      memory: +row.querySelector(".memory").innerText,
      time: +row.querySelector(".time").innerText,
    });
  }
  return subs.map((s) => convertToSub(s));
};
