import * as path from 'path';
import { IConfigProvider } from '../interfaces/IConfigProvider';


import nconf from 'nconf';

/**
 * Initialize configuration loading chain
 * Priority: Environment variables > Command line arguments > Config file
 */
const initializeConfig = (): void => {
    // Load from environment variables and command line arguments
    nconf.env().argv();

    // Determine environment (defaults to 'local' if not specified)
    const env: string = nconf.get("env") || "local";

    const configPath = path.join(__dirname, "./env", `${env}.json`);

    console.log(`Loading configuration from: ${configPath}`);

    // Load environment-specific configuration file
    nconf.file({ file: configPath });
};

/**
 * Get configuration value by key
 * @param key - Configuration key (supports nested keys with dot notation)
 * @returns Configuration value
 */
const get = (key: string): any => {
    return nconf.get(key);
};

/**
 * Load environment variables
 * @returns ConfigProvider instance for chaining
 */
const env = (): IConfigProvider => {
    nconf.env();
    return configProvider;
};

/**
 * Load command line arguments
 * @returns ConfigProvider instance for chaining
 */
const argv = (): IConfigProvider => {
    nconf.argv();
    return configProvider;
};

/**
 * Load configuration from file
 * @param options - File loading options
 * @returns ConfigProvider instance for chaining
 */
const file = (options: { file: string }): IConfigProvider => {
    nconf.file(options);
    return configProvider;
};

/**
 * Set configuration value
 * @param key - Configuration key
 * @param value - Configuration value
 */
const set = (key: string, value: any): void => {
    nconf.set(key, value);
};

/**
 * Check if configuration key exists
 * @param key - Configuration key to check
 * @returns True if key exists, false otherwise
 */
const has = (key: string): boolean => {
    return nconf.get(key) !== undefined;
};

/**
 * Get all configuration as object
 * @returns Complete configuration object
 */
const getAll = (): any => {
    return nconf.get();
};

/**
 * Configuration provider object implementing ConfigProvider interface
 * Uses functional approach instead of classes for better JavaScript idioms
 */
const configProvider: IConfigProvider = {
    get,
    env,
    argv,
    file,
    set,
    has,
    getAll
};

// Initialize configuration on module load
initializeConfig();

export default configProvider;
