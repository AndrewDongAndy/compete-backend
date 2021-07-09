import { Request, Response } from "express";
import jwt from "jsonwebtoken";

/**
 * Verifies the access token and parses the username into the request body.
 * @param req request
 * @param res response
 * @param next next
 * @returns void
 */
const verifyAccessToken = (
  req: Request,
  res: Response,
  next: () => void
): void => {
  const { accessToken } = req.body;
  if (!accessToken) {
    // unauthorized
    res.sendStatus(401);
    return;
  }

  try {
    const payload: any = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    req.body.username = payload.username;
  } catch (err) {
    // forbidden
    res.status(403).send({ message: "tampered with accessToken" });
    return;
  }

  next();
};

export default verifyAccessToken;
