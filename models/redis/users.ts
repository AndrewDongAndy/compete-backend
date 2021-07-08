/*
Redis caching.
*/

import { usersRedis } from "./redisClients";

const USER_TTL = 7 * 24 * 60 * 60; // one week
