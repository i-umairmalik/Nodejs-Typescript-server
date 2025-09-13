import express from "express";
import { AwilixContainer } from "awilix";
import { IAppContainer } from "../../interfaces/IAppContainer";

// Health routes structured as a function for Awilix DI
const healthRoutes = (container: AwilixContainer<IAppContainer>) => {
    const { healthController } = container.cradle;
    const router = express.Router();

    // Public routes (no authentication required)
    router.get("/", healthController.checkHealth);
    router.get("/db", healthController.getDatabaseStats);

    return router;
};

export default healthRoutes;
