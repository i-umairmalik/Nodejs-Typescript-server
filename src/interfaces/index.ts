import { Request, Response } from 'express';
// =============================================================================
// DIRECT EXPORTS - For backward compatibility and specific imports
// =============================================================================

// Core Application Interfaces
export * from './IAppContainer';
export * from './IAppLogger';
export * from './IConfigProvider';
export * from './IAdapters';

// Domain-specific Interfaces
export * from './User';
export * from './Encryption';
export * from './Helpers';
export * from './Plugins';

// Re-export enums for runtime access
import { UserStatus as UserStatusEnum, Gender as GenderEnum } from './User';
export { UserStatusEnum as UserStatus, GenderEnum as Gender };

// =============================================================================
// MODULAR NAMESPACE EXPORTS - Organized by domain and responsibility
// =============================================================================

/**
 * Main application namespace containing all organized interfaces
 */
export namespace App {

    /**
     * Core application interfaces - fundamental system components
     */
    export namespace Core {
        export type Container = import('./IAppContainer').IAppContainer;
        export type Logger = import('./IAppLogger').IAppLogger;
        export type LogContext = import('./IAppLogger').ILogContext;
        export type LoggerConfig = import('./IAppLogger').ILoggerConfig;
        export type ConfigProvider = import('./IConfigProvider').IConfigProvider;
        export type Helpers = import('./IAppContainer').IHelpers;
    }

    /**
     * Adapter interfaces - external service integrations
     */
    export namespace Adapters {
        export type Collection = import('./IAdapters').IAdapters;
        export type Database = import('./IAdapters').IDatabaseAdapter;
        export type Cache = import('./IAdapters').ICacheAdapter;
        export type ImageUpload = import('./IAdapters').IImageUploadAdapter;
        export type GraphDB = import('./IAdapters').IGraphDBAdapter;
        export type MongoConnectionOptions = import('./IAdapters').MongoConnectionOptions;
    }

    /**
     * Security and encryption interfaces
     */
    export namespace Security {
        export type EncryptionService = import('./Encryption').IEncryptionService;
        export type EncryptionConfig = import('./Encryption').IEncryptionConfig;
    }

    /**
     * Error handling and utility interfaces
     */
    export namespace Utils {
        export type JoiError = import('./Helpers').IJoiError;
        export type BoomError = import('./Helpers').IBoomError;
        export type ErrorResponse = import('./Helpers').IErrorResponse;
    }

    /**
     * Plugin system interfaces
     */
    export namespace Plugins {
        export type Plugin = import('./Plugins').IPlugin;
        export type Collection = import('./Plugins').IPluginCollection;
        export type ValidationResult = import('./Plugins').IPluginValidationResult;
        export type Helper = import('./Plugins').IPluginsHelper;
        export type JoiType = import('./Plugins').JoiType;

        // User-specific plugins
        export namespace User {
            export type Signup = import('./Plugins').ISignupPlugin;
            export type Login = import('./Plugins').ILoginPlugin;
            export type Update = import('./Plugins').IUpdatePlugin;
        }
    }

    /**
     * User domain interfaces - complete user management system
     */
    export namespace User {
        // Core user types
        export type Entity = import('./User').IUser;
        export type Profile = import('./User').IProfile;
        export type Document = import('./User').IUserDocument;

        // Enums - re-exported from User module
        export type Status = import('./User').UserStatus;
        export type Gender = import('./User').Gender;

        // Operation types
        export type CreateInput = import('./User').IUserCreateInput;
        export type UpdateInput = import('./User').IUserUpdateInput;
        export type Query = import('./User').IUserQuery;

        // Response types
        export type UserResponse = import('./User').IUserResponse;
        export type ListResponse = import('./User').IUserListResponse;

        // Layer interfaces
        export type Repository = import('./User').IUserRepository;

        /**
         * Service layer interface for user operations
         */
        export interface Service {
            getAllUsers: (page?: number, limit?: number) => Promise<ListResponse>;
            getUserById: (id: string) => Promise<UserResponse | null>;
            createUser: (userData: Entity) => Promise<UserResponse>;
            updateUser: (id: string, userData: UpdateInput) => Promise<UserResponse | null>;
            deleteUser: (id: string) => Promise<boolean>;
            getUserByEmail: (email: string) => Promise<UserResponse | null>;
        }

        /**
         * Controller layer interface for HTTP request handling
         * Methods can return void or the Express Response object for chaining
         */
        export interface Controller {
            getAllUsers: (req: Request, res: Response) => Promise<void | UserResponse>;
            getUserById: (req: Request, res: Response) => Promise<void | UserResponse>;
            createUser: (req: Request, res: Response) => Promise<void | UserResponse>;
            updateUser: (req: Request, res: Response) => Promise<void | UserResponse>;
            deleteUser: (req: Request, res: Response) => Promise<void | Response>;
            loginUser: (req: Request, res: Response) => Promise<void | UserResponse>;
        }
    }
}

