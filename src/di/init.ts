import { createContainer, asFunction, asValue, InjectionMode, Lifetime } from "awilix";
import { IAppContainer } from "../interfaces/IAppContainer";
import { createApp } from "../app";
import config from "../config/config";
import createLogger from "../config/logger/logger";
import createAdapters from "../adapters";
import * as helpers from "../helpers";
export const init = async (): Promise<void> => {
  try {
    const container = createContainer<IAppContainer>({
      injectionMode: InjectionMode.PROXY,
    });

    // Initialize logger
    const logger = createLogger(config);

    // Step 1: Register core dependencies first (logger, config, helpers)
    container.register({
      logger: asValue(logger),
      config: asValue(config),
      helpers: asValue(helpers),
    });

    logger.info("Core dependencies registered in DI container");

    // Step 2: Load modules - this allows schemas and interfaces to access helpers
    // Determine file extension based on whether we're running with ts-node or compiled JS
    const isTypeScript = __filename.endsWith('.ts');
    const fileExtension = isTypeScript ? 'ts' : 'js';

    logger.info(`Loading modules with extension: .${fileExtension}`);

    container.loadModules(
      [
        `../controllers/**/*.${fileExtension}`,
        `../services/**/*.${fileExtension}`,
        `../middlewares/**/*.${fileExtension}`,
        `../interfaces/**/*.${fileExtension}`,
        `../schemas/**/*.${fileExtension}`,

        // `../utils/**/*.${fileExtension}`, // Uncomment when you have utils
      ],
      {
        cwd: __dirname,
        formatName: "camelCase",
        resolverOptions: {
          lifetime: Lifetime.SINGLETON,
          register: asFunction,
        },
      }
    );

    logger.info("All modules loaded successfully");

    // Step 3: Now initialize adapters using container
    const adapters = await createAdapters(container);

    // Step 4: Register adapters in the container
    container.register({
      adapters: asValue(adapters),
      mongoDB: asFunction(() => adapters.db.primary).singleton(),
      redis: asFunction(() => adapters.cache?.secondary).singleton(),

    });

    logger.info("Dependency injection container initialized successfully");

    // Step 5: Create and start the application
    createApp(container);
  } catch (error) {
    console.error("Failed to initialize application:", error);
    process.exit(1);
  }
};

export default init;
