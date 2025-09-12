import { IAppLogger } from '../interfaces/IAppLogger';
import { IConfigProvider } from '../interfaces/IConfigProvider';
import { Connection } from 'mongoose';
import { RedisClientType } from 'redis';
import { IAdapters } from '../interfaces/IAdapters';
import { ILoggerConfig } from '../interfaces/IAppLogger';
import { AwilixContainer } from 'awilix';
import { IAppContainer } from '../interfaces/IAppContainer';

// Adapter Factory Types
export type MongoAdapterFactory = (container: AwilixContainer<IAppContainer>) => Promise<Connection>;
export type RedisAdapterFactory = (logger: IAppLogger, config: IConfigProvider) => Promise<RedisClientType>;
export type LoggerFactory = (config: ILoggerConfig) => Promise<IAppLogger>;
export type AdapterFactory = (container: AwilixContainer<IAppContainer>) => Promise<IAdapters>;
