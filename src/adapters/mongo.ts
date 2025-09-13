import mongoose, { Connection, ConnectOptions } from 'mongoose';
import { IAppLogger } from '../interfaces/IAppLogger';
import {
  IMongoDBClusterConfig,
  IMongoDBConfig
} from '../interfaces/IAppConfig';
import { IConfigProvider } from '../interfaces/IConfigProvider';
import { IAppContainer, IHelpers } from '../interfaces/IAppContainer';
import { AwilixContainer } from 'awilix';
/**
 * MongoDB adapter factory function
 * Creates and configures a MongoDB connection with enhanced security and monitoring
 */
const createMongoAdapter = async (container: AwilixContainer<IAppContainer>): Promise<Connection> => {
  const { config, logger, helpers } = container.cradle;
  const { mongoose } = helpers;
  try {
    // Get current environment
    const environment = config.get("environment") || "local";

    let dburl: string;
    let dbName: string;

    // Check environment and connect accordingly
    if (environment === "local") {
      // Connect to local MongoDB
      const localDbConfig: IMongoDBConfig = config.get("database").mongodb;
      dbName = localDbConfig.dbname;
      dburl = `${localDbConfig.uri}:${localDbConfig.port}/${localDbConfig.dbname}`;

      logger.info("Connecting to local MongoDB", {
        environment,
        dbName: localDbConfig.dbname,
        uri: localDbConfig.uri,
        port: localDbConfig.port
      });
    } else {
      // Connect to MongoDB cluster (for dev, staging, production, etc.)
      const clusterDbConfig: IMongoDBClusterConfig = config.get("database").mongodb_cluster;
      dbName = clusterDbConfig.dbName;
      dburl = `${clusterDbConfig.uri}://${clusterDbConfig.options.user}:${clusterDbConfig.options.pass}${clusterDbConfig.prefix_db}/${clusterDbConfig.dbName}?${clusterDbConfig.suffix_db}`;

      logger.info("Connecting to MongoDB cluster", {
        environment,
        dbName: clusterDbConfig.dbName,
        uri: clusterDbConfig.uri
      });
    }

    // Enhanced connection options optimized for high load
    const connectionOptions: ConnectOptions = {
      // Connection Pool Settings
      maxPoolSize: environment === "production" ? 20 : 10, // Scale based on environment
      minPoolSize: environment === "production" ? 5 : 2,   // Maintain minimum connections
      maxIdleTimeMS: 30000, // Close connections after 30s of inactivity

      // Timeout Settings
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds

      // Network & Performance
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      w: "majority", // Write concern
      readPreference: "primary", // Primary read preference (maxStalenessSeconds not compatible)
      compressors: ["zlib"], // Enable compression

      // Monitoring & Health
      heartbeatFrequencyMS: 10000, // Check server health every 10s
      // Note: maxStalenessSeconds only works with secondary read preferences
    };

    // MongoDB connection event handlers with proper logging - MUST be set before connecting
    mongoose.connection.on("connected", () => {
      logger.info("MongoDB connected successfully", {
        environment,
        dbName,
        readyState: mongoose.connection.readyState
      });
    });

    mongoose.connection.on("error", (err: Error) => {
      logger.error("MongoDB connection error", err, {
        environment,
        dbName
      });
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected", {
        environment,
        dbName
      });
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected", {
        environment,
        dbName
      });
    });

    mongoose.connection.on("close", () => {
      logger.info("MongoDB connection closed", {
        environment,
        dbName
      });
    });

    // Additional monitoring for production environments
    if (environment !== "local") {
      mongoose.connection.on("fullsetup", () => {
        logger.info("MongoDB replica set fully connected", { environment, dbName });
      });

      mongoose.connection.on("all", () => {
        logger.info("MongoDB connected to all servers", { environment, dbName });
      });
    }

    logger.info("Attempting to connect to MongoDB", {
      environment,
      dbName,
      connectionType: environment === "local" ? "local" : "cluster",
      poolSettings: {
        maxPoolSize: connectionOptions.maxPoolSize,
        minPoolSize: connectionOptions.minPoolSize
      }
    });

    await mongoose.connect(dburl, connectionOptions);

    // Log connection pool statistics
    logger.info("MongoDB connection established", {
      environment,
      dbName,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port
    });

    return mongoose.connection;
  } catch (error) {
    logger.error("Failed to create MongoDB connection", error as Error);
    throw error;
  }
};

export default createMongoAdapter;
