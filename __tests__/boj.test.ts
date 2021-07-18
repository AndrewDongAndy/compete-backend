import boj from "../platforms/base/boj";

describe("Baekjoon Online Judge API", () => {
  const bojId = "admathnoob";

  it("can fetch a user's solves", async () => {
    const solves = await boj.getSolvedIds(bojId);
    expect(solves.length).toBeGreaterThan(100);
  });
});
