/*
c:<username> stores categories for the day
c:<judge>:<categoryId> stores a set
*/

import { PlatformName } from "../../common/interfaces/platforms";
import { getNextDate } from "./nextDate";
import { categoriesRedis } from "./redisClients";

const BY_CATEGORY_TTL = 7 * 24 * 60 * 60; // one week

export const getUserCategories = async (
  username: string
): Promise<number[]> => {
  // convert to number
  const categories = await categoriesRedis.smembers(username);
  return categories.map((i) => +i);
};

export const setUserCategories = async (
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

export const cacheCategoryIds = async (
  categoryId: number,
  platform: PlatformName,
  ids: string[]
): Promise<void> => {
  const key = `${platform}:${categoryId}`;
  await categoriesRedis
    .multi()
    .sadd(key, ...ids)
    .expire(key, BY_CATEGORY_TTL)
    .exec();
};

export const getCategoryIds = async (
  categoryId: number,
  platform: PlatformName
): Promise<string[]> => {
  // this function is only called when the server starts so it is okay
  // if the values expire while the server is running; fresh data will
  // just get cached next time
  const key = `${platform}:${categoryId}`;
  const res = await categoriesRedis.smembers(key);
  return res;
};
