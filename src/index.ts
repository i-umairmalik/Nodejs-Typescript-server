import { init } from "./di/init";
const bootstrap = async () => {
  try {
    init();
  } catch (error) {
    console.error("❌ Failed to start application:", error);
    process.exit(1);
  }
};

bootstrap();
