/*
Keys are of the form (prefix):<username>:<tagNumber>.
*/

import { listRedis } from "./redisClients";
import { PlatformName } from "../../common/interfaces/platformName";
import { getNextDate } from "./nextDate";

export const getList = async (
  username: string,
  platform: PlatformName,
  tagId: number
): Promise<string[]> => {
  const key = `${username}:${platform}:${tagId}`;
  return listRedis.lrange(key, 0, -1);
};

/**
 *
 * @param username
 * @param tagId
 * @param ids the ids, in INCREASING order of difficulty
 */
export const setList = async (
  username: string,
  platform: PlatformName,
  tagId: number,
  ids: string[]
): Promise<void> => {
  if (ids.length == 0) {
    return; // can't call rpush with no arguments
  }
  const key = `${username}:${platform}:${tagId}`;
  // expire at the next midnight
  const expiryDate = getNextDate();
  const expiryTime = expiryDate.getTime() / 1000; // convert to seconds
  await listRedis
    .multi()
    .rpush(key, ids) // push to the right
    .expireat(key, expiryTime)
    .exec();
};
