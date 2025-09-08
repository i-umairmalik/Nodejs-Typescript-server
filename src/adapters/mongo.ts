import mongoose, { Connection, ConnectOptions } from 'mongoose';
import { IAppLogger } from '../interfaces/IAppLogger';
import {
  IMongoDBClusterConfig
} from '../interfaces/IAppConfig';
import { IConfigProvider } from '../interfaces/IConfigProvider';
/**
 * MongoDB adapter factory function
 * Creates and configures a MongoDB connection with enhanced security and monitoring
 */
const createMongoAdapter = async (
  logger: IAppLogger,
  config: IConfigProvider
): Promise<Connection> => {
  try {
    const dbConfig: IMongoDBClusterConfig = config.get("database").mongodb_cluster;

    // Construct MongoDB connection URL
    const dburl = `${dbConfig.uri}://${dbConfig.options.user}:${dbConfig.options.pass}${dbConfig.prefix_db}/${dbConfig.dbName}?${dbConfig.suffix_db}`;

    // Enhanced connection options for production
    const connectionOptions: ConnectOptions = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      w: "majority", // Write concern
      readPreference: "primary",
      compressors: ["zlib"], // Enable compression
    };

    // MongoDB connection event handlers with proper logging - MUST be set before connecting
    mongoose.connection.on("connected", () => {
      logger.info("MongoDB connected successfully with enhanced security", {
        dbName: dbConfig.dbName,
        readyState: mongoose.connection.readyState
      });
    });

    mongoose.connection.on("error", (err: Error) => {
      logger.error("MongoDB connection error", err, {
        dbName: dbConfig.dbName
      });
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected", {
        dbName: dbConfig.dbName
      });
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected", {
        dbName: dbConfig.dbName
      });
    });

    mongoose.connection.on("close", () => {
      logger.info("MongoDB connection closed", {
        dbName: dbConfig.dbName
      });
    });

    logger.info("Attempting to connect to MongoDB", {
      dbName: dbConfig.dbName,
      uri: dbConfig.uri
    });

    await mongoose.connect(dburl, connectionOptions);

    return mongoose.connection;
  } catch (error) {
    logger.error("Failed to create MongoDB connection", error as Error);
    throw error;
  }
};

export default createMongoAdapter;
