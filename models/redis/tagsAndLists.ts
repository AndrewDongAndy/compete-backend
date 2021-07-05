import { listRedis, tagsRedis } from "./redisClients";

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

export const getUserTags = async (username: string): Promise<number[]> => {
  // convert to number
  const tags = await tagsRedis.smembers(username);
  return tags.map((i) => +i);
};

export const setUserTags = async (
  username: string,
  tags: number[]
): Promise<void> => {
  // expire at the next midnight
  const expiryTime = new Date().setHours(24, 0, 0, 0);
  await tagsRedis
    .multi()
    .sadd(username, tags)
    .expireat(username, expiryTime)
    .exec();
};
