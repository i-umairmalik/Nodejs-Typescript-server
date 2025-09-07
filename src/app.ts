import express, { Express } from "express";
import { createServer } from "http";
import cors from "cors";
import helmet from "helmet";

export const createApp = (container: any) => {
  const { config, logger } = container.cradle;
  const app: Express = express();

  const server = createServer(app);
  const PORT = config.get("server").port;
  try {
    server.listen(PORT, async () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`API endpoints available at http://localhost:${PORT}/api`);
      logger.info(`Nodejs Server Socket architecture loaded`);

      // Setup enterprise features
    });
  } catch (error) {
    logger.error("Failed to start functional application:", error);
    process.exit(1);
  }
};
