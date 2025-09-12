import { AwilixContainer } from 'awilix';
import { IAppContainer } from '../interfaces/IAppContainer';
import createMongoAdapter from './mongo';

// Import other adapters when they are implemented
import { createRedisConnection } from './redis';
// import createCloudinaryAdapter from './cloudinary';
// import createNeo4jAdapter from './neo4j';
// import createPostgreSQLAdapter from './pgsql';

/**
 * Adapter factory function that initializes and returns all configured adapters
 * Uses dependency injection container to get all dependencies
 * @param container - Awilix container with all dependencies
 * @returns Promise resolving to configured adapters object
 */
const createAdapters = async (
  container: AwilixContainer<IAppContainer>
) => {
  const { logger, config } = container.cradle;

  try {
    logger.info("Initializing application adapters");

    const adapters = {
      // Database adapter - MongoDB (primary)
      db: {
        primary: await createMongoAdapter(container),
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
