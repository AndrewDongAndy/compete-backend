/*
GET /user/:username

query parameters:
username: the username whose data to get
*/

import { Request, Response } from "express";

import { User } from "../models/User";

export const userGet = async (req: Request, res: Response): Promise<void> => {
  const username = req.params.username as string;

  const user = await User.findOne({ username });
  if (user) {
    res.status(200).send(user);
  } else {
    res.status(404).send({ message: "user does not exist" });
  }
};
