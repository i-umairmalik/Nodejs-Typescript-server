export interface ILogContext {
    userId?: string;
    requestId?: string;
    module?: string;
    [key: string]: any;
}
export interface ILoggerConfig {
    level: string;
    environment: string;
    service: string;
    version: string;
}

export interface IAppLogger {
    info: (message: string, context?: ILogContext) => void;
    warn: (message: string, context?: ILogContext) => void;
    error: (message: string, error?: Error, context?: ILogContext) => void;
    debug: (message: string, context?: ILogContext) => void;
    logRequest: (method: string, url: string, context?: ILogContext) => void;
    logResponse: (
        statusCode: number,
        responseTime: number,
        context?: ILogContext
    ) => void;
}

