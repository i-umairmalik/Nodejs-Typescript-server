const mongoose = require("mongoose");

module.exports = async (logger: any, config: any) => {
  const dbConfig = config.get("database").mongodb_cluster;

  const dburl = `${dbConfig.uri}://${dbConfig.options.user}:${dbConfig.options.pass}${dbConfig.prefix_db}/${dbConfig.dbName}?${dbConfig.suffix_db}`;

  // Enhanced connection options for production
  const connection = await mongoose.connect(dburl, {
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
    retryWrites: true,
    w: "majority", // Write concern
    readPreference: "primary",
    compressors: ["zlib"], // Enable compression
  });


  // MongoDB connection event handlers
  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected successfully with enhanced security");
  });

  mongoose.connection.on("error", (err: any) => {
    console.error("❌ MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("⚠️ MongoDB disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("🔄 MongoDB reconnected");
  });

  mongoose.connection.on("close", () => {
    console.log("🔒 MongoDB connection closed");
  });

  return connection;
};
