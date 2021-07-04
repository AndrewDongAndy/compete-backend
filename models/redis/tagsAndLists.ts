import { listRedis, tagsRedis } from "./redisClients";

export const getList = async (
  username: string,
  tagId: number
): Promise<string[] | null> => {
  const key = `${username}:${tagId}`;
  if (!(await listRedis.exists(key))) {
    return null;
  }
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
  // TODO: set expiry?
  const key = `${username}:${tagId}`;
  // expire at the next midnight
  const expiryTime = new Date().setHours(24, 0, 0, 0);
  await listRedis
    .multi()
    .rpush(key, ids) // push to the right
    .expireat(key, expiryTime)
    .exec();
};

export const getUserTags = async (
  username: string
): Promise<number[] | null> => {
  if (!(await tagsRedis.exists(username))) {
    return null;
  }
  // convert to number
  return (await tagsRedis.smembers(username)).map((i) => +i);
};

export const setUserTags = async (
  username: string,
  tags: number[]
): Promise<void> => {
  await tagsRedis.sadd(username, tags);
};
