import { IAppContainer } from "../IAppContainer";
import { AwilixContainer } from "awilix";
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

// Base user interface (without mongoose Document properties)

// Factory function that creates user interfaces with proper mongoose types through DI
export default (container: AwilixContainer<IAppContainer>) => {
    const { helpers, logger, config } = container.cradle;
    logger.info("User interface initialized", { container, logger, config, helpers });
    const { mongoose: mongooseFromHelpers } = helpers;
    logger.info("User interface initialized", { container, logger, config, helpers, mongoose: mongooseFromHelpers });
    // User document interface extending mongoose Document with proper types
    type IUser = {
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
        created_by?: mongoose.Types.ObjectId; // Will be Types.ObjectId from mongoose in helpers
        deleted_by?: mongoose.Types.ObjectId; // Will be Types.ObjectId from mongoose in helpers
        updated_by?: mongoose.Types.ObjectId; // Will be Types.ObjectId from mongoose in helpers
        blocked_by?: mongoose.Types.ObjectId; // Will be Types.ObjectId from mongoose in helpers
        followers?: mongoose.Types.ObjectId[]; // Will be Types.ObjectId[] from mongoose in helpers
        followings?: mongoose.Types.ObjectId[]; // Will be Types.ObjectId[] from mongoose in helpers
        is_deleted?: boolean;
        is_super_admin?: boolean;
        is_blocked?: boolean;
        token_deleted?: boolean;
        ip?: string;
        x_access_token?: string;
        last_login?: Date;
        is_login?: boolean;
        device?: string;
        city?: mongoose.Types.ObjectId; // Will be Types.ObjectId from mongoose in helpers
        status?: UserStatus;
        dtu?: Date;
        profile?: IProfile;
    }

    type IProfile = {
        first_name?: string;
        last_name?: string;
        cnic?: string;
        date_of_birth?: Date;
        picture?: string;
        address?: string;
        gender?: Gender;
        phone?: string;
    }


    return {
        IUser: {} as IUser,
        IProfile: {} as IProfile,
        IUserDocument: {} as IUser & mongoose.Document,
        UserStatus,
        Gender,
        // Helper function to create typed user document
        createUserDocument: (userData: IUser) => userData as any
    };
};

