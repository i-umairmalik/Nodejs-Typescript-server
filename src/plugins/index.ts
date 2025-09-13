import _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';
import Joi from './joi-config';
import { IPlugin, IPluginCollection, IPluginValidationResult, IPluginsHelper } from '../interfaces/Plugins';

const loadPlugins = (pluginsDirectory: string): IPluginCollection => {
    const dirItems = fs.readdirSync(pluginsDirectory, 'utf-8');
    const plugins: IPluginCollection = {};

    const loadSubDirectories = (key: string, currentItemPath: string) => {
        const subDirItems = fs.readdirSync(currentItemPath, 'utf-8');

        subDirItems.forEach(subItem => {
            const currentSubItemPath = path.join(currentItemPath, subItem);

            if (fs.lstatSync(currentSubItemPath).isFile()) {
                // Handle both .js and .ts files
                const itemName = path.basename(subItem, path.extname(subItem));

                try {
                    const pluginModule = require(currentSubItemPath);
                    // Handle both default exports and named exports
                    const plugin = pluginModule.default || pluginModule;

                    if (plugin && typeof plugin.schema === 'function' && typeof plugin.decorate === 'function') {
                        (plugins[key] as IPluginCollection)[itemName] = plugin;
                    }
                } catch (error) {
                    console.warn(`Failed to load plugin ${currentSubItemPath}:`, error);
                }
            } else if (fs.lstatSync(currentSubItemPath).isDirectory()) {
                const _key = `${key}.${subItem}`;
                if (!plugins[_key]) plugins[_key] = {};

                const currentDirPath = path.join(currentItemPath, subItem);
                loadSubDirectories(_key, currentDirPath);
            }
        });
    };

    dirItems.forEach(item => {
        const currentItemPath = path.join(pluginsDirectory, item);

        if (fs.lstatSync(currentItemPath).isDirectory()) {
            if (!plugins[item]) plugins[item] = {};
            loadSubDirectories(item, currentItemPath);
        }
    });

    return plugins;
};


class PluginsHelper implements IPluginsHelper {
    private plugins: { pluginsType: IPluginCollection };

    /**
     * Load all available plugins
     * @description Load all available plugins
     * @instance
     */
    constructor(helpers?: any) {
        this.plugins = {
            pluginsType: loadPlugins(__dirname)
        };
    }

    /**
     * Get plugin validation schema and decorated data
     * @description Get plugin validation schema and decorated data
     * @instance
     * @param {string} type - Plugin type (e.g., "Users")
     * @param {any} data - Data to validate and decorate
     * @param {object} [options] - Options including specific plugin subtype
     * @return {Promise<IPluginValidationResult>}
     */
    async pluginsType(type: string, data: any, options: { type?: string } = {}): Promise<IPluginValidationResult> {
        const pluginGroup = this.plugins.pluginsType[type] as IPluginCollection;

        if (!pluginGroup) {
            throw new Error(`Plugin type "${type}" not found`);
        }

        let plugin: IPlugin;

        if (options.type && pluginGroup[options.type]) {
            plugin = pluginGroup[options.type] as IPlugin;
        } else {
            // Try to find a default plugin or use the first available one
            const pluginKeys = Object.keys(pluginGroup);
            if (pluginKeys.length === 0) {
                throw new Error(`No plugins found for type "${type}"`);
            }

            // Look for 'default' plugin first, otherwise use first available
            const defaultKey = pluginKeys.find(key => key === 'default') || pluginKeys[0];
            plugin = pluginGroup[defaultKey] as IPlugin;
        }

        if (!plugin || typeof plugin.schema !== 'function' || typeof plugin.decorate !== 'function') {
            throw new Error(`Invalid plugin structure for type "${type}"`);
        }

        const schema = plugin.schema();
        const decoratedData = plugin.decorate(data);

        return {
            schema,
            data: decoratedData,
        };
    }
}

// Export both the class and a default instance for backward compatibility
export { PluginsHelper };
export default PluginsHelper;