// =============================================================================
// DOMAIN-SPECIFIC NAMESPACE EXPORTS - For focused domain usage
// =============================================================================

/**
 * User-specific interfaces namespace for focused user domain development
 */
export namespace UserInterfaces {
    export type Entity = App.User.Entity;
    export type Profile = App.User.Profile;
    export type Document = App.User.Document;
    export type CreateInput = App.User.CreateInput;
    export type UpdateInput = App.User.UpdateInput;
    export type Query = App.User.Query;
    export type UserResponse = App.User.UserResponse;
    export type ListResponse = App.User.ListResponse;
    export type Repository = App.User.Repository;
    export type Service = App.User.Service;
    export type Controller = App.User.Controller;
    export type Status = App.User.Status;
    export type Gender = App.User.Gender;
}

/**
 * Core system interfaces namespace for infrastructure development
 */
export namespace CoreInterfaces {
    export type Container = App.Core.Container;
    export type Logger = App.Core.Logger;
    export type LogContext = App.Core.LogContext;
    export type LoggerConfig = App.Core.LoggerConfig;
    export type ConfigProvider = App.Core.ConfigProvider;
    export type Helpers = App.Core.Helpers;
}

/**
 * Adapter interfaces namespace for external service integration
 */
export namespace AdapterInterfaces {
    export type Collection = App.Adapters.Collection;
    export type Database = App.Adapters.Database;
    export type Cache = App.Adapters.Cache;
    export type ImageUpload = App.Adapters.ImageUpload;
    export type GraphDB = App.Adapters.GraphDB;
    export type MongoConnectionOptions = App.Adapters.MongoConnectionOptions;
}

// =============================================================================
// LEGACY COMPATIBILITY EXPORTS - Maintain backward compatibility
// =============================================================================

/**
 * @deprecated Use App.Core.Container instead
 */
export type IAppContainer = App.Core.Container;

/**
 * @deprecated Use App.Core.Logger instead
 */
export type IAppLogger = App.Core.Logger;

/**
 * @deprecated Use App.Core.ConfigProvider instead
 */
export type IConfigProvider = App.Core.ConfigProvider;

/**
 * @deprecated Use App.Adapters.Collection instead
 */
export type IAdapters = App.Adapters.Collection;

/**
 * @deprecated Use UserInterfaces or App.User namespace instead
 */
export namespace Interfaces {
    export type AppContainer = App.Core.Container;
    export type AppLogger = App.Core.Logger;
    export type LogContext = App.Core.LogContext;
    export type LoggerConfig = App.Core.LoggerConfig;
    export type ConfigProvider = App.Core.ConfigProvider;
    export type Adapters = App.Adapters.Collection;
    export type DatabaseAdapter = App.Adapters.Database;
    export type CacheAdapter = App.Adapters.Cache;
    export type ImageUploadAdapter = App.Adapters.ImageUpload;
    export type GraphDBAdapter = App.Adapters.GraphDB;
    export type MongoConnectionOptions = App.Adapters.MongoConnectionOptions;
    export type Helpers = App.Core.Helpers;
    export type EncryptionService = App.Security.EncryptionService;
    export type JoiError = App.Utils.JoiError;
    export type BoomError = App.Utils.BoomError;
    export type ErrorResponse = App.Utils.ErrorResponse;
    export type Plugin = App.Plugins.Plugin;
    export type PluginCollection = App.Plugins.Collection;
    export type PluginValidationResult = App.Plugins.ValidationResult;
    export type PluginsHelper = App.Plugins.Helper;
    export type SignupPlugin = App.Plugins.User.Signup;
    export type LoginPlugin = App.Plugins.User.Login;
    export type UpdatePlugin = App.Plugins.User.Update;
    export type JoiType = App.Plugins.JoiType;

    export namespace User {
        export type IUser = App.User.Entity;
        export type IProfile = App.User.Profile;
        export type IUserDocument = App.User.Document;
        export type IUserCreateInput = App.User.CreateInput;
        export type IUserUpdateInput = App.User.UpdateInput;
        export type IUserQuery = App.User.Query;
        export type IUserResponse = App.User.UserResponse;
        export type IUserListResponse = App.User.ListResponse;
        export type IUserRepository = App.User.Repository;
        export type IUserService = App.User.Service;
        export type IUserController = App.User.Controller;

        // Export enum values for runtime access
        export const UserStatus = UserStatusEnum;
        export const Gender = GenderEnum;
    }
}
