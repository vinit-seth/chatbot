import IORedis from "ioredis";

// This creates a singleton instance of the Redis client.
const redis = new IORedis(process.env.REDIS_URL as string);

export default redis;