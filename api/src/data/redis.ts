import * as ioredis from 'ioredis'
import * as config from 'config';

const redisHost = config.get<string>('redis.host');
const redisPort = config.get<number>('redis.port');

let redis = null;
export function getRedis(): ioredis.Redis {
  if (!redis) {
    redis = new ioredis(redisPort, redisHost);
  }
  return redis;
}

export function getSubscriber(): ioredis.Redis {
  return new ioredis();
}
