import { IAppLogger } from "./IAppLogger";
import { IConfigProvider } from "./IConfigProvider";
import { IAdapters } from "./IAdapters";
import { IDatabaseAdapter } from "./IAdapters";
import { RedisClientType } from "redis";
import { Router } from "express";

export interface IAppContainer {
    // Core dependencies
    logger: IAppLogger;
    config: IConfigProvider;
    adapters?: IAdapters;
    mongoDB?: IDatabaseAdapter;
    redis?: RedisClientType;

    // Controllers (auto-registered via loadModules)
    healthController?: any;

    // Routes (auto-registered via loadModules)
    healthRoutes?: Router;

    // Services (auto-registered via loadModules)
    [key: string]: any; // Allow dynamic registration of modules
}
