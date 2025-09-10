import { Request, Response, NextFunction } from "express";
import { IAppLogger } from "../interfaces/IAppLogger";
import { IConfigProvider } from "../interfaces/IConfigProvider";

// Example middleware structured as a function for Awilix DI
const authMiddleware = ({ logger, config }: { logger: IAppLogger; config: IConfigProvider }) => {
    logger.info("Auth middleware initialized");

    return {
        authenticate: (req: Request, res: Response, next: NextFunction) => {
            logger.info("Authenticating request");

            // Example authentication logic
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                logger.warn("No authorization header provided");
                return res.status(401).json({ error: "No authorization header provided" });
            }

            // Add your authentication logic here
            // For example, verify JWT token

            logger.info("Request authenticated successfully");
            next();
        },

        authorize: (roles: string[]) => {
            return (req: Request, res: Response, next: NextFunction) => {
                logger.info(`Authorizing request for roles: ${roles.join(", ")}`);

                // Add your authorization logic here
                // For example, check user roles

                logger.info("Request authorized successfully");
                next();
            };
        }
    };
};

export default authMiddleware;
