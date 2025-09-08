import { IAppLogger } from '../interfaces/IAppLogger';

import { IConfigProvider } from '../interfaces/IConfigProvider';
import { IAdapters } from '../interfaces/IAdapters';
import createMongoAdapter from './mongo';

// Import other adapters when they are implemented
import { createRedisConnection } from './redis';
// import createCloudinaryAdapter from './cloudinary';
// import createNeo4jAdapter from './neo4j';
// import createPostgreSQLAdapter from './pgsql';

/**
 * Adapter factory function that initializes and returns all configured adapters
 * @param logger - Application logger instance
 * @param config - Configuration provider instance
 * @returns Promise resolving to configured adapters object
 */
const createAdapters = async (
  logger: IAppLogger,
  config: IConfigProvider
): Promise<IAdapters> => {
  try {
    logger.info("Initializing application adapters");

    const adapters: IAdapters = {
      // Database adapter - MongoDB (primary)
      db: {
        primary: await createMongoAdapter(logger, config),
      },

      cache: {
        // Cache adapter - Redis (when implemented)
        secondary: await createRedisConnection(logger, config),
      },

      // Image upload adapter - Cloudinary (when implemented)
      // imageUpload: {
      //   primary: await createCloudinaryAdapter(logger, config)
      // },

      // Graph database adapter - Neo4j (when implemented)
      // graphDB: {
      //   primary: await createNeo4jAdapter(logger, config)
      // }
    };


    logger.info("All adapters initialized successfully", {
      adapters: Object.keys(adapters)
    });
    return adapters;
  } catch (error) {
    logger.error("Failed to initialize adapters", error as Error);
    throw error;
  }
};

export default createAdapters;
