import { Request, Response, NextFunction } from "express";
import { IAppLogger } from "../interfaces/IAppLogger";

// Example error handling middleware structured as a function for Awilix DI
const errorMiddleware = ({ logger }: { logger: IAppLogger }) => {
    logger.info("Error middleware initialized");

    return {
        errorHandler: (error: Error, req: Request, res: Response, next: NextFunction) => {
            logger.error("Error occurred:", error);

            // Default error response
            const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
            res.status(statusCode).json({
                error: {
                    message: error.message,
                    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
                }
            });
        },

        notFound: (req: Request, res: Response, next: NextFunction) => {
            logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
            res.status(404).json({ error: "Route not found" });
        }
    };
};

export default errorMiddleware;
