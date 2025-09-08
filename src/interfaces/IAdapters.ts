import { Connection } from 'mongoose';

export interface IDatabaseAdapter {
    primary: Connection;
}

export interface ICacheAdapter {
    secondary: any; // Redis client type
}

export interface IImageUploadAdapter {
    primary: any; // Cloudinary instance type
}

export interface IGraphDBAdapter {
    primary: any; // Neo4j driver type
}

export interface IAdapters {
    db: IDatabaseAdapter;
    cache?: ICacheAdapter;
    imageUpload?: IImageUploadAdapter;
    graphDB?: IGraphDBAdapter;
}

// MongoDB Connection Options Interface
export interface MongoConnectionOptions {
    maxPoolSize: number;
    serverSelectionTimeoutMS: number;
    socketTimeoutMS: number;
    family: number;
    retryWrites: boolean;
    w: "majority" | number | string;
    readPreference: "primary" | "primaryPreferred" | "secondary" | "secondaryPreferred" | "nearest";
    compressors: ("zlib" | "none" | "snappy" | "zstd")[];
}
