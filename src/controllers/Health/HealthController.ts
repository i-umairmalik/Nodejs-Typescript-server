import { Request, Response } from "express";
import { Interfaces } from "../../interfaces";

// When using loadModules, Awilix will inject dependencies automatically
// The function parameters should match the registered dependency names
const healthController = ({ logger }: { logger: Interfaces.AppLogger }) => {
    logger.info("Health controller initialized");
    return {
        checkHealth: (req: Request, res: Response) => {
            logger.info("Health check");
            res.send("Health check");
        }
    }
}

export default healthController;