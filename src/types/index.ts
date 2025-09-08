import { IAppLogger } from '../interfaces/IAppLogger';
import { IConfigProvider } from '../interfaces/IConfigProvider';
import { Connection } from 'mongoose';
import { RedisClientType } from 'redis';
import { IAdapters } from '../interfaces/IAdapters';
import { ILoggerConfig } from '../interfaces/IAppLogger';

// Adapter Factory Types
export type MongoAdapterFactory = (logger: IAppLogger, config: IConfigProvider) => Promise<Connection>;
export type RedisAdapterFactory = (logger: IAppLogger, config: IConfigProvider) => Promise<RedisClientType>;
export type LoggerFactory = (config: ILoggerConfig) => Promise<IAppLogger>;
export type AdapterFactory = (logger: IAppLogger, config: IConfigProvider) => Promise<IAdapters>;
