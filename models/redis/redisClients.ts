import Redis from "ioredis";
import { exit } from "process";

const getRedis = (keyPrefix: string) => {
  const r = new Redis(process.env.REDIS_URL, {
    keyPrefix, // prepend to all keys
    showFriendlyErrorStack: true,
  });

  r.on("error", (err) => {
    console.error("Redis server failed to connect:", err);
    exit(1);
  });

  r.on("connect", () => {
    console.log(`redis with prefix "${keyPrefix}" is connected`);
  });

  return r;
};

export const categoriesRedis = getRedis("c:");
export const listRedis = getRedis("l:");
export const problemsRedis = getRedis("p:");
export const usersRedis = getRedis("u:");
