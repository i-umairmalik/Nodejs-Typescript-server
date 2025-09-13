// =============================================================================
// PLUGIN INTERFACES - Plugin system interfaces
// =============================================================================

import * as JoiTypes from 'joi';

export interface IPlugin {
    schema(): any;
    decorate(value: any): any;
}

export interface IPluginCollection {
    [key: string]: IPlugin | IPluginCollection;
}

export interface IPluginValidationResult {
    schema: any;
    data: any;
}

export interface IPluginsHelper {
    pluginsType(type: string, data: any, options?: { type?: string }): Promise<IPluginValidationResult>;
}

// User-specific plugin interfaces
export interface ISignupPlugin {
    schema(): any;
    decorate(value: any): any;
}

export interface ILoginPlugin {
    schema(): any;
    decorate(value: any): any;
}

export interface IUpdatePlugin {
    schema(): any;
    decorate(value: any): any;
}

// Joi configuration type
export type JoiType = any; // This will be properly typed based on the actual joi-config
