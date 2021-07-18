/*
GET /boj/problem/:id

query parameters:
id: the id of the problem data to get
*/

import { Request, Response } from "express";
import { fetchProblemBoj } from "../../platforms/boj/fetchProblemsFromBoj";

export const problemGet = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const problem = await fetchProblemBoj(id);
  if (problem) {
    res.status(200).send(problem);
  } else {
    res.status(404).send({ message: "problem does not exist" });
  }
};
