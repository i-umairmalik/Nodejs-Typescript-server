// Import required types for dependency injection
import { Interfaces } from "../interfaces";

// UserSchema using dependency injection pattern
export default ({ helpers }: { helpers: Interfaces.Helpers }) => {
    const { mongoose } = helpers;

    // Define the schema using mongoose from hel`pers with proper typing
    const userSchema = new mongoose.Schema({
        username: { type: String, index: true, unique: true, sparse: true },
        email: { type: String, index: true, unique: true, sparse: true },
        password: { type: String, index: true },
        password_reset_token: { type: String },
        password_reset_expiry: { type: Date },
        board_invite_token: { type: String },
        board_invite_salt: { type: String },
        board_invite_expiry: { type: Date },
        salt: { type: String },
        access_token: { type: String, index: true },
        dt: { type: Date, default: Date.now },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "superAdmins",
            index: true,
        },
        deleted_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "superAdmins",
            index: true,
        },
        updated_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "superAdmins",
            index: true,
        },
        blocked_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "superAdmins",
            index: true,
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
                index: true,
            },
        ],
        followings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
                index: true,
            },
        ],
        is_deleted: { type: Boolean },
        is_super_admin: { type: Boolean, index: true },
        is_blocked: { type: Boolean },
        token_deleted: { type: Boolean },
        ip: { type: String },
        x_access_token: { type: String },
        last_login: { type: Date, index: true },
        is_login: { type: Boolean, index: true },
        current_device: { type: String },
        devices: { type: [String] },
        city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "cities",
            index: true,
        },
        status: {
            type: String,
            enum: Object.values(Interfaces.User.UserStatus),
            default: Interfaces.User.UserStatus.DEACTIVE,
        },
        // roles_permissions: { type: mongoose.Schema.Types.Mixed }, // add role_permission id here to define the role_permission of routes here
        dtu: { type: Date },
        profile: {
            first_name: { type: String },
            last_name: { type: String },
            cnic: { type: String },
            date_of_birth: { type: Date },
            picture: { type: String },
            address: { type: String },
            gender: {
                type: String,
                enum: Object.values(Interfaces.User.Gender),
                default: Interfaces.User.Gender.MALE,
            },
            phone: { type: String, unique: true, sparse: true },
        },
    });

    // Create and return the model using mongoose from helpers with proper typing
    const User = mongoose.model<Interfaces.User.IUserDocument>("users", userSchema);

    return { User };
};