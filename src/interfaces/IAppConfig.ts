import { IEncryptionConfig } from "./Encryption";
export interface IMongoDBConfig {
    uri: string;
    port: number;
    dbname: string;
}

export interface IMongoDBClusterConfig {
    uri: string;
    dbName: string;
    options: {
        user: string;
        pass: string;
    };
    prefix_db: string;
    suffix_db: string;
}

export interface IDatabaseConfig {
    mongodb: IMongoDBConfig;
    mongodb_cluster: IMongoDBClusterConfig;
}

export interface INeo4jConfig {
    uri: string;
    port: string;
    options: {
        username: string;
        password: string;
    };
}

export interface IRedisConfig {
    host: string;
    port: number;
}

export interface ICloudinaryConfig {
    cloud_name: string;
    api_key: string;
    api_secret_key: string;
    environemnt: string;
}



export interface IServerConfig {
    port: number;
    host: string;
    secretOrKey: string;
    session_secret: string;
    api_versions: {
        v1: string;
    };
}

export interface IAppConfig {
    environment: string;
    server: IServerConfig;
    database: IDatabaseConfig;
    graphDB: {
        neo4j: INeo4jConfig;
    };
    cache: {
        redis: IRedisConfig;
    };
    cloudinary: ICloudinaryConfig;
    encryption: IEncryptionConfig;
}