import mongoose from 'mongoose';
import { IAppLogger } from '../interfaces/IAppLogger';

/**
 * Database monitoring utility for production environments
 * Provides connection pool statistics and health metrics
 */
export class DatabaseMonitor {
    private logger: IAppLogger;
    private monitoringInterval?: NodeJS.Timeout;

    constructor(logger: IAppLogger) {
        this.logger = logger;
    }

    /**
     * Start monitoring database connection health
     * @param intervalMs - Monitoring interval in milliseconds (default: 30000ms)
     */
    startMonitoring(intervalMs: number = 30000): void {
        if (this.monitoringInterval) {
            this.logger.warn('Database monitoring already started');
            return;
        }

        this.logger.info('Starting database connection monitoring', { intervalMs });

        this.monitoringInterval = setInterval(() => {
            this.logConnectionStats();
        }, intervalMs);
    }

    /**
     * Stop monitoring database connection
     */
    stopMonitoring(): void {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = undefined;
            this.logger.info('Database monitoring stopped');
        }
    }

    /**
     * Log current connection pool statistics
     */
    private logConnectionStats(): void {
        try {
            const connection = mongoose.connection;

            if (connection.readyState !== 1) {
                this.logger.warn('Database connection not ready', {
                    readyState: connection.readyState,
                    readyStateDescription: this.getReadyStateDescription(connection.readyState)
                });
                return;
            }

            // Get connection pool stats (if available)
            const stats = {
                readyState: connection.readyState,
                readyStateDescription: this.getReadyStateDescription(connection.readyState),
                host: connection.host,
                port: connection.port,
                name: connection.name,
                // Note: Mongoose doesn't expose all pool stats directly
                // These would need to be tracked at the application level
            };

            this.logger.info('Database connection healthy', stats);
        } catch (error) {
            this.logger.error('Error getting database connection stats', error as Error);
        }
    }

    /**
     * Get human-readable description of connection ready state
     */
    private getReadyStateDescription(state: number): string {
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        return states[state as keyof typeof states] || 'unknown';
    }

    /**
     * Get current connection statistics
     */
    getConnectionStats(): {
        isConnected: boolean;
        readyState: number;
        host?: string;
        port?: number;
        dbName?: string;
    } {
        const connection = mongoose.connection;

        return {
            isConnected: connection.readyState === 1,
            readyState: connection.readyState,
            host: connection.host,
            port: connection.port,
            dbName: connection.name
        };
    }

    /**
     * Health check method for monitoring endpoints
     */
    async healthCheck(): Promise<{
        status: 'healthy' | 'unhealthy';
        details: any;
    }> {
        try {
            const connection = mongoose.connection;

            if (connection.readyState !== 1) {
                return {
                    status: 'unhealthy',
                    details: {
                        readyState: connection.readyState,
                        error: 'Database not connected'
                    }
                };
            }

            // Perform a simple ping operation
            if (!connection.db) {
                throw new Error('Database connection not available');
            }
            await connection.db.admin().ping();

            return {
                status: 'healthy',
                details: this.getConnectionStats()
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                details: {
                    error: (error as Error).message
                }
            };
        }
    }
}

export default DatabaseMonitor;
