import { init } from "./di/init";

const bootstrap = async (): Promise<void> => {
  try {
    await init();
  } catch (error) {
    console.error("❌ Failed to start application:", error);
    process.exit(1);
  }
};

bootstrap();
