// import {
//   ProblemBoj,
//   getProblemsBoj,
// } from "../platforms/boj/fetchProblemsFromBoj";
import { getSubs } from "../platforms/boj/subs";
import { getTags } from "../platforms/boj/tags";
import { getUserSolves } from "../platforms/boj/user";

describe("Baekjoon Online Judge scraper", () => {
  const bojId = "admathnoob";
  const problemId = "9244";
  // const title = "핀볼";

  it("can fetch user", async () => {
    const solves = await getUserSolves(bojId);
    expect(solves?.accepted.length).toBeGreaterThan(100);
  });

  // it("can fetch a problem", async () => {
  //   const problem = await ProblemBoj.fromId(problemId);
  //   const props = problem.props;
  //   expect(props.id).toBe(problemId);
  //   expect(props.title).toBe(title);
  //   expect(props.numSolved).toBeGreaterThan(10);
  //   expect(props.numSubs).toBeGreaterThanOrEqual(524);
  //   expect(props.fractionSolved).toBeGreaterThan(0);
  //   expect(props.fractionSolved).toBeLessThan(1);
  // });

  // it("can fetch a set of problems", async () => {
  //   const problems = await getProblemsBoj({
  //     tier: [23],
  //     tags: ["25", "124"],
  //     multilingual: true, // increase the chance of English
  //   });
  //   expect(problems.length).toBeGreaterThan(0);
  // });

  it("can fetch tags", async () => {
    const tags = await getTags();
    expect(tags.length).toBeGreaterThanOrEqual(100);
  });

  it("can fetch submissions", async () => {
    const subs = await getSubs({ problemId, userId: bojId });
    expect(subs.length).toBeGreaterThan(0);
    const allSubs = await getSubs();
    expect(allSubs.length).toBeGreaterThan(0);
  });
});
