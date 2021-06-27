import { getTable } from "../../util/table";

const subsUrl = (query: string) => {
  return `https://www.acmicpc.net/status?${query}`;
};

interface SubQuery {
  problemId?: string;
  userId?: string;
}

interface Sub {
  subId: string;
  userId: string;
  problemId: string;
  result: string;
  memory: number; // in KB
  time: number; // in ms
}

/*
A row has the form:
<tr id="solution-26848090">
  <td>26848090</td>
  <td><a href="/user/lovelydays95">lovelydays95</a></td>
  <td>
    <a
      href="/problem/1180"
      rel="tooltip"
      data-placement="right"
      title="Cactus Reloaded"
      class="problem_title tooltip-click"
    >
      1180
    </a>
  </td>
  <td class="result">
    <span class="result-text"><span class="result-ac">맞았습니다!!</span></span>
  </td>
  <td class="memory">12640<span class="kb-text"></span></td>
  <td class="time">40<span class="ms-text"></span></td>
  <td>C++17</td>
  <td>1852<span class="b-text"></span></td>
  <td>
    <a
      href="javascript:void(0);"
      rel="tooltip"
      data-placement="top"
      title="2021-03-01 13:37:40"
      data-timestamp="1614573460"
      class="real-time-update show-date"
      data-method="from-now"
      >3달 전</a
    >
  </td>
</tr>
*/
export const getSubs = async ({ problemId, userId }: SubQuery = {}): Promise<
  Sub[]
> => {
  const query: string[] = [];
  if (problemId) query.push(`problem_id=${problemId}`);
  if (userId) query.push(`user_id=${userId}`);

  const url = subsUrl(query.join("&"));
  // console.log(url);

  const { rows } = await getTable(url, "#status-table");
  const subs: Sub[] = [];
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
  return subs;
};
