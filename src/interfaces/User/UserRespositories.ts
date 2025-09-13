import { IUser, IUserDocument } from "./index";

export interface IUserRepository {
    create: (userData: IUser) => Promise<IUserDocument>;
    findById: (id: string) => Promise<IUserDocument | null>;
    findByEmail: (email: string) => Promise<IUserDocument | null>;
    findAll: (page: number, limit: number) => Promise<IUserDocument[]>;
    update: (id: string, userData: Partial<IUser>) => Promise<IUserDocument | null>;
    delete: (id: string) => Promise<boolean>;
    count: () => Promise<number>;
}
