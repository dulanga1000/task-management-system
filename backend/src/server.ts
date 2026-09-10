import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(env.port, "0.0.0.0", () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer();