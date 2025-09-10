import { createContainer, asFunction, asValue, InjectionMode, Lifetime } from "awilix";
import { IAppContainer } from "../interfaces/IAppContainer";
import { createApp } from "../app";
import config from "../config/config";
import createLogger from "../config/logger/logger";
import createAdapters from "../adapters";

export const init = async (): Promise<void> => {
  try {
    const container = createContainer<IAppContainer>({
      injectionMode: InjectionMode.PROXY,
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

    // Load modules approach - registers controllers, routes, services, etc. in the container
    // Determine file extension based on whether we're running with ts-node or compiled JS
    const isTypeScript = __filename.endsWith('.ts');
    const fileExtension = isTypeScript ? 'ts' : 'js';

    logger.info(`Loading modules with extension: .${fileExtension}`);

    container.loadModules(
      [
        `../controllers/**/*.${fileExtension}`,
        `../services/**/*.${fileExtension}`,
        `../middlewares/**/*.${fileExtension}`,
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

    // Create and start the application
    createApp(container);
  } catch (error) {
    console.error("Failed to initialize application:", error);
    process.exit(1);
  }
};

export default init;
