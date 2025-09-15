import { Request, Response } from "express";
import { Interfaces } from "../../interfaces";

// User controller structured as a function for Awilix DI
const userController = ({ logger, helpers, userService, pluginsHelper, encryptionService }: {
    logger: Interfaces.AppLogger;
    helpers: Interfaces.Helpers;
    userService: Interfaces.User.IUserService;
    pluginsHelper: Interfaces.PluginsHelper;
    encryptionService: Interfaces.EncryptionService;
}): Interfaces.User.IUserController => {
    const { Joi, Boom, _, decorateErrorResponse, validateRequest } = helpers;
    logger.info("User controller initialized");

    return {
        getAllUsers: async (req: Request, res: Response) => {
            try {
                logger.info("GET /users - Getting all users");
                const page = parseInt(req.query.page as string) || 1;
                const limit = parseInt(req.query.limit as string) || 10;
                const result = await userService.getAllUsers(page, limit);
                res.json(result);
            } catch (error) {
                logger.error("Error getting users:", error as Error);
                res.status(500).json({ error: "Internal server error" });
            }
        },

        getUserById: async (req: Request, res: Response) => {
            try {
                const { id } = req.params;
                logger.info(`GET /users/${id} - Getting user by id`);
                const user = await userService.getUserById(id);

                if (!user) {
                    res.status(404).json({ error: "User not found" });
                    return;
                }

                res.json({ user });
            } catch (error) {
                logger.error("Error getting user:", error as Error);
                res.status(500).json({ error: "Internal server error" });
            }
        },

        createUser: async (req: Request, res: Response) => {
            try {
                logger.info("POST /users - Creating new user");
                logger.info("Request body:", req.body);

                // Validate request body using the signup plugin
                const validation = await validateRequest("Users", req.body, { type: "signup" });
                logger.info("Validation:", validation);
                // Return validation errors if any
                if (!validation.isValid) {
                    logger.error("validation error occurs", validation.error);
                    throw Boom.badData(validation.error);
                }

                logger.info("Validated data:", validation.validatedData);

                const checkExistingUser = await userService.getUserByEmail(validation.validatedData.email);
                logger.info("Check existing user:", { checkExistingUser });
                if (checkExistingUser) {
                    logger.error("User already exits");
                    throw Boom.badRequest("User already exits");
                }

                const { salt, hash } = encryptionService.hashPassword(validation.validatedData.password);
                logger.info("Hashed password:", { salt, hash });
                validation.validatedData.salt = salt;
                validation.validatedData.password = hash;
                validation.validatedData.current_device = req.headers["x-device-type"] as string;
                validation.validatedData.devices = [req.headers["x-device-type"] as string];
                // Use the validated and decorated data to create the user
                const user = await userService.createUser({ ...validation.validatedData, salt, hash });
                logger.info("User created:", { user });
                res.status(200).json({ data: { ...user }, message: "User created successfully" });
            } catch (error) {
                logger.error("Error creating user:", error as Error);
                const { _code, _payload } = decorateErrorResponse(error);
                res.status(_code).json(_payload);
            }
        },

        loginUser: async (req: Request, res: Response) => {
            try {
                logger.info("POST /users/login - Logging in user");
                logger.info("Request body:", req.body);

                const validation = await validateRequest("Users", req.body, { type: "login" });
                logger.info("Validation:", validation);

                if (!validation.isValid) {
                    logger.error("Validation error occurred:", validation.error);
                    throw Boom.badData(validation.error);
                }


                const checkExistingUser = await userService.getUserByEmail(validation.validatedData.email);

                logger.info(`User is found with this email`, {checkExistingUser})

                if(!checkExistingUser){
                    logger.error(`User is not found with this email`, validation.validatedData.email)
                    throw Boom.badData(`User id not found with this email ${validation.validatedData.email}`);
                }

                // check if the user is already registered first
                if(checkExistingUser.is_deleted || checkExistingUser.is_blocked){
                    return Boom.badRequest(`User is ${checkExistingUser.is_deleted} ? "deleted": "blocked contact admin"`)
                }

                // const compare_password = await encryptionService.compare_password(
                //     checkExistingUser.password,
                //     validation.validatedData.password,
                //     checkExistingUser.salt
                // )

                // check if the user is already registered and if the user is not blocked or deleted
                // now matched the password of the user database and inputed password
                // if all goes well then assign the token to the user
                // update the user in database with the token 
                // store the login user in the redis cache
                // return the login user
                
            } catch (error) {
                logger.error("Error logging in user:", error as Error);
                const { _code, _payload } = decorateErrorResponse(error);
                res.status(_code).json(_payload);
            }
        },

        updateUser: async (req: Request, res: Response) => {
            try {
                const { id } = req.params;
                logger.info(`PUT /users/${id} - Updating user`);

                // Validate request body using the update plugin
                const validation = await validateRequest("Users", req.body, { type: "update" });

                // Return validation errors if any
                if (!validation.isValid) {
                    logger.error("Validation error occurred:", validation.error);
                    res.status(400).json(validation.errorResponse);
                    return;
                }

                // Use the validated and decorated data to update the user
                const user = await userService.updateUser(id, validation.validatedData);

                if (!user) {
                    res.status(404).json({ error: "User not found" });
                    return;
                }

                res.json({ user });
            } catch (error) {
                logger.error("Error updating user:", error as Error);

                // Handle specific plugin errors
                if (error instanceof Error && error.message.includes('Plugin')) {
                    res.status(400).json({ error: error.message });
                    return;
                }

                res.status(500).json({ error: "Internal server error" });
            }
        },

        deleteUser: async (req: Request, res: Response) => {
            try {
                const { id } = req.params;
                logger.info(`DELETE /users/${id} - Deleting user`);
                await userService.deleteUser(id);
                res.status(204).send();
            } catch (error) {
                logger.error("Error deleting user:", error as Error);
                res.status(500).json({ error: "Internal server error" });
            }
        }
    };
};

export default userController;
