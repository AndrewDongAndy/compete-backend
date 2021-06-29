/*
Currently not working unless both the refresh token and the access token
are defined in the .env file.
*/

import { readFileSync } from "fs";
import { google } from "googleapis";
import Handlebars from "handlebars";
import nodemailer from "nodemailer";
import { exit } from "process";

import dotenv from "dotenv";
dotenv.config();

const { user, clientId, clientSecret, refreshToken } = process.env;
const redirectUri = "https://developers.google.com/oauthplayground";

const client = new google.auth.OAuth2({
  clientId,
  clientSecret,
  redirectUri,
});
client.setCredentials({
  refresh_token: refreshToken,
  scope: "https://mail.google.com/",
});

const reminderTemplate = Handlebars.compile(
  // path is relative to root
  readFileSync("./mailer/reminder.html", { encoding: "utf-8" })
);

export const sendReminder = async (
  to: string | string[],
  username = "admathnoob" // TODO: check
): Promise<boolean> => {
  // let accessToken: string;
  // try {
  //   const res = await client.getAccessToken();
  //   console.log("res:", res);
  //   accessToken = res.token as string;
  // } catch (err) {
  //   console.error(err);
  //   return false;
  // }
  const accessToken = process.env.accessToken;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "oauth2",
      user,
      clientId,
      clientSecret,
      refreshToken,
      accessToken,
    },
  });

  transporter.on("token", (token) => {
    console.log("received token:", token);
  });

  try {
    const from = process.env.user;
    console.log(`trying to send email from ${from} to ${to}`);
    const info = await transporter.sendMail({
      from,
      to,
      subject: "First Email with Nodemailer",
      html: reminderTemplate({ username, days: 3 }),
    });
    console.log(info);
  } catch (err) {
    console.error(err);
    exit(1);
  }
  return true;
};
