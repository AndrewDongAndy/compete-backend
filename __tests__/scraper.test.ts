import { getProblem, getProblems } from "../platforms/boj/problems";
import { getSubs } from "../platforms/boj/subs";
import { getTags } from "../platforms/boj/tags";
import { getUserSolves } from "../platforms/boj/user";

describe("Baekjoon Online Judge scraper", () => {
  const userId = "admathnoob";
  const problemId = "9244";

  it("can fetch user", async () => {
    const solves = await getUserSolves(userId);
    expect(solves.accepted.length).toBeGreaterThan(0);
  });

  it("can fetch a problem", async () => {
    const problem = await getProblem(problemId);
    expect(problem.title).toEqual("핀볼");
  });

  it("can fetch a set of problems", async () => {
    const problems = await getProblems({
      tier: [23],
      tags: ["25", "124"],
      multilingual: true, // increase the chance of English
    });
    expect(problems.length).toBeGreaterThan(0);
  });

  it("can fetch tags", async () => {
    const tags = await getTags();
    expect(tags.length).toBeGreaterThanOrEqual(100);
  });

  it("can fetch submissions", async () => {
    const subs = await getSubs({ problemId: "9244", userId: "admathnoob" });
    expect(subs.length).toBeGreaterThan(0);
    const allSubs = await getSubs();
    expect(allSubs.length).toBeGreaterThan(0);
  });
});
