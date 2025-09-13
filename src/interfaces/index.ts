// =============================================================================
// INTERFACES INDEX - Centralized Interface Exports
// =============================================================================
// This file provides a clean, organized way to access all interfaces
// Usage: import { Interfaces } from '../interfaces'
// Then use: Interfaces.User.IUser, Interfaces.Logger.IAppLogger, etc.

// Core Application Interfaces
export * from './IAppContainer';
export * from './IAppLogger';
export * from './IConfigProvider';
export * from './IAdapters';

// User-related Interfaces
import * as UserTypes from './User';

// Create organized namespace structure
export namespace Interfaces {
    // Core interfaces (direct access)
    export type AppContainer = import('./IAppContainer').IAppContainer;
    export type AppLogger = import('./IAppLogger').IAppLogger;
    export type LogContext = import('./IAppLogger').ILogContext;
    export type LoggerConfig = import('./IAppLogger').ILoggerConfig;
    export type ConfigProvider = import('./IConfigProvider').IConfigProvider;

    // Adapter interfaces
    export type Adapters = import('./IAdapters').IAdapters;
    export type DatabaseAdapter = import('./IAdapters').IDatabaseAdapter;
    export type CacheAdapter = import('./IAdapters').ICacheAdapter;
    export type ImageUploadAdapter = import('./IAdapters').IImageUploadAdapter;
    export type GraphDBAdapter = import('./IAdapters').IGraphDBAdapter;
    export type MongoConnectionOptions = import('./IAdapters').MongoConnectionOptions;

    // Helper interfaces
    export type Helpers = import('./IAppContainer').IHelpers;
    export type EncryptionService = import('./Encryption').IEncryptionService;
    // User namespace - organized user-related interfaces
    export namespace User {
        export type IUser = UserTypes.IUser;
        export type IProfile = UserTypes.IProfile;
        export type IUserDocument = UserTypes.IUserDocument;
        export type IUserCreateInput = UserTypes.IUserCreateInput;
        export type IUserUpdateInput = UserTypes.IUserUpdateInput;
        export type IUserQuery = UserTypes.IUserQuery;
        export type IUserResponse = UserTypes.IUserResponse;
        export type IUserListResponse = UserTypes.IUserListResponse;
        export const UserStatus = UserTypes.UserStatus;
        export const Gender = UserTypes.Gender;
        export type UserStatus = UserTypes.UserStatus;
        export type Gender = UserTypes.Gender;
        export type IUserRepository = UserTypes.IUserRepository;

        // Service interface
        export interface IUserService {
            getAllUsers: (page?: number, limit?: number) => Promise<IUserListResponse>;
            getUserById: (id: string) => Promise<IUserResponse | null>;
            createUser: (userData: IUser) => Promise<IUserResponse>;
            updateUser: (id: string, userData: IUserUpdateInput) => Promise<IUserResponse | null>;
            deleteUser: (id: string) => Promise<boolean>;
            getUserByEmail: (email: string) => Promise<IUserResponse | null>;
        }

        // Controller interface
        export interface IUserController {
            getAllUsers: (req: import('express').Request, res: import('express').Response) => Promise<any>;
            getUserById: (req: import('express').Request, res: import('express').Response) => Promise<any>;
            createUser: (req: import('express').Request, res: import('express').Response) => Promise<any>;
            updateUser: (req: import('express').Request, res: import('express').Response) => Promise<any>;
            deleteUser: (req: import('express').Request, res: import('express').Response) => Promise<any>;
        }

        // Repository factory interface
        // export interface IUserRepositoryFactory {
        //     (container: import('awilix').AwilixContainer<AppContainer>): IUserRepository;
        // }
    }
}

// For backward compatibility and direct imports
export type IAppContainer = import('./IAppContainer').IAppContainer;
export type IAppLogger = import('./IAppLogger').IAppLogger;
export type IConfigProvider = import('./IConfigProvider').IConfigProvider;
export type IAdapters = import('./IAdapters').IAdapters;

// Re-export user types for direct access if needed
export * from './User';
