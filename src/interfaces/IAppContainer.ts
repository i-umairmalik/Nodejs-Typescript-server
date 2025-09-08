import { IAppLogger } from "./IAppLogger";
import { IConfigProvider } from "./IConfigProvider";
import { IAdapters } from "./IAdapters";
import { IDatabaseAdapter } from "./IAdapters";
import { RedisClientType } from "redis";

export interface IAppContainer {
    logger: IAppLogger;
    config: IConfigProvider;
    adapters?: IAdapters;
    mongoDB?: IDatabaseAdapter;
    redis?: RedisClientType;
}
