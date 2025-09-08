// src/adapters/redis.ts
import { createClient, RedisClientType } from "redis";
import { IAppLogger } from "../interfaces/IAppLogger";
import { IConfigProvider } from "../interfaces/IConfigProvider";

// Redis connection factory
export const createRedisConnection = async (logger: IAppLogger, config: IConfigProvider): Promise<RedisClientType> => {
    try {
        const redisConfig = config.get("cache").redis;
        const redisUrl = `redis://${redisConfig.host}:${redisConfig.port}`;
        const client = createClient({
            url: redisUrl,
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        return false; // Stop reconnecting
                    }
                    return Math.min(retries * 100, 3000); // Exponential backoff with max 3s
                }
            }
        }) as RedisClientType;

        // Redis connection event handlers
        client.on("error", (err) => {
            logger.error("Redis Client Error", err);
        });

        client.on("connect", () => {
            logger.info("Redis client connected");
        });

        client.on("ready", () => {
            logger.info("Redis client ready");
        });

        client.on("end", () => {
            logger.info("Redis connection ended");
        });

        client.on("reconnecting", () => {
            logger.info("Redis client reconnecting...");
        });

        await client.connect();
        logger.info("Redis connected successfully");
        return client;
    } catch (error) {
        logger.error("Failed to create Redis connection", error as Error);
        throw error;
    }
}

// Redis disconnection helper
export const disconnectRedis = async (client: RedisClientType, logger: IAppLogger): Promise<void> => {
    try {
        await client.disconnect();
        logger.info("Redis disconnected successfully");
    } catch (error) {
        logger.error("Failed to disconnect Redis", error as Error);
        throw error;
    }
};
