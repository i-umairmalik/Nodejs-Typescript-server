import { Interfaces } from "../interfaces";

// Use the service interface from the centralized interfaces

// Helper function to convert IUserDocument to IUserResponse (removes sensitive fields)
const convertToUserResponse = (user: Interfaces.User.IUserDocument): Interfaces.User.IUserResponse => ({
    _id: user._id.toString(),
    username: user.username,
    email: user.email,
    status: user.status,
    profile: user.profile,
    dt: user.dt,
    dtu: user.dtu,
    is_deleted: user.is_deleted,
    is_super_admin: user.is_super_admin,
    is_blocked: user.is_blocked,
    last_login: user.last_login,
    is_login: user.is_login,
    // current_device: user.current_device,
    // devices: user.devices,
    city: user.city,
    created_by: user.created_by,
    deleted_by: user.deleted_by,
    updated_by: user.updated_by,
    blocked_by: user.blocked_by,
    followers: user.followers,
    followings: user.followings,
    ip: user.ip,
    // Exclude sensitive fields: password, salt, password_reset_token, etc.
});

// Example service structured as a function for Awilix DI
const userService = ({ logger, config, userRepository }: {
    logger: Interfaces.AppLogger;
    config: Interfaces.ConfigProvider;
    userRepository: Interfaces.User.IUserRepository;
}): Interfaces.User.IUserService => {
    logger.info("User service initialized");

    return {
        getAllUsers: async (page: number = 1, limit: number = 10): Promise<Interfaces.User.IUserListResponse> => {
            logger.info("Getting all users", { page, limit });

            const users = await userRepository.findAll(page, limit);
            const total = await userRepository.count();

            // Convert IUserDocument to IUserResponse (remove sensitive fields)
            const userResponses: Interfaces.User.IUserResponse[] = users.map(convertToUserResponse);

            return {
                users: userResponses,
                total,
                page,
                limit
            };
        },

        getUserById: async (id: string): Promise<Interfaces.User.IUserResponse | null> => {
            logger.info(`Getting user by id: ${id}`);

            const user = await userRepository.findById(id);
            if (!user) {
                return null;
            }

            // Convert IUserDocument to IUserResponse (remove sensitive fields)
            return convertToUserResponse(user);
        },

        getUserByEmail: async (email: string): Promise<Interfaces.User.IUserResponse | null> => {
            logger.info(`Getting user by email In Service: ${email}`);
            const user = await userRepository.findByEmail(email);
            if (!user) {
                return null;
            }
            return convertToUserResponse(user);
        },

        createUser: async (userData: Interfaces.User.IUser): Promise<Interfaces.User.IUserResponse> => {
            logger.info("Creating new user");
            // Example: Validate user data, hash password, save to database
            // Your business logic here

            const createdUser = await userRepository.create(userData);

            // Convert IUserDocument to IUserResponse (remove sensitive fields)
            return convertToUserResponse(createdUser);
        },

        updateUser: async (id: string, userData: Interfaces.User.IUserUpdateInput): Promise<Interfaces.User.IUserResponse | null> => {
            logger.info(`Updating user: ${id}`);
            // Your business logic here

            const updatedUser = await userRepository.update(id, userData);
            if (!updatedUser) {
                return null;
            }

            // Convert IUserDocument to IUserResponse (remove sensitive fields)
            return convertToUserResponse(updatedUser);
        },

        deleteUser: async (id: string): Promise<boolean> => {
            logger.info(`Deleting user: ${id}`);
            // Your business logic here
            return await userRepository.delete(id);
        }
    };
};

export default userService;
