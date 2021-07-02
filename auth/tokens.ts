import { Response } from "express";
import jwt from "jsonwebtoken";

import config from "../config";
import { IUser } from "../models/User";

export const createAccessToken = (user: IUser): string => {
  return jwt.sign(
    { username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: config.ACCESS_TOKEN_EXPIRY_TIME }
  );
};

// not exported
const createRefreshToken = (user: IUser): string => {
  return jwt.sign(
    { username: user.username, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: config.REFRESH_TOKEN_EXPIRY_TIME }
  );
};

/**
 * Adds a cookie for the given response
 * @param res the response to send the cookie to
 * @param user the user to send for
 */
export const sendRefreshToken = (res: Response, user: IUser): void => {
  const token = createRefreshToken(user);
  res.cookie(config.REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    // maxAge is in milliseconds
    maxAge: config.REFRESH_TOKEN_EXPIRY_TIME_MILLIS,
  });
  // console.log("sent refresh token");
};

/**
 * Clears the refresh token.
 * @param res the response where the cookie should be cleared
 */
export const clearRefreshToken = (res: Response): void => {
  res.cookie(config.REFRESH_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    maxAge: 1,
  });
};
