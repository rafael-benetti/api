const redisConfig = {
  timeToLive: Number.parseInt(process.env.REDIS_TTL, 10),
};

export default redisConfig;
