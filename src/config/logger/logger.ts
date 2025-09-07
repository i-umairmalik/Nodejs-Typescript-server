// src/utils/logger.ts
import pino, { Logger } from "pino";
import pinoPretty from "pino-pretty";
import path from "path";

export interface LogContext {
  userId?: string;
  requestId?: string;
  module?: string;
  [key: string]: any;
}

export interface AppLogger {
  info: (message: string, context?: LogContext) => void;
  warn: (message: string, context?: LogContext) => void;
  error: (message: string, error?: Error, context?: LogContext) => void;
  debug: (message: string, context?: LogContext) => void;
  logRequest: (method: string, url: string, context?: LogContext) => void;
  logResponse: (
    statusCode: number,
    responseTime: number,
    context?: LogContext
  ) => void;
}

const createLogger = (config: any): AppLogger => {
  const environment = config.get("server").environment;
  const isProd = environment === "production";

  let logger: Logger;

  if (isProd) {
    // 🔹 Production: log to app.log & error.log
    const allLogs = pino.destination({
      dest: path.join(__dirname, "../../logs/app.log"),
      sync: false,
    });

    const errorLogs = pino.destination({
      dest: path.join(__dirname, "../../logs/error.log"),
      sync: false,
    });

    logger = pino(
      {
        level: process.env.LOG_LEVEL || "info",
        timestamp: () => `,"time":"${new Date().toISOString()}"`,
      },
      pino.multistream([
        { stream: allLogs }, // all logs
        { level: "error", stream: errorLogs }, // errors only
      ])
    );
  } else {
    // 🔹 Development: pretty console logs
    logger = pino({
      level: "debug",
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
    });
  }

  return {
    info: (msg, ctx) => logger.info(ctx || {}, msg),
    warn: (msg, ctx) => logger.warn(ctx || {}, msg),
    debug: (msg, ctx) => logger.debug(ctx || {}, msg),
    error: (msg, err, ctx) =>
      logger.error(
        {
          ...ctx,
          error: err
            ? { name: err.name, message: err.message, stack: err.stack }
            : undefined,
        },
        msg
      ),
    logRequest: (method, url, ctx) =>
      logger.info(
        { ...ctx, http: { method, url, type: "request" } },
        `➡️  ${method} ${url}`
      ),
    logResponse: (statusCode, responseTime, ctx) => {
      const level = statusCode >= 400 ? "warn" : "info";
      logger[level](
        { ...ctx, http: { statusCode, responseTime, type: "response" } },
        `⬅️  Response ${statusCode} (${responseTime}ms)`
      );
    },
  };
};

export default createLogger;
