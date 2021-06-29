import { Request, Response } from "express";
import { getProblems } from "../platforms/boj/problems";

export const problemsGet = async (
  req: Request,
  res: Response
): Promise<void> => {
  const query = req.query;
  const problems = await getProblems(query);

  const english = problems.filter((problem) => {
    // keep only the problems whose titles are entirely alphanumeric;
    // to increase the chance of English
    return /^[a-z ]*$/i.test(problem.title);
  });
  res.status(200).send(english);
};
