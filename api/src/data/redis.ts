import * as ioredis from 'ioredis'

let redis = null;
export function getRedis(): ioredis.Redis {
  if (!redis) {
    redis = new ioredis();
  }
  return redis;
}

export function getSubscriber(): ioredis.Redis {
  return new ioredis();
}
