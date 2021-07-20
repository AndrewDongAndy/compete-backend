/*
GET /user/:username

query parameters:
username: the username whose data to get


GET /users
returns all users

PUT /user-info
accessToken: access token for the user to change
bojId: the new BOJ ID, or an empty string if clearing
cfId: the new CF ID, or an empty string if clearing
*/

import { Request, Response } from "express";
import { UpdateFields } from "../common/interfaces/requests";

import { User as UserModel } from "../models/User";

import boj from "../platforms/base/boj";
import cf from "../platforms/base/cf";

export const userGet = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;

  const user = await UserModel.findOne({ username });
  if (user) {
    res.status(200).send(user);
  } else {
    res.status(404).send({ message: "user does not exist" });
  }
};

export const usersGet = async (_req: Request, res: Response): Promise<void> => {
  const users = await UserModel.find({});
  res.status(200).send(users);
};

export const userInfoPut = async (
  req: Request,
  res: Response
): Promise<void> => {
  // goes through verifyAccessToken middleware
  const { username } = req.body;
  const { bojId, cfId }: UpdateFields = req.body;
  // console.log(`modifying handles for ${username}:`, bojId, cfId);

  const user = await UserModel.findOne({ username });
  if (!user) {
    res.sendStatus(404);
    return;
  }

  const validBojId = bojId == "" || (await boj.getSolvedIds(bojId)) != null;
  const validCfId = cfId == "" || (await cf.getSolvedIds(cfId)) != null;
  if (!validBojId || !validCfId) {
    res.status(400).send({
      errors: {
        bojId: !validBojId ? "that BOJ handle does not exist" : "",
        cfId: !validCfId ? "that CF handle does not exist" : "",
      },
    });
    return;
  }
  try {
    await UserModel.updateOne(
      { username },
      {
        $set: {
          "boj.userId": bojId,
          "cf.userId": cfId,
        },
      }
    );
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500);
  }
};

// export const userDelete = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { username } = req.params;
//   await User.deleteOne({ username });
//   res.send(201).send({ message: "user deleted" });
// };
