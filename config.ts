import dotenv from "dotenv";
dotenv.config();

const DOMAIN = "andrewdong.me";

const config = {
  // allowed CORS origin
  ORIGIN:
    process.env.NODE_ENV == "production"
      ? `https://compete.${DOMAIN}`
      : "http://localhost:3000",

  BACKEND_SERVER_URL:
    process.env.NODE_ENV == "production"
      ? `https://api.compete.${DOMAIN}`
      : `http://localhost:${process.env.PORT}`,

  // name of the cookie that stores the refresh token;
  // not touched on the frontend
  REFRESH_TOKEN_COOKIE_NAME: "compete_refresh_token",

  // token expiry times
  ACCESS_TOKEN_EXPIRY_TIME: "15m",
  REFRESH_TOKEN_EXPIRY_TIME: "7d",
  REFRESH_TOKEN_EXPIRY_TIME_MILLIS: 1000 * 60 * 60 * 24 * 7,

  // when the data refreshes: 8:30 AM
  REFRESH_HOUR: 8,
  REFRESH_MINUTE: 30,
};

export default config;
