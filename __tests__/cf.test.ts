import cf from "../platforms/base/cf";

describe("Codeforces API", () => {
  const cfId = "admathnoob";

  it("can fetch a user's solves", async () => {
    const solves = await cf.getSolvedIds(cfId);
    expect(solves.length).toBeGreaterThan(100);
  });

  it("can fetch newer problems", async () => {
    await cf.fetchProblems();
  });
});
