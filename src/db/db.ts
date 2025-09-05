import mongoose from "mongoose";
import config from "../config/config";

// Define DB config type for stronger typing
interface MongoClusterOptions {
  uri: string;
  user: string;
  pass: string;
}

interface DatabaseConfig {
  mongodb_cluster: {
    uri: string;
    dbName: string;
    prefix_db?: string;
    suffix_db?: string;
    options: MongoClusterOptions;
  };
}

export const connectDB = async (): Promise<typeof mongoose> => {
  try {
    const dbConfig = config.get("database") as DatabaseConfig; 
    const mongoDB_Cluster = dbConfig.mongodb_cluster;

    const user = encodeURIComponent(mongoDB_Cluster.options.user);
    const pass = encodeURIComponent(mongoDB_Cluster.options.pass);

    const dburl = `${mongoDB_Cluster.uri}://${user}:${pass}${
      mongoDB_Cluster.prefix_db ?? ""
    }/${mongoDB_Cluster.dbName}?${mongoDB_Cluster.suffix_db ?? ""}`;
    // const dburl = `${config.get('database').mongodb.uri}:${config.get('database').mongodb.port}/${config.get('database').mongodb.dbname}`;

    const connection = await mongoose.connect(dburl, {
      // These options are no longer required in mongoose >= 6
      maxPoolSize: 10, // instead of poolSize
    });
    console.log("✅ Successfully Connected to MongoDB!");
    return connection;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
};

export const disconnectDB = async (): Promise<void> => {
  console.log("NODE_ENV:", config.get("environment"));
  await mongoose.disconnect();
  console.log("🛑 Disconnected from MongoDB");
};

process.on("SIGINT", async () => {
  console.log("🛑 Caught SIGINT (Ctrl+C). Closing DB...");
  await disconnectDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🛑 Caught SIGTERM. Closing DB...");
  await disconnectDB();
  process.exit(0);
});

export default connectDB;
