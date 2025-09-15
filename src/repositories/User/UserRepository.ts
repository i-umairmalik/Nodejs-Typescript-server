import { Interfaces } from "../../interfaces";
import mongoose from "mongoose";


// User repository factory using closures - implements the factory interface
const userRepository = ({ mongoDB, userSchema, logger }: { mongoDB: mongoose.Connection, userSchema: any, logger: Interfaces.AppLogger }): Interfaces.User.IUserRepository => {
    if (!mongoDB) {
        throw new Error("MongoDB is not connected");
    }
    const { User } = userSchema;

    const create = async (userData: Interfaces.User.IUser): Promise<Interfaces.User.IUserDocument> => {
        return await User.create(userData);
    };

    const findById = async (id: string): Promise<Interfaces.User.IUserDocument | null> => {
        return await User.findById(id);
    };

    const findByEmail =  (email: string): Promise<Interfaces.User.IUserDocument | null> => {
        logger.info(`Finding user by email In Repository: ${email}`);
        return  User.findOne({ email });
    };

    const findAll = async (page: number = 1, limit: number = 10): Promise<Interfaces.User.IUserDocument[]> => {
        const skip = (page - 1) * limit;
        return await User.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    };

    const update = async (id: string, userData: Partial<Interfaces.User.IUser>): Promise<Interfaces.User.IUserDocument | null> => {
        return await User.findByIdAndUpdate(id, userData, { new: true }) as Interfaces.User.IUserDocument | null;
    };

    const deleteUser = async (id: string): Promise<boolean> => {
        const result = await User.findByIdAndDelete(id) as Interfaces.User.IUserDocument | null;
        return !!result;
    };

    const count = async (): Promise<number> => {
        return await User.countDocuments();
    };

    return {
        create,
        findById,
        findByEmail,
        findAll,
        update,
        delete: deleteUser,
        count
    };
};


export default userRepository;