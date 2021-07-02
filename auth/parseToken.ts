import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: () => void): void => {
  const { accessToken } = req.body;
  // if (!accessToken) {
  //   // forbidden
  //   res.sendStatus(403);
  //   return;
  // }
  let payload: any;
  try {
    // does this throw for an empty accessToken too?
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    // forbidden
    res.sendStatus(403);
    return;
  }
  req.body.username = payload.username;
  next();
};

export default verifyToken;
