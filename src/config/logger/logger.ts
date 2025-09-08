// src/utils/logger.ts
import pino, { Logger } from "pino";
import pinoPretty from "pino-pretty";
import path from "path";
import { IAppLogger, ILogContext } from "../../interfaces/IAppLogger";
import { IConfigProvider } from "../../interfaces/IConfigProvider";


const createLogger = (config: IConfigProvider): IAppLogger => {
  const environment = config.get("environment");
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
    info: (msg: string, ctx?: ILogContext) => logger.info(ctx || {}, msg),
    warn: (msg: string, ctx?: ILogContext) => logger.warn(ctx || {}, msg),
    debug: (msg: string, ctx?: ILogContext) => logger.debug(ctx || {}, msg),
    error: (msg: string, err?: Error, ctx?: ILogContext) =>
      logger.error(
        {
          ...(ctx || {}),
          error: err
            ? { name: err.name, message: err.message, stack: err.stack }
            : undefined,
        },
        msg
      ),
    logRequest: (method: string, url: string, ctx?: ILogContext) =>
      logger.info(
        { ...(ctx || {}), http: { method, url, type: "request" } },
        `➡️  ${method} ${url}`
      ),
    logResponse: (statusCode: number, responseTime: number, ctx?: ILogContext) => {
      const level = statusCode >= 400 ? "warn" : "info";
      logger[level](
        { ...(ctx || {}), http: { statusCode, responseTime, type: "response" } },
        `⬅️  Response ${statusCode} (${responseTime}ms)`
      );
    },
  };
};

export default createLogger;
