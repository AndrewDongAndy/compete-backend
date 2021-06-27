import { getProblem, getProblems } from "./problems";
import { getSubs } from "./subs";
import { getTags } from "./tags";
import { getUserSolves } from "./user";

const delay = async (ms: number) => {
  await new Promise((f) => setTimeout(f, ms));
};

// TODO: this might change
const tierBadgeUrl = (tier: string | number) => {
  return `https://d2gd6pc034wcta.cloudfront.net/tier/${tier}.svg`;
};

(async () => {
  // const solves = await getUserSolves("admathnoob");
  // console.log(solves);
  // return;

  // const subs = await getSubs({
  //   userId: "admathnoob",
  //   problemId: "22020",
  // });
  // console.log(subs);
  // return;

  const tags = await getTags();
  console.log(tags);

  delay(1000);

  // etc=ml gives multilingual problems
  const problems = await getProblems({
    tier: [23],
    tags: ["25", "124"],
    multilingual: true, // increase the chance of English
  });
  const english = problems.filter((problem) => {
    // keep only the problems whose titles are entirely alphanumeric;
    // to increase the chance of English
    return /^[a-z ]*$/i.test(problem.title);
  });
  // console.log(english);
  // const problem = await getProblem(problems[0].id);
  // console.log(problem, problems[0]);
  return;
})();
