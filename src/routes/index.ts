import { AwilixContainer } from "awilix";
import { IAppContainer } from "../interfaces/IAppContainer";
import { Express } from "express";
import healthRoutes from "./Health/HealthRoutes";
import userRoutes from "./User/UserRoutes";
import errorMiddleware from "../middlewares/errorMiddleware";

const routes = function (container: AwilixContainer<IAppContainer>, app: Express): void {
    const { logger, config } = container.cradle;
    logger.info("Routes initialized");

    const { v1 } = config.get("server").api_versions;
    logger.info(`API version: ${v1}`);

    // Root endpoint
    app.get("/", (req, res) => {
        logger.info("Hello World");
        res.send("Hello World");
    });


    app.use(v1 + "/health", healthRoutes(container));
    app.use(v1 + "/users", userRoutes(container));


};
export default routes;