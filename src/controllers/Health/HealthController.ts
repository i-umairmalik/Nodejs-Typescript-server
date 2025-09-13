import { Request, Response } from "express";
import { Interfaces } from "../../interfaces";
import DatabaseMonitor from "../../utils/dbMonitor";

// When using loadModules, Awilix will inject dependencies automatically
// The function parameters should match the registered dependency names
const healthController = ({
    logger,
    dbMonitor
}: {
    logger: Interfaces.AppLogger;
    dbMonitor: DatabaseMonitor;
}) => {
    logger.info("Health controller initialized");

    const checkHealth = async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info("Health check requested");

            // Get database health status
            const dbHealth = await dbMonitor.healthCheck();

            const healthStatus = {
                status: dbHealth.status === 'healthy' ? "OK" : "DEGRADED",
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                environment: process.env.NODE_ENV || "development",
                version: process.env.npm_package_version || "1.0.0",
                memory: {
                    used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
                    total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
                    external: Math.round(process.memoryUsage().external / 1024 / 1024 * 100) / 100
                },
                cpu: process.cpuUsage(),
                database: dbHealth
            };

            const statusCode = dbHealth.status === 'healthy' ? 200 : 503;

            res.status(statusCode).json({
                success: dbHealth.status === 'healthy',
                data: healthStatus
            });
        } catch (error) {
            logger.error("Health check failed", error as Error);
            res.status(500).json({
                success: false,
                error: "Health check failed"
            });
        }
    };

    const getDatabaseStats = async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info("Database stats requested");

            const stats = dbMonitor.getConnectionStats();

            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            logger.error("Database stats check failed", error as Error);
            res.status(500).json({
                success: false,
                error: "Database stats check failed"
            });
        }
    };

    return {
        checkHealth,
        getDatabaseStats
    };
}

export default healthController;