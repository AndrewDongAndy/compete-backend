/*

GET /:platform/subs?username=<Compete username>&page=<page number>


*/

import assert from "assert";
import { Request, Response } from "express";

import { PlatformName } from "../common/interfaces/platformName";
import { User as UserModel } from "../models/User";
import { getPlatform } from "../platforms/base/platforms";

const SUBS_PER_PAGE = 50;

export const subsGet = async (req: Request, res: Response): Promise<void> => {
  const platformName = req.params.platform as PlatformName;
  const username = req.query.username as string;
  const page = +(req.query.page as string);

  const user = await UserModel.findOne({ username });
  if (!user) {
    res.sendStatus(404);
    return;
  }

  const platform = getPlatform(platformName);
  const subs = await platform.getSubs(user[platformName].userId);
  assert(subs);
  const start = SUBS_PER_PAGE * (page - 1);
  const forPage = subs.slice(start, start + SUBS_PER_PAGE);
  res.status(200).send(forPage);
};
