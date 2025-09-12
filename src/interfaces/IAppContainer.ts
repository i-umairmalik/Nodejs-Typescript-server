import { IAppLogger } from "./IAppLogger";
import { IConfigProvider } from "./IConfigProvider";
import { IAdapters } from "./IAdapters";
import { IDatabaseAdapter } from "./IAdapters";
import { RedisClientType } from "redis";
import { Router } from "express";
import * as mongoose from "mongoose";

// Interface for helpers object
export interface IHelpers {
    mongoose: typeof mongoose;
    _: any; // lodash
    Joi: any;
    Boom: any;
    Jwt: any;
    Utility: any;
    crypto: any;
    mime: any;
    path: any;
    moment: any;
}

export interface IAppContainer {
    // Core dependencies
    logger: IAppLogger;
    config: IConfigProvider;
    helpers: IHelpers; // Contains mongoose, lodash, joi, etc.
    adapters?: IAdapters;
    mongoDB?: mongoose.Connection;
    redis?: RedisClientType;
    // Controllers (auto-registered via loadModules)
    healthController?: any;

    // Routes (auto-registered via loadModules)
    healthRoutes?: Router;

    // Services (auto-registered via loadModules)
    [key: string]: any; // Allow dynamic registration of modules
}
