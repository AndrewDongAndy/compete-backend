import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  LoginRequest,
  RefreshTokenResponse,
  RegisterFields,
} from "../common/interfaces/requests";
import config from "../config";

import { User } from "../models/User";
import {
  clearRefreshToken,
  createAccessToken,
  sendRefreshToken,
} from "../auth/tokens";
import { getUserSolves } from "../platforms/boj/user";
import { fetchUserSolves } from "../platforms/cf/user";

const getRegisterErrors = async (err): Promise<RegisterFields> => {
  // console.log(err.message, err.code);
  const errors: RegisterFields = {
    username: "",
    email: "",
    password: "",
    bojId: "",
    cfId: "",
  };
  if (err.code == 11000) {
    // duplicate something?
    // TODO: make this better lol
    errors.email = "a user with that username or email already exists";
    return errors;
  }
  if (err.message.includes("User validation failed")) {
    for (const { properties } of Object.values<any>(err.errors)) {
      // console.log(properties);
      // console.log(properties.path, properties.message);
      errors[properties.path] = properties.message;
    }
  }
  return errors;
};

const getLoginErrors = (err) => {
  const errors = { username: "", password: "" };
  const errorMessage: string = err.message;
  // console.log(errorMessage);
  if (errorMessage.includes("username")) {
    errors.username = errorMessage;
  } else if (errorMessage.includes("password")) {
    errors.password = errorMessage;
  }
  return errors;
};

export const registerPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  // console.log("received post request for registration");
  const { username, email, password, bojId, cfId }: RegisterFields = req.body;
  try {
    const validBojId = bojId == "" || (await getUserSolves(bojId)) != null;
    const validCfId = cfId == "" || (await fetchUserSolves(cfId)) != null;
    if (!validBojId || !validCfId) {
      res.status(400).send({
        errors: {
          username: "",
          email: "",
          password: "",
          bojId: !validBojId ? "that BOJ handle does not exist" : "",
          cfId: !validCfId ? "that CF handle does not exist" : "",
        },
      });
      return;
    }
    const user = await User.create({
      username,
      email,
      password,
      boj: {
        userId: bojId,
      },
      cf: {
        userId: cfId,
      },
    });
    // successfully created
    await (User as any).login(username, password);
    sendRefreshToken(res, user);
    const accessToken = createAccessToken(user);
    res.status(201).send({ accessToken });
  } catch (err) {
    const errors = await getRegisterErrors(err);
    // console.log(errors);
    res.status(400).send({ errors });
  }
};

export const loginPost = async (req: Request, res: Response): Promise<void> => {
  const { username, password }: LoginRequest = req.body;
  try {
    const user = await (User as any).login(username, password);
    // succeeded
    sendRefreshToken(res, user);
    const accessToken = createAccessToken(user);
    res.status(200).send({ accessToken });
  } catch (err) {
    const errors = getLoginErrors(err);
    // console.log(errors);
    res.status(400).send({ errors });
  }
};

export const logoutPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { accessToken } = req.body;
  // console.log("logout called: received access token", accessToken);
  if (accessToken == "") {
    // console.log("empty access token received");
    res.status(400).send({ ok: false });
    return;
  }

  // get the payload
  let payload: any = "";
  try {
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    // console.log("tampered with request?", err);
    res.status(400).send({ ok: false });
    return;
  }
  // console.log("payload:", payload);
  const { username } = payload;

  await User.findOneAndUpdate(
    { username },
    {
      $inc: { tokenVersion: +1 },
    }
  );
  clearRefreshToken(res);
  // need to send something back, otherwise a timeout response occurs?
  res.status(200).send({ ok: true });
};

export const refreshTokenPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  // TODO: add status 201/400 stuff?
  // console.log("cookies:", req.cookies);
  let response: RefreshTokenResponse = { ok: false, accessToken: "" };
  const token = req.cookies[config.REFRESH_TOKEN_COOKIE_NAME];
  if (!token) {
    // console.log("no refresh token cookie present");
    res.send(response);
    return;
  }

  // get the payload
  let payload: any = "";
  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    // console.log("tampered with request?", err);
    res.send(response);
    return;
  }
  // console.log("payload:", payload);

  // the user should exist now
  const user = await User.findOne({ username: payload.username });
  if (!user) {
    // console.log("somehow passed an invalid user");
    // this might change if we allow users to delete their accounts?
    res.send(response);
    return;
  }
  if (user.tokenVersion != payload.tokenVersion) {
    // console.log("outdated token");
    res.send(response);
    return;
  }
  sendRefreshToken(res, user);
  response = { ok: true, accessToken: createAccessToken(user) };
  res.send(response);
};
