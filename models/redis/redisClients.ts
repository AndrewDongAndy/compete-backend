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

  // r.flushall().then(() => {
  //   console.log("flushed namespace with prefix", keyPrefix);
  // });

  return r;
};

export const tagsRedis = getRedis("t:");
export const problemsRedis = getRedis("p:");
export const listRedis = getRedis("l:");
