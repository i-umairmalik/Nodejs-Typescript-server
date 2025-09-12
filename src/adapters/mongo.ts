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

    // Enhanced connection options
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

    logger.info("Attempting to connect to MongoDB", {
      environment,
      dbName,
      connectionType: environment === "local" ? "local" : "cluster"
    });

    await mongoose.connect(dburl, connectionOptions);

    return mongoose.connection;
  } catch (error) {
    logger.error("Failed to create MongoDB connection", error as Error);
    throw error;
  }
};

export default createMongoAdapter;
