import express, { Express } from "express";
import { createServer } from "http";
import cors from "cors";
import helmet from "helmet";
import { AwilixContainer } from "awilix";
import { IAppContainer } from "./interfaces/IAppContainer";
import routes from "./routes";
export const createApp = (container: AwilixContainer<IAppContainer>): void => {
  const { config, logger } = container.cradle;
  const app: Express = express();

  // Middleware setup
  app.use(helmet()); // Security headers
  app.use(cors()); // Enable CORS
  app.use(express.json()); // Parse JSON bodies
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

  const server = createServer(app);
  const PORT = config.get("server").port;

  routes(container, app);
  try {

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`, {
        port: PORT,
        environment: config.get("environment")
      });
      logger.info(`API endpoints available at http://localhost:${PORT}/api/v1`);
      logger.info(`Node.js Server Socket architecture loaded`);
    });

    // Graceful shutdown handling with database cleanup
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully`);

      server.close(async () => {
        try {
          // Close MongoDB connection
          const { adapters } = container.cradle;
          if (adapters?.db?.primary) {
            await adapters.db.primary.close();
            logger.info('MongoDB connection closed successfully');
          }

          // Close Redis connection if exists
          if (adapters?.cache?.secondary) {
            await adapters.cache.secondary.quit();
            logger.info('Redis connection closed successfully');
          }

          logger.info('All connections closed, process terminated');
          process.exit(0);
        } catch (error) {
          logger.error('Error during graceful shutdown', error as Error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error("Failed to start application", error as Error);
    process.exit(1);
  }
};
