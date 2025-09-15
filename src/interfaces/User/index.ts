// =============================================================================
// USER INTERFACES - Clean, Standard Interface Definitions
// =============================================================================
// This file contains all user-related interfaces and types
// No DI dependencies - pure TypeScript interfaces

import * as mongoose from "mongoose";

// Define enums for better type safety
export enum UserStatus {
    ACTIVE = 'active',
    DEACTIVE = 'deactive'
}

export enum Gender {
    MALE_SHORT = 'M',
    FEMALE_SHORT = 'F',
    MALE = 'Male',
    FEMALE = 'Female'
}

// Profile interface
export interface IProfile {
    first_name?: string;
    last_name?: string;
    cnic?: string;
    date_of_birth?: Date;
    picture?: string;
    address?: string;
    gender?: Gender;
    phone?: string;
}

// Base user interface (clean, without mongoose Document properties)
export interface IUser {
    username?: string;
    email?: string;
    password?: string;
    password_reset_token?: string;
    password_reset_expiry?: Date;
    board_invite_token?: string;
    board_invite_salt?: string;
    board_invite_expiry?: Date;
    salt?: string;
    access_token?: string;
    dt?: Date;
    created_by?: mongoose.Types.ObjectId;
    deleted_by?: mongoose.Types.ObjectId;
    updated_by?: mongoose.Types.ObjectId;
    blocked_by?: mongoose.Types.ObjectId;
    followers?: mongoose.Types.ObjectId[];
    followings?: mongoose.Types.ObjectId[];
    is_deleted?: boolean;
    is_super_admin?: boolean;
    is_blocked?: boolean;
    token_deleted?: boolean;
    ip?: string;
    x_access_token?: string;
    last_login?: Date;
    is_login?: boolean;
    current_device?: string;
    devices?: string[];
    city?: mongoose.Types.ObjectId;
    status?: UserStatus;
    dtu?: Date;
    profile?: IProfile;
}

// User document interface extending mongoose Document
export interface IUserDocument extends IUser, mongoose.Document {
    _id: mongoose.Types.ObjectId;
    // Additional mongoose document methods can be added here if needed
}

// Utility types for user operations
export interface IUserCreateInput extends Omit<IUser, 'dt' | 'dtu' | 'created_by'> {
    // Fields required for user creation
}

export interface IUserUpdateInput extends Partial<Omit<IUser, 'dt' | 'dtu' | 'created_by'>> {
    // Fields that can be updated
    updated_by?: mongoose.Types.ObjectId;
}

// User query interfaces
export interface IUserQuery {
    email?: string;
    username?: string;
    status?: UserStatus;
    is_deleted?: boolean;
    is_blocked?: boolean;
}

// User response interfaces (for API responses)
export interface IUserResponse extends Omit<IUser, 'password' | 'salt' | 'password_reset_token'> {
    _id: string;
}

export interface IUserListResponse {
    users: IUserResponse[];
    total: number;
    page?: number;
    limit?: number;
}

// Repository interface
export interface IUserRepository {
    create: (userData: IUser) => Promise<IUserDocument>;
    findById: (id: string) => Promise<IUserDocument | null>;
    findByEmail: (email: string) => Promise<IUserDocument | null>;
    findAll: (page: number, limit: number) => Promise<IUserDocument[]>;
    update: (id: string, userData: Partial<IUser>) => Promise<IUserDocument | null>;
    delete: (id: string) => Promise<boolean>;
    count: () => Promise<number>;
}
