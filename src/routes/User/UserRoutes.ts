import express from "express";
import { AwilixContainer } from "awilix";
import { IAppContainer } from "../../interfaces/IAppContainer";

// User routes structured as a function for Awilix DI
const userRoutes = (container: AwilixContainer<IAppContainer>) => {
    const { userController, authMiddleware } = container.cradle;
    const router = express.Router();

    // Public routes (no authentication required)
    router.get("/", authMiddleware.authenticate, userController.getAllUsers);
    router.get("/:id", authMiddleware.authenticate, userController.getUserById);

    // Protected routes (validation handled in controller)
    router.post("/", userController.createUser);
    router.put("/:id", authMiddleware.authenticate, userController.updateUser);
    router.delete("/:id", authMiddleware.authenticate, userController.deleteUser);

    return router;
};

export default userRoutes;
