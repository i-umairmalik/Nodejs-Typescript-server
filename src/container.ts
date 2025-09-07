import { createContainer, asFunction, asValue, InjectionMode } from "awilix";
import { AppContainer } from "./types";
import logger from "./config/logger/logger";

export const createAppContainer = async () => {
  const container = createContainer<AppContainer>({
    injectionMode: InjectionMode.CLASSIC,
  });

  container.register({
    logger: asValue(logger),
  });
};
