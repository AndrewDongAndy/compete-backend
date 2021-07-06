import { getNextDate } from "./nextDate";
import { listRedis } from "./redisClients";

export const getList = async (
  username: string,
  tagId: number
): Promise<string[]> => {
  const key = `${username}:${tagId}`;
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
  tagId: number,
  ids: string[]
): Promise<void> => {
  const key = `${username}:${tagId}`;
  // expire at the next midnight
  const expiryDate = getNextDate();
  const expiryTime = expiryDate.getTime() / 1000; // convert to seconds
  await listRedis
    .multi()
    .rpush(key, ids) // push to the right
    .expireat(key, expiryTime)
    .exec();
};
