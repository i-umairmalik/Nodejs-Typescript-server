import { createContainer, asFunction, asValue, InjectionMode } from "awilix";
import { IAppContainer } from "../interfaces/IAppContainer";
import { createApp } from "../app";
import config from "../config/config";
import createLogger from "../config/logger/logger";
import createAdapters from "../adapters";

export const init = async (): Promise<void> => {
  try {
    const container = createContainer<IAppContainer>({
      injectionMode: InjectionMode.CLASSIC,
    });

    // Initialize logger
    const logger = createLogger(config);

    // Initialize all adapters
    const adapters = await createAdapters(logger, config);

    // Register dependencies in the container
    container.register({
      logger: asValue(logger),
      config: asValue(config),
      // adapters: asValue(adapters),
      mongoDB: asFunction(() => adapters.db).singleton(),
      redis: asFunction(() => adapters.cache?.secondary).singleton(),
    });

    logger.info("Dependency injection container initialized successfully");

    // Create and start the application
    createApp(container);
  } catch (error) {
    console.error("Failed to initialize application:", error);
    process.exit(1);
  }
};

export default init;
