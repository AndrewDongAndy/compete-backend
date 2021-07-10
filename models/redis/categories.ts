import { getNextDate } from "./nextDate";
import { categoriesRedis } from "./redisClients";

export const getUserTags = async (username: string): Promise<number[]> => {
  // convert to number
  const tags = await categoriesRedis.smembers(username);
  return tags.map((i) => +i);
};

export const setUserTags = async (
  username: string,
  tags: number[]
): Promise<void> => {
  // expire at the next midnight
  const expiryDate = getNextDate();
  const expiryTime = expiryDate.getTime() / 1000; // convert to seconds
  // console.log("setting user tags expiry:", expiryDate, expiryTime);
  await categoriesRedis
    .multi()
    .del(username) // clear all to be safe and avoid race conditions?
    .sadd(username, tags)
    .expireat(username, expiryTime)
    .exec();
};
