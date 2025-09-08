import express, { Express } from "express";
import { createServer } from "http";
import cors from "cors";
import helmet from "helmet";
import { AwilixContainer } from "awilix";
import { IAppContainer } from "./interfaces/IAppContainer";

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

  try {
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`, {
        port: PORT,
        environment: config.get("environment")
      });
      logger.info(`API endpoints available at http://localhost:${PORT}/api`);
      logger.info(`Node.js Server Socket architecture loaded`);
    });

    // Graceful shutdown handling
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error("Failed to start application", error as Error);
    process.exit(1);
  }
};
