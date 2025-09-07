import { createContainer, asFunction, asValue, InjectionMode } from "awilix";
import { AppContainer } from "../types";
import { createApp } from "../app";
import config from "../config/config";
import createLogger from "../config/logger/logger";
import adapter from "../adapters";
export const init = async () => {
  const container = createContainer<AppContainer>({
    injectionMode: InjectionMode.CLASSIC,
  });

  const logger = createLogger(config);
  const initAdapters = async (logger: any, config: any) =>
    await adapter(logger, config);

  const dbAdapters = await initAdapters(logger, config);
  container.register({
    logger: asValue(logger),
    config: asValue(config),
    mongoDB: asFunction(() => dbAdapters.db).singleton(),
  });

  createApp(container);
};

export default init;
