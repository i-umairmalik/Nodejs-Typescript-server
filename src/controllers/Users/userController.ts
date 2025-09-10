import { Request, Response } from "express";
import { IAppLogger } from "../../interfaces/IAppLogger";

// User controller structured as a function for Awilix DI
const userController = ({ logger, userService }: { logger: IAppLogger; userService: any }) => {
    logger.info("User controller initialized");

    return {
        getAllUsers: async (req: Request, res: Response) => {
            try {
                logger.info("GET /users - Getting all users");
                const users = await userService.getAllUsers();
                res.json({ users });
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
                    return res.status(404).json({ error: "User not found" });
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
                const user = await userService.createUser(req.body);
                res.status(201).json({ user });
            } catch (error) {
                logger.error("Error creating user:", error as Error);
                res.status(500).json({ error: "Internal server error" });
            }
        },

        updateUser: async (req: Request, res: Response) => {
            try {
                const { id } = req.params;
                logger.info(`PUT /users/${id} - Updating user`);
                const user = await userService.updateUser(id, req.body);
                res.json({ user });
            } catch (error) {
                logger.error("Error updating user:", error as Error);
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